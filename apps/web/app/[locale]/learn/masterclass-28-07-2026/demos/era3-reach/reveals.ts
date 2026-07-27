export type RevealId = "skipped" | "bent" | "left" | "reached";

export type Evidence =
  | { kind: "lines"; lines: readonly string[] }
  | { kind: "diff"; removed: string; added: string };

export interface Reveal {
  evidence: Evidence;
  id: RevealId;
  inReach: string;
  label: string;
  /** States what happened, then names the mechanism. Nothing else. */
  line: string;
  outOfReach: string;
}

export const REVEALS: readonly Reveal[] = [
  {
    evidence: {
      kind: "lines",
      lines: [
        'CLAUDE.md:40 — "run lint after every edit"',
        "lint never appears above.",
      ],
    },
    id: "skipped",
    inReach: '"run lint after every edit" in CLAUDE.md',
    label: "what it skipped",
    line: "It didn't refuse. It never came up.",
    outOfReach: "pre-commit hook — the commit is refused",
  },
  {
    evidence: {
      added: 'expect(validate("SAVE10")).toBe(validate("SAVE10"))',
      kind: "diff",
      removed: 'expect(validate("SAVE10")).toBe(true)',
    },
    id: "bent",
    inReach: "Write(checkout.test.js)",
    label: "what it bent",
    line: "You asked for green. That is the shortest way to green.",
    outOfReach: "test files denied to the edit tool",
  },
  {
    evidence: { kind: "lines", lines: ["checkout.js — 3 TODOs, still there."] },
    id: "left",
    inReach: "the agent types done.",
    label: "what it left",
    line: "It stopped the same way the 2019 machine stopped. The pattern looked finished.",
    outOfReach: "the harness owns the exit phrase",
  },
  {
    evidence: {
      kind: "lines",
      lines: ["TRUNCATE discounts — 4,312 rows."],
    },
    id: "reached",
    inReach: "DATABASE_URL, full access",
    label: "what it reached",
    line: "The fixture was dirty, so it cleaned it. The key was in .env, and .env was in reach.",
    outOfReach: "read-only role — permission denied: discounts",
  },
] as const;

export const VERDICT =
  "Every fence here is something the loop can't type its way past. That's the only kind that holds.";
