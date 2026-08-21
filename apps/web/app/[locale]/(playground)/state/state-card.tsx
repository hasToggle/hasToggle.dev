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

/** Which history slot a landing line lights, in reading order. */
const NOTE_INDEX: Readonly<Record<number, number>> = {
  [REPLAY_NOTES.fn]: 0,
  [REPLAY_NOTES.useState]: 1,
  [REPLAY_NOTES.paint]: 2,
};

interface StateCardProps {
  /** Narrate mode: a press turns the card over and replays itself. */
  narrate: boolean;
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
export function StateCard({ narrate, replayCode }: StateCardProps) {
  renderTally += 1;
  const renderNumber = renderTally;

  const [count, setCount] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const badgeRef = useRef<HTMLSpanElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<HTMLOListElement>(null);
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

  const noteItems = (): HTMLLIElement[] =>
    notesRef.current ? [...notesRef.current.querySelectorAll("li")] : [];

  const lightNote = (index: number | undefined) => {
    if (index === undefined) {
      return;
    }
    noteItems()[index]?.classList.add("ht-lit");
  };

  const clearNotes = () => {
    for (const item of noteItems()) {
      item.textContent = "";
      item.classList.remove("ht-lit");
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

    replayingRef.current = true;
    timeoutsRef.current = [];
    setFlipped(true);
    // The whole record is on the card before the walk begins — all three
    // annotations, dimmed — so a reader can take them in at their own pace.
    // Values are read at fire time; the render this history names has
    // happened by mid-flip.
    schedule(
      () => {
        const texts = [
          stepRender(renderTally),
          stepReturns(next),
          stepPaints(next),
        ];
        noteItems().forEach((item, index) => {
          item.textContent = texts[index] ?? "";
          item.classList.remove("ht-lit");
        });
      },
      Math.round(FLIP_MS / 2)
    );
    // The walk re-runs the component the way a render does: top to bottom,
    // every line with code on it — dwelling where a history line lights up,
    // and each stays lit once lit.
    let at = FLIP_MS;
    for (const line of REPLAY_WALK) {
      schedule(() => {
        setActiveLine(line);
        lightNote(NOTE_INDEX[line]);
      }, at);
      at += NOTE_LINES.has(line) ? NOTE_MS : SWEEP_MS;
    }
    schedule(() => {
      setFlipped(false);
      setActiveLine(null);
      clearNotes();
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
      ]}
      pill="useState"
      title="state-card.tsx"
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
            {/* One dark pill: the button is the long segment; the count sits
                behind a short hairline pipe, not a full-height seam — output
                riding on the same control it answers. */}
            <div className="inline-flex items-stretch overflow-hidden rounded-full bg-primary shadow-md">
              <button
                className="px-8 py-[calc(0.5rem-1px)] font-medium text-base text-primary-foreground transition-colors hover:bg-primary-foreground/10"
                onClick={handleClick}
                type="button"
              >
                +1
              </button>
              <span
                aria-hidden="true"
                className="my-1.5 w-px self-stretch bg-primary-foreground/25"
              />
              <p
                className="ht-land flex min-w-12 items-center justify-center px-4 font-display font-medium text-base text-primary-foreground tabular-nums tracking-tight"
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
            {/* The history, whole from the start: three dimmed lines that
                light as the walk reaches them and stay lit — a record to
                read at your own pace, not a ticker. */}
            <ol
              aria-live="polite"
              className="mt-2 grid gap-1 font-mono text-xs/5"
              ref={notesRef}
            >
              <li className="ht-replay-note min-h-5" />
              <li className="ht-replay-note min-h-5" />
              <li className="ht-replay-note min-h-5" />
            </ol>
            <p className="mt-1 font-mono text-[0.65rem] text-muted-foreground/70">
              the last click, replayed slow · values real
            </p>
          </div>
        </div>
      </div>
    </StateCardShell>
  );
}
