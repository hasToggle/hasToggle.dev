"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { cn } from "@repo/design-system/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { MetaAside } from "../../components/meta-aside";
import { GroundedParagraph } from "./grounded-paragraph";
import { OwnedAnswer } from "./owned-answer";
import {
  HINGE_TO_BEAT_3,
  HINGE_TO_REALITY,
  STREAM_LABEL,
} from "./paragraph-data";
import { PromptInput } from "./prompt-input";
import { StreamingParagraph } from "./streaming-paragraph";
import { Toggles } from "./toggles";
import { UngroundedParagraph } from "./ungrounded-paragraph";

const REALITY_TEXT =
  "AI writes the grammar of software. You own the meaning. Grounding doesn’t change which one is which — it just makes the grammar more current.";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const handler = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);
  return reduced;
}

interface AnswerAreaProps {
  grounding: boolean;
  move: boolean;
}

function AnswerArea({ grounding, move }: AnswerAreaProps) {
  if (move) {
    return <OwnedAnswer />;
  }
  if (grounding) {
    return <GroundedParagraph />;
  }
  return (
    <>
      <UngroundedParagraph />
      <p className="mt-6 font-mono text-foreground/55 text-sm">
        <span aria-hidden="true" className="mr-2 select-none opacity-55">
          {"//"}
        </span>
        {STREAM_LABEL}
      </p>
    </>
  );
}

interface StatusLineProps {
  grounding: boolean;
  move: boolean;
}

function StatusLine({ grounding, move }: StatusLineProps) {
  return (
    <div className="mt-5 mb-7 flex items-center gap-3 font-medium font-mono text-[0.7rem] text-foreground/40 uppercase tracking-[0.2em] sm:gap-4">
      <span aria-hidden="true" className="select-none">
        ──
      </span>
      <span>output</span>
      <span
        aria-hidden="true"
        className="hidden h-px flex-1 bg-foreground/15 sm:block"
      />
      <span className="flex items-center gap-1.5">
        <span>grounding=</span>
        <span
          className={cn(
            "transition-colors",
            grounding ? "text-foreground" : "text-foreground/40"
          )}
        >
          {grounding ? "on" : "off"}
        </span>
      </span>
      <span aria-hidden="true" className="text-foreground/25">
        ·
      </span>
      <span className="flex items-center gap-1.5">
        <span>move=</span>
        <span
          className={cn(
            "transition-colors",
            move ? "text-foreground" : "text-foreground/40"
          )}
        >
          {move ? "re-rank" : "re-generate"}
        </span>
      </span>
    </div>
  );
}

export function Plausibility() {
  const reducedMotion = useReducedMotion();
  const [streamPlays, setStreamPlays] = useState(0);
  const [beat1Complete, setBeat1Complete] = useState(false);
  const [grounding, setGrounding] = useState(false);
  const [move, setMove] = useState(false);
  const [everGrounded, setEverGrounded] = useState(false);
  const [everMoved, setEverMoved] = useState(false);

  const handleStreamComplete = useCallback(() => {
    setBeat1Complete(true);
  }, []);

  const handleGroundingChange = useCallback((next: boolean) => {
    setGrounding(next);
    if (next) {
      setEverGrounded(true);
    }
  }, []);

  const handleMoveChange = useCallback((next: boolean) => {
    setMove(next);
    if (next) {
      setEverMoved(true);
    }
  }, []);

  const handlePlay = useCallback(() => {
    setBeat1Complete(false);
    setGrounding(false);
    setMove(false);
    setStreamPlays((n) => n + 1);
  }, []);

  const playPressed = streamPlays > 0;
  const showInteractive = beat1Complete;
  const realityRevealed = everGrounded && everMoved;
  const modeKey = `${grounding ? "g" : "ug"}-${move ? "rr" : "rg"}`;

  return (
    <div className="rounded-2xl border border-border bg-card/40 p-5 shadow-sm sm:p-8">
      <PromptInput
        amended={showInteractive && grounding}
        reducedMotion={reducedMotion}
      />

      {showInteractive && <StatusLine grounding={grounding} move={move} />}

      <div
        className={cn(showInteractive ? "min-h-[10rem]" : "mt-6 min-h-[10rem]")}
      >
        {playPressed && !beat1Complete && (
          <StreamingParagraph
            enabled={true}
            key={streamPlays}
            onComplete={handleStreamComplete}
            reducedMotion={reducedMotion}
          />
        )}
        {showInteractive && (
          <div
            className="fade-in animate-in duration-200"
            key={`${modeKey}-${streamPlays}`}
          >
            <AnswerArea grounding={grounding} move={move} />
          </div>
        )}
        {!playPressed && (
          <p className="font-display text-foreground/30 text-lg leading-8">
            {/* paragraph empty until play */}
          </p>
        )}
      </div>

      {!showInteractive && (
        <div className="mt-6 flex flex-col items-end gap-3">
          {!playPressed && (
            <MetaAside className="text-right">
              About ten seconds. Every other AI demo lies about that.
            </MetaAside>
          )}
          <Button
            aria-label="Play the LLM generation animation"
            disabled={playPressed}
            onClick={handlePlay}
            variant="outline"
          >
            {playPressed ? "Generating…" : "▶ Watch how it generates"}
          </Button>
        </div>
      )}

      {showInteractive && (
        <>
          <MetaAside className="mt-10 mb-6 max-w-prose" variant="block">
            {HINGE_TO_BEAT_3}
          </MetaAside>

          <section
            aria-label="Demo controls"
            className="rounded-md border border-border/70 bg-foreground/[0.015] dark:bg-foreground/[0.025]"
          >
            <header className="flex items-center justify-between border-border/60 border-b px-5 py-3 sm:px-6">
              <p className="font-medium font-mono text-[0.7rem] text-foreground/55 uppercase tracking-[0.2em]">
                Controls
              </p>
              <button
                className="inline-flex items-center gap-1.5 font-medium font-mono text-[0.7rem] text-foreground/45 uppercase tracking-[0.2em] transition-colors hover:text-foreground"
                onClick={handlePlay}
                type="button"
              >
                <span aria-hidden="true">↻</span>
                replay
              </button>
            </header>
            <div className="px-5 py-6 sm:px-6 sm:py-7">
              <Toggles
                grounding={grounding}
                move={move}
                onGroundingChange={handleGroundingChange}
                onMoveChange={handleMoveChange}
              />
            </div>
          </section>
        </>
      )}

      {realityRevealed && (
        <div className="fade-in slide-in-from-bottom-2 mt-10 animate-in border-border/60 border-t pt-8 duration-500">
          <MetaAside className="mb-6 max-w-prose" variant="block">
            {HINGE_TO_REALITY}
          </MetaAside>
          <div className="border-ht-cyan-500/50 border-l-2 pl-5 dark:border-ht-cyan-400/50">
            <p className="mb-2 font-medium font-mono text-[0.7rem] text-ht-cyan-700 uppercase tracking-[0.2em] dark:text-ht-cyan-300/90">
              Reality
            </p>
            <p className="text-balance text-foreground/85 text-lg leading-8">
              {REALITY_TEXT}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
