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
    court: "evals",
    id: "rag",
    mono: "rag-retrieval · bias-evals",
    plain: "A fairer job search — same query, same results, whoever's asking",
    tense: "present — you plan this one",
  },
  {
    court: "parity harness",
    id: "wp",
    mono: "wp-next · parity-harness",
    plain: "Rebuilding a site, pixel for pixel — the demo above",
    tense: "past — you already planned it",
  },
  {
    court: "CI + your signature",
    id: "deps",
    mono: "deps · eve agent",
    plain: "Every library kept current, on a schedule",
    tense: "permanent — planned once, runs weekly",
  },
];
