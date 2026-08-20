import { cn } from "@repo/design-system/lib/utils";

interface LivePanelProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Interactive strip pinned to the bottom of the instrument — actions only,
   * in execution order. Hands always go to the same place.
   */
  deck?: React.ReactNode;
  /**
   * The bottom zone: a ReferenceBar holding the code drawer and the docs and
   * source links — the status bar every editor ends in. The exhibit's whole
   * engineering surface lives in one chassis.
   */
  references?: React.ReactNode;
  /**
   * The header gauge. `working` means a server round trip is in flight right
   * now — the dot turns amber and says so. There is exactly one such signal
   * per instrument, and this is it.
   */
  status?: "live" | "working";
  /**
   * View controls, pinned top-right of the chrome — the corner every editor
   * keeps its view switches in. Actions never live here.
   */
  viewControls?: React.ReactNode;
}

/**
 * The instrument chrome every demo sits in. The fixed grammar: state
 * top-left, view controls top-right, the specimen in the body, actions in
 * the bottom deck. A visitor who has used one instrument has used them all.
 */
export function LivePanel({
  children,
  className,
  deck,
  references,
  status = "live",
  viewControls,
}: LivePanelProps) {
  const working = status === "working";
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
      <figcaption className="flex min-h-11 items-center justify-between gap-4 border-foreground/10 border-b bg-muted/40 px-4 py-2 sm:px-5">
        <span className="flex items-center gap-2.5 font-mono font-semibold text-[0.7rem] text-muted-foreground uppercase tracking-[0.2em]">
          <span aria-hidden="true" className="relative flex size-2">
            <span
              className={cn(
                "absolute inline-flex size-full rounded-full motion-safe:animate-ping",
                working
                  ? "bg-(--color-hastoggle-orange)/60"
                  : "bg-ht-cyan-500/50"
              )}
            />
            <span
              className={cn(
                "relative inline-flex size-2 rounded-full",
                working
                  ? "bg-(--color-hastoggle-orange)"
                  : "bg-ht-cyan-600 dark:bg-ht-cyan-400"
              )}
            />
          </span>
          {working ? "working" : "live"}
        </span>
        {viewControls}
      </figcaption>
      <div className="p-5 sm:p-6">{children}</div>
      {deck ? (
        <div className="border-foreground/10 border-t px-4 py-4 sm:px-5">
          {deck}
        </div>
      ) : null}
      {references ? (
        <div className="border-foreground/10 border-t bg-muted/40">
          {references}
        </div>
      ) : null}
    </figure>
  );
}
