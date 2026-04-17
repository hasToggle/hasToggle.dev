"use client";

import { cn } from "@repo/design-system/lib/utils";

interface MetaAsideProps {
  children: React.ReactNode;
  className?: string;
}

export function MetaAside({ children, className }: MetaAsideProps) {
  return (
    <p
      className={cn(
        "font-mono text-muted-foreground text-xs/5 italic tracking-wide",
        className
      )}
    >
      {children}
    </p>
  );
}
