"use client";

import { cn } from "@repo/design-system/lib/utils";
import { useEffect, useRef, useState } from "react";
import { StateCardShell } from "./card";
import { stepPaints, stepPress, stepRender, stepReturns } from "./copy";
import { REPLAY_LINES } from "./source";

// The render tally lives outside the component on purpose: a value inside
// would be re-declared by the very renders it is meant to count. Written to
// the badge after paint, never rendered by JSX, so hydration has nothing to
// disagree with. (React's dev StrictMode double-invokes renders; the tally
// is honest in production.)
let renderTally = 0;

// The replay's rhythm: one flip out, four narrated landings, one flip back.
const FLIP_MS = 550;
const STEP_MS = 1050;

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
    // Read *after* the setter on purpose: the closure's `count` still holds
    // the old value, because the new one does not exist until the next
    // render does. The replay's first annotation reports that read.
    const closureRead = count;

    if (!narrate) {
      return;
    }

    replayingRef.current = true;
    timeoutsRef.current = [];
    setFlipped(true);
    schedule(() => {
      setActiveLine(REPLAY_LINES.press);
      writeNote(stepPress(next, closureRead));
    }, FLIP_MS);
    schedule(() => {
      // Read at fire time: the render this step names has happened by now.
      setActiveLine(REPLAY_LINES.fn);
      writeNote(stepRender(renderTally));
    }, FLIP_MS + STEP_MS);
    schedule(
      () => {
        setActiveLine(REPLAY_LINES.useState);
        writeNote(stepReturns(next));
      },
      FLIP_MS + 2 * STEP_MS
    );
    schedule(
      () => {
        setActiveLine(REPLAY_LINES.paint);
        writeNote(stepPaints(next));
      },
      FLIP_MS + 3 * STEP_MS
    );
    schedule(
      () => {
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
      },
      FLIP_MS + 4 * STEP_MS
    );
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
          {/* Front: the counter. */}
          <div
            aria-hidden={flipped}
            className={cn(
              "flex flex-col justify-center gap-2 [backface-visibility:hidden] [grid-area:1/1]",
              flipped && "pointer-events-none"
            )}
          >
            <div className="flex items-center gap-4">
              <button
                className="inline-flex items-center justify-center rounded-full border border-transparent bg-primary px-4 py-[calc(0.5rem-1px)] font-medium text-base text-primary-foreground shadow-md hover:bg-primary/90"
                onClick={handleClick}
                type="button"
              >
                +1
              </button>
              <p
                className="ht-land font-display font-medium text-2xl text-foreground tabular-nums tracking-tight"
                key={count}
                ref={numberRef}
              >
                {count}
              </p>
              <span
                className="ml-auto font-mono text-[0.65rem] text-muted-foreground/70"
                ref={badgeRef}
              />
            </div>
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
