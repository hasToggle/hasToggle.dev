"use client";

import { cn } from "@repo/design-system/lib/utils";
import { useEffect, useRef, useState } from "react";
import { StateCardShell } from "./card";
import { stepPaints, stepRender, stepReturns } from "./copy";
import { REPLAY_NOTES, REPLAY_WALK } from "./source";

// The render tally lives outside the component on purpose: a value inside
// would be re-declared by the very renders it is meant to count. Written to
// the badge after paint, never rendered by JSX, so hydration has nothing to
// disagree with. (React's dev StrictMode double-invokes renders; the tally
// is honest in production.)
let renderTally = 0;

// The replay's rhythm: flip out, then the walk — quick over plain lines,
// dwelling where an annotation lands — then flip back.
const FLIP_MS = 550;
const SWEEP_MS = 240;
const NOTE_MS = 1000;
const NOTE_LINES: ReadonlySet<number> = new Set(Object.values(REPLAY_NOTES));

interface StateCardProps {
  /** Narrate mode: a press turns the card over and replays itself. */
  narrate: boolean;
  /** Threads the deck's re-render through the React Compiler's memoization. */
  panelPass: number;
  /** The card's back face — the source, Shiki-highlighted on the server. */
  replayCode: React.ReactNode;
}

/**
 * The counter, with the replay on its back. A press updates state
 * immediately — the new number exists before the card finishes turning —
 * and in narrate mode the card flips to the source and replays the click
 * against it: the press (annotated with the closure's genuinely stale
 * read), the fresh call, the kept value coming back, the paint. Slowed,
 * not simulated; every value in the annotations was read live. Then it
 * turns back, and the number has moved.
 */
export function StateCard({ narrate, panelPass, replayCode }: StateCardProps) {
  renderTally += 1;
  const renderNumber = renderTally;

  const [count, setCount] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const badgeRef = useRef<HTMLSpanElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLParagraphElement>(null);
  const numberRef = useRef<HTMLParagraphElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const replayingRef = useRef(false);

  useEffect(() => {
    if (badgeRef.current) {
      badgeRef.current.textContent = `render #${renderNumber}`;
    }
  });

  // Unmounting mid-replay: cancel the walk.
  useEffect(
    () => () => {
      for (const timeout of timeoutsRef.current) {
        clearTimeout(timeout);
      }
    },
    []
  );

  const setActiveLine = (index: number | null) => {
    const lines = codeRef.current?.querySelectorAll(".line");
    if (!lines) {
      return;
    }
    lines.forEach((line, i) => {
      line.classList.toggle("ht-replay-active", i === index);
    });
  };

  const schedule = (fn: () => void, ms: number) => {
    timeoutsRef.current.push(setTimeout(fn, ms));
  };

  const writeNote = (text: string) => {
    if (noteRef.current) {
      noteRef.current.textContent = text;
    }
  };

  const handleClick = () => {
    if (replayingRef.current) {
      return;
    }
    const next = count + 1;
    setCount(next);

    if (!narrate) {
      return;
    }

    // Read at fire time: the render an annotation names has happened by the
    // time its timeout runs.
    const noteFor = (line: number): string | null => {
      if (line === REPLAY_NOTES.fn) {
        return stepRender(renderTally);
      }
      if (line === REPLAY_NOTES.useState) {
        return stepReturns(next);
      }
      if (line === REPLAY_NOTES.paint) {
        return stepPaints(next);
      }
      return null;
    };

    replayingRef.current = true;
    timeoutsRef.current = [];
    setFlipped(true);
    // The walk re-runs the component the way a render does: top to bottom,
    // every line with code on it. An annotation holds until the next one
    // replaces it, so the sweep reads as one continuous execution.
    let at = FLIP_MS;
    for (const line of REPLAY_WALK) {
      schedule(() => {
        setActiveLine(line);
        const note = noteFor(line);
        if (note !== null) {
          writeNote(note);
        }
      }, at);
      at += NOTE_LINES.has(line) ? NOTE_MS : SWEEP_MS;
    }
    schedule(() => {
      setFlipped(false);
      setActiveLine(null);
      writeNote("");
      // The paint happened while the card was turned; the wash marks its
      // reveal (re-triggered by hand — a keyed remount already played it
      // behind the card's back).
      if (numberRef.current) {
        numberRef.current.classList.remove("ht-land");
        void numberRef.current.offsetWidth;
        numberRef.current.classList.add("ht-land");
      }
      replayingRef.current = false;
    }, at);
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
      <div className="[perspective:1200px]">
        <div
          className={cn(
            "grid transition-transform duration-500 [transform-style:preserve-3d] motion-reduce:transition-none",
            flipped && "[transform:rotateY(180deg)]"
          )}
        >
          {/* Front: the counter — one control, two segments. The button
              presses; the count answers. A hairline seam keeps them honest
              as separate elements while the shared pill makes them one. */}
          <div
            aria-hidden={flipped}
            className={cn(
              "flex flex-col items-center justify-center gap-3 [backface-visibility:hidden] [grid-area:1/1]",
              flipped && "pointer-events-none"
            )}
          >
            <div className="inline-flex items-stretch overflow-hidden rounded-full border border-foreground/15 shadow-md">
              <button
                className="bg-primary px-5 py-[calc(0.5rem-1px)] font-medium text-base text-primary-foreground transition-colors hover:bg-primary/90"
                onClick={handleClick}
                type="button"
              >
                +1
              </button>
              <p
                className="ht-land flex min-w-14 items-center justify-center border-foreground/15 border-l bg-background px-5 font-display font-medium text-foreground text-xl tabular-nums tracking-tight"
                key={count}
                ref={numberRef}
              >
                {count}
              </p>
            </div>
            <span
              className="font-mono text-[0.65rem] text-muted-foreground/70"
              ref={badgeRef}
            />
          </div>
          {/* Back: the source, walked line by line. Pointer events off while
              hidden — an invisible backface still sits over the button. */}
          <div
            aria-hidden={!flipped}
            className={cn(
              "[backface-visibility:hidden] [grid-area:1/1] [transform:rotateY(180deg)]",
              !flipped && "pointer-events-none"
            )}
          >
            <div ref={codeRef}>{replayCode}</div>
            <p
              aria-live="polite"
              className="mt-2 min-h-5 font-mono text-ht-cyan-700 text-xs/5 dark:text-ht-cyan-300"
              ref={noteRef}
            />
            <p className="mt-1 font-mono text-[0.65rem] text-muted-foreground/70">
              the last click, replayed slow · values real
            </p>
          </div>
        </div>
      </div>
    </StateCardShell>
  );
}
