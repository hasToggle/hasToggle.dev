"use client";

import { cn } from "@repo/design-system/lib/utils";
import { useCallback, useState } from "react";

/**
 * The one component in this chapter that genuinely needs the browser:
 * clipboard access and a "copied" tick have no server-side counterpart.
 * In the split beat this file is the entire client bundle of the card —
 * the directive above is the boundary, drawn at its smallest.
 */
export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {
        // Clipboard access denied: the button simply doesn't tick.
      });
  }, [value]);

  return (
    <button
      className={cn(
        "inline-flex items-center rounded-md border border-foreground/15 px-2 py-0.5 font-mono text-muted-foreground text-xs transition-colors",
        "hover:border-foreground/30 hover:text-foreground",
        copied && "border-ht-cyan-700/40 text-ht-cyan-800 dark:text-ht-cyan-300"
      )}
      onClick={handleCopy}
      type="button"
    >
      {copied ? "copied" : "copy"}
    </button>
  );
}
