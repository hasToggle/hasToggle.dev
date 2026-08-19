"use client";

import { Switch } from "@repo/design-system/components/ui/switch";
import { cn } from "@repo/design-system/lib/utils";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useReducer,
  useRef,
  useState,
  useTransition,
} from "react";
import { MarketingButton } from "../../components/marketing-button";
import { LivePanel } from "../live-panel";
import { rebakeShell } from "./actions";
import {
  CAPTION_VARIANTS,
  DETAIL_VARIANTS,
  REBAKE_FAILED_CAPTION,
  readout,
  SETTLING_READOUT,
} from "./rebake-copy";
import {
  canFetch,
  canRebake,
  INITIAL_REBAKE_STATE,
  rebakeReducer,
} from "./rebake-state";

// The outline variant's `disabled:` look, re-expressed for `aria-disabled` —
// the expire button stays a real, focusable element while it's locked, so
// keyboard and screen-reader users don't lose their place when its lock
// state flips. See MarketingButton's `outline` variant.
//
// The hover override earns its place: a natively disabled button is excluded
// from `:hover` matching, but an `aria-disabled` one is still live, so the
// variant's `hover:bg-muted` would light up a button that does nothing.
const LOCKED_LOOK = cn(
  "aria-disabled:bg-transparent aria-disabled:opacity-40",
  "aria-disabled:cursor-not-allowed aria-disabled:hover:bg-transparent"
);

const FUSED_LABELS = ["Re-bake this page", "Re-baking…"];
const EXPIRE_LABELS = ["Expire the entry", "Expiring…"];
const ASK_LABELS = ["Ask for the page", "Asking…"];

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

/** The mono step marker inside a deck button — real sequence, so real numbers. */
function StepMark({ n }: { n: string }) {
  return (
    <span
      aria-hidden="true"
      className="mr-2 select-none font-mono text-muted-foreground/60 text-xs"
    >
      {n}
    </span>
  );
}

interface RebakePanelProps {
  /** The fingerprint the server just rendered, whichever render that was. */
  currentId: string;
  /**
   * The server-rendered stamp, threaded through as a prop so this client
   * component can wrap it in the pending and landing treatments — the
   * server-component-as-prop composition exhibit one teaches.
   */
  stamp: React.ReactNode;
}

/**
 * Demo 02's instrument, in the house zones: display (the stamp, which dims
 * while a round trip is out and flashes once when a new fingerprint lands),
 * narration (provenance and caption, one block), and the deck. The slow-motion
 * switch doesn't add a second button — it splits the one button into the two
 * events it was always made of.
 */
