"use client";

import { useCallback, useEffect, useState } from "react";
import { reached as beatReached, firstBeat, furthestBeatOf } from "./beats";
import type { StepId } from "./steps";

/**
 * Step-level presenter staging. Visibility keys off `furthest`, never
 * `current`, so stepping back to re-explain something never removes a demo
 * mid-sentence — the rule Era I's disposition module learned the hard way.
 */
export function useBeats(step: StepId, presenter: boolean) {
  const [current, setCurrent] = useState<string>(() => firstBeat(step) ?? "");
  const [furthest, setFurthest] = useState<string>(() => firstBeat(step) ?? "");

  useEffect(() => {
    const first = firstBeat(step) ?? "";
    setCurrent(first);
    setFurthest(first);
  }, [step]);

  const go = useCallback(
    (id: string) => {
      setCurrent(id);
      setFurthest((f) => furthestBeatOf(step, f, id));
    },
    [step]
  );

  const has = useCallback(
    (id: string) => beatReached(step, id, furthest, presenter),
    [step, furthest, presenter]
  );

  return { current, furthest, go, has };
}
