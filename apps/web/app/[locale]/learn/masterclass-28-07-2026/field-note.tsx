import { cn } from "@repo/design-system/lib/utils";

interface FieldNoteProps {
  children: React.ReactNode;
  className?: string;
  date: string;
  /**
   * Defaults to "field note", which claims the passage is Eric's own dated
   * observation. Override it when the aside carries something else — evidence
   * from the literature, say — so the eyebrow doesn't overclaim.
   */
  label?: string;
}

export function FieldNote({
  children,
  className,
  date,
  label = "field note",
}: FieldNoteProps) {
  return (
    <aside
      className={cn(
        "mt-8 max-w-2xl border-ht-cyan-700/30 border-l-2 pl-4 dark:border-ht-cyan-500/40",
        className
      )}
    >
      <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.2em]">
        {label} · {date}
      </p>
      <div className="mt-2 font-mono text-foreground/70 text-sm/6">
        {children}
      </div>
    </aside>
  );
}
