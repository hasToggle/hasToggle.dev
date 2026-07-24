"use client";

import { Slider } from "@repo/design-system/components/ui/slider";
import { useCallback, useEffect, useRef, useState } from "react";
import { bandFor, PROMPTS, selectCompletion } from "./selector";

const STREAM_MS = 18;

export function Era1Playground() {
  const [promptId, setPromptId] = useState(PROMPTS[0].id);
  const [temp, setTemp] = useState(0.7);
  const [shown, setShown] = useState("");
  const [streaming, setStreaming] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const prompt = PROMPTS.find((p) => p.id === promptId) ?? PROMPTS[0];

  const stop = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    setStreaming(false);
  }, []);

  const run = useCallback(() => {
    stop();
    const full = selectCompletion(promptId, temp);
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      setShown(full);
      return;
    }
    setShown("");
    setStreaming(true);
    let i = 0;
    timer.current = setInterval(() => {
      i += 1;
      setShown(full.slice(0, i));
      if (i >= full.length) {
        stop();
      }
    }, STREAM_MS);
  }, [promptId, temp, stop]);

  useEffect(() => stop, [stop]);

  return (
    <div className="rounded-xl border border-foreground/10 bg-background p-4 sm:p-6">
      <p className="mb-4 max-w-2xl text-foreground/55 text-sm italic">
        Most of the world met these models believing they&apos;re a search
        engine with better manners. Try it — ask it a question.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {PROMPTS.map((p) => (
          <button
            className={`rounded-full border px-3 py-1 text-xs ${
              p.id === promptId
                ? "border-ht-cyan-500 text-foreground"
                : "border-foreground/15 text-muted-foreground hover:text-foreground"
            }`}
            key={p.id}
            onClick={() => {
              setPromptId(p.id);
              setShown("");
            }}
            type="button"
          >
            {p.label}
          </button>
        ))}
      </div>

      <pre className="min-h-40 overflow-x-auto whitespace-pre-wrap rounded-lg border border-foreground/10 bg-muted/40 p-4 font-mono text-sm leading-relaxed">
        <span className="text-foreground">{prompt.prefix}</span>
        <span className="text-ht-cyan-700 dark:text-ht-cyan-300">{shown}</span>
        {streaming && <span className="animate-pulse">▋</span>}
      </pre>

      <div className="mt-4 flex items-center gap-4">
        <span className="font-mono text-muted-foreground text-xs uppercase tracking-wide">
          temperature
        </span>
        <Slider
          className="max-w-xs flex-1"
          max={1.5}
          min={0}
          onValueChange={([v]) => setTemp(v)}
          step={0.1}
          value={[temp]}
        />
        <span className="font-mono text-muted-foreground text-xs">
          {temp.toFixed(1)} · {bandFor(temp)}
        </span>
        <button
          className="ml-auto rounded-md bg-foreground px-4 py-1.5 text-background text-sm"
          onClick={run}
          type="button"
        >
          Submit ⏎
        </button>
      </div>

      {prompt.isQuestion && shown.length > 0 && !streaming && (
        <p className="mt-4 text-foreground/55 text-sm italic">
          You asked a question. It didn&apos;t answer — it just kept going.
          There&apos;s no one in there to ask.
        </p>
      )}

      {!prompt.isQuestion && shown.length > 0 && !streaming && (
        <p className="mt-4 text-foreground/55 text-sm italic">
          It isn&apos;t looking anything up. It&apos;s continuing your pattern —
          that&apos;s all it ever does.
        </p>
      )}
    </div>
  );
}
