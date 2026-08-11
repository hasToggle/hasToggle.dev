import { describe, expect, test } from "bun:test";
import {
  CAPTION_VARIANTS,
  DETAIL_VARIANTS,
  REBAKE_FAILED_CAPTION,
  readout,
} from "./rebake-copy";
import type { RebakeState } from "./rebake-state";

const EXPIRED_AT = "2026-08-10T15:05:35.000Z";
const CURRENT_ID = "a020a685";
const PRIVATE_ID = "1e472bda";

const SERVED_STATE: RebakeState = { phase: "served" };
const EXPIRED_STATE: RebakeState = {
  expiredAt: EXPIRED_AT,
  phase: "expired",
};

describe("rebake readout", () => {
  test("served doesn't claim to know how this render happened", () => {
    expect(readout(SERVED_STATE, CURRENT_ID)).toEqual({
      caption:
        "expires the cache tag for everyone, instantly. Then something surprising happens.",
      detail: "from the static shell — the same entry every visitor gets",
      label: "served",
    });
  });

  test("expired names the moment and disclaims the private hash above it", () => {
    expect(readout(EXPIRED_STATE, CURRENT_ID)).toEqual({
      caption:
        "the shell you killed is gone. Its replacement doesn't exist until someone asks for it. Be the someone.",
      detail:
        "at 15:05:35 UTC — the hash above was rendered for you and cached for nobody",
      label: "expired",
    });
  });

  test("refetched compares what you saw against what actually persisted, without claiming credit for it", () => {
    const state: RebakeState = {
      expiredAt: EXPIRED_AT,
      phase: "refetched",
      privateId: PRIVATE_ID,
    };
    expect(readout(state, CURRENT_ID)).toEqual({
      caption:
        "expiring an entry and refilling it are two different events. You just watched both.",
      detail: `from the static shell — you saw #${PRIVATE_ID}, the cache kept #${CURRENT_ID}`,
      label: "served",
    });
  });

  test("every caption the panel can show is one the layout reserved space for", () => {
    const shown = [
      readout(SERVED_STATE, CURRENT_ID).caption,
      readout(EXPIRED_STATE, CURRENT_ID).caption,
      readout(
        { expiredAt: EXPIRED_AT, phase: "refetched", privateId: PRIVATE_ID },
        CURRENT_ID
      ).caption,
      REBAKE_FAILED_CAPTION,
    ];
    for (const caption of shown) {
      expect(CAPTION_VARIANTS).toContain(caption);
    }
  });

  test("the ghost details are the same width as the real ones, or the reserve is a guess", () => {
    // The placeholders stand in for a clock and two bake ids. If a copy edit
    // changes a detail's length without updating its ghost, the slot stops
    // reserving the right space and the panel starts hopping again.
    const real = [
      readout(SERVED_STATE, CURRENT_ID).detail,
      readout(EXPIRED_STATE, CURRENT_ID).detail,
      readout(
        { expiredAt: EXPIRED_AT, phase: "refetched", privateId: PRIVATE_ID },
        CURRENT_ID
      ).detail,
    ];
    expect(real.map((d) => d.length)).toEqual(
      DETAIL_VARIANTS.map((d) => d.length)
    );
  });

  test("the reveal caption points at the evidence, and only when there is evidence", () => {
    const revealed: RebakeState = {
      expiredAt: EXPIRED_AT,
      phase: "refetched",
      privateId: PRIVATE_ID,
    };
    // The idle caption promises a surprise; once the surprise is on screen,
    // still promising it reads as though the panel missed its own reveal.
    expect(readout(revealed, CURRENT_ID).caption).not.toBe(
      readout(SERVED_STATE, CURRENT_ID).caption
    );
  });

  test("refetched to the same id you already had falls back to the served line, not a comparison of a hash with itself", () => {
    const state: RebakeState = {
      expiredAt: EXPIRED_AT,
      phase: "refetched",
      privateId: CURRENT_ID,
    };
    expect(readout(state, CURRENT_ID)).toEqual({
      caption:
        "expires the cache tag for everyone, instantly. Then something surprising happens.",
      detail: "from the static shell — the same entry every visitor gets",
      label: "served",
    });
  });
});
