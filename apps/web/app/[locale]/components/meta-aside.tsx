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
    return (
      <aside
        className={cn("font-mono text-muted-foreground text-sm/6", className)}
      >
        <span aria-hidden="true" className="select-none opacity-55">
          {"/* "}
        </span>
        {children}
        <span aria-hidden="true" className="select-none opacity-55">
          {" */"}
        </span>
      </aside>
    );
  }

  if (variant === "block") {
    return (
      <aside
        className={cn(
          "border-ht-cyan-700/30 border-l-2 pl-4 font-mono text-ht-cyan-900/70 text-sm/6 dark:border-ht-cyan-500/40 dark:text-ht-cyan-300/85",
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
        "font-mono text-ht-cyan-800/75 text-sm/6 dark:text-ht-cyan-300/85",
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
