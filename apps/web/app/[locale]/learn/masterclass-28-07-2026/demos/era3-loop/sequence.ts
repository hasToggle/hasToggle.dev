export type LoopStepKind = "message" | "think" | "tool" | "respond";

export interface LoopStep {
  kind: LoopStepKind;
  label: string;
}

export const LOOP_STEPS: readonly LoopStep[] = [
  {
    kind: "message",
    label: '"unknown discount codes crash checkout — fix it"',
  },
  { kind: "think", label: "thinking" },
  { kind: "tool", label: "Read(checkout.js)" },
  { kind: "think", label: "the guard throws — it should fail soft" },
  { kind: "tool", label: "Write(checkout.js)" },
  { kind: "tool", label: "Run(bun test)" },
  { kind: "respond", label: "done — 5 tests passing" },
];

export const LAST_LOOP_STEP = LOOP_STEPS.length - 1;

/**
 * Walks the sequence once and stops. Returns null at the end rather than
 * wrapping: the run is something the presenter starts, not something the page
 * does on its own.
 */
export function advanceLoop(i: number): number | null {
  return i < LAST_LOOP_STEP ? i + 1 : null;
}
