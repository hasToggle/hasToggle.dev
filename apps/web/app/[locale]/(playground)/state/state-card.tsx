"use client";

import { useEffect, useRef, useState } from "react";
import { StateCardShell } from "./card";
import { stateAskLine, stateRenderLine } from "./copy";

// Same instrument as the var card's: counted outside the component,
// written after paint, honest in production. See var-card.tsx.
let renderTally = 0;

interface StateCardProps {
  /** Narrate mode: the two events of a click report themselves in order. */
  narrate: boolean;
  /** Threads the deck's re-render through the React Compiler's memoization. */
  panelPass: number;
}

/**
 * The card that asks useState for its count. The narration is written by
 * the mechanism itself: the ask line from inside the click handler, where
 * the closure still holds the old value, and the render line from an
 * effect after the paint that caught up. Two lines, two moments, both
 * genuinely read at their moment — nothing staged.
 */
export function StateCard({ narrate, panelPass }: StateCardProps) {
  renderTally += 1;
  const renderNumber = renderTally;

  const [count, setCount] = useState(0);

  const badgeRef = useRef<HTMLSpanElement>(null);
  const askRef = useRef<HTMLSpanElement>(null);
  const renderLineRef = useRef<HTMLSpanElement>(null);
  const askedRef = useRef<number | null>(null);

  useEffect(() => {
    if (badgeRef.current) {
      badgeRef.current.textContent = `render #${renderNumber}`;
    }
    if (!narrate) {
      askedRef.current = null;
      if (askRef.current) {
        askRef.current.textContent = "";
      }
      if (renderLineRef.current) {
        renderLineRef.current.textContent = "";
      }
      return;
    }
    // The render line writes only once a click has asked — and it reports
    // the render that actually painted the new value.
    if (askedRef.current !== null && renderLineRef.current) {
      renderLineRef.current.textContent = stateRenderLine(count, renderNumber);
    }
  });

  const handleClick = () => {
    const next = count + 1;
    setCount(next);
    // Read *after* the setter on purpose: the closure's `count` still holds
    // the old value, because the new one does not exist until the next
    // render does. That read is the lesson.
    if (narrate) {
      askedRef.current = next;
      if (askRef.current) {
        askRef.current.textContent = stateAskLine(next, count);
      }
    }
  };

  return (
    <StateCardShell
      facts={[
        "setCount stores the value where React keeps it",
        "then React calls the component again",
        "survives the panel re-rendering — that’s the job",
      ]}
      pill="useState"
      title={`state-card.tsx · pass ${panelPass}`}
      tone="state"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <button
            className="inline-flex items-center justify-center rounded-full border border-transparent bg-primary px-4 py-[calc(0.5rem-1px)] font-medium text-base text-primary-foreground shadow-md hover:bg-primary/90"
            onClick={handleClick}
            type="button"
          >
            +1
          </button>
          {/* Key-remount so each landed value takes the amber wash — the
              same feedback the stamp uses (design.md §2). */}
          <p
            className="ht-land font-display font-medium text-2xl text-foreground tabular-nums tracking-tight"
            key={count}
          >
            {count}
          </p>
          <span
            className="ml-auto font-mono text-[0.65rem] text-muted-foreground/70"
            ref={badgeRef}
          />
        </div>
        <div
          aria-live="polite"
          className={
            narrate
              ? "grid min-h-10 gap-1 font-mono text-muted-foreground text-xs/5"
              : "hidden"
          }
        >
          <span ref={askRef} />
          <span
            className="text-ht-cyan-700 dark:text-ht-cyan-300"
            ref={renderLineRef}
          />
        </div>
      </div>
    </StateCardShell>
  );
}
