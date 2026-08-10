"use client";

import { useRouter } from "next/navigation";
import { useCallback, useReducer, useTransition } from "react";
import { MarketingButton } from "../../components/marketing-button";
import { formatClock } from "../format";
import { rebakeShell } from "./actions";
import {
  canFetch,
  canRebake,
  initialRebakeState,
  type RebakeState,
  rebakeReducer,
} from "./rebake-state";

const IDLE_CAPTION =
  "expires the cache tag for everyone, instantly. Then something surprising happens.";
const EXPIRED_CAPTION =
  "the shell you killed is gone. Its replacement doesn't exist until someone asks for it. Be the someone.";

interface Readout {
  caption: string;
  detail: string;
  label: string;
}

/**
 * The provenance line, which is the only part of the demo that has to change
 * per phase — the stamp above states facts that survive all three.
 */
function readout(state: RebakeState, currentId: string): Readout {
  if (state.phase === "expired") {
    return {
      caption: EXPIRED_CAPTION,
      detail: `at ${formatClock(new Date(state.expiredAt))} — the hash above is a private render, computed for you and cached for nobody`,
      label: "expired",
    };
  }
  if (state.phase === "refetched") {
    return {
      caption: IDLE_CAPTION,
      detail: `from the static shell, baked by your own request — you saw #${state.privateId}, the cache kept #${currentId}`,
      label: "served",
    };
  }
  return {
    caption: IDLE_CAPTION,
    detail: "from the static shell — no server render for you",
    label: "served",
  };
}

interface RebakePanelProps {
  /** The fingerprint the server just rendered, whichever render that was. */
  currentId: string;
}

/**
 * Expiring a tag and refilling it are separate events, so they get separate
 * buttons — and the button you can't press is doing as much teaching as the
 * one you can.
 */
export function RebakePanel({ currentId }: RebakePanelProps) {
  const router = useRouter();
  const [state, dispatch] = useReducer(rebakeReducer, initialRebakeState());
  const [isRebaking, startRebake] = useTransition();
  const [isFetching, startFetch] = useTransition();

  const handleRebake = useCallback(() => {
    startRebake(async () => {
      const { rebakedAt } = await rebakeShell();
      dispatch({ at: rebakedAt, type: "expired" });
    });
  }, []);

  const handleFetch = useCallback(() => {
    startFetch(() => {
      // Captured before the refresh lands, while the private render is still
      // the thing on screen. Both updates sit in the same transition, so the
      // panel keeps showing the expired state until the new bake arrives.
      dispatch({ privateId: currentId, type: "refetched" });
      router.refresh();
    });
  }, [currentId, router]);

  const { caption, detail, label } = readout(state, currentId);

  return (
    <div className="flex flex-col gap-3">
      <dl className="grid gap-1 font-mono text-muted-foreground text-sm/6">
        <div className="flex gap-3">
          <dt className="w-16 shrink-0 text-muted-foreground/60">{label}</dt>
          <dd>{detail}</dd>
        </div>
      </dl>
      <div className="flex flex-wrap items-center gap-3">
        <MarketingButton
          disabled={!canRebake(state) || isRebaking}
          onClick={handleRebake}
          variant="outline"
        >
          {isRebaking ? "Re-baking…" : "Re-bake this page"}
        </MarketingButton>
        {canFetch(state) ? (
          <MarketingButton
            disabled={isFetching}
            onClick={handleFetch}
            variant="outline"
          >
            {isFetching ? "Fetching…" : "Fetch what's actually cached"}
          </MarketingButton>
        ) : null}
      </div>
      <p className="font-mono text-muted-foreground text-xs/5">{caption}</p>
    </div>
  );
}
