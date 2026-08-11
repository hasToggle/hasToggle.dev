"use client";

import { cn } from "@repo/design-system/lib/utils";
import { useRouter } from "next/navigation";
import { useCallback, useReducer, useState, useTransition } from "react";
import { MarketingButton } from "../../components/marketing-button";
import { rebakeShell } from "./actions";
import {
  CAPTION_VARIANTS,
  DETAIL_VARIANTS,
  REBAKE_FAILED_CAPTION,
  readout,
} from "./rebake-copy";
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
//
// The hover override earns its place: a natively disabled button is excluded
// from `:hover` matching, but an `aria-disabled` one is still live, so the
// variant's `hover:bg-muted` would light up a button that does nothing.
const REBAKE_LOCKED_LOOK = cn(
  "aria-disabled:bg-transparent aria-disabled:opacity-40",
  "aria-disabled:cursor-not-allowed aria-disabled:hover:bg-transparent"
);

const IDLE_REBAKE_LABEL = "Re-bake this page";
const REBAKE_LABELS = [IDLE_REBAKE_LABEL, "Re-baking…"];
const FETCH_LABELS = ["Fetch what's actually cached", "Fetching…"];

/**
 * Renders `value` stacked on top of every string it could have been, so the
 * cell is always as tall and as wide as its worst case. Reserving by hand
 * means a magic number per breakpoint that a copy edit silently invalidates;
 * this reserves the real thing, at whatever width the reader happens to be.
 *
 * The ghosts are `visibility: hidden`, so they take space but leave the tab
 * order, the selection, and — with `aria-hidden` — the announcement alone.
 */
function StableSlot({
  className,
  value,
  variants,
}: {
  className?: string;
  value: string;
  variants: readonly string[];
}) {
  return (
    <span className={cn("grid", className)}>
      {variants.map((variant) => (
        <span
          aria-hidden="true"
          className="invisible [grid-area:1/1]"
          key={variant}
        >
          {variant}
        </span>
      ))}
      <span className="[grid-area:1/1]">{value}</span>
    </span>
  );
}

interface RebakePanelProps {
  /** The fingerprint the server just rendered, whichever render that was. */
  currentId: string;
}

/**
 * Expiring a tag and refilling it are separate events, so they get separate
 * buttons — and the button you can't press is doing as much teaching as the
 * one you can.
 *
 * Every slot in here is sized for its tallest and widest state, because a
 * demo about cache timing is unreadable if the thing you are watching hops
 * down the page as it changes.
 */
export function RebakePanel({ currentId }: RebakePanelProps) {
  const router = useRouter();
  const [state, dispatch] = useReducer(rebakeReducer, INITIAL_REBAKE_STATE);
  const [isRebaking, startRebake] = useTransition();
  const [isFetching, startFetch] = useTransition();
  const [rebakeFailed, setRebakeFailed] = useState(false);

  const rebakeLocked = !canRebake(state) || isRebaking;
  const fetchable = canFetch(state);

  const handleRebake = useCallback(() => {
    // Guards the same lock the button's `aria-disabled` shows, since that
    // attribute doesn't stop clicks the way the native one does.
    if (rebakeLocked) {
      return;
    }
    setRebakeFailed(false);
    startRebake(async () => {
      try {
        const { rebakedAt } = await rebakeShell();
        dispatch({ at: rebakedAt, type: "expired" });
      } catch {
        // The tag may well have been expired before the response died, so the
        // copy promises nothing about what happened — it just says so.
        setRebakeFailed(true);
      }
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
  const rebakeLabel = isRebaking ? REBAKE_LABELS[1] : REBAKE_LABELS[0];
  const fetchLabel = isFetching ? FETCH_LABELS[1] : FETCH_LABELS[0];
  const captionText = rebakeFailed ? REBAKE_FAILED_CAPTION : caption;

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
            <dd className="min-w-0 flex-1">
              <StableSlot value={detail} variants={DETAIL_VARIANTS} />
            </dd>
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
          <StableSlot value={rebakeLabel} variants={REBAKE_LABELS} />
        </MarketingButton>
        {/*
          Rendered in every phase, hidden from sight and from the a11y tree
          when it doesn't apply, so the row always reserves its exact
          footprint. `invisible` also takes it out of the tab order.
        */}
        <MarketingButton
          aria-hidden={!fetchable}
          className={fetchable ? undefined : "invisible"}
          disabled={!fetchable || isFetching}
          onClick={handleFetch}
          variant="outline"
        >
          <StableSlot value={fetchLabel} variants={FETCH_LABELS} />
        </MarketingButton>
      </div>
      {/*
        Its own live region rather than the one above: the caption sits below
        the buttons, so a single region can't span both without reordering
        what a sighted reader sees. Two polite regions announce in DOM order —
        the fact, then what to do about it.
      */}
      <p
        aria-live="polite"
        className={cn(
          "font-mono text-xs/5",
          rebakeFailed ? "text-destructive" : "text-muted-foreground"
        )}
      >
        <StableSlot value={captionText} variants={CAPTION_VARIANTS} />
      </p>
    </div>
  );
}
