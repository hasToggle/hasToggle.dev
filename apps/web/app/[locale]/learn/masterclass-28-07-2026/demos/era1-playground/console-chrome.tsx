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

const MORPH = { duration: 0.25 } as const;

interface ConsoleChromeProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  onReset: () => void;
  onTempChange: (temp: number) => void;
  showDial: boolean;
  showReset: boolean;
  showSwitch: boolean;
  temp: number;
}

export function ConsoleChrome({
  mode,
  onModeChange,
  onReset,
  onTempChange,
  showDial,
  showReset,
  showSwitch,
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

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-foreground/10 border-b bg-muted/30 px-4 py-2.5 sm:px-6">
      <AnimatePresence initial={false} mode="wait">
        {showSwitch ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="flex gap-0.5 rounded-md bg-foreground/5 p-0.5"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="switch"
            transition={MORPH}
          >
            {MODES.map((m) => (
              <button
                className={cn(
                  "rounded px-2.5 py-1 font-mono text-xs transition-colors",
                  mode === m.id
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                )}
                data-mode={m.id}
                key={m.id}
                onClick={handleModeClick}
                type="button"
              >
                {m.label}
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.span
            animate={{ opacity: 1 }}
            className="font-mono text-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="nameplate"
            transition={MORPH}
          >
            <span className="text-foreground/80">davinci-002</span>
            <span className="text-muted-foreground"> · base</span>
          </motion.span>
        )}
      </AnimatePresence>

      {showDial ? (
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
            temp
          </span>
          <Slider
            className="w-28"
            max={1.5}
            min={0}
            onValueChange={handleTemp}
            step={0.1}
            value={[temp]}
          />
          <span className="font-mono text-muted-foreground text-xs tabular-nums">
            {temp.toFixed(1)} · {bandFor(temp)}
          </span>
        </div>
      ) : null}

      {showReset ? (
        <button
          aria-label="Start the demo over"
          className="ml-auto font-mono text-muted-foreground text-sm hover:text-foreground"
          onClick={onReset}
          title="Start the demo over"
          type="button"
        >
          ↺
        </button>
      ) : null}
    </div>
  );
}
