import { cn } from "@repo/design-system/lib/utils";

interface LivePanelProps {
  children: React.ReactNode;
  className?: string;
  /** Short mono caption shown in the panel header, e.g. "runs on this page". */
  label: string;
  /** Server-reported facts rendered in the footer strip. */
  readout?: React.ReactNode;
}

/**
 * The instrument chrome every demo sits in. The header says it's live, the
 * footer reports what the server actually did. If a panel can't honestly fill
 * its readout, it doesn't belong on this page.
 */
export function LivePanel({
  children,
  className,
  label,
  readout,
}: LivePanelProps) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-sm",
        // The instrument warms slightly under the cursor. It is the only
        // hover state on a non-interactive element on this page — it marks
        // the panel as the thing you are meant to reach for.
        "transition-colors duration-300 hover:border-foreground/20",
        className
      )}
    >
      <figcaption className="flex items-center justify-between gap-4 border-foreground/10 border-b bg-muted/40 px-4 py-2.5 sm:px-5">
        <span className="flex items-center gap-2.5 font-mono font-semibold text-[0.7rem] text-muted-foreground uppercase tracking-[0.2em]">
          <span aria-hidden="true" className="relative flex size-2">
            <span className="absolute inline-flex size-full rounded-full bg-ht-cyan-500/50 motion-safe:animate-ping" />
            <span className="relative inline-flex size-2 rounded-full bg-ht-cyan-600 dark:bg-ht-cyan-400" />
          </span>
          live
        </span>
        <span className="truncate font-mono text-muted-foreground/70 text-xs">
          {label}
        </span>
      </figcaption>
      <div className="p-5 sm:p-6">{children}</div>
      {readout ? (
        <div className="border-foreground/10 border-t bg-muted/30 px-4 py-3 font-mono text-ht-cyan-800/85 text-xs/5 sm:px-5 dark:text-ht-cyan-300/85">
          {readout}
        </div>
      ) : null}
    </figure>
  );
}
