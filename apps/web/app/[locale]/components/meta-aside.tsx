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
        "font-mono text-gray-400 text-xs/5 italic tracking-wide dark:text-gray-500",
        className
      )}
    >
      {children}
    </p>
  );
}
