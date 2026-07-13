"use client";

import { cn } from "@repo/design-system/lib/utils";
import { useEffect, useState } from "react";
import { LADDER_STAGES, type LadderStage } from "./stages";

const RUNNER_TESTS = [
  "validateDiscount › rejects an unknown code",
  "validateDiscount › rejects an empty code",
  "validateDiscount › accepts a known code",
  "validateDiscount › is case-insensitive",
  "applyDiscount › never throws at checkout",
] as const;
const RUNNER_MS = 450;

export function Era3Ladder() {
  const [year, setYear] = useState<LadderStage["year"]>("2024");
  const stage = LADDER_STAGES.find((s) => s.year === year) ?? LADDER_STAGES[0];

  return (
    <div className="mt-10 rounded-xl border border-foreground/10 p-4 sm:p-6">
      <p className="font-medium text-sm">Where did the reading go?</p>
      <p className="mt-1 max-w-2xl text-muted-foreground text-sm">
        The same feature — the discount validation you fixed by hand one room
        ago — reviewed at three altitudes.
      </p>

      <div className="mt-4 flex gap-2">
        {LADDER_STAGES.map((s) => (
          <button
            className={cn(
              "rounded-full border px-3 py-1 font-mono text-xs",
              s.year === year
                ? "border-ht-cyan-500 text-foreground"
                : "border-foreground/15 text-muted-foreground hover:text-foreground"
            )}
            key={s.year}
            onClick={() => setYear(s.year)}
            type="button"
          >
            {s.year} · {s.read}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-foreground/10 bg-muted/40 p-4">
        {stage.artifact === "diff" && (
          <div className="max-h-44 overflow-y-auto font-mono text-xs leading-5">
            {stage.body.map((l, i) => (
              <div
                className={
                  l.startsWith("+")
                    ? "text-emerald-700 dark:text-emerald-400"
                    : l.startsWith("-")
                      ? "text-red-700 dark:text-red-400"
                      : "text-muted-foreground"
                }
                key={`${i}-${l}`}
              >
                {l}
              </div>
            ))}
          </div>
        )}
        {stage.artifact === "plan" && (
          <ol className="list-decimal space-y-1 pl-5 font-mono text-xs leading-6">
            {stage.body.map((l) => (
              <li key={l}>{l.replace(/^\d+\.\s*/, "")}</li>
            ))}
          </ol>
        )}
        {stage.artifact === "design" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <p className="font-mono text-xs leading-6">
              {stage.body.join(" ")}
            </p>
            <TestRunner key={year} />
          </div>
        )}
      </div>

      <p className="mt-3 max-w-2xl text-foreground/55 text-sm italic">
        {stage.line}
      </p>
    </div>
  );
}

function TestRunner() {
  const [passed, setPassed] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      setPassed(RUNNER_TESTS.length);
      return;
    }
    const id = setInterval(() => {
      setPassed((p) => Math.min(p + 1, RUNNER_TESTS.length));
    }, RUNNER_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-md bg-[#0d1117] p-3 font-mono text-xs leading-6">
      {RUNNER_TESTS.map((t, i) => (
        <div
          className={i < passed ? "text-[#3fb950]" : "text-[#e5707e]"}
          key={t}
        >
          {i < passed ? "✓" : "✗"} {t}
        </div>
      ))}
      <div className="mt-1 text-[#8b949e]">
        {passed === RUNNER_TESTS.length
          ? `${RUNNER_TESTS.length} passed — nobody read the code.`
          : "running…"}
      </div>
    </div>
  );
}
