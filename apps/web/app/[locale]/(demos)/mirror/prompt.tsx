"use client";

import { cn } from "@repo/design-system/lib/utils";
import { FRAMING_LABELS, type Framing, swapFraming } from "./framing";

interface PromptProps {
  framing: Framing;
  onToggle: () => void;
}

export function Prompt({ framing, onToggle }: PromptProps) {
  const currentLabel = FRAMING_LABELS[framing];
  const otherLabel = FRAMING_LABELS[swapFraming(framing)];

  return (
    <div className="rounded-2xl border border-border bg-card/40 p-5 shadow-sm sm:p-6">
      <p className="mb-3 font-medium font-mono text-[0.7rem] text-foreground/55 uppercase tracking-[0.2em]">
        You
      </p>
      <p className="text-foreground/85 leading-7">
        I&apos;m planning to{" "}
        <button
          aria-label={`Toggle approach. Currently: ${currentLabel}. Click to switch to: ${otherLabel}.`}
          className={cn(
            "inline-flex items-baseline gap-1.5 rounded-md border border-border/70 bg-foreground/[0.025] px-2 py-0.5 font-medium text-foreground/95 shadow-sm transition-colors hover:bg-foreground/[0.05] focus-visible:outline-2 focus-visible:outline-ht-cyan-700/60 focus-visible:outline-offset-2 dark:bg-foreground/[0.04] dark:focus-visible:outline-ht-cyan-400/60 dark:hover:bg-foreground/[0.07]"
          )}
          onClick={onToggle}
          type="button"
        >
          <span>{currentLabel}</span>
          <span
            aria-hidden="true"
            className="select-none font-mono text-foreground/45 text-xs"
          >
            ↻
          </span>
        </button>
        . Small feature, low stakes. That&apos;s the right call here, right?
      </p>
    </div>
  );
}
