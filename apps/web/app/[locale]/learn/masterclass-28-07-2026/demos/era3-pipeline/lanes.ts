import type { LaneId } from "./reducer";

export interface LaneMeta {
  court: string;
  id: LaneId;
  mono: string;
  plain: string;
  tense: string;
}

export const LANES: readonly LaneMeta[] = [
  {
    id: "rag",
    plain: "A fairer job search — same query, same results, whoever's asking",
    mono: "rag-retrieval · bias-evals",
    court: "evals",
    tense: "present — you plan this one",
  },
  {
    id: "wp",
    plain: "Rebuilding a site, pixel for pixel — the demo above",
    mono: "wp-next · parity-harness",
    court: "parity harness",
    tense: "past — you already planned it",
  },
  {
    id: "deps",
    plain: "Every library kept current, on a schedule",
    mono: "deps · eve agent",
    court: "CI + your signature",
    tense: "permanent — planned once, runs weekly",
  },
];
