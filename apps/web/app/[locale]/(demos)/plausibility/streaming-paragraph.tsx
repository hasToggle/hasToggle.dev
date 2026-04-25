"use client";

import { cn } from "@repo/design-system/lib/utils";
import { useEffect, useState } from "react";
import {
  type PauseId,
  PROBABILITY_ANNOUNCEMENT,
  PROBABILITY_CANDIDATES,
  STREAM_LABEL,
  type Token,
  UNGROUNDED_TOKENS,
} from "./paragraph-data";
import { ProbabilityPopover } from "./probability-popover";
import { useStreaming } from "./use-streaming";

const FULL_TEXT = UNGROUNDED_TOKENS.map((token) =>
  token.text.replace(/`/g, "")
).join("");

const POPOVER_LINGER_MS = 220;

interface StreamingParagraphProps {
  enabled: boolean;
  onComplete: () => void;
  reducedMotion: boolean;
}

function isCodeToken(token: Token) {
  return token.text.startsWith("`") && token.text.endsWith("`");
}

function renderTokenText(token: Token) {
  if (!isCodeToken(token)) {
    return token.text;
  }
  const stripped = token.text.slice(1, -1);
  return (
    <code className="rounded bg-foreground/[0.06] px-1 py-0.5 font-mono text-[0.95em] text-foreground/90">
      {stripped}
    </code>
  );
}

function useDisplayedPause(activePause: PauseId | null) {
  const [displayed, setDisplayed] = useState<PauseId | null>(null);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (activePause) {
      setDisplayed(activePause);
      setExiting(false);
      return;
    }
    if (!displayed) {
      return;
    }
    setExiting(true);
    const id = window.setTimeout(() => {
      setDisplayed(null);
      setExiting(false);
    }, POPOVER_LINGER_MS);
    return () => window.clearTimeout(id);
  }, [activePause, displayed]);

  return { displayedPause: displayed, exiting };
}

export function StreamingParagraph({
  enabled,
  reducedMotion,
  onComplete,
}: StreamingParagraphProps) {
  const { visibleCount, activePause, isComplete } = useStreaming({
    tokens: UNGROUNDED_TOKENS,
    enabled,
    reducedMotion,
    onComplete,
  });
  const { displayedPause, exiting } = useDisplayedPause(activePause);

  return (
    <div
      aria-live="polite"
      className="relative font-display text-foreground/85 text-lg leading-8"
    >
      <span className="sr-only">{enabled ? FULL_TEXT : ""}</span>

      <span aria-hidden="true">
        {UNGROUNDED_TOKENS.map((token, index) => {
          const isVisible = index < visibleCount;
          const isLastVisible = index === visibleCount - 1;
          const showPopover =
            !reducedMotion &&
            isLastVisible &&
            !!token.pause &&
            token.pause === displayedPause;
          const showStaticPopover = reducedMotion && !!token.pause;
          const popoverPauseId = token.pause;

          return (
            <span
              className={cn(
                "relative whitespace-pre-wrap transition-opacity duration-150",
                isVisible ? "opacity-100" : "opacity-0",
                isComplete && token.wrong && "border-red-500/70 border-b-2"
              )}
              key={token.id}
            >
              {isVisible && renderTokenText(token)}
              {showPopover && popoverPauseId && (
                <ProbabilityPopover
                  candidates={PROBABILITY_CANDIDATES[popoverPauseId]}
                  exiting={exiting}
                />
              )}
              {showStaticPopover && popoverPauseId && (
                <ProbabilityPopover
                  candidates={PROBABILITY_CANDIDATES[popoverPauseId]}
                />
              )}
            </span>
          );
        })}

        {!isComplete && enabled && (
          <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[3px] animate-pulse bg-foreground/80 align-baseline" />
        )}
      </span>

      {isComplete && (
        <>
          <span className="sr-only">{PROBABILITY_ANNOUNCEMENT}</span>
          <p className="mt-6 font-mono text-foreground/55 text-sm">
            <span aria-hidden="true" className="mr-2 select-none opacity-55">
              {"//"}
            </span>
            {STREAM_LABEL}
          </p>
        </>
      )}
    </div>
  );
}
