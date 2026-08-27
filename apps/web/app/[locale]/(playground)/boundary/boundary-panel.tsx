"use client";

import { cn } from "@repo/design-system/lib/utils";
import { useCallback, useState } from "react";
import { MarketingButton } from "../../components/marketing-button";
import { LivePanel } from "../live-panel";
import { FileCard } from "./card";
import { ClientCard } from "./client-card";
import type { Beat } from "./copy";
import {
  RESET_LABEL,
  SEAMS,
  STEP_ONE_DETAIL,
  STEP_ONE_LABEL,
  STEP_THREE_DETAIL,
  STEP_THREE_LABEL,
  STEP_TWO_LABEL,
} from "./copy";
import { Refusal } from "./refusal";

// The outline variant's `disabled:` look re-expressed for `aria-disabled`,
// so a spent step stays focusable and keyboard users keep their place when
// the sequence advances past it. Same trick as the rebake deck.
const LOCKED_LOOK = cn(
  "aria-disabled:bg-transparent aria-disabled:opacity-40",
  "aria-disabled:cursor-not-allowed aria-disabled:hover:bg-transparent"
);

/** The mono step marker inside a deck button — real sequence, so real numbers. */
function StepMark({ n }: { n: string }) {
  return (
    <span
      aria-hidden="true"
      className="mr-2 select-none font-mono text-muted-foreground text-xs"
    >
      {n}
    </span>
  );
}

/** Each beat's one legal successor — the deck is a sequence, not a menu. */
const NEXT_BEAT: Partial<Record<Beat, Beat>> = {
  hydrated: "split",
  refused: "hydrated",
  rest: "refused",
};

interface BoundaryPanelProps {
  references: React.ReactNode;
  /**
   * The rest beat's body, rendered on the server and handed across the
   * boundary as a finished slot — a client component cannot render a
   * Server Component, only be handed one.
   */
  serverCard: React.ReactNode;
  /**
   * The split beat's body: the same Server Component, now importing the
   * copy-button client island. Also server-rendered, also a slot.
   */
  splitCard: React.ReactNode;
}

/**
 * The client owner of the boundary instrument. The gauge stays `live`:
 * nothing here makes a server round trip — both server slots arrived with
 * the page, and every beat after them is a client render.
 *
 * The deck walks the sequence everyone has walked, plus the step no error
 * message suggests: ask a Server Component for a copy button, read the
 * compiler's refusal, apply the fix the error names — the whole file
 * crosses, fetch included — then extract the button so the fetch comes
 * back. Reset is instrument housekeeping, not a subject action, so it
 * sits in the chrome and stays locked at rest (design.md §4, 2026-08-27).
 */
export function BoundaryPanel({
  references,
  serverCard,
  splitCard,
}: BoundaryPanelProps) {
  const [beat, setBeat] = useState<Beat>("rest");

  const handleReset = useCallback(() => setBeat("rest"), []);
  const advanceFrom = useCallback(
    (from: Beat) =>
      setBeat((current) =>
        current === from ? (NEXT_BEAT[from] ?? current) : current
      ),
    []
  );
  const handleStepOne = useCallback(() => advanceFrom("rest"), [advanceFrom]);
  const handleStepTwo = useCallback(
    () => advanceFrom("refused"),
    [advanceFrom]
  );
  const handleStepThree = useCallback(
    () => advanceFrom("hydrated"),
    [advanceFrom]
  );

  const viewControls = (
    <button
      aria-disabled={beat === "rest"}
      className={cn(
        "cursor-pointer select-none font-mono font-semibold text-[0.7rem] text-muted-foreground uppercase tracking-[0.2em] hover:text-foreground",
        "aria-disabled:cursor-default aria-disabled:opacity-40 aria-disabled:hover:text-muted-foreground"
      )}
      onClick={handleReset}
      type="button"
    >
      {RESET_LABEL} <span aria-hidden="true">↺</span>
    </button>
  );

  const deck = (
    <div className="flex flex-wrap items-center gap-3">
      <MarketingButton
        aria-disabled={beat !== "rest"}
        className={LOCKED_LOOK}
        onClick={handleStepOne}
        variant="outline"
      >
        <StepMark n="1" />
        {STEP_ONE_LABEL}
        <span className="ml-2 font-mono text-muted-foreground text-xs">
          {STEP_ONE_DETAIL}
        </span>
      </MarketingButton>
      <span
        aria-hidden="true"
        className="select-none font-mono text-muted-foreground/50"
      >
        →
      </span>
      <MarketingButton
        aria-disabled={beat !== "refused"}
        className={LOCKED_LOOK}
        onClick={handleStepTwo}
        variant="outline"
      >
        <StepMark n="2" />
        <span className="font-mono">{STEP_TWO_LABEL}</span>
      </MarketingButton>
      <span
        aria-hidden="true"
        className="select-none font-mono text-muted-foreground/50"
      >
        →
      </span>
      <MarketingButton
        aria-disabled={beat !== "hydrated"}
        className={LOCKED_LOOK}
        onClick={handleStepThree}
        variant="outline"
      >
        <StepMark n="3" />
        {STEP_THREE_LABEL}
        <span className="ml-2 font-mono text-muted-foreground text-xs">
          {STEP_THREE_DETAIL}
        </span>
      </MarketingButton>
    </div>
  );

  return (
    <LivePanel deck={deck} references={references} viewControls={viewControls}>
      <div className="flex flex-col gap-5">
        {/* The hydrated and split cards take the landing wash through a key
            remount (.ht-land) — the beats where the value the deck promised
            moves. The refusal needs no wash: red is its own arrival. */}
        <div
          className={cn((beat === "hydrated" || beat === "split") && "ht-land")}
          key={beat}
        >
          <FileCard beat={beat}>
            {beat === "rest" && serverCard}
            {beat === "refused" && <Refusal />}
            {beat === "hydrated" && <ClientCard />}
            {beat === "split" && splitCard}
          </FileCard>
        </div>
        {/* The seam, narrated: the one fact the current beat proves. */}
        <p className="font-mono text-muted-foreground text-xs/5" role="status">
          {SEAMS[beat]}
        </p>
      </div>
    </LivePanel>
  );
}
