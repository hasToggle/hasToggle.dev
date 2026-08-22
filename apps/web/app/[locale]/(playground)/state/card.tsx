import { cn } from "@repo/design-system/lib/utils";

interface StateCardShellProps {
  children: React.ReactNode;
  facts: readonly string[];
  /** The mechanism on trial, worn as the pill: "let count" or "useState". */
  pill: string;
  title: string;
  tone: "plain" | "state";
}

/**
 * Shared chrome for the two halves of the state demo — the boundary demo's
 * card, re-cut: the only visible difference between the halves is the one
 * that matters, which is where the count lives.
 */
export function StateCardShell({
  children,
  facts,
  pill,
  title,
  tone,
}: StateCardShellProps) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-xl border border-foreground/10 bg-muted/20 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono font-semibold text-[0.65rem] tracking-[0.08em]",
            tone === "state"
              ? "border-ht-cyan-700/30 text-ht-cyan-800 dark:border-ht-cyan-500/40 dark:text-ht-cyan-300"
              : "border-ht-orange-700/30 text-ht-orange-800 dark:border-ht-orange-500/40 dark:text-ht-orange-300"
          )}
        >
          {pill}
        </span>
        <span className="font-mono text-muted-foreground/70 text-xs">
          {title}
        </span>
      </div>
      <div className="flex-1">{children}</div>
      <ul className="grid gap-1 border-foreground/10 border-t pt-3 font-mono text-muted-foreground text-xs/5">
        {facts.map((fact) => (
          <li className="flex gap-2" key={fact}>
            <span aria-hidden="true" className="select-none opacity-55">
              –
            </span>
            {fact}
          </li>
        ))}
      </ul>
    </div>
  );
}
