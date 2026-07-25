import type { Mode } from "./selector";

export type PhaseId = "autocomplete" | "unanswered" | "dial" | "taught";

export interface PhaseArrival {
  mode: Mode;
  promptId: string;
  /** Beats before the flip park the dial; the flip inherits wherever it is. */
  resetTemp: boolean;
}

export interface Phase {
  arrival: PhaseArrival;
  id: PhaseId;
  label: string;
  /** Rides inline before the label. Only the beat that *is* a date has one. */
  year?: string;
}

/**
 * The four beats, in the order the presenter walks them. Arriving at a phase
 * configures the machine and stops — nothing runs on its own.
 */
export const PHASES: readonly Phase[] = [
  {
    arrival: { mode: "base", promptId: "reverse-fn", resetTemp: true },
    id: "autocomplete",
    label: "autocomplete",
  },
  {
    arrival: { mode: "base", promptId: "how-do-i", resetTemp: true },
    id: "unanswered",
    label: "nobody answers",
  },
  {
    arrival: { mode: "base", promptId: "how-do-i", resetTemp: true },
    id: "dial",
    label: "turn the dial",
  },
  {
    arrival: { mode: "instruct", promptId: "how-do-i", resetTemp: false },
    id: "taught",
    label: "taught to answer",
    year: "2022",
  },
] as const;

export const FIRST_PHASE: PhaseId = PHASES[0].id;

function indexOf(id: PhaseId): number {
  return PHASES.findIndex((p) => p.id === id);
}

export function phaseFor(id: PhaseId): Phase {
  return PHASES.find((p) => p.id === id) ?? PHASES[0];
}

export function reached(furthest: PhaseId, target: PhaseId): boolean {
  return indexOf(furthest) >= indexOf(target);
}

export function furthestOf(a: PhaseId, b: PhaseId): PhaseId {
  return indexOf(a) >= indexOf(b) ? a : b;
}

export function adjacentPhase(
  id: PhaseId,
  dir: "prev" | "next"
): PhaseId | null {
  const next = indexOf(id) + (dir === "next" ? 1 : -1);
  return PHASES[next]?.id ?? null;
}
