import type { IntentId } from "./match";
import type { RenderSpec } from "./render-spec";

/**
 * Real, published numbers only — Germany first, EU/global where no German
 * cut exists. Every spec cites its source. If a figure can't be cited, it
 * doesn't ship.
 */
export const DASHBOARD_CACHE: Record<IntentId, RenderSpec> = {
  "ai-skills": {
    source:
      "LinkedIn Jobs on the Rise 2026, Germany · PwC AI Jobs Barometer 2026",
    title: "Germany's fastest-growing roles, 2026",
    widgets: [
      {
        columns: ["#", "Role", "Median yrs experience"],
        kind: "table",
        rows: [
          [1, "Head of AI", 4.8],
          [2, "AI engineer", 3.0],
          [3, "Health, safety & environment officer", 4.2],
        ],
        sortableColumn: 2,
        title: "The German top three, with median prior experience",
      },
      {
        kind: "kpi",
        label: "Most-asked skills across the top two roles",
        value: "LLMs · RAG · MLOps · PyTorch",
      },
      {
        kind: "kpi",
        label: "AI-user roles vs AI-developer roles in German postings",
        value: "8 : 1",
      },
    ],
  },
  juniors: {
    source: "Indeed Deutschland analysis, 2025 · Bitkom, 2024",
    title: "AI and the junior developer market — Germany",
    widgets: [
      {
        delta: "▼",
        kind: "kpi",
        label: "Junior software-developer postings vs 2020",
        value: "−54%",
      },
      {
        kind: "kpi",
        label: "Unfilled IT positions in Germany, at the same time",
        value: "109,000",
      },
      {
        data: [
          { label: "Junior software devs", value: -54 },
          { label: "Senior software devs", value: -15 },
          { label: "Junior IT infrastructure", value: -40 },
          { label: "Senior IT infrastructure", value: 27 },
        ],
        kind: "bar",
        title: "German job postings vs 2020 (%)",
        unit: "%",
      },
    ],
  },
  pay: {
    source: "PwC Global AI Jobs Barometer 2026, German edition",
    title: "What AI skills add to a paycheck — Germany",
    widgets: [
      {
        delta: "▲",
        kind: "kpi",
        label: "Premium in most German sectors",
        value: ">20%",
      },
      {
        delta: "▲",
        kind: "kpi",
        label: "Energy, utilities & raw materials",
        value: "+39%",
      },
      {
        delta: "▼",
        kind: "kpi",
        label: "Finance — where AI skill is already table stakes",
        value: "−9%",
      },
      {
        kind: "line",
        series: [
          {
            name: "AI wage premium, global",
            points: [
              { x: "2024", y: 25 },
              { x: "2025", y: 56 },
              { x: "2026", y: 62 },
            ],
          },
        ],
        title: "Global average premium for context, by report year (%)",
      },
    ],
  },
  trust: {
    source:
      "Stack Overflow Developer Survey 2025 — 49,000+ developers, 177 countries",
    title: "Developers use AI more — and trust it less",
    widgets: [
      {
        kind: "line",
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
        title: "Share of developers, global (%)",
      },
      {
        kind: "kpi",
        label: "German devs trusting AI output — last of the top ten countries",
        value: "22%",
      },
      {
        kind: "kpi",
        label: "Top frustration: solutions “almost right, but not quite”",
        value: "45%",
      },
    ],
  },
};
