"use client";

import { cn } from "@repo/design-system/lib/utils";
import { STEPS, type Step, type StepId } from "./steps";

interface StepperHeaderProps {
  current: StepId;
  onSelect: (id: StepId) => void;
}

export function StepperHeader({ current, onSelect }: StepperHeaderProps) {
  return (
    <nav
      aria-label="Masterclass progress"
      className="sticky top-0 z-10 border-foreground/10 border-b bg-background/80 backdrop-blur"
    >
      <ol className="mx-auto flex max-w-5xl items-stretch px-4">
        {STEPS.map((step: Step) => {
          const active = step.id === current;
          return (
            <li className="flex-1" key={step.id}>
              <button
                aria-current={active ? "step" : undefined}
                className={cn(
                  "w-full border-b-2 px-2 py-3 text-center transition-colors",
                  active
                    ? "border-ht-cyan-500 text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
                onClick={() => onSelect(step.id)}
                type="button"
              >
                <span className="block font-medium text-xs sm:text-sm">
                  {step.label}
                </span>
                {step.vibe && (
                  <span className="mt-0.5 block font-mono text-[10px] text-muted-foreground/70 tracking-wide">
                    {step.vibe}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
