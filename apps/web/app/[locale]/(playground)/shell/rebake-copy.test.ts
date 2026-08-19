import { describe, expect, test } from "bun:test";
import {
  CAPTION_VARIANTS,
  DETAIL_VARIANTS,
  REBAKE_FAILED_CAPTION,
  readout,
  SETTLING_READOUT,
} from "./rebake-copy";
import type { RebakeState } from "./rebake-state";

const EXPIRED_AT = "2026-08-10T15:05:35.000Z";
const CURRENT_ID = "a020a685";
const PRIVATE_ID = "1e472bda";

const SIMPLE_FRESH: RebakeState = {
  hasCompletedCycle: false,
  mode: "simple",
  phase: "served",
};
const SIMPLE_CYCLED: RebakeState = {
  hasCompletedCycle: true,
  mode: "simple",
  phase: "served",
};
const MACHINERY_SERVED: RebakeState = {
  hasCompletedCycle: false,
  mode: "machinery",
  phase: "served",
};
const MACHINERY_EXPIRED: RebakeState = {
  expiredAt: EXPIRED_AT,
  hasCompletedCycle: false,
  mode: "machinery",
  phase: "expired",
};
const MACHINERY_REFETCHED: RebakeState = {
  expiredAt: EXPIRED_AT,
  hasCompletedCycle: true,
  mode: "machinery",
  phase: "refetched",
  privateId: PRIVATE_ID,
};

describe("rebake readout", () => {
  test("the simple view opens by saying what one press does, fused", () => {
    expect(readout(SIMPLE_FRESH, CURRENT_ID)).toEqual({
      caption:
        "throws this page’s cache entry away and bakes a fresh one — for every visitor, immediately.",
      detail: "from the static shell — the same entry every visitor gets",
      label: "served",
    });
  });

  test("after a cycle, the simple view plants the hook for the switch", () => {
    expect(readout(SIMPLE_CYCLED, CURRENT_ID)).toEqual({
      caption:
        "that worked — the bake above is what every visitor gets now. It felt like one event; it was three. The switch slows the next one down.",
      detail: "from the static shell — the same entry every visitor gets",
      label: "served",
    });
  });

  test("the machinery view names the handle the button is about to pull", () => {
    expect(readout(MACHINERY_SERVED, CURRENT_ID)).toEqual({
      caption:
        'updateTag("landing-shell") expires the entry for everyone, instantly. Nothing refills it on its own.',
      detail: "from the static shell — the same entry every visitor gets",
      label: "served",
    });
  });

  test("expired explains why the private hash cannot be the refill", () => {
    expect(readout(MACHINERY_EXPIRED, CURRENT_ID)).toEqual({
      caption:
        "the hash above was rendered before your expiry landed, so the cache will not keep it. The refill is the first render that starts afterwards. Ask for it.",
      detail:
        "at 15:05:35 UTC — the hash above was rendered for you and cached for nobody",
      label: "expired",
    });
  });

  test("refetched discloses that the refill was a render, not an API call", () => {
    expect(readout(MACHINERY_REFETCHED, CURRENT_ID)).toEqual({
      caption:
        "the fetch ran no cache API — the page rendered again, and this time the cache kept it. Expiring an entry and refilling it are two different events. You just watched both.",
      detail: `#${CURRENT_ID} is the bake above, and every visitor gets it. #${PRIVATE_ID} was yours alone, and is gone`,
      label: "served",
    });
  });

  test("every caption the panel can show is one the layout reserved space for", () => {
    const shown = [
      readout(SIMPLE_FRESH, CURRENT_ID).caption,
      readout(SIMPLE_CYCLED, CURRENT_ID).caption,
      readout(MACHINERY_SERVED, CURRENT_ID).caption,
      readout(MACHINERY_EXPIRED, CURRENT_ID).caption,
      readout(MACHINERY_REFETCHED, CURRENT_ID).caption,
      REBAKE_FAILED_CAPTION,
      SETTLING_READOUT.caption,
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
      readout(MACHINERY_SERVED, CURRENT_ID).detail,
      readout(MACHINERY_EXPIRED, CURRENT_ID).detail,
      readout(MACHINERY_REFETCHED, CURRENT_ID).detail,
      SETTLING_READOUT.detail,
    ];
    expect(real.map((d) => d.length)).toEqual(
      DETAIL_VARIANTS.map((d) => d.length)
    );
  });

  test("the settling readout never claims the shared entry is on screen", () => {
    // While the owed refresh is in flight, the stamp still shows the private
    // render — the settling lines must not borrow the served claim.
    expect(SETTLING_READOUT.detail).not.toContain("every visitor");
    expect(SETTLING_READOUT.label).not.toBe("served");
  });

  test("the reveal caption points at the evidence, and only when there is evidence", () => {
    // The machinery idle caption describes what pressing will do; once the
    // reveal is on screen, repeating it reads as though the panel missed its
    // own reveal.
    expect(readout(MACHINERY_REFETCHED, CURRENT_ID).caption).not.toBe(
      readout(MACHINERY_SERVED, CURRENT_ID).caption
    );
  });

  test("refetched to the same id you already had falls back to the served line, not a comparison of a hash with itself", () => {
    const state: RebakeState = {
      expiredAt: EXPIRED_AT,
      hasCompletedCycle: true,
      mode: "machinery",
      phase: "refetched",
      privateId: CURRENT_ID,
    };
    expect(readout(state, CURRENT_ID)).toEqual({
      caption:
        'updateTag("landing-shell") expires the entry for everyone, instantly. Nothing refills it on its own.',
      detail: "from the static shell — the same entry every visitor gets",
      label: "served",
    });
  });
});
