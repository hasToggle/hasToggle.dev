"use client";

import { useState } from "react";
import {
  applySuggestion,
  INITIAL_FILE,
  resolveMismatch,
  SUGGESTION,
} from "./apply";

type Phase = "initial" | "applied" | "resolved";

export function Era2Companion() {
  const [phase, setPhase] = useState<Phase>("initial");
  const [file, setFile] = useState(INITIAL_FILE);
  const [ghostAccepted, setGhostAccepted] = useState(false);

  const apply = () => {
    const { file: next } = applySuggestion(INITIAL_FILE, SUGGESTION);
    setFile(next);
    setPhase("applied");
  };
  const fix = () => {
    setFile((f) => resolveMismatch(f, SUGGESTION));
    setPhase("resolved");
  };
  const reset = () => {
    setFile(INITIAL_FILE);
    setPhase("initial");
    setGhostAccepted(false);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-foreground/10">
      <div className="grid md:grid-cols-[1.4fr_1fr]">
        {/* editor */}
        <div className="bg-[#1e1e1e] p-4 font-mono text-[#d4d4d4] text-xs leading-6">
          <div className="mb-2 text-[#858585]">checkout.js</div>
          {file.lines.map((line, i) => {
            const bad =
              phase === "applied" && line.includes(SUGGESTION.missingRef);
            return (
              <div
                className={bad ? "bg-[#5a1d1d]" : undefined}
                key={`${i}-${line}`}
              >
                {line || " "}
              </div>
            );
          })}
          {phase === "initial" && (
            <button
              className="mt-1 block w-full text-left text-[#858585] italic hover:text-[#bbb]"
              onClick={() => setGhostAccepted(true)}
              type="button"
            >
              {ghostAccepted
                ? "  // discount applied"
                : "  // ghost: press to accept →"}
            </button>
          )}
        </div>

        {/* chat panel */}
        <div className="bg-[#252526] p-4 text-[#ccc] text-xs">
          <div className="mb-2 text-[#858585] uppercase tracking-wide">
            Chat
          </div>
          <div className="mb-2 rounded bg-[#2d2d30] px-2 py-1.5">
            add validation so an unknown code doesn&apos;t crash
          </div>
          <div className="rounded border border-[#3c3c3c] bg-[#1e1e1e] p-2 font-mono leading-5">
            {SUGGESTION.code.map((l) => (
              <div key={l}>{l}</div>
            ))}
            <div className="mt-2 flex gap-2">
              <button
                className="rounded bg-ht-cyan-600 px-2 py-1 text-[11px] text-white disabled:opacity-40"
                disabled={phase !== "initial"}
                onClick={apply}
                type="button"
              >
                Apply
              </button>
              <button
                className="rounded border border-[#555] px-2 py-1 text-[#aaa] text-[11px]"
                onClick={reset}
                type="button"
              >
                Reset
              </button>
            </div>
          </div>
          <p className="mt-2 text-[#858585] italic">
            It can&apos;t run it. It can&apos;t see the rest of your repo. You
            decide if it&apos;s right — and you move it.
          </p>
        </div>
      </div>

      {phase === "applied" && (
        <div className="flex items-center justify-between gap-3 bg-amber-50 px-4 py-3 text-amber-900 text-sm dark:bg-amber-950/40 dark:text-amber-200">
          <span>
            Applied — but <code>{SUGGESTION.missingRef}</code> isn&apos;t
            imported in this file. It only saw the selection, not the system.
          </span>
          <button
            className="shrink-0 rounded-md bg-amber-600 px-3 py-1 text-white"
            onClick={fix}
            type="button"
          >
            Fix it yourself
          </button>
        </div>
      )}
      {phase === "resolved" && (
        <div className="bg-emerald-50 px-4 py-3 text-emerald-800 text-sm dark:bg-emerald-950/40 dark:text-emerald-200">
          You added the import. You were the integration layer — every accept,
          file by file.
        </div>
      )}
    </div>
  );
}
