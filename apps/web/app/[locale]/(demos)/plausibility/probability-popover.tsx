"use client";

import { cn } from "@repo/design-system/lib/utils";
import type { Candidate } from "./paragraph-data";

interface ProbabilityPopoverProps {
  candidates: Candidate[];
  exiting?: boolean;
}

export function ProbabilityPopover({
  candidates,
  exiting = false,
}: ProbabilityPopoverProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute top-full left-1/2 z-10 mt-2 block w-[16rem] -translate-x-1/2 rounded-md border border-border bg-card/95 p-3 font-mono text-foreground/85 text-xs shadow-lg backdrop-blur-sm sm:-top-1 sm:bottom-full sm:mt-0 sm:mb-2 sm:w-[18rem]",
        "transition-all duration-200",
        exiting ? "scale-95 opacity-0" : "scale-100 opacity-100"
      )}
    >
      <span className="block space-y-1">
        {candidates.map((candidate) => (
          <span className="block" key={candidate.text}>
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  "min-w-0 flex-1 truncate",
                  candidate.chosen
                    ? "font-semibold text-foreground"
                    : "text-foreground/55"
                )}
              >
                {candidate.text}
              </span>
              <span
                className={cn(
                  "text-[0.65rem] tabular-nums",
                  candidate.chosen ? "text-foreground" : "text-foreground/45"
                )}
              >
                {(candidate.weight * 100).toFixed(0)}%
              </span>
            </span>
            <span className="mt-1 block h-1 w-full overflow-hidden rounded-full bg-foreground/10">
              <span
                className={cn(
                  "block h-full rounded-full",
                  candidate.chosen ? "bg-ht-cyan-500/80" : "bg-foreground/25"
                )}
                style={{ width: `${candidate.weight * 100}%` }}
              />
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
