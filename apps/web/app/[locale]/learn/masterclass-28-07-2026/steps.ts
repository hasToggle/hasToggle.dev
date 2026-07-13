export type StepId =
  | "intro"
  | "era-1"
  | "era-2"
  | "era-3"
  | "era-4"
  | "synthesis";

export interface Step {
  era?: string;
  id: StepId;
  label: string;
  vibe?: string;
}

export const STEPS: readonly Step[] = [
  { id: "intro", label: "Intro" },
  { era: "Era I", id: "era-1", label: "I · Completion", vibe: "skepticism" },
  {
    era: "Era II",
    id: "era-2",
    label: "II · Companion",
    vibe: "guarded fascination",
  },
  {
    era: "Era III",
    id: "era-3",
    label: "III · Agent",
    vibe: "the trust pivot",
  },
  {
    era: "Era IV",
    id: "era-4",
    label: "IV · Runtime",
    vibe: "architectural liberation",
  },
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
