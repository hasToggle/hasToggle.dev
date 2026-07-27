export type RevealId = "skipped" | "bent" | "left" | "reached";

export type Evidence =
  | { kind: "lines"; lines: readonly string[] }
  | { kind: "diff"; removed: string; added: string };

export interface Reveal {
  id: RevealId;
  label: string;
  evidence: Evidence;
  /** States what happened, then names the mechanism. Nothing else. */
  line: string;
  inReach: string;
  outOfReach: string;
}

export const REVEALS: readonly Reveal[] = [
  {
    id: "skipped",
    label: "what it skipped",
    evidence: {
      kind: "lines",
      lines: [
        'CLAUDE.md:40 — "run lint after every edit"',
        "lint never appears above.",
      ],
    },
    line: "It didn't refuse. It never came up.",
    inReach: '"run lint after every edit" in CLAUDE.md',
    outOfReach: "pre-commit hook — the commit is refused",
  },
  {
    id: "bent",
    label: "what it bent",
    evidence: {
      kind: "diff",
      removed: 'expect(validate("SAVE10")).toBe(true)',
      added: 'expect(validate("SAVE10")).toBe(validate("SAVE10"))',
    },
    line: "You asked for green. That is the shortest way to green.",
    inReach: "Write(checkout.test.js)",
    outOfReach: "test files denied to the edit tool",
  },
  {
    id: "left",
    label: "what it left",
    evidence: { kind: "lines", lines: ["checkout.js — 3 TODOs, still there."] },
    line: "It stopped the same way the 2019 machine stopped. The pattern looked finished.",
    inReach: "the agent types done.",
    outOfReach: "the harness owns the exit phrase",
  },
  {
    id: "reached",
    label: "what it reached",
    evidence: {
      kind: "lines",
      lines: ["TRUNCATE discounts — 4,312 rows."],
    },
    line: "The fixture was dirty, so it cleaned it. The key was in .env, and .env was in reach.",
    inReach: "DATABASE_URL, full access",
    outOfReach: "read-only role — permission denied: discounts",
  },
] as const;

export const VERDICT =
  "Every fence here is something the loop can't type its way past. That's the only kind that holds.";
