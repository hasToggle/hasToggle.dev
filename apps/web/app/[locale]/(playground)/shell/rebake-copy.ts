import { formatClock } from "../format";
import type { RebakeState } from "./rebake-state";

const IDLE_CAPTION =
  "expires the cache tag for everyone, instantly. Then something surprising happens.";
const EXPIRED_CAPTION =
  "the shell you killed is gone. Its replacement doesn't exist until someone asks for it. Be the someone.";

interface Readout {
  caption: string;
  detail: string;
  label: string;
}

const SERVED_READOUT: Readout = {
  caption: IDLE_CAPTION,
  detail: "from the static shell — the same entry every visitor gets",
  label: "served",
};

/**
 * The provenance line, which is the only part of the demo that has to change
 * per phase — the stamp above states facts that survive all three.
 */
export function readout(state: RebakeState, currentId: string): Readout {
  if (state.phase === "expired") {
    return {
      caption: EXPIRED_CAPTION,
      detail: `at ${formatClock(new Date(state.expiredAt))} — the hash above is a private render, computed for you and cached for nobody`,
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
      caption: IDLE_CAPTION,
      detail: `from the static shell — you saw #${state.privateId}, the cache kept #${currentId}`,
      label: "served",
    };
  }
  return SERVED_READOUT;
}
