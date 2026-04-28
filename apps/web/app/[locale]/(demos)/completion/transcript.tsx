import { cn } from "@repo/design-system/lib/utils";
import { CLAIMS, COMPLETION_LINE, PROMPT_TEXT } from "./claims";
import type { ClaimTracker } from "./use-claim-tracker";

interface TranscriptProps {
  tracker: ClaimTracker;
}

export function Transcript({ tracker }: TranscriptProps) {
  const allCaught = tracker.countCaught === CLAIMS.length;

  return (
    <div className="rounded-2xl border border-border bg-card/40 p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 font-mono text-sm/7">
          <p className="text-foreground/55">
            <span aria-hidden="true" className="mr-2 select-none opacity-55">
              &gt;
            </span>
            {PROMPT_TEXT}
          </p>
          <ul className="mt-3 space-y-1">
            {CLAIMS.map((claim) => {
              const caught = tracker.isCaught(claim.id);
              return (
                <li
                  className={cn(
                    "flex items-baseline gap-2 transition-colors",
                    caught
                      ? "text-foreground/45 line-through decoration-red-500/70 dark:decoration-red-400/70"
                      : "text-foreground/85"
                  )}
                  key={claim.id}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "select-none",
                      caught
                        ? "text-red-500 dark:text-red-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    )}
                  >
                    {caught ? "✗" : "✓"}
                  </span>
                  <span>{claim.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <p
          aria-live="polite"
          className="shrink-0 rounded-md border border-border/60 bg-foreground/[0.02] px-3 py-1.5 font-medium font-mono text-[0.7rem] text-foreground/55 uppercase tracking-[0.2em] dark:bg-foreground/[0.04]"
        >
          lies caught: {tracker.countCaught} / {CLAIMS.length}
        </p>
      </div>
      {allCaught && (
        <p className="fade-in mt-4 animate-in font-mono text-foreground/45 text-sm duration-300">
          {COMPLETION_LINE}
        </p>
      )}
    </div>
  );
}
