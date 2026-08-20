import { cn } from "@repo/design-system/lib/utils";

interface MetaAsideProps {
  children: React.ReactNode;
  className?: string;
  noMarker?: boolean;
  variant?: "comment" | "inline" | "block";
}

export function MetaAside({
  children,
  className,
  noMarker = false,
  variant = "inline",
}: MetaAsideProps) {
  if (variant === "comment") {
    // The exhibit asides, set the way they read: a note an engineer left in
    // this codebase. Comment-gray like the highlighted source's own comments,
    // wrapped in the block markers, no brand color asking for credit.
    //
    // The spaces beside the markers are U+00A0. A marker belongs to the text
    // it wraps, and an ordinary space lets the closing marker wrap onto a line
    // of its own, which is not a shape a comment ever has in an editor.
    return (
      <aside
        className={cn("font-mono text-muted-foreground text-sm/6", className)}
      >
        <span aria-hidden="true" className="select-none opacity-55">
          {"/* "}
        </span>
        {children}
        <span aria-hidden="true" className="select-none opacity-55">
          {" */"}
        </span>
      </aside>
    );
  }

  if (variant === "block") {
    return (
      <aside
        className={cn(
          "border-ht-cyan-700/30 border-l-2 pl-4 font-mono text-ht-cyan-900 text-sm/6 dark:border-ht-cyan-500/40 dark:text-ht-cyan-300/85",
          className
        )}
      >
        {children}
      </aside>
    );
  }

  return (
    <p
      className={cn(
        // Solid cyan-900, not the 800/75 and 900/70 these started on. At
        // 14px the aside needs 4.5:1 and those measured 3.00 and 3.48 on the
        // page's own white. Every faded cyan this palette can make misses —
        // 900/85 is the closest and still lands at 4.46 on the muted band.
        // Solid 900 clears it everywhere the component is used (6.03 worst
        // case). Dark keeps 300/85, which was never in question at 12.62.
        "font-mono text-ht-cyan-900 text-sm/6 dark:text-ht-cyan-300/85",
        className
      )}
    >
      {!noMarker && (
        <span aria-hidden="true" className="mr-2 select-none opacity-55">
          {"//"}
        </span>
      )}
      {children}
    </p>
  );
}
