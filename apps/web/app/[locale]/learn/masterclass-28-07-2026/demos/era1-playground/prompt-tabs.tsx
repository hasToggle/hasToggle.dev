"use client";

import { cn } from "@repo/design-system/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import type { MouseEvent } from "react";
import { PROMPTS } from "./selector";

const FADE = { duration: 0.25 } as const;

interface PromptTabsProps {
  activeId: string;
  onSelect: (event: MouseEvent<HTMLButtonElement>) => void;
  showSecond: boolean;
}

/**
 * Folder tabs. The active one carries the output panel's exact fill and touches
 * it with no border between, so the two read as one object; the inactive one
 * sits on the console's own background and reads as behind. No underline, no
 * accent colour — the join itself says which prompt is loaded.
 *
 * The fill has to live here rather than on the wrapper: `bg-muted/40` is
 * translucent, so the active tab and the panel only composite to the same
 * colour if both sit directly on the wrapper's `bg-background`.
 */
export function PromptTabs({
  activeId,
  onSelect,
  showSecond,
}: PromptTabsProps) {
  const visible = showSecond ? PROMPTS : PROMPTS.slice(0, 1);
  return (
    <div className="flex h-10 items-stretch gap-1 px-2 pt-2">
      <AnimatePresence initial={false}>
        {visible.map((prompt) => {
          const active = prompt.id === activeId;
          return (
            <motion.button
              animate={{ opacity: 1 }}
              aria-pressed={active}
              className={cn(
                "whitespace-nowrap rounded-t-md px-3 font-mono text-xs transition-colors sm:text-sm",
                active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-foreground/[0.03] hover:text-foreground"
              )}
              data-prompt={prompt.id}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key={prompt.id}
              onClick={onSelect}
              transition={FADE}
              type="button"
            >
              {prompt.label}
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
