"use client";

import { cn } from "@repo/design-system/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { adjacentPhase, PHASES, type PhaseId } from "./phases";

const NUMERALS = ["①", "②", "③", "④"] as const;
const ACCORDION = { duration: 0.25 } as const;

interface ArrowProps {
  dir: "prev" | "next";
  onSelect: (id: PhaseId) => void;
  target: PhaseId | null;
}

function Arrow({ dir, onSelect, target }: ArrowProps) {
  return (
    <button
      aria-label={dir === "prev" ? "Previous beat" : "Next beat"}
      className="shrink-0 rounded px-2 py-1 font-mono text-muted-foreground text-sm transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
      disabled={target === null}
      onClick={() => target && onSelect(target)}
      type="button"
    >
      {dir === "prev" ? "←" : "→"}
    </button>
  );
}

interface PhaseFooterProps {
  current: PhaseId;
  onSelect: (id: PhaseId) => void;
}

/**
 * Presenter mode's transport. An accordion: only the current beat carries its
 * label, the rest collapse to bare numerals — still clickable, so a jump is
 * always one click, and so nothing on the projector reads ahead of the room.
 */
export function PhaseFooter({ current, onSelect }: PhaseFooterProps) {
  return (
    <nav
      aria-label="Demo beats"
      className="flex h-12 items-center gap-1 border-foreground/10 border-t px-2 sm:px-4"
    >
      <Arrow
        dir="prev"
        onSelect={onSelect}
        target={adjacentPhase(current, "prev")}
      />
      {PHASES.map((phase, index) => {
        const active = phase.id === current;
        return (
          <button
            aria-current={active ? "step" : undefined}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap border-b-2 px-2 py-1 font-mono text-xs transition-colors",
              active
                ? "border-ht-cyan-500 text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            key={phase.id}
            onClick={() => onSelect(phase.id)}
            type="button"
          >
            <span>{NUMERALS[index]}</span>
            <AnimatePresence initial={false}>
              {active ? (
                <motion.span
                  animate={{ opacity: 1, width: "auto" }}
                  className="overflow-hidden"
                  exit={{ opacity: 0, width: 0 }}
                  initial={{ opacity: 0, width: 0 }}
                  key="label"
                  transition={ACCORDION}
                >
                  {phase.year ? `${phase.year} · ` : ""}
                  {phase.label}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </button>
        );
      })}
      <Arrow
        dir="next"
        onSelect={onSelect}
        target={adjacentPhase(current, "next")}
      />
    </nav>
  );
}
