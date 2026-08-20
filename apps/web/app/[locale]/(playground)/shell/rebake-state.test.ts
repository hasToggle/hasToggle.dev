import { describe, expect, test } from "bun:test";
import {
  canFetch,
  canRebake,
  INITIAL_REBAKE_STATE,
  type RebakeState,
  rebakeReducer,
} from "./rebake-state";

const EXPIRED_AT = "2026-08-10T15:05:35.000Z";
const LATER = "2026-08-10T15:09:00.000Z";
const ID_AT_EXPIRY = "01dbake";
const PRIVATE_ID = "1e472b";

function expire(state: RebakeState, at = EXPIRED_AT): RebakeState {
  return rebakeReducer(state, {
    at,
    idAtExpiry: ID_AT_EXPIRY,
    type: "expired",
  });
}

function refetch(state: RebakeState, privateId = PRIVATE_ID): RebakeState {
  return rebakeReducer(state, { privateId, type: "refetched" });
}

function toggle(state: RebakeState): RebakeState {
  return rebakeReducer(state, { type: "toggled" });
}

function fuse(state: RebakeState): RebakeState {
  return rebakeReducer(state, { type: "fused" });
}

const MACHINERY_SERVED = toggle(INITIAL_REBAKE_STATE);

describe("rebake state", () => {
  test("you arrive in the simple view, looking at the shell everyone gets", () => {
    const state = INITIAL_REBAKE_STATE;
    expect(state).toEqual({
      hasCompletedCycle: false,
      mode: "simple",
      phase: "served",
    });
    expect(canRebake(state)).toBe(true);
    expect(canFetch(state, ID_AT_EXPIRY)).toBe(false);
  });

  test("a fused press lands back where it started, with the cycle behind it", () => {
    const state = fuse(INITIAL_REBAKE_STATE);
    expect(state).toEqual({
      hasCompletedCycle: true,
      mode: "simple",
      phase: "served",
    });
    expect(canRebake(state)).toBe(true);
  });

  test("the switch carries what you've seen into the machinery view", () => {
    expect(MACHINERY_SERVED).toEqual({
      hasCompletedCycle: false,
      mode: "machinery",
      phase: "served",
    });
    expect(toggle(fuse(INITIAL_REBAKE_STATE)).hasCompletedCycle).toBe(true);
  });

  test("in the machinery view, expiring records when and locks the button", () => {
    const state = expire(MACHINERY_SERVED);
    expect(state).toEqual({
      expiredAt: EXPIRED_AT,
      hasCompletedCycle: false,
      idAtExpiry: ID_AT_EXPIRY,
      mode: "machinery",
      phase: "expired",
    });
    expect(canRebake(state)).toBe(false);
  });

  test("the ask stays dark until the private render has landed", () => {
    // Clicking ask before the action's re-render arrives would capture the
    // old shared fingerprint as the private one, and the comparison would
    // claim a public bake had been yours alone. The gate: the fingerprint
    // on screen must have moved off the one that was there at expiry.
    const state = expire(MACHINERY_SERVED);
    expect(canFetch(state, ID_AT_EXPIRY)).toBe(false);
    expect(canFetch(state, PRIVATE_ID)).toBe(true);
  });

  test("fetching hands back the comparison, frees the button, and counts as a cycle", () => {
    const state = refetch(expire(MACHINERY_SERVED));
    expect(state).toEqual({
      expiredAt: EXPIRED_AT,
      hasCompletedCycle: true,
      mode: "machinery",
      phase: "refetched",
      privateId: PRIVATE_ID,
    });
    expect(canRebake(state)).toBe(true);
    expect(canFetch(state, PRIVATE_ID)).toBe(false);
  });

  test("switching off mid-gap settles into the simple view, cycle complete", () => {
    // The panel pairs this transition with a router.refresh() — see
    // handleToggle — so the simple view never rests on an unanswered expiry.
    const state = toggle(expire(MACHINERY_SERVED));
    expect(state).toEqual({
      hasCompletedCycle: true,
      mode: "simple",
      phase: "served",
    });
  });

  test("switching off after the reveal drops the comparison, which belongs to the machinery view", () => {
    const state = toggle(refetch(expire(MACHINERY_SERVED)));
    expect(state).toEqual({
      hasCompletedCycle: true,
      mode: "simple",
      phase: "served",
    });
  });

  test("fetching without expiring first changes nothing", () => {
    expect(refetch(MACHINERY_SERVED)).toBe(MACHINERY_SERVED);
    expect(refetch(INITIAL_REBAKE_STATE)).toBe(INITIAL_REBAKE_STATE);
  });

  test("fetching twice changes nothing the second time", () => {
    const once = refetch(expire(MACHINERY_SERVED));
    expect(refetch(once, "ffffff")).toBe(once);
  });

  test("re-baking again clears the old comparison, which no longer has a subject", () => {
    const state = expire(refetch(expire(MACHINERY_SERVED)), LATER);
    expect(state).toEqual({
      expiredAt: LATER,
      hasCompletedCycle: true,
      idAtExpiry: ID_AT_EXPIRY,
      mode: "machinery",
      phase: "expired",
    });
    expect(canFetch(state, PRIVATE_ID)).toBe(true);
  });

  test("the simple view ignores the machinery's actions", () => {
    // A machinery press resolving after the switch flipped off must not strand
    // the simple view in a phase it cannot display. The panel disables the
    // switch while a press is in flight, so this is the belt to that brace.
    expect(expire(INITIAL_REBAKE_STATE)).toBe(INITIAL_REBAKE_STATE);
    expect(fuse(MACHINERY_SERVED)).toBe(MACHINERY_SERVED);
  });
});
