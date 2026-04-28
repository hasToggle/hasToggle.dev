import { cn } from "@repo/design-system/lib/utils";
import type { ClaimId } from "./claims";
import type { ClaimTracker } from "./use-claim-tracker";

const NUDGES: readonly { id: ClaimId; text: string }[] = [
  {
    id: "optimistic",
    text: "Drag an item to a new spot. Then try a second drag.",
  },
  {
    id: "persistence",
    text: "Reorder once, then click Refresh demo.",
  },
  {
    id: "test",
    text: 'Open "What the agent did when the test failed."',
  },
];

interface NudgesProps {
  tracker: ClaimTracker;
}

export function Nudges({ tracker }: NudgesProps) {
  return (
    <div className="rounded-md border border-border/50 bg-foreground/[0.015] p-4 dark:bg-foreground/[0.025]">
      <p className="mb-2 font-medium font-mono text-[0.7rem] text-foreground/55 uppercase tracking-[0.2em]">
        Try this
      </p>
      <ul className="space-y-1.5 text-sm">
        {NUDGES.map((nudge) => {
          const caught = tracker.isCaught(nudge.id);
          return (
            <li
              className={cn(
                "flex items-baseline gap-2 transition-colors",
                caught ? "text-foreground/35" : "text-foreground/75"
              )}
              key={nudge.id}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "select-none",
                  caught
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-foreground/40"
                )}
              >
                {caught ? "✓" : "○"}
              </span>
              <span className={cn(caught && "line-through")}>{nudge.text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