export function RebakePanel({ currentId, stamp }: RebakePanelProps) {
  const router = useRouter();
  const [state, dispatch] = useReducer(rebakeReducer, INITIAL_REBAKE_STATE);
  const [isRebaking, startRebake] = useTransition();
  const [isFetching, startFetch] = useTransition();
  const [rebakeFailed, setRebakeFailed] = useState(false);
  // The fingerprint the page arrived with. A remount of the display wrapper
  // only counts as a landing once the id has moved off this — otherwise the
  // first paint of the page would flash as though something had changed.
  const initialIdRef = useRef(currentId);

  const machinery = state.mode === "machinery";
  const working = isRebaking || isFetching;
  const rebakeLocked = !canRebake(state) || isRebaking;
  const fetchable = canFetch(state);

  const handleRebake = useCallback(() => {
    // Guards the same lock the button's `aria-disabled` shows, since that
    // attribute doesn't stop clicks the way the native one does.
    if (rebakeLocked) {
      return;
    }
    setRebakeFailed(false);
    if (machinery) {
      startRebake(async () => {
        try {
          const { rebakedAt } = await rebakeShell();
          dispatch({ at: rebakedAt, type: "expired" });
        } catch {
          // The tag may well have been expired before the response died, so
          // the copy promises nothing about what happened — it just says so.
          setRebakeFailed(true);
        }
      });
      return;
    }
    // The fused press: the same action, with the refill it implies chained
    // into the same transition. The button stays "Re-baking…" across both
    // halves, so the press reads as the one event it is pretending to be.
    startRebake(async () => {
      try {
        await rebakeShell();
      } catch {
        setRebakeFailed(true);
        return;
      }
      dispatch({ type: "fused" });
      router.refresh();
    });
  }, [machinery, rebakeLocked, router]);

  const handleFetch = useCallback(() => {
    startFetch(() => {
      // Captured before the refresh lands, while the private render is still
      // the thing on screen. Both updates sit in the same transition, so the
      // panel keeps showing the expired state until the new bake arrives.
      dispatch({ privateId: currentId, type: "refetched" });
      router.refresh();
    });
  }, [currentId, router]);

  const handleToggle = useCallback(() => {
    const leavesGapOpen = canFetch(state);
    // The flip itself stays OUT of the transition: it is client-owned state,
    // and inside one it would not paint until router.refresh() resolved —
    // the switch sat frozen for the whole round trip. Only the server sync
    // is transitional; while it flies, `isFetching` swaps in the settling
    // readout so the flipped view doesn't claim a shared entry the stamp
    // isn't showing yet.
    dispatch({ type: "toggled" });
    if (leavesGapOpen) {
      // Leaving the machinery view with an expiry unanswered: settle it on
      // the way out — quietly finishing the round trip is exactly what real
      // apps do — so the simple view never rests showing a render the cache
      // refused to keep.
      startFetch(() => {
        router.refresh();
      });
    }
  }, [router, state]);

  // A fetch transition still flying after the mode flipped to simple is the
  // settling window: the owed refresh is out, and the stamp is still the
  // private render until it lands.
  const settling = isFetching && !machinery;
  // During a fused press the reducer commits `fused` at the await boundary,
  // before the refresh lands — so the readout is held at the pre-press state
  // for the flight. The hook caption then arrives in the same paint as the
  // new fingerprint, instead of congratulating a bake that isn't up yet.
  const fusedInFlight = isRebaking && !machinery;
  const {
    caption,
    detail,
    label: statusLabel,
  } = settling
    ? SETTLING_READOUT
    : readout(fusedInFlight ? INITIAL_REBAKE_STATE : state, currentId);
  const rebakeLabels = machinery ? EXPIRE_LABELS : FUSED_LABELS;
  const rebakeLabel = isRebaking ? rebakeLabels[1] : rebakeLabels[0];
  const askLabel = isFetching ? ASK_LABELS[1] : ASK_LABELS[0];
  const captionText = rebakeFailed ? REBAKE_FAILED_CAPTION : caption;

  // Actions only — the view switch lives in the chrome, not here.
  const deck = (
    <div className="flex flex-wrap items-center gap-3">
      <MarketingButton
        aria-disabled={rebakeLocked}
        className={LOCKED_LOOK}
        onClick={handleRebake}
        variant="outline"
      >
        {machinery && <StepMark n="1" />}
        <StableSlot
          value={rebakeLabel}
          variants={machinery ? EXPIRE_LABELS : FUSED_LABELS}
        />
      </MarketingButton>
      {machinery && (
        <>
          <span
            aria-hidden="true"
            className="select-none font-mono text-muted-foreground/50"
          >
            →
          </span>
          <MarketingButton
            disabled={!fetchable || isFetching}
            onClick={handleFetch}
            variant="outline"
          >
            <StepMark n="2" />
            <StableSlot value={askLabel} variants={ASK_LABELS} />
          </MarketingButton>
        </>
      )}
    </div>
  );

  /*
    The view switch, in the corner every editor keeps its view controls.
    Disabled while either transition is in flight: a machinery press
    resolving after the switch flipped off would strand the simple view
    mid-gap, and the reducer's ignore-rule is only the fallback for that —
    see rebake-state.test.ts.
  */
  const viewControls = (
    <div className="flex items-center gap-2.5">
      <label
        className="cursor-pointer select-none font-mono font-semibold text-[0.7rem] text-muted-foreground uppercase tracking-[0.2em]"
        htmlFor="rebake-slow-motion"
      >
        slow motion
      </label>
      <Switch
        checked={machinery}
        disabled={working}
        id="rebake-slow-motion"
        onCheckedChange={handleToggle}
      />
    </div>
  );

  return (
    <LivePanel
      deck={deck}
      status={working ? "working" : "live"}
      viewControls={viewControls}
    >
      <div className="flex flex-col gap-5">
        {/* The specimen: stamp plus provenance, one table. The stamp dims
            and pulses while a round trip is out, and takes one amber wash
            when a new fingerprint lands (key remount, .ht-land). The
            provenance row shares the stamp's own grid so the two read as a
            single instrument readout. role="status" on a <dl> itself trips
            Biome's noInteractiveElementToNoninteractiveRole rule, so the
            live region wraps the row instead. */}
        <div>
          <div
            className={cn(
              "transition-opacity duration-300",
              working && "opacity-60 motion-safe:animate-pulse"
            )}
          >
            <div
              className={
                currentId === initialIdRef.current ? undefined : "ht-land"
              }
              key={currentId}
            >
              {stamp}
            </div>
          </div>
          <div aria-live="polite" className="mt-1" role="status">
            <dl className="grid gap-1 font-mono text-muted-foreground text-sm/6">
              <div className="flex gap-3">
                <dt className="w-16 shrink-0 text-muted-foreground/60">
                  {statusLabel}
                </dt>
                <dd className="min-w-0 flex-1">
                  <StableSlot value={detail} variants={DETAIL_VARIANTS} />
                </dd>
              </div>
            </dl>
          </div>
        </div>
        {/* The narration line — one teaching beat per phase, announced after
            the provenance row (two polite regions, DOM order: the fact,
            then what to do about it). */}
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
    </LivePanel>
  );
}
