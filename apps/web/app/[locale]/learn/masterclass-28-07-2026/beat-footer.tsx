"use client";

import { cn } from "@repo/design-system/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { adjacentBeat, BEATS } from "./beats";
import type { StepId } from "./steps";

const CROSSFADE = { duration: 0.2 } as const;
/** Above this, numerals stop being countable from the back wall. */
const NUMERAL_LIMIT = 6;
/** The one visual break the eleven-tick rail needs. */
const GROUP_BREAK_AFTER = "fenced";

interface ArrowProps {
  dir: "prev" | "next";
  onSelect: (id: string) => void;
  target: string | null;
}

function Arrow({ dir, onSelect, target }: ArrowProps) {
  return (
    <button
      aria-label={dir === "prev" ? "Previous beat" : "Next beat"}
      className="shrink-0 rounded px-2 font-mono text-muted-foreground text-sm transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
      disabled={target === null}
      onClick={() => target && onSelect(target)}
      type="button"
    >
      {dir === "prev" ? "←" : "→"}
    </button>
  );
}

interface BeatFooterProps {
  current: string;
  onSelect: (id: string) => void;
  step: StepId;
}

/**
 * The step-level transport, fixed to the viewport bottom because a step is now
 * taller than a screen and a footer in the document flow would have to be
 * scrolled to before it could be used.
 *
 * Numerals up to six, grouped ticks beyond: eleven numerals read as a smear at
 * stage distance, where "third cluster, second tick" still reads. The label
 * sits in a reserved slot and crossfades in place, so the numerals never move —
 * the same fixed-geometry rule `PhaseFooter` documents.
 */
export function BeatFooter({ current, onSelect, step }: BeatFooterProps) {
  const beats = BEATS[step];
  if (beats.length === 0) {
    return null;
  }
  const index = beats.findIndex((b) => b.id === current);
  const numerals = beats.length <= NUMERAL_LIMIT;

  return (
    <nav
      aria-label="Presentation beats"
      className="fixed inset-x-0 bottom-0 z-40 flex h-[4.5rem] flex-col items-center justify-center gap-1.5 border-foreground/10 border-t bg-background/95 px-2 backdrop-blur sm:px-4"
    >
      <div className="flex items-center gap-2">
        <Arrow
          dir="prev"
          onSelect={onSelect}
          target={adjacentBeat(step, current, "prev")}
        />

        <div className="flex items-center gap-2">
          {beats.map((b, i) => {
            const active = b.id === current;
            const gap = !numerals && beats[i - 1]?.id === GROUP_BREAK_AFTER;
            return (
              <button
                aria-current={active ? "step" : undefined}
                aria-label={b.label}
                className={cn(
                  numerals
                    ? "flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-xs tabular-nums transition-colors"
                    : "size-2.5 shrink-0 rounded-[2px] transition-colors",
                  gap && "ml-4",
                  active && "bg-foreground text-background",
                  !active &&
                    numerals &&
                    "border border-foreground/20 text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                  !(active || numerals) &&
                    "bg-foreground/20 hover:bg-foreground/40"
                )}
                key={b.id}
                onClick={() => onSelect(b.id)}
                type="button"
              >
                {numerals ? i + 1 : null}
              </button>
            );
          })}
        </div>

        <Arrow
          dir="next"
          onSelect={onSelect}
          target={adjacentBeat(step, current, "next")}
        />
      </div>

      <div className="flex h-5 items-center">
        <AnimatePresence mode="wait">
          <motion.span
            animate={{ opacity: 1 }}
            className="whitespace-nowrap font-mono text-foreground text-xs"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key={current}
            transition={CROSSFADE}
          >
            {beats[index]?.label ?? ""}
          </motion.span>
        </AnimatePresence>
      </div>
    </nav>
  );
}
