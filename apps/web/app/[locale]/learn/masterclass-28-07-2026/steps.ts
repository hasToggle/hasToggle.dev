export type StepId =
  | "intro"
  | "completion"
  | "integration"
  | "agentic-engineering"
  | "outlook"
  | "synthesis";

export interface Step {
  id: StepId;
  label: string;
  vibe?: string;
}

export const STEPS: readonly Step[] = [
  { id: "intro", label: "Intro" },
  { id: "completion", label: "2019–2022", vibe: "skepticism" },
  { id: "integration", label: "2022–2024", vibe: "guarded fascination" },
  {
    id: "agentic-engineering",
    label: "2024 → now",
    vibe: "the trust pivot",
  },
  { id: "outlook", label: "2026 →", vibe: "the next frontier" },
  { id: "synthesis", label: "Synthesis" },
] as const;

const IDS = STEPS.map((s) => s.id);

export function isStepId(value: string): value is StepId {
  return (IDS as string[]).includes(value);
}

export function getStepIndex(id: StepId): number {
  return IDS.indexOf(id);
}

export function getAdjacentStep(
  id: StepId,
  dir: "prev" | "next"
): StepId | null {
  const next = getStepIndex(id) + (dir === "next" ? 1 : -1);
  return STEPS[next]?.id ?? null;
}
