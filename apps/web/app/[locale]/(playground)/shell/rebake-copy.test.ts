import { describe, expect, test } from "bun:test";
import { readout } from "./rebake-copy";
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
        "at 15:05:35 UTC — the hash above is a private render, computed for you and cached for nobody",
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
        "expires the cache tag for everyone, instantly. Then something surprising happens.",
      detail: `from the static shell — you saw #${PRIVATE_ID}, the cache kept #${CURRENT_ID}`,
      label: "served",
    });
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
