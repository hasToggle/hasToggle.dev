"use client";

import { useState } from "react";
import {
  type ClipPhase,
  clipTransition,
  THREAD_ANSWER,
  THREAD_QUESTION,
} from "./extraction";

export function Era2Extraction() {
  const [phase, setPhase] = useState<ClipPhase>("idle");

  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-foreground/10">
      {/* browser window */}
      <div className="border-foreground/10 border-b bg-muted/40 p-0">
        <div className="flex items-center gap-2 border-foreground/10 border-b px-3 py-2">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          </span>
          <span className="rounded bg-background px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
            chat.openai.com · 2022
          </span>
        </div>
        <div className="space-y-3 p-4 text-xs">
          <div className="ml-auto w-fit max-w-[80%] rounded-lg bg-ht-cyan-600/10 px-3 py-2">
            {THREAD_QUESTION}
          </div>
          <div className="w-fit max-w-[80%] rounded-lg border border-foreground/10 bg-background p-3">
            <pre className="font-mono leading-5">
              {THREAD_ANSWER.join("\n")}
            </pre>
            <button
              className="mt-2 rounded border border-foreground/15 px-2 py-1 font-mono text-[11px] text-muted-foreground hover:text-foreground disabled:opacity-40"
              disabled={phase !== "idle"}
              onClick={() => setPhase((p) => clipTransition(p, "copy"))}
              type="button"
            >
              {phase === "idle" ? "Copy" : "Copied ✓"}
            </button>
          </div>
        </div>
      </div>

      {/* your editor, a world away */}
      <div className="bg-[#1e1e1e] p-4 font-mono text-[#d4d4d4] text-xs leading-6">
        <div className="mb-2 flex items-center justify-between text-[#858585]">
          <span>checkout.js — your editor</span>
          <span className="flex gap-2">
            <button
              className="rounded border border-[#3c3c3c] px-2 py-0.5 text-[11px] disabled:opacity-40"
              disabled={phase !== "copied"}
              onClick={() => setPhase((p) => clipTransition(p, "paste"))}
              type="button"
            >
              Paste
            </button>
            <button
              className="rounded border border-[#3c3c3c] px-2 py-0.5 text-[11px]"
              onClick={() => setPhase("idle")}
              type="button"
            >
              Reset
            </button>
          </span>
        </div>
        {phase === "pasted" ? (
          THREAD_ANSWER.map((l, i) => <div key={`${i}-${l}`}>{l}</div>)
        ) : (
          <div className="text-[#858585] italic">
            {phase === "copied"
              ? "// the answer is on your clipboard. Bring it over yourself."
              : "// empty. The knowledge lives in another window."}
          </div>
        )}
      </div>

      {phase === "pasted" && (
        <p className="border-foreground/10 border-t px-4 py-3 text-foreground/55 text-sm italic">
          You were the clipboard. Every answer crossed between those two worlds
          by hand.
        </p>
      )}
    </div>
  );
}
