"use client";

import { useRouter } from "next/navigation";
import { useCallback, useReducer, useTransition } from "react";
import { MarketingButton } from "../../components/marketing-button";
import { rebakeShell } from "./actions";
import { readout } from "./rebake-copy";
import {
  canFetch,
  canRebake,
  INITIAL_REBAKE_STATE,
  rebakeReducer,
} from "./rebake-state";

// The outline variant's `disabled:` look, re-expressed for `aria-disabled` —
// the re-bake button stays a real, focusable element while it's locked, so
// keyboard and screen-reader users don't lose their place when the fetch
// button appears beside it. See MarketingButton's `outline` variant.
const REBAKE_LOCKED_LOOK =
  "aria-disabled:bg-transparent aria-disabled:opacity-40";

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
  const [state, dispatch] = useReducer(rebakeReducer, INITIAL_REBAKE_STATE);
  const [isRebaking, startRebake] = useTransition();
  const [isFetching, startFetch] = useTransition();

  const rebakeLocked = !canRebake(state) || isRebaking;

  const handleRebake = useCallback(() => {
    // Guards the same lock the button's `aria-disabled` shows, since that
    // attribute doesn't stop clicks the way the native one does.
    if (rebakeLocked) {
      return;
    }
    startRebake(async () => {
      const { rebakedAt } = await rebakeShell();
      dispatch({ at: rebakedAt, type: "expired" });
    });
  }, [rebakeLocked]);

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
      {/*
        role="status" on a <dl> itself trips Biome's
        noInteractiveElementToNoninteractiveRole rule, so the live region
        wraps the definition list instead of landing on it directly.
      */}
      <div aria-live="polite" role="status">
        <dl className="grid gap-1 font-mono text-muted-foreground text-sm/6">
          <div className="flex gap-3">
            <dt className="w-16 shrink-0 text-muted-foreground/60">{label}</dt>
            <dd>{detail}</dd>
          </div>
        </dl>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <MarketingButton
          aria-disabled={rebakeLocked}
          className={REBAKE_LOCKED_LOOK}
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
