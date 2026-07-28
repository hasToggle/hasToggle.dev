"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { cn } from "@repo/design-system/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { REVEALS, VERDICT } from "./reveals";
import { type LineKind, REACHED_LINE_INDEX, TRANSCRIPT } from "./transcript";

const LINE_MS = 180;

const KIND_GLYPH: Record<string, string> = {
  message: "›",
  respond: "✓",
  think: "∴",
  tool: "⚙",
};

function lineClass(kind: LineKind, highlighted: boolean): string {
  if (highlighted) {
    return "bg-amber-500/15 text-amber-200";
  }
  if (kind === "respond") {
    return "text-emerald-400";
  }
  return "text-[#8b949e]";
}

interface Era3ReachProps {
  fenced?: boolean;
  /** Presenter drives 0–4. Omitted means the button drives it. */
  revealed?: number;
}

export function Era3Reach({ revealed, fenced }: Era3ReachProps) {
  const [printed, setPrinted] = useState(0);
  const [selfRevealed, setSelfRevealed] = useState(0);
  const [selfFenced, setSelfFenced] = useState(false);

  const driven = revealed !== undefined;
  const shown = revealed ?? selfRevealed;
  const showFence = Boolean(fenced ?? selfFenced);
  const reachedShown = shown >= REVEALS.length;

  const revealAll = useCallback(() => {
    setSelfRevealed(REVEALS.length);
    setSelfFenced(true);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      setPrinted(TRANSCRIPT.length);
      return;
    }
    const id = setInterval(() => {
      setPrinted((n) => {
        if (n >= TRANSCRIPT.length) {
          clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, LINE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mt-10 rounded-xl border border-foreground/10 p-4 sm:p-6">
      <p className="font-medium text-base">Nothing was outside the loop</p>
      <p className="mt-1 max-w-2xl text-muted-foreground text-sm">
        One instruction, on a repo where nothing was fenced off.
      </p>

      <ol className="mt-4 space-y-1 rounded-lg bg-[#0d1117] p-3 font-mono text-xs">
        {TRANSCRIPT.slice(0, printed).map((line, i) => (
          <li
            className={cn(
              "flex items-start gap-3 rounded px-2 py-1 transition-colors",
              lineClass(line.kind, i === REACHED_LINE_INDEX && reachedShown)
            )}
            key={line.text}
          >
            <span
              aria-hidden="true"
              className="w-4 shrink-0 text-center opacity-70"
            >
              {KIND_GLYPH[line.kind]}
            </span>
            <span className="min-w-0 break-all">{line.text}</span>
          </li>
        ))}
      </ol>

      {!driven && shown === 0 && (
        <Button
          className="mt-4"
          onClick={revealAll}
          size="sm"
          type="button"
          variant="outline"
        >
          See what actually happened
        </Button>
      )}

      {shown > 0 && (
        <dl className="mt-6 space-y-4">
          {REVEALS.slice(0, shown).map((r) => (
            <div
              className="grid gap-3 border-foreground/10 border-t pt-4 md:grid-cols-2"
              key={r.id}
            >
              <div>
                <dt className="font-mono text-[11px] text-muted-foreground uppercase tracking-wide">
                  {r.label}
                </dt>
                <dd className="mt-2 space-y-1 font-mono text-xs">
                  {r.evidence.kind === "lines" ? (
                    r.evidence.lines.map((l) => (
                      <p className="text-foreground/80" key={l}>
                        {l}
                      </p>
                    ))
                  ) : (
                    <>
                      <p className="text-red-500/90">- {r.evidence.removed}</p>
                      <p className="text-emerald-500/90">
                        + {r.evidence.added}
                      </p>
                    </>
                  )}
                </dd>
                <p className="mt-2 max-w-md text-foreground/55 text-sm italic">
                  {r.line}
                </p>
              </div>

              {showFence ? (
                <div className="fade-in animate-in rounded-lg border border-foreground/10 bg-foreground/[0.03] p-3 duration-300">
                  <p className="font-mono text-[11px] text-muted-foreground">
                    inside the loop
                  </p>
                  <p className="mt-1 font-mono text-foreground/70 text-xs">
                    {r.insideLoop}
                  </p>
                  <p className="mt-3 font-mono text-[11px] text-muted-foreground">
                    outside the loop
                  </p>
                  <p className="mt-1 font-mono text-ht-cyan-700 text-xs dark:text-ht-cyan-300">
                    {r.outsideLoop}
                  </p>
                </div>
              ) : null}
            </div>
          ))}
        </dl>
      )}

      {showFence ? (
        <p className="mt-6 max-w-2xl text-foreground/55 text-sm italic">
          {VERDICT}
        </p>
      ) : null}
    </div>
  );
}
