"use client";

import { cn } from "@repo/design-system/lib/utils";
import { useState } from "react";

interface ExpandableProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  label: string;
}

export function Expandable({
  children,
  className,
  dark = false,
  label,
}: ExpandableProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("mt-6", className)}>
      <button
        className={cn(
          "group flex items-center gap-2 font-medium text-sm",
          dark
            ? "text-gray-200 hover:text-gray-400"
            : "text-gray-950 hover:text-gray-700 dark:text-gray-200 dark:hover:text-gray-400"
        )}
        onClick={() => setOpen(!open)}
        type="button"
      >
        <span
          className={cn(
            "inline-block transition-transform duration-200",
            open && "rotate-90"
          )}
        >
          &#9656;
        </span>
        {label}
      </button>
      {open && (
        <div
          className={cn(
            "mt-4 text-sm/6",
            dark ? "text-gray-400" : "text-gray-600 dark:text-gray-400"
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
