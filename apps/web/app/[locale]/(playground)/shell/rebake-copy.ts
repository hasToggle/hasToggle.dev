import { formatClock } from "../format";
import type { RebakeState } from "./rebake-state";

const IDLE_CAPTION =
  "expires the cache tag for everyone, instantly. Nothing refills it on its own.";
const EXPIRED_CAPTION =
  "the entry you expired is gone. Its replacement does not exist until someone asks for the page. Ask for it.";
const REVEALED_CAPTION =
  "expiring an entry and refilling it are two different events. You just watched both.";

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

const SERVED_DETAIL =
  "from the static shell — the same entry every visitor gets";

const SERVED_READOUT: Readout = {
  caption: IDLE_CAPTION,
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
 * viewport, not just the ones someone measured.
 *
 * The placeholders are the same width as the real values (a clock is always
 * `HH:MM:SS`, a bake id always eight hex characters), so the ghosts wrap
 * exactly where the real thing will. `rebake-copy.test.ts` holds that
 * property still.
 */
const PLACEHOLDER_CLOCK = "00:00:00 UTC";
const PLACEHOLDER_ID = "00000000";

export const CAPTION_VARIANTS: readonly string[] = [
  IDLE_CAPTION,
  EXPIRED_CAPTION,
  REVEALED_CAPTION,
  REBAKE_FAILED_CAPTION,
];

export const DETAIL_VARIANTS: readonly string[] = [
  SERVED_DETAIL,
  expiredDetail(PLACEHOLDER_CLOCK),
  revealedDetail(PLACEHOLDER_ID, PLACEHOLDER_ID),
];

/**
 * The provenance line, which is the only part of the demo that has to change
 * per phase — the stamp above states facts that survive all three.
 */
export function readout(state: RebakeState, currentId: string): Readout {
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
      return SERVED_READOUT;
    }
    return {
      caption: REVEALED_CAPTION,
      detail: revealedDetail(state.privateId, currentId),
      label: "served",
    };
  }
  return SERVED_READOUT;
}
