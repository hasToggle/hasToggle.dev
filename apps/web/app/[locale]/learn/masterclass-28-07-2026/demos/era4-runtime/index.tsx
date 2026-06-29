"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CompanyBrain } from "./company-brain";
import { DashboardRenderer } from "./dashboard-renderer";
import { generateDashboard } from "./generate-dashboard";
import { INTENTS } from "./match";
import type { RenderSpec } from "./render-spec";

type View = "idle" | "compiling" | "rendered";
const CHAR_MS = 6;

export function Era4Runtime() {
  const [question, setQuestion] = useState(
    "What skills land junior full-stack & AI engineering roles right now?"
  );
  const [view, setView] = useState<View>("idle");
  const [specText, setSpecText] = useState("");
  const [spec, setSpec] = useState<RenderSpec | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const ask = useCallback((q: string) => {
    if (timer.current) {
      clearInterval(timer.current);
    }
    const { spec: result } = generateDashboard(q);
    const json = JSON.stringify(result, null, 2);
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setSpec(result);
    if (reduce) {
      setSpecText(json);
      setView("rendered");
      return;
    }
    setView("compiling");
    setSpecText("");
    let i = 0;
    timer.current = setInterval(() => {
      i += 24;
      setSpecText(json.slice(0, i));
      if (i >= json.length) {
        if (timer.current) {
          clearInterval(timer.current);
        }
        setView("rendered");
      }
    }, CHAR_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, []);

  return (
    <>
      <div className="rounded-xl border border-foreground/10 p-4 sm:p-6">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            ask(question);
          }}
        >
          <input
            className="flex-1 rounded-md border border-foreground/15 bg-background px-3 py-2 text-sm"
            onChange={(e) => setQuestion(e.target.value)}
            value={question}
          />
          <button
            className="rounded-md bg-foreground px-4 py-2 text-background text-sm"
            type="submit"
          >
            Ask
          </button>
        </form>

        <div className="mt-3 flex flex-wrap gap-2">
          {INTENTS.map((intent) => (
            <button
              className="rounded-full border border-foreground/15 px-3 py-1 text-muted-foreground text-xs hover:text-foreground"
              key={intent.id}
              onClick={() => {
                setQuestion(intent.question);
                ask(intent.question);
              }}
              type="button"
            >
              {intent.label}
            </button>
          ))}
        </div>

        {view === "compiling" && (
          <pre className="mt-5 max-h-64 overflow-auto rounded-lg border border-foreground/10 bg-muted/40 p-4 font-mono text-xs">
            {specText}
            <span className="animate-pulse">▋</span>
          </pre>
        )}

        {view === "rendered" && spec && (
          <div className="mt-5 fade-in animate-in duration-300">
            <DashboardRenderer spec={spec} />
          </div>
        )}

        {view === "idle" && (
          <p className="mt-5 text-muted-foreground text-sm">
            Ask a question — there is no pre-built dashboard. The UI is compiled
            from your question.
          </p>
        )}
      </div>
      <CompanyBrain />
    </>
  );
}
