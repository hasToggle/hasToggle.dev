/**
 * Where the visitor stands in the re-bake demo, which runs in two views:
 *
 * `simple`    — one button, and a press runs the whole round trip (the
 *               updateTag action, then a refresh) fused into one event. This
 *               is the flow real apps ship, and the reason the belief this
 *               exhibit answers feels true.
 * `machinery` — the same mechanism with the fusion switched off: expiring and
 *               refilling get separate buttons, and the gap between them is
 *               allowed to sit on screen.
 *
 * The invariant the types encode: the simple view only ever rests in `served`.
 * An unanswered expiry can exist only where it is being narrated — flipping
 * the switch off mid-gap settles it (the panel pairs that toggle with a
 * refresh), so the stamp never quietly shows a render the cache refused.
 *
 * `hasCompletedCycle` remembers that at least one full expire-and-refill has
 * happened, in either view — it is what turns the simple caption from an
 * invitation into the hook for the switch.
 */
export type RebakeState =
  | { hasCompletedCycle: boolean; mode: "simple"; phase: "served" }
  | { hasCompletedCycle: boolean; mode: "machinery"; phase: "served" }
  | {
      expiredAt: string;
      hasCompletedCycle: boolean;
      /** The fingerprint that was on screen when the press happened. */
      idAtExpiry: string;
      mode: "machinery";
      phase: "expired";
    }
  | {
      expiredAt: string;
      hasCompletedCycle: boolean;
      mode: "machinery";
      phase: "refetched";
      privateId: string;
    };

export type RebakeAction =
  | { at: string; idAtExpiry: string; type: "expired" }
  | { privateId: string; type: "refetched" }
  | { type: "fused" }
  | { type: "toggled" };

export const INITIAL_REBAKE_STATE: RebakeState = {
  hasCompletedCycle: false,
  mode: "simple",
  phase: "served",
};

/**
 * `privateId` is captured on the *fetch*, not on the expiry. At expiry time the
 * private render has not come back from the server yet, so the fingerprint on
 * screen is still the old one — the interesting hash only exists once the
 * action's response has landed and the visitor is looking at it.
 */
export function rebakeReducer(
  state: RebakeState,
  action: RebakeAction
): RebakeState {
  if (action.type === "fused") {
    if (state.mode !== "simple") {
      return state;
    }
    return { hasCompletedCycle: true, mode: "simple", phase: "served" };
  }
  if (action.type === "toggled") {
    if (state.mode === "simple") {
      return {
        hasCompletedCycle: state.hasCompletedCycle,
        mode: "machinery",
        phase: "served",
      };
    }
    return {
      // Leaving mid-gap counts as a completed cycle: the panel answers the
      // expiry on the way out, and the visitor watched both halves happen.
      hasCompletedCycle: state.hasCompletedCycle || state.phase === "expired",
      mode: "simple",
      phase: "served",
    };
  }
  if (action.type === "expired") {
    if (state.mode !== "machinery") {
      return state;
    }
    // Always legal within the machinery view. Re-baking after a fetch drops
    // the previous comparison, which has just lost its subject.
    return {
      expiredAt: action.at,
      hasCompletedCycle: state.hasCompletedCycle,
      idAtExpiry: action.idAtExpiry,
      mode: "machinery",
      phase: "expired",
    };
  }
  if (state.mode !== "machinery" || state.phase !== "expired") {
    return state;
  }
  return {
    expiredAt: state.expiredAt,
    hasCompletedCycle: true,
    mode: "machinery",
    phase: "refetched",
    privateId: action.privateId,
  };
}

/** The re-bake button is dead exactly while an expiry is unanswered. */
export function canRebake(state: RebakeState): boolean {
  return state.phase !== "expired";
}

/**
 * The ask button lights only when there is something to fetch AND the
 * private render has landed — the fingerprint on screen has moved off the
 * one that was there at expiry. Asking earlier would capture the old shared
 * fingerprint as the private one, and the comparison would claim a public
 * bake had been yours alone.
 *
 * (The settle-on-toggle-off path checks `phase === "expired"` directly: any
 * open gap owes a refresh, landed or not.)
 */
export function canFetch(state: RebakeState, currentId: string): boolean {
  return state.phase === "expired" && state.idAtExpiry !== currentId;
}
