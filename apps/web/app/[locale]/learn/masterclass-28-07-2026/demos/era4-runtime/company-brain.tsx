"use client";

import { motion } from "motion/react";

const SOURCES = ["Email", "Slack", "Meet transcripts", "Docs", "Tickets"];

export function CompanyBrain() {
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="mt-10 rounded-xl border border-foreground/10 p-4 sm:p-6">
      <p className="mb-1 font-medium text-sm">The other half: ambient context</p>
      <p className="mb-6 max-w-2xl text-muted-foreground text-sm">
        Era 2 made you carry context by hand — paste it in, copy the answer back
        out. Era 4 dissolves that: the org&apos;s communication flows into one
        living markdown brain the model already stands inside.
      </p>
      <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <ul className="space-y-2">
          {SOURCES.map((s, i) => (
            <motion.li
              animate={
                reduce
                  ? { opacity: 1 }
                  : { opacity: [0.4, 1, 0.4], x: [0, 8, 0] }
              }
              className="rounded-md border border-foreground/10 bg-muted/40 px-3 py-1.5 text-sm"
              key={s}
              transition={{
                duration: 2.4,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.3,
              }}
            >
              {s}
            </motion.li>
          ))}
        </ul>
        <div className="text-center font-mono text-muted-foreground text-xs">
          → LLM →
        </div>
        <div className="rounded-lg border border-ht-cyan-500/40 bg-ht-cyan-50/60 p-4 dark:bg-ht-cyan-950/30">
          <div className="font-mono text-muted-foreground text-xs">
            company-brain.md
          </div>
          <div className="mt-2 space-y-1 font-mono text-foreground/70 text-xs">
            <div># Decisions</div>
            <div># People &amp; ownership</div>
            <div># Open questions</div>
            <div className="text-muted-foreground">…silos collapsed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
