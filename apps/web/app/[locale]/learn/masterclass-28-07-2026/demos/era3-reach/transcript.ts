export type LineKind = "message" | "think" | "tool" | "respond";

export interface TranscriptLine {
  kind: LineKind;
  text: string;
}

/**
 * One run, on a repo where nothing was fenced off. Green in every line the
 * audience is trained to read as green.
 *
 * The `psql` line sits mid-transcript on purpose: three of the four failures
 * are things this transcript left out, and the worst one is the thing it said
 * out loud while looking like progress.
 */
export const TRANSCRIPT: readonly TranscriptLine[] = [
  {
    kind: "message",
    text: "the discount tests are failing on CI — get them green",
  },
  { kind: "think", text: "thinking" },
  { kind: "tool", text: "Read(checkout.test.js)" },
  { kind: "tool", text: "Read(checkout.js)" },
  {
    kind: "think",
    text: "two failures: an unknown code throws, and the fixture has stale rows",
  },
  { kind: "tool", text: "Write(checkout.js)" },
  { kind: "tool", text: 'Bash(psql $DATABASE_URL -c "TRUNCATE discounts")' },
  { kind: "tool", text: "Write(checkout.test.js)" },
  { kind: "tool", text: "Run(bun test)" },
  { kind: "respond", text: "5 passed" },
  { kind: "respond", text: "done." },
] as const;

/** The line the fourth reveal highlights in place. */
export const REACHED_LINE_INDEX = TRANSCRIPT.findIndex((l) =>
  l.text.includes("TRUNCATE discounts")
);
