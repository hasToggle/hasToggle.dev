import { useEffect, useRef, useState } from "react";
import type { PauseId, Token } from "./paragraph-data";

const COMMON_TOKEN_MS = 55;
const PUNCTUATION_TOKEN_MS = 160;
const PAUSE_HOLD_MS = 1400;
const PUNCTUATION = new Set([".", ",", "!", "?", ";", ":"]);

function tokenDelay(token: Token | undefined) {
  if (!token) {
    return COMMON_TOKEN_MS;
  }
  return PUNCTUATION.has(token.text.trim())
    ? PUNCTUATION_TOKEN_MS
    : COMMON_TOKEN_MS;
}

function buildRevealSchedule(tokens: Token[]) {
  const revealAt: number[] = [];
  let elapsed = 0;
  for (const token of tokens) {
    elapsed += tokenDelay(token);
    revealAt.push(elapsed);
    if (token.pause) {
      elapsed += PAUSE_HOLD_MS;
    }
  }
  return revealAt;
}

function countRevealed(elapsed: number, revealAt: number[]) {
  let count = 0;
  while (count < revealAt.length && elapsed >= revealAt[count]) {
    count += 1;
  }
  return count;
}

function pauseAt(
  count: number,
  elapsed: number,
  tokens: Token[],
  revealAt: number[]
): PauseId | null {
  if (count === 0) {
    return null;
  }
  const last = tokens[count - 1];
  if (!last.pause) {
    return null;
  }
  const pauseStart = revealAt[count - 1];
  return elapsed < pauseStart + PAUSE_HOLD_MS ? last.pause : null;
}

interface UseStreamingOptions {
  enabled: boolean;
  onComplete?: () => void;
  reducedMotion?: boolean;
  tokens: Token[];
}

interface UseStreamingReturn {
  activePause: PauseId | null;
  isComplete: boolean;
  visibleCount: number;
}

export function useStreaming({
  tokens,
  enabled,
  reducedMotion = false,
  onComplete,
}: UseStreamingOptions): UseStreamingReturn {
  const [visibleCount, setVisibleCount] = useState(0);
  const [activePause, setActivePause] = useState<PauseId | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!enabled) {
      setVisibleCount(0);
      setActivePause(null);
      setIsComplete(false);
      return;
    }

    if (reducedMotion) {
      setVisibleCount(tokens.length);
      setActivePause(null);
      setIsComplete(true);
      onCompleteRef.current?.();
      return;
    }

    const revealAt = buildRevealSchedule(tokens);
    const totalDuration = revealAt.at(-1) ?? 0;

    let cancelled = false;
    let rafId = 0;
    let startTime: number | null = null;
    let lastCount = -1;
    let lastPause: PauseId | null = null;
    let completionFired = false;

    const tick = (timestamp: number) => {
      if (cancelled) {
        return;
      }
      if (startTime === null) {
        startTime = timestamp;
      }
      const elapsed = timestamp - startTime;
      const count = countRevealed(elapsed, revealAt);
      const currentPause = pauseAt(count, elapsed, tokens, revealAt);

      if (count !== lastCount) {
        setVisibleCount(count);
        lastCount = count;
      }
      if (currentPause !== lastPause) {
        setActivePause(currentPause);
        lastPause = currentPause;
      }

      if (count >= tokens.length && elapsed >= totalDuration) {
        if (!completionFired) {
          setIsComplete(true);
          onCompleteRef.current?.();
          completionFired = true;
        }
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [enabled, reducedMotion, tokens]);

  return { visibleCount, activePause, isComplete };
}
