import type { RenderSpec } from "./render-spec";
import type { IntentId } from "./match";

/**
 * Real, published numbers only — every spec cites its source. If a figure
 * can't be cited, it doesn't ship.
 */
export const DASHBOARD_CACHE: Record<IntentId, RenderSpec> = {
  juniors: {
    title: "AI and the junior developer market",
    source:
      "Stanford Digital Economy Lab (Brynjolfsson et al.), ADP payroll records — August 2025",
    widgets: [
      {
        kind: "kpi",
        label: "Employment, software devs aged 22–25, since late 2022",
        value: "−20%",
        delta: "▼",
      },
      {
        kind: "kpi",
        label: "Experienced devs, same firms, same period",
        value: "+6–12%",
        delta: "▲",
      },
      {
        kind: "bar",
        title: "Workers aged 22–25 — employment change since 2022",
        unit: "%",
        data: [
          { label: "Software developers", value: -20 },
          { label: "All AI-exposed occupations", value: -13 },
        ],
      },
    ],
  },
  "ai-skills": {
    title: "The fastest-growing U.S. roles — four of the top five are AI",
    source: "LinkedIn Jobs on the Rise, U.S. edition — January 2026",
    widgets: [
      {
        kind: "kpi",
        label: "AI-engineer job postings, 2025",
        value: "+143%",
        delta: "▲",
      },
      {
        kind: "table",
        title: "The top five, with median prior experience",
        columns: ["#", "Role", "Median yrs experience"],
        sortableColumn: 2,
        rows: [
          [1, "AI engineer", 3.7],
          [2, "AI consultant / strategist", 8.2],
          [3, "New-home sales specialist", 6.5],
          [4, "Data annotator", 3.5],
          [5, "AI / ML researcher", 3.0],
        ],
      },
      {
        kind: "kpi",
        label: "Most-asked skills for the #1 role",
        value: "LangChain · RAG · PyTorch",
      },
    ],
  },
  pay: {
    title: "What AI skills add to a paycheck",
    source: "PwC Global AI Jobs Barometer — 2024, 2025 and 2026 editions",
    widgets: [
      {
        kind: "line",
        title: "Average wage premium vs the same role without AI skills (%)",
        series: [
          {
            name: "AI wage premium",
            points: [
              { x: "2024", y: 25 },
              { x: "2025", y: 56 },
              { x: "2026", y: 62 },
            ],
          },
        ],
      },
      {
        kind: "kpi",
        label: "Growth of AI-skill postings vs the overall job market",
        value: "8× faster",
      },
    ],
  },
  trust: {
    title: "Developers use AI more — and trust it less",
    source: "Stack Overflow Developer Survey 2025",
    widgets: [
      {
        kind: "line",
        title: "Share of developers (%)",
        series: [
          {
            name: "Using or planning to use AI tools",
            points: [
              { x: "2024", y: 76 },
              { x: "2025", y: 84 },
            ],
          },
          {
            name: "Trusting the output",
            points: [
              { x: "2024", y: 40 },
              { x: "2025", y: 29 },
            ],
          },
        ],
      },
      {
        kind: "kpi",
        label: "Top frustration: solutions “almost right, but not quite”",
        value: "45%",
      },
    ],
  },
};
