import type { RenderSpec } from "./render-spec";
import type { IntentId } from "./match";

/**
 * Real, published numbers only — Germany first, EU/global where no German
 * cut exists. Every spec cites its source. If a figure can't be cited, it
 * doesn't ship.
 */
export const DASHBOARD_CACHE: Record<IntentId, RenderSpec> = {
  juniors: {
    title: "AI and the junior developer market — Germany",
    source: "Indeed Deutschland analysis, 2025 · Bitkom, 2024",
    widgets: [
      {
        kind: "kpi",
        label: "Junior software-developer postings vs 2020",
        value: "−54%",
        delta: "▼",
      },
      {
        kind: "kpi",
        label: "Unfilled IT positions in Germany, at the same time",
        value: "109,000",
      },
      {
        kind: "bar",
        title: "German job postings vs 2020 (%)",
        unit: "%",
        data: [
          { label: "Junior software devs", value: -54 },
          { label: "Senior software devs", value: -15 },
          { label: "Junior IT infrastructure", value: -40 },
          { label: "Senior IT infrastructure", value: 27 },
        ],
      },
    ],
  },
  "ai-skills": {
    title: "Germany's fastest-growing roles, 2026",
    source: "LinkedIn Jobs on the Rise 2026, Germany · PwC AI Jobs Barometer 2026",
    widgets: [
      {
        kind: "table",
        title: "The German top three, with median prior experience",
        columns: ["#", "Role", "Median yrs experience"],
        sortableColumn: 2,
        rows: [
          [1, "Head of AI", 4.8],
          [2, "AI engineer", 3.0],
          [3, "Health, safety & environment officer", 4.2],
        ],
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
  pay: {
    title: "What AI skills add to a paycheck — Germany",
    source: "PwC Global AI Jobs Barometer 2026, German edition",
    widgets: [
      {
        kind: "kpi",
        label: "Premium in most German sectors",
        value: ">20%",
        delta: "▲",
      },
      {
        kind: "kpi",
        label: "Energy, utilities & raw materials",
        value: "+39%",
        delta: "▲",
      },
      {
        kind: "kpi",
        label: "Finance — where AI skill is already table stakes",
        value: "−9%",
        delta: "▼",
      },
      {
        kind: "line",
        title: "Global average premium for context, by report year (%)",
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
      },
    ],
  },
  trust: {
    title: "Developers use AI more — and trust it less",
    source: "Stack Overflow Developer Survey 2025 — 49,000+ developers, 177 countries",
    widgets: [
      {
        kind: "line",
        title: "Share of developers, global (%)",
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
