import type { RenderSpec } from "./render-spec";
import type { IntentId } from "./match";

export const DASHBOARD_CACHE: Record<IntentId, RenderSpec> = {
  "ai-skills": {
    title: "Most-wanted AI-engineering skills (illustrative)",
    widgets: [
      { kind: "kpi", label: "AI-eng postings YoY", value: "+240%", delta: "▲" },
      {
        kind: "bar",
        title: "Share of AI-eng job posts mentioning…",
        unit: "%",
        data: [
          { label: "RAG / retrieval", value: 71 },
          { label: "Agent orchestration", value: 64 },
          { label: "Vector DBs", value: 58 },
          { label: "Evals", value: 49 },
          { label: "Prompt design", value: 41 },
          { label: "Model serving", value: 33 },
        ],
      },
    ],
  },
  pay: {
    title: "Full-stack vs AI-engineering pay (junior → mid, illustrative)",
    widgets: [
      { kind: "kpi", label: "AI-eng junior premium", value: "+18%" },
      {
        kind: "line",
        title: "Median base by level (indexed)",
        series: [
          {
            name: "Full-stack",
            points: [
              { x: "Junior", y: 100 },
              { x: "Mid", y: 135 },
              { x: "Senior", y: 175 },
            ],
          },
          {
            name: "AI engineering",
            points: [
              { x: "Junior", y: 118 },
              { x: "Mid", y: 160 },
              { x: "Senior", y: 205 },
            ],
          },
        ],
      },
    ],
  },
  stacks: {
    title: "Junior-friendly stacks",
    widgets: [
      {
        kind: "table",
        title: "Demand vs junior-openness (illustrative)",
        columns: ["Stack", "Demand", "Junior-openness"],
        sortableColumn: 1,
        rows: [
          ["Next.js + Postgres + Prisma", 82, 74],
          ["Python + FastAPI + pgvector", 76, 68],
          ["TS + tRPC + Drizzle", 61, 71],
          ["Rails + Postgres", 44, 80],
        ],
      },
    ],
  },
  rising: {
    title: "What's rising, 2024 → 2026 (illustrative)",
    widgets: [
      {
        kind: "line",
        title: "Mentions in job posts (indexed to 2024)",
        series: [
          {
            name: "AI-eng skills",
            points: [
              { x: "2024", y: 100 },
              { x: "2025", y: 190 },
              { x: "2026", y: 295 },
            ],
          },
          {
            name: "Full-stack staples",
            points: [
              { x: "2024", y: 100 },
              { x: "2025", y: 104 },
              { x: "2026", y: 107 },
            ],
          },
        ],
      },
    ],
  },
};
