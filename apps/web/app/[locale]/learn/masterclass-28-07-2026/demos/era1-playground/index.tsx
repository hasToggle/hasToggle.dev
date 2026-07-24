"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { cn } from "@repo/design-system/lib/utils";
import type { MouseEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ConsoleChrome } from "./console-chrome";
import {
  type Band,
  bandFor,
  INITIAL_TEMP,
  type Mode,
  PROMPTS,
  selectCompletion,
} from "./selector";
import { getRevealedStage, setRevealedStage } from "./session-store";
import {
  advance,
  type Stage,
  showsDial,
  showsDialWhisper,
  showsModeSwitch,
  showsOffer,
  showsPromptSelector,
  showsReset,
} from "./stage";
import { verdictFor } from "./verdicts";

const STREAM_MS = 18;

interface RunSnapshot {
  band: Band;
  isQuestion: boolean;
  mode: Mode;
}

export function Era1Playground() {
  const [stage, setStage] = useState<Stage>(getRevealedStage);
  const [promptId, setPromptId] = useState(PROMPTS[0].id);
  const [temp, setTemp] = useState(INITIAL_TEMP);
  const [mode, setMode] = useState<Mode>("base");
  const [shown, setShown] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [lastRun, setLastRun] = useState<RunSnapshot | null>(null);
  const [verdict, setVerdict] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const prompt = PROMPTS.find((p) => p.id === promptId) ?? PROMPTS[0];

  const stop = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    setStreaming(false);
  }, []);

  const clear = useCallback(() => {
    stop();
    setShown("");
    setLastRun(null);
    setVerdict(null);
  }, [stop]);

  const run = useCallback(
    (runMode: Mode) => {
      stop();
      setVerdict(null);
      setLastRun({
        band: bandFor(temp),
        isQuestion: prompt.isQuestion,
        mode: runMode,
      });
      const full = selectCompletion(promptId, temp, runMode);
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
    },
    [promptId, prompt.isQuestion, temp, stop]
  );

  const reveal = useCallback((next: Stage) => {
    setStage(next);
    setRevealedStage(next);
  }, []);

  const handleRun = useCallback(() => run(mode), [run, mode]);

  const handleVerdict = useCallback(() => {
    if (!lastRun) {
      return;
    }
    setVerdict(verdictFor(lastRun));
    reveal(advance(stage, { type: "verdict", ...lastRun }));
  }, [lastRun, reveal, stage]);

  const handleAcceptOffer = useCallback(() => {
    reveal(advance(stage, { type: "accept-offer" }));
    setMode("instruct");
    run("instruct");
  }, [reveal, run, stage]);

  const handleModeChange = useCallback(
    (next: Mode) => {
      clear();
      setMode(next);
    },
    [clear]
  );

  const handlePromptClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const id = event.currentTarget.dataset.prompt;
      if (!id) {
        return;
      }
      clear();
      setPromptId(id);
    },
    [clear]
  );

  const handleReset = useCallback(() => {
    clear();
    setPromptId(PROMPTS[0].id);
    setMode("base");
    setTemp(INITIAL_TEMP);
    reveal("continuation");
  }, [clear, reveal]);

  useEffect(() => stop, [stop]);

  const armed = lastRun !== null && !streaming && verdict === null;

  return (
    <div className="mb-6">
      <div className="overflow-hidden rounded-xl border border-foreground/10 bg-background">
        <ConsoleChrome
          mode={mode}
          onModeChange={handleModeChange}
          onReset={handleReset}
          onTempChange={setTemp}
          showDial={showsDial(stage, mode)}
          showReset={showsReset(stage)}
          showSwitch={showsModeSwitch(stage)}
          temp={temp}
        />

        {showsDialWhisper(stage) ? (
          <p className="border-foreground/10 border-b px-4 py-2 font-mono text-[11px] text-muted-foreground sm:px-6">
            temperature — how much the dice get to decide
          </p>
        ) : null}

        <div className="p-4 sm:p-6">
          {showsPromptSelector(stage) ? (
            <div className="mb-4 flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
                prompt
              </span>
              {PROMPTS.map((p) => (
                <button
                  className={cn(
                    "border-b-2 pb-0.5 font-mono text-sm transition-colors",
                    p.id === promptId
                      ? "border-ht-cyan-500 text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                  data-prompt={p.id}
                  key={p.id}
                  onClick={handlePromptClick}
                  type="button"
                >
                  {p.label}
                </button>
              ))}
            </div>
          ) : null}

          <pre className="min-h-40 overflow-x-auto whitespace-pre-wrap rounded-lg border border-foreground/10 bg-muted/40 p-4 font-mono text-[15px] leading-7">
            <span className="text-foreground">{prompt.prefix}</span>
            <span className="text-ht-cyan-700 dark:text-ht-cyan-300">
              {shown}
            </span>
            {streaming ? <span className="animate-pulse">▋</span> : null}
          </pre>

          <div className="mt-4 flex justify-end">
            <Button onClick={handleRun} type="button">
              Run ⏎
            </Button>
          </div>
        </div>

        {armed || verdict !== null ? (
          <div className="border-foreground/10 border-t px-4 py-3 sm:px-6">
            {verdict === null ? (
              <button
                className="font-mono text-muted-foreground text-sm hover:text-foreground"
                onClick={handleVerdict}
                type="button"
              >
                ↩ what just happened
              </button>
            ) : (
              <p className="max-w-2xl text-foreground/55 text-sm italic">
                {verdict}
              </p>
            )}
          </div>
        ) : null}
      </div>

      {showsOffer(stage) ? (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl border border-foreground/15 border-dashed px-4 py-3 sm:px-6">
          <span className="font-mono text-muted-foreground text-xs">2022</span>
          <span className="text-foreground/70 text-sm">
            humans taught it a format
          </span>
          <Button
            className="ml-auto"
            onClick={handleAcceptOffer}
            size="sm"
            type="button"
          >
            Load the post-trained model →
          </Button>
        </div>
      ) : null}
    </div>
  );
}
