import { describe, expect, test } from "bun:test";
import {
  canFetch,
  canRebake,
  initialRebakeState,
  type RebakeState,
  rebakeReducer,
} from "./rebake-state";

const EXPIRED_AT = "2026-08-10T15:05:35.000Z";
const LATER = "2026-08-10T15:09:00.000Z";
const PRIVATE_ID = "1e472bda";

function expire(state: RebakeState, at = EXPIRED_AT): RebakeState {
  return rebakeReducer(state, { at, type: "expired" });
}

function refetch(state: RebakeState, privateId = PRIVATE_ID): RebakeState {
  return rebakeReducer(state, { privateId, type: "refetched" });
}

describe("rebake state", () => {
  test("you arrive looking at the shell everyone else gets", () => {
    const state = initialRebakeState();
    expect(state).toEqual({ phase: "served" });
    expect(canRebake(state)).toBe(true);
    expect(canFetch(state)).toBe(false);
  });

  test("expiring records when, and locks the button until you answer it", () => {
    const state = expire(initialRebakeState());
    expect(state).toEqual({ expiredAt: EXPIRED_AT, phase: "expired" });
    expect(canRebake(state)).toBe(false);
    expect(canFetch(state)).toBe(true);
  });

  test("fetching hands back the comparison and frees the button", () => {
    const state = refetch(expire(initialRebakeState()));
    expect(state).toEqual({
      expiredAt: EXPIRED_AT,
      phase: "refetched",
      privateId: PRIVATE_ID,
    });
    expect(canRebake(state)).toBe(true);
    expect(canFetch(state)).toBe(false);
  });

  test("fetching without expiring first changes nothing", () => {
    const state = initialRebakeState();
    expect(refetch(state)).toBe(state);
  });

  test("fetching twice changes nothing the second time", () => {
    const once = refetch(expire(initialRebakeState()));
    expect(refetch(once, "ffffffff")).toBe(once);
  });

  test("re-baking again clears the old comparison, which no longer has a subject", () => {
    const state = expire(refetch(expire(initialRebakeState())), LATER);
    expect(state).toEqual({ expiredAt: LATER, phase: "expired" });
    expect(canFetch(state)).toBe(true);
  });
});
