import { cn } from "@repo/design-system/lib/utils";
import type { Beat } from "./copy";
import { DIRECTIVE_LINES, FACTS, SIDES } from "./copy";

interface FileCardProps {
  beat: Beat;
  children: React.ReactNode;
}

/**
 * The specimen dressed as its file: badge and filename up top, the file's
 * first line where a file keeps it, the body, then the fact rows. One card
 * for all four beats, so the only thing that ever changes is what the
 * beat changed — the directive, the residency, and the boundary.
 *
 * The dashed orange border is the boundary made visible. In the crossed
 * beat it wraps the whole card — that is what the directive claimed — and
 * in the split beat the same dashing shrinks to the ring around
 * copy-button.tsx (drawn in server-card.tsx), so the two states show the
 * line moving.
 */
export function FileCard({ beat, children }: FileCardProps) {
  const side = SIDES[beat];
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-xl bg-muted/20",
        beat === "crossed"
          ? "border border-ht-orange-700/40 border-dashed dark:border-ht-orange-500/40"
          : "border border-foreground/10"
      )}
    >
      <div className="flex items-center justify-between gap-3 border-foreground/10 border-b px-4 py-2.5 sm:px-5">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono font-semibold text-[0.65rem] uppercase tracking-[0.2em]",
            side === "server"
              ? "border-ht-cyan-700/30 text-ht-cyan-800 dark:border-ht-cyan-500/40 dark:text-ht-cyan-300"
              : "border-ht-orange-700/30 text-ht-orange-800 dark:border-ht-orange-500/40 dark:text-ht-orange-300"
          )}
        >
          {side}
        </span>
        <span className="font-mono text-muted-foreground text-xs">
          card.tsx
        </span>
      </div>
      <p
        className={cn(
          "px-4 pt-3 font-mono text-xs sm:px-5",
          beat === "crossed"
            ? "text-ht-orange-800 dark:text-ht-orange-300"
            : "text-muted-foreground/60"
        )}
      >
        {DIRECTIVE_LINES[beat]}
      </p>
      <div className="flex-1 px-4 py-3 sm:px-5">{children}</div>
      <ul className="grid gap-1 border-foreground/10 border-t px-4 py-3 font-mono text-muted-foreground text-xs/5 sm:px-5">
        {FACTS[beat].map((fact) => (
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
