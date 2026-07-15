export type LoopStepKind = "message" | "think" | "tool" | "respond";

export interface LoopStep {
  kind: LoopStepKind;
  label: string;
}

export const LOOP_STEPS: readonly LoopStep[] = [
  { kind: "message", label: "\"unknown discount codes crash checkout — fix it\"" },
  { kind: "think", label: "thinking" },
  { kind: "tool", label: "Read(checkout.js)" },
  { kind: "think", label: "the guard throws — it should fail soft" },
  { kind: "tool", label: "Write(checkout.js)" },
  { kind: "tool", label: "Run(bun test)" },
  { kind: "respond", label: "done — 5 tests passing" },
];

export function nextLoopStep(i: number): number {
  return (i + 1) % LOOP_STEPS.length;
}
