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
 * The panel is one continuous surface, and this row sits on it. The loaded
 * prompt therefore needs no treatment at all — it *is* the surface, flush with
 * the code beneath it. Only the unloaded prompt is marked, as a recess cut into
 * that surface.
 *
 * Marking the active tab instead is what made it read as a plump floating
 * button in a field of its own, and gave the panel a stripe of bare background
 * above the tabs. There is no field here and nothing to sit in it.
 *
 * The recess is darkened per theme rather than by one translucent token, so it
 * reads as a hole in both. A fill that lightens would read as a raised button —
 * and a raised *inactive* tab would invert the phase footer's grammar, where a
 * filled shape is the one that's live.
 */
export function PromptTabs({
  activeId,
  onSelect,
  showSecond,
}: PromptTabsProps) {
  const visible = showSecond ? PROMPTS : PROMPTS.slice(0, 1);
  // The row's p-1 plus each tab's px-3 puts the first label at exactly the
  // code's p-4 indent, so the loaded prompt and its output share a left edge.
  return (
    <div className="flex h-11 items-stretch gap-1 p-1">
      <AnimatePresence initial={false}>
        {visible.map((prompt) => {
          const active = prompt.id === activeId;
          return (
            <motion.button
              animate={{ opacity: 1 }}
              aria-pressed={active}
              className={cn(
                "whitespace-nowrap rounded-md px-3 font-mono text-xs transition-colors sm:text-sm",
                active
                  ? "text-foreground"
                  : "bg-foreground/[0.06] text-muted-foreground hover:bg-foreground/10 hover:text-foreground dark:bg-black/35 dark:hover:bg-black/50"
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
