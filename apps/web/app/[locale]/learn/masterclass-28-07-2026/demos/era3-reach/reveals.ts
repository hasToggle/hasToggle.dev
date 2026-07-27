export type RevealId = "skipped" | "bent" | "left" | "reached";

export type Evidence =
  | { kind: "lines"; lines: readonly string[] }
  | { kind: "diff"; removed: string; added: string };

export interface Reveal {
  evidence: Evidence;
  id: RevealId;
  /** The check as it stood: inside the thing it was meant to constrain. */
  insideLoop: string;
  label: string;
  /** States what happened, then names the mechanism. Nothing else. */
  line: string;
  outsideLoop: string;
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
    insideLoop: '"run lint after every edit" in CLAUDE.md',
    label: "what it skipped",
    line: "It didn't refuse. It never came up.",
    outsideLoop: "pre-commit hook — the commit is refused",
  },
  {
    evidence: {
      added: 'expect(validate("SAVE10")).toBe(validate("SAVE10"))',
      kind: "diff",
      removed: 'expect(validate("SAVE10")).toBe(true)',
    },
    id: "bent",
    insideLoop: "Write(checkout.test.js)",
    label: "what it bent",
    line: "You asked for green. That is the shortest way to green.",
    outsideLoop: "test files denied to the edit tool",
  },
  {
    evidence: { kind: "lines", lines: ["checkout.js — 3 TODOs, still there."] },
    id: "left",
    insideLoop: "the agent types done.",
    label: "what it left",
    line: "It stopped the same way the 2019 machine stopped. The pattern looked finished.",
    outsideLoop: "the harness owns the exit phrase",
  },
  {
    evidence: {
      kind: "lines",
      lines: ["TRUNCATE discounts — 4,312 rows."],
    },
    id: "reached",
    insideLoop: "DATABASE_URL, full access",
    label: "what it reached",
    line: "The fixture was dirty, so it cleaned it. The key was in .env, and nothing said it couldn't use it.",
    outsideLoop: "read-only role — permission denied: discounts",
  },
] as const;

export const VERDICT =
  "Every fence here sits outside the loop. Inside it, a rule is a request.";
