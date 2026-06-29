"use client";

import { cn } from "@repo/design-system/lib/utils";
import { useEffect, useReducer, useRef } from "react";
import {
  harnessReducer,
  initialHarnessState,
  isClear,
  remainingCount,
} from "./reducer";

const TICK_MS = 650;

export function Era3Harness() {
  const [state, dispatch] = useReducer(harnessReducer, undefined, initialHarnessState);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!state.running) {
      return;
    }
    timer.current = setInterval(() => dispatch({ type: "tick" }), TICK_MS);
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [state.running]);

  const resolved = (id: string) =>
    state.diffs.find((d) => d.id === id)?.status === "resolved";

  return (
    <div className="rounded-xl border border-foreground/10 p-4 sm:p-6">
      {/* target vs candidate */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Mock label="Target · WordPress" tight={false} />
        <Mock
          converged={isClear(state)}
          label="Candidate · Next.js"
          // candidate tightens toward target as diffs resolve
          tight={resolved("padding")}
        />
      </div>

      {/* diff list + loop */}
      <div className="mt-4 grid gap-4 md:grid-cols-[1.3fr_1fr]">
        <ul className="overflow-hidden rounded-lg border border-foreground/10 font-mono text-xs">
          {state.diffs.map((d) => (
            <li
              className={cn(
                "border-foreground/5 border-b px-3 py-2 last:border-0",
                d.status === "resolved" && "text-emerald-600 line-through opacity-60",
                d.status === "pending" && "bg-red-50 text-red-700 dark:bg-red-950/30",
                d.status === "excepted" && "bg-amber-50 text-amber-700 dark:bg-amber-950/30"
              )}
              key={d.id}
            >
              {d.status === "resolved" ? "✓ " : d.status === "excepted" ? "⚠ " : "● "}
              {d.label}
            </li>
          ))}
        </ul>

        <div className="rounded-lg border border-foreground/10 bg-[#0d1117] p-3 font-mono text-[#8b949e] text-xs leading-6">
          {state.log.map((line, i) => (
            <div className="text-[#3fb950]" key={`${i}-${line}`}>
              › {line}
            </div>
          ))}
          <div className="mt-2">
            diff count:{" "}
            <span className={isClear(state) ? "text-[#3fb950]" : "text-[#e5707e]"}>
              {remainingCount(state)}
            </span>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              className="rounded bg-[#21262d] px-3 py-1 text-[#c9d1d9] disabled:opacity-40"
              disabled={state.running || isClear(state)}
              onClick={() => dispatch({ type: "run" })}
              type="button"
            >
              Run audit
            </button>
            <button
              className="rounded border border-[#30363d] px-3 py-1"
              onClick={() => dispatch({ type: "reset" })}
              type="button"
            >
              Reset
            </button>
            <button
              className={cn(
                "rounded px-3 py-1",
                state.validated
                  ? "bg-[#238636] text-white"
                  : "border border-[#30363d] text-[#8b949e]"
              )}
              disabled={!isClear(state)}
              onClick={() => dispatch({ type: "validate" })}
              type="button"
            >
              {state.validated ? "VALIDATED ✓" : "Validate"}
            </button>
          </div>
        </div>
      </div>

      <p className="mt-4 text-foreground/55 text-sm italic">
        You wrote the validation rules. The agent screenshots, diffs, fixes, and
        re-runs — on its own — until the count hits zero. The iframe stays
        flagged: knowing what isn&apos;t worth it is your judgment too.
      </p>
    </div>
  );
}

function Mock({
  label,
  tight,
  converged,
}: {
  label: string;
  tight: boolean;
  converged?: boolean;
}) {
  return (
    <div>
      <div className="mb-1 font-mono text-[10px] text-muted-foreground uppercase tracking-wide">
        {label}
        {converged && <span className="text-emerald-600"> ▸ match</span>}
      </div>
      <div className="rounded-lg border border-foreground/10 bg-background p-4">
        <div
          className={cn(
            "h-2.5 w-3/5 rounded bg-foreground transition-all",
            tight ? "mb-2" : "mb-3"
          )}
        />
        <div className="mb-1.5 h-1.5 w-11/12 rounded bg-foreground/30" />
        <div className="mb-3 h-1.5 w-4/5 rounded bg-foreground/30" />
        <div className="h-6 w-28 rounded bg-emerald-500" />
      </div>
    </div>
  );
}
