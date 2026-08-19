import { formatClock } from "../format";
import type { RebakeState } from "./rebake-state";

/**
 * Two views, one arc. The simple captions describe the fused flow real apps
 * ship — a press that expires and refills in one round trip — and, once the
 * visitor has seen it work, hand them the switch. The machinery captions are
 * the same story slowed down: idle names the handle the button is wired to;
 * expired explains why the private render cannot be the refill (the expiry is
 * a timestamp, and that hash predates it — verified on a preview deploy in
 * PR #364, since `next dev` hides this); revealed discloses that the refill
 * had no cache API in it at all.
 */
const SIMPLE_IDLE_CAPTION =
  "throws this page’s cache entry away and bakes a fresh one — for every visitor, immediately.";
const SIMPLE_CYCLED_CAPTION =
  "that worked — the bake above is what every visitor gets now. It felt like one event; it was three. The switch slows the next one down.";
const MACHINERY_IDLE_CAPTION =
  'updateTag("landing-shell") expires the entry for everyone, instantly. Nothing refills it on its own.';
const EXPIRED_CAPTION =
  "the hash above was rendered before your expiry landed, so the cache will not keep it. The refill is the first render that starts afterwards. Ask for it.";
const REVEALED_CAPTION =
  "the fetch ran no cache API — the page rendered again, and this time the cache kept it. Expiring an entry and refilling it are two different events. You just watched both.";

/**
 * Replaces the caption when the action never came back, so a failure lands in
 * the slot the visitor is already reading instead of adding a line and moving
 * everything below it.
 */
export const REBAKE_FAILED_CAPTION = "the re-bake didn’t come back. Try again?";

interface Readout {
  caption: string;
  detail: string;
  label: string;
}

/**
 * Shown while the switch is settling an expiry the visitor left open: the
 * view flips to simple immediately (the switch has to answer the hand), and
 * this readout covers the window until the owed refresh lands — because for
 * that window the served line would be claiming a shared entry the stamp
 * isn't showing yet.
 */
export const SETTLING_READOUT: Readout = {
  caption:
    "settling the expiry you left open — the same quiet refresh a mutation normally ends with.",
  detail:
    "the hash above is still the private one — its replacement is in flight",
  label: "asking",
};

const SERVED_DETAIL =
  "from the static shell — the same entry every visitor gets";

const MACHINERY_SERVED_READOUT: Readout = {
  caption: MACHINERY_IDLE_CAPTION,
  detail: SERVED_DETAIL,
  label: "served",
};

function expiredDetail(clock: string): string {
  return `at ${clock} — the hash above was rendered for you and cached for nobody`;
}

/**
 * Both fingerprints, because the comparison is the whole payoff — but each
 * one carries its role, and the one on screen says so. Two bare hex strings
 * side by side look identical at a glance and leave the reader guessing
 * which of them is the stamp they are looking at.
 */
function revealedDetail(privateId: string, currentId: string): string {
  return `#${currentId} is the bake above, and every visitor gets it. #${privateId} was yours alone, and is gone`;
}

/**
 * Every string each slot could hold, for the panel to stack invisibly behind
 * the live one so the slot is always as tall as its worst case — at every
 * viewport, not just the ones someone measured. Captions from both views are
 * reserved together, so flipping the switch doesn't move the page either.
 *
 * The placeholders are the same width as the real values (a clock is always
 * `HH:MM:SS`, a bake id always six hex characters — a CSS color), so the
 * ghosts wrap exactly where the real thing will. `rebake-copy.test.ts` holds
 * that property still.
 */
const PLACEHOLDER_CLOCK = "00:00:00 UTC";
const PLACEHOLDER_ID = "000000";

export const CAPTION_VARIANTS: readonly string[] = [
  SIMPLE_IDLE_CAPTION,
  SIMPLE_CYCLED_CAPTION,
  MACHINERY_IDLE_CAPTION,
  EXPIRED_CAPTION,
  REVEALED_CAPTION,
  REBAKE_FAILED_CAPTION,
  SETTLING_READOUT.caption,
];

export const DETAIL_VARIANTS: readonly string[] = [
  SERVED_DETAIL,
  expiredDetail(PLACEHOLDER_CLOCK),
  revealedDetail(PLACEHOLDER_ID, PLACEHOLDER_ID),
  SETTLING_READOUT.detail,
];

/**
 * The provenance line, which is the only part of the demo that has to change
 * per phase — the stamp above states facts that survive every phase of both
 * views.
 */
export function readout(state: RebakeState, currentId: string): Readout {
  if (state.mode === "simple") {
    return {
      caption: state.hasCompletedCycle
        ? SIMPLE_CYCLED_CAPTION
        : SIMPLE_IDLE_CAPTION,
      detail: SERVED_DETAIL,
      label: "served",
    };
  }
  if (state.phase === "expired") {
    return {
      caption: EXPIRED_CAPTION,
      detail: expiredDetail(formatClock(new Date(state.expiredAt))),
      label: "expired",
    };
  }
  if (state.phase === "refetched") {
    // A different visitor's request may have regenerated the shell in the
    // window between your expiry and your fetch, so the same id back is not
    // a bug — it's just nothing left to compare.
    if (state.privateId === currentId) {
      return MACHINERY_SERVED_READOUT;
    }
    return {
      caption: REVEALED_CAPTION,
      detail: revealedDetail(state.privateId, currentId),
      label: "served",
    };
  }
  return MACHINERY_SERVED_READOUT;
}
