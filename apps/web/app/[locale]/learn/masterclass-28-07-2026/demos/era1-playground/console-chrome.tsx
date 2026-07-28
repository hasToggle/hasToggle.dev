"use client";

import { Slider } from "@repo/design-system/components/ui/slider";
import { cn } from "@repo/design-system/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import type { MouseEvent } from "react";
import { useCallback } from "react";
import { bandFor, type Mode } from "./selector";

const MODES: readonly { id: Mode; label: string }[] = [
  { id: "base", label: "base" },
  { id: "instruct", label: "post-trained" },
] as const;

const FADE = { duration: 0.25 } as const;

interface ConsoleChromeProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  onReset: () => void;
  onTempChange: (temp: number) => void;
  showDial: boolean;
  showPostTrainedCell: boolean;
  temp: number;
}

export function ConsoleChrome({
  mode,
  onModeChange,
  onReset,
  onTempChange,
  showDial,
  showPostTrainedCell,
  temp,
}: ConsoleChromeProps) {
  const handleModeClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const next = event.currentTarget.dataset.mode as Mode | undefined;
      if (next) {
        onModeChange(next);
      }
    },
    [onModeChange]
  );

  const handleTemp = useCallback(
    ([value]: number[]) => onTempChange(value),
    [onTempChange]
  );

  const cells = showPostTrainedCell ? MODES : MODES.slice(0, 1);

  return (
    <div className="flex min-h-14 flex-wrap items-center gap-x-5 gap-y-2 border-foreground/10 border-b bg-muted/30 px-4 py-2 sm:h-14 sm:flex-nowrap sm:px-6 sm:py-0">
      {/* The machine's name. It does not change — only its training does. */}
      <span className="shrink-0 font-mono text-foreground/80 text-sm">
        davinci-002
      </span>

      {/* Sized for both cells from the start, so nothing to the right moves. */}
      <div className="w-44 shrink-0">
        <div className="inline-flex gap-0.5 rounded-md bg-foreground/5 p-0.5">
          <AnimatePresence initial={false}>
            {cells.map((m) => (
              <motion.button
                animate={{ opacity: 1 }}
                aria-pressed={mode === m.id}
                className={cn(
                  "rounded px-2.5 py-1 font-mono text-xs transition-colors",
                  mode === m.id
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                )}
                data-mode={m.id}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key={m.id}
                onClick={handleModeClick}
                transition={FADE}
                type="button"
              >
                {m.label}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Reserved whether or not the dial has arrived. */}
      <div className="h-8 w-60 shrink-0">
        <AnimatePresence initial={false}>
          {showDial ? (
            <motion.div
              animate={{ opacity: 1 }}
              className="flex h-full items-center gap-3"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key="dial"
              transition={FADE}
            >
              <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
                temp
              </span>
              <Slider
                className="w-24"
                max={1.5}
                min={0}
                onValueChange={handleTemp}
                step={0.1}
                value={[temp]}
              />
              <span className="font-mono text-muted-foreground text-xs tabular-nums">
                {temp.toFixed(1)} · {bandFor(temp)}
              </span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <button
        aria-label="Start the demo over"
        className="ml-auto shrink-0 font-mono text-muted-foreground text-sm hover:text-foreground"
        onClick={onReset}
        title="Start the demo over"
        type="button"
      >
        ↺
      </button>
    </div>
  );
}
