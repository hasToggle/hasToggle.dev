"use client";

import { cn } from "@repo/design-system/lib/utils";

interface MetaAsideProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  noMarker?: boolean;
  variant?: "inline" | "block";
}

export function MetaAside({
  children,
  className,
  dark = false,
  noMarker = false,
  variant = "inline",
}: MetaAsideProps) {
  if (variant === "block") {
    return (
      <aside
        className={cn(
          "border-l-2 pl-4 font-mono text-sm/6",
          dark
            ? "border-ht-cyan-500/40 text-ht-cyan-300/85"
            : "border-ht-cyan-700/30 text-ht-cyan-900/70 dark:border-ht-cyan-500/40 dark:text-ht-cyan-300/85",
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
        "font-mono text-sm/6",
        dark
          ? "text-ht-cyan-300/85"
          : "text-ht-cyan-800/75 dark:text-ht-cyan-300/85",
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
