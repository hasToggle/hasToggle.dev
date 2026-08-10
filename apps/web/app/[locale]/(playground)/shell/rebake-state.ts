/**
 * Where the visitor stands in the two-phase re-bake, which is the whole lesson
 * of this demo: expiring a cache entry and refilling it are separate events,
 * and the bake you are shown in between was cached for nobody.
 *
 * `served`    — you are looking at the shell every visitor gets.
 * `expired`   — you pressed the button. The hash on screen is a private render.
 * `refetched` — you asked for the real one, and can now compare the two.
 */
export type RebakeState =
  | { phase: "served" }
  | { expiredAt: string; phase: "expired" }
  | { expiredAt: string; phase: "refetched"; privateId: string };

export type RebakeAction =
  | { at: string; type: "expired" }
  | { privateId: string; type: "refetched" };

export const INITIAL_REBAKE_STATE: RebakeState = { phase: "served" };

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
  if (action.type === "expired") {
    // Always legal. Re-baking after a fetch drops the previous comparison,
    // which has just lost its subject.
    return { expiredAt: action.at, phase: "expired" };
  }
  if (state.phase !== "expired") {
    return state;
  }
  return {
    expiredAt: state.expiredAt,
    phase: "refetched",
    privateId: action.privateId,
  };
}

/** The re-bake button is dead exactly while an expiry is unanswered. */
export function canRebake(state: RebakeState): boolean {
  return state.phase !== "expired";
}

/** The fetch button exists only when there is something to fetch. */
export function canFetch(state: RebakeState): boolean {
  return state.phase === "expired";
}
