"use client";

import { cn } from "@repo/design-system/lib/utils";
import { useEffect, useState } from "react";
import { LOOP_STEPS, nextLoopStep } from "./sequence";

const STEP_MS = 900;

const KIND_GLYPH: Record<string, string> = {
  message: "›",
  think: "∴",
  tool: "⚙",
  respond: "✓",
};

export function Era3Loop() {
  const [active, setActive] = useState(0);
  const [cycling, setCycling] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      setCycling(false);
      return;
    }
    const id = setInterval(() => setActive(nextLoopStep), STEP_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mb-10 rounded-xl border border-foreground/10 p-4 sm:p-6">
      <p className="font-medium text-sm">
        An LLM with tools, trapped in a loop
      </p>
      <p className="mt-1 max-w-2xl text-muted-foreground text-sm">
        Strip away the debate about what an agent is, and mechanically this is
        all of it:
      </p>
      <ol className="mt-4 space-y-1 font-mono text-xs">
        {LOOP_STEPS.map((step, i) => (
          <li
            className={cn(
              "flex items-center gap-3 rounded px-2 py-1",
              cycling && i === active
                ? "bg-ht-cyan-500/10 text-foreground"
                : "text-muted-foreground"
            )}
            key={step.label}
          >
            <span className="w-4 text-center opacity-70">
              {KIND_GLYPH[step.kind]}
            </span>
            {step.label}
          </li>
        ))}
      </ol>
      <p className="mt-3 font-mono text-[11px] text-muted-foreground">
        ↺ and again, until the rules are satisfied
      </p>
      <p className="mt-3 max-w-2xl text-foreground/55 text-sm italic">
        That&apos;s the whole mechanism — a model, tools, and a loop.
        Everything since is scale.
      </p>
    </div>
  );
}
