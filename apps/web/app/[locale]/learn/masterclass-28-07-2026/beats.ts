import type { StepId } from "./steps";

export interface Beat {
  id: string;
  label: string;
}

/**
 * Presenter staging, one sequence per step. A step with no beats is never
 * gated — its demos render the moment the step does.
 *
 * The reading ladder gets one beat, not three: gates exist to stop the room
 * reading a punchline early, and three labelled year-pills spoil nothing.
 */
export const BEATS: Record<StepId, readonly Beat[]> = {
  "agentic-engineering": [
    { id: "loop", label: "the loop" },
    { id: "reading", label: "where the reading went" },
    { id: "run", label: "get them green" },
    { id: "skipped", label: "what it skipped" },
    { id: "bent", label: "what it bent" },
    { id: "left", label: "what it left" },
    { id: "reached", label: "what it reached" },
    { id: "fenced", label: "out of reach" },
    { id: "parity", label: "pixel for pixel" },
    { id: "lanes", label: "three lanes" },
    { id: "meter", label: "the meter" },
  ],
  completion: [],
  integration: [
    { id: "tab", label: "a browser tab" },
    { id: "editor", label: "the chat moves in" },
  ],
  intro: [],
  outlook: [],
  synthesis: [],
};

export function beatIndex(step: StepId, id: string): number {
  return BEATS[step].findIndex((b) => b.id === id);
}

export function firstBeat(step: StepId): string | null {
  return BEATS[step][0]?.id ?? null;
}

export function adjacentBeat(
  step: StepId,
  current: string,
  dir: "prev" | "next"
): string | null {
  const next = beatIndex(step, current) + (dir === "next" ? 1 : -1);
  return BEATS[step][next]?.id ?? null;
}

/**
 * Keys off `furthest`, never `current`, so stepping back to re-explain
 * something never removes a demo mid-sentence.
 */
export function reached(
  step: StepId,
  target: string,
  furthest: string,
  presenter: boolean
): boolean {
  if (!presenter || BEATS[step].length === 0) {
    return true;
  }
  return beatIndex(step, furthest) >= beatIndex(step, target);
}

export function furthestBeatOf(step: StepId, a: string, b: string): string {
  return beatIndex(step, a) >= beatIndex(step, b) ? a : b;
}
