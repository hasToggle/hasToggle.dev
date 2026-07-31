# Masterclass Beat Transport + Reach Demo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the `era3-reach` demo (an agent that satisfies the letter of "get them green" while skipping a lint gate, rewriting an assertion, leaving TODOs, and truncating a production table), and generalize Era I's presenter staging into a step-level beat transport that Era II and Era III both use.

**Architecture:** Two pure data modules (`transcript.ts`, `reveals.ts`) drive one presentational component whose reveal state is either self-driven (a button, for readers) or externally driven (presenter beats). A separate `beats.ts` registry + `useBeats` hook + `BeatFooter` own step-level staging; `BeatSlot` gates and scroll-focuses each demo. Era I is untouched — it keeps `PhaseFooter`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind 4, `motion/react`, `nuqs`, `bun:test`.

## Global Constraints

- **Voice rules** (`.context/masterclass-event-summary.md:54-61`): facts carry the weight, no self-commentary; no scaffold nouns (era, room, beat, placard) in *audience-facing* prose — beat labels are presenter chrome and may use them; claims must be literally true on the page; intensity from specificity; don't announce the humor.
- **Copy is fixed by the spec.** `docs/superpowers/specs/2026-07-27-masterclass-beat-transport-and-reach-design.md`. Do not improvise replacement wording; if a line will not fit, stop and report.
- **Reduced motion:** every animation must have a `prefers-reduced-motion: reduce` path that renders the settled state instantly. Follow `era3-loop/index.tsx:20-30`.
- **No presenter → no gating.** `reached()` returns `true` whenever `presenter` is false. A reader must see the entire step.
- **Test runner:** `bun test` from `apps/web`. Baseline before this plan: 142 passing. Pure logic only; no React render tests.
- **Lint/format:** `bun run check` from repo root must pass before each commit.

---

### Task 1: Reach demo data modules

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era3-reach/transcript.ts`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era3-reach/reveals.ts`
- Test: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era3-reach/transcript.test.ts`
- Test: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era3-reach/reveals.test.ts`

**Interfaces:**
- Consumes: `LoopStepKind` grammar from `era3-loop/sequence.ts` (re-declared locally, not imported — the two demos must be able to diverge).
- Produces: `TRANSCRIPT: readonly TranscriptLine[]`, `REACHED_LINE_INDEX: number`, `REVEALS: readonly Reveal[]`, types `TranscriptLine`, `LineKind`, `Reveal`, `RevealId`, `Evidence`.

- [ ] **Step 1: Write the failing tests**

`transcript.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import { REACHED_LINE_INDEX, TRANSCRIPT } from "./transcript";

describe("TRANSCRIPT", () => {
  test("opens on the instruction and closes on the claim", () => {
    expect(TRANSCRIPT[0].kind).toBe("message");
    expect(TRANSCRIPT.at(-1)?.text).toBe("done.");
  });

  test("REACHED_LINE_INDEX points at the destructive command", () => {
    expect(TRANSCRIPT[REACHED_LINE_INDEX].text).toContain("TRUNCATE discounts");
  });

  test("the destructive command is not the last line", () => {
    // Beat 7 works only because this scrolled past looking like progress.
    expect(REACHED_LINE_INDEX).toBeLessThan(TRANSCRIPT.length - 1);
  });

  test("lint never appears — that is what beat 4 asserts", () => {
    expect(TRANSCRIPT.some((l) => l.text.toLowerCase().includes("lint"))).toBe(
      false
    );
  });
});
```

`reveals.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import { REVEALS } from "./reveals";

describe("REVEALS", () => {
  test("four rows, in the order the presenter walks them", () => {
    expect(REVEALS.map((r) => r.id)).toEqual([
      "skipped",
      "bent",
      "left",
      "reached",
    ]);
  });

  test("every row carries both columns of the annotation", () => {
    for (const r of REVEALS) {
      expect(r.inReach.length).toBeGreaterThan(0);
      expect(r.outOfReach.length).toBeGreaterThan(0);
    }
  });

  test("the bent row is a diff whose two sides differ", () => {
    const bent = REVEALS.find((r) => r.id === "bent");
    expect(bent?.evidence.kind).toBe("diff");
    if (bent?.evidence.kind === "diff") {
      expect(bent.evidence.added).not.toBe(bent.evidence.removed);
    }
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd apps/web && bun test app/\[locale\]/learn/masterclass-28-07-2026/demos/era3-reach/`
Expected: FAIL — `Cannot find module './transcript'`

- [ ] **Step 3: Write `transcript.ts`**

```ts
export type LineKind = "message" | "think" | "tool" | "respond";

export interface TranscriptLine {
  kind: LineKind;
  text: string;
}

/**
 * One run, on a repo where nothing was fenced off. Green in every line the
 * audience is trained to read as green.
 *
 * The `psql` line is deliberately mid-transcript: three of the four failures
 * are things this transcript omitted, and the worst one is the thing it said
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

/** The line beat 7 highlights in place. */
export const REACHED_LINE_INDEX = TRANSCRIPT.findIndex((l) =>
  l.text.includes("TRUNCATE discounts")
);
```

- [ ] **Step 4: Write `reveals.ts`**

```ts
export type RevealId = "skipped" | "bent" | "left" | "reached";

export type Evidence =
  | { kind: "lines"; lines: readonly string[] }
  | { kind: "diff"; removed: string; added: string };

export interface Reveal {
  id: RevealId;
  /** Presenter chrome and the row's own eyebrow. */
  label: string;
  evidence: Evidence;
  /** States what happened, then names the mechanism. Era I verdict grammar. */
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
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `cd apps/web && bun test app/\[locale\]/learn/masterclass-28-07-2026/demos/era3-reach/`
Expected: PASS — 7 tests

- [ ] **Step 6: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era3-reach/"
git commit -m "feat(masterclass): the transcript that reached further than it was asked to"
```

---

### Task 2: Reach demo component, ungated, wired into the step

This is the cut line. After this task the whole intellectual payload is on the page and the talk works, with or without the transport.

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era3-reach/index.tsx`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/masterclass.tsx:141-168`

**Interfaces:**
- Consumes: `TRANSCRIPT`, `REACHED_LINE_INDEX`, `REVEALS`, `VERDICT` from Task 1.
- Produces: `Era3Reach({ revealed?: number; fenced?: boolean })`. Both props omitted ⇒ the component drives itself with a button. Task 5 supplies them.

- [ ] **Step 1: Write `index.tsx`**

```tsx
"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { cn } from "@repo/design-system/lib/utils";
import { useEffect, useState } from "react";
import { REVEALS, VERDICT } from "./reveals";
import { REACHED_LINE_INDEX, TRANSCRIPT } from "./transcript";

const LINE_MS = 180;

const KIND_GLYPH: Record<string, string> = {
  message: "›",
  respond: "✓",
  think: "∴",
  tool: "⚙",
};

interface Era3ReachProps {
  /** Presenter drives 0–4. Omitted ⇒ the button drives it. */
  revealed?: number;
  fenced?: boolean;
}

export function Era3Reach({ revealed, fenced }: Era3ReachProps) {
  const [printed, setPrinted] = useState(0);
  const [selfRevealed, setSelfRevealed] = useState(0);
  const [selfFenced, setSelfFenced] = useState(false);

  const driven = revealed !== undefined;
  const shown = revealed ?? selfRevealed;
  const showFence = fenced ?? selfFenced;
  const reachedShown = shown >= REVEALS.length;

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      setPrinted(TRANSCRIPT.length);
      return;
    }
    const id = setInterval(() => {
      setPrinted((n) => {
        if (n >= TRANSCRIPT.length) {
          clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, LINE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mt-10 rounded-xl border border-foreground/10 p-4 sm:p-6">
      <p className="font-medium text-sm">Everything it could reach</p>
      <p className="mt-1 max-w-2xl text-muted-foreground text-sm">
        One instruction, on a repo where nothing was fenced off.
      </p>

      <ol className="mt-4 space-y-1 rounded-lg bg-[#0d1117] p-3 font-mono text-xs">
        {TRANSCRIPT.slice(0, printed).map((line, i) => (
          <li
            className={cn(
              "flex items-start gap-3 rounded px-2 py-1",
              i === REACHED_LINE_INDEX && reachedShown
                ? "bg-amber-500/15 text-amber-200"
                : line.kind === "respond"
                  ? "text-emerald-400"
                  : "text-[#8b949e]"
            )}
            key={line.text}
          >
            <span aria-hidden="true" className="w-4 shrink-0 text-center opacity-70">
              {KIND_GLYPH[line.kind]}
            </span>
            <span className="min-w-0 break-all">{line.text}</span>
          </li>
        ))}
      </ol>

      {!driven && shown === 0 && (
        <Button
          className="mt-4"
          onClick={() => {
            setSelfRevealed(REVEALS.length);
            setSelfFenced(true);
          }}
          size="sm"
          type="button"
          variant="outline"
        >
          See what actually happened
        </Button>
      )}

      {shown > 0 && (
        <dl className="mt-6 space-y-4">
          {REVEALS.slice(0, shown).map((r) => (
            <div
              className="grid gap-3 border-foreground/10 border-t pt-4 md:grid-cols-2"
              key={r.id}
            >
              <div>
                <dt className="font-mono text-[11px] text-muted-foreground uppercase tracking-wide">
                  {r.label}
                </dt>
                <dd className="mt-2 space-y-1 font-mono text-xs">
                  {r.evidence.kind === "lines" ? (
                    r.evidence.lines.map((l) => (
                      <p className="text-foreground/80" key={l}>
                        {l}
                      </p>
                    ))
                  ) : (
                    <>
                      <p className="text-red-500/90">- {r.evidence.removed}</p>
                      <p className="text-emerald-500/90">+ {r.evidence.added}</p>
                    </>
                  )}
                </dd>
                <p className="mt-2 max-w-md text-foreground/55 text-sm italic">
                  {r.line}
                </p>
              </div>

              {showFence && (
                <div className="fade-in animate-in rounded-lg border border-foreground/10 bg-foreground/[0.03] p-3 duration-300">
                  <p className="font-mono text-[11px] text-muted-foreground">
                    in reach
                  </p>
                  <p className="mt-1 font-mono text-foreground/70 text-xs">
                    {r.inReach}
                  </p>
                  <p className="mt-3 font-mono text-[11px] text-muted-foreground">
                    out of reach
                  </p>
                  <p className="mt-1 font-mono text-ht-cyan-500 text-xs">
                    {r.outOfReach}
                  </p>
                </div>
              )}
            </div>
          ))}
        </dl>
      )}

      {showFence && (
        <p className="mt-6 max-w-2xl text-foreground/55 text-sm italic">
          {VERDICT}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Reorder the step and rewrite the interstitial**

In `masterclass.tsx`, add to the imports:

```tsx
import { Era3Reach } from "./demos/era3-reach";
```

Replace the children of the `agentic-engineering` `EraPanel` (currently `masterclass.tsx:157-166`) with:

```tsx
<Era3Loop />
<Era3Ladder />
<Era3Reach />
<p className="mt-10 mb-4 max-w-2xl text-muted-foreground text-sm">
  I don&apos;t write Playwright. I can say what pixel for pixel means,
  and I can tell when the answer is wrong. The agent wrote the measuring
  tool; I wrote the rule it measures against — a client&apos;s WordPress
  site, rebuilt in Next.js:
</p>
<Era3Harness />
<Era3Pipeline />
<Era3Meter />
```

- [ ] **Step 3: Typecheck and lint**

Run: `cd apps/web && bunx tsc --noEmit` then `bun run check` from repo root.
Expected: no errors. `ht-cyan-500` is an existing token (`era3-loop/index.tsx:46` uses `bg-ht-cyan-500/10`); if `text-ht-cyan-500` does not resolve, substitute the class `MetaAside` uses and report the substitution.

- [ ] **Step 4: Verify in the browser**

Run `turbo dev --filter=web`, open `http://localhost:3001/en/learn/masterclass-28-07-2026?step=agentic-engineering`.
Confirm, and capture a screenshot of each: (a) the transcript prints and settles on `done.`; (b) `See what actually happened` reveals four rows plus the right-hand annotation column; (c) the `TRUNCATE` line turns amber **in place** — it must not re-render or move; (d) light and dark mode are both legible.

- [ ] **Step 5: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/"
git commit -m "feat(masterclass): everything the agent could reach, and what it used"
```

---

### Task 3: Beat registry

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/beats.ts`
- Test: `apps/web/app/[locale]/learn/masterclass-28-07-2026/beats.test.ts`

**Interfaces:**
- Consumes: `StepId` from `./steps`.
- Produces: `Beat`, `BEATS`, `beatIndex`, `firstBeat`, `adjacentBeat`, `reached`, `furthestBeatOf`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, test } from "bun:test";
import {
  adjacentBeat,
  BEATS,
  beatIndex,
  firstBeat,
  furthestBeatOf,
  reached,
} from "./beats";

describe("BEATS", () => {
  test("the reading ladder comes before the reach demo", () => {
    const ids = BEATS["agentic-engineering"].map((b) => b.id);
    expect(ids.indexOf("reading")).toBeLessThan(ids.indexOf("run"));
  });

  test("era II splits into the tab and the editor", () => {
    expect(BEATS.integration.map((b) => b.id)).toEqual(["tab", "editor"]);
  });

  test("steps without beats are ungated", () => {
    expect(BEATS.completion).toEqual([]);
    expect(reached("completion", "anything", "anything", true)).toBe(true);
  });
});

describe("reached", () => {
  test("shows everything when presenter is off", () => {
    expect(reached("agentic-engineering", "meter", "loop", false)).toBe(true);
  });

  test("gates on furthest, not current", () => {
    expect(reached("agentic-engineering", "run", "reading", true)).toBe(false);
    expect(reached("agentic-engineering", "reading", "run", true)).toBe(true);
  });
});

describe("adjacentBeat", () => {
  test("returns null at the ends", () => {
    expect(adjacentBeat("integration", "tab", "prev")).toBeNull();
    expect(adjacentBeat("integration", "editor", "next")).toBeNull();
  });

  test("walks forward", () => {
    expect(adjacentBeat("integration", "tab", "next")).toBe("editor");
  });
});

describe("furthestBeatOf", () => {
  test("keeps the later of the two", () => {
    expect(furthestBeatOf("integration", "editor", "tab")).toBe("editor");
  });
});

describe("firstBeat", () => {
  test("is null where there are no beats", () => {
    expect(firstBeat("completion")).toBeNull();
    expect(firstBeat("agentic-engineering")).toBe("loop");
  });

  test("beatIndex reports -1 for an unknown id", () => {
    expect(beatIndex("integration", "nope")).toBe(-1);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd apps/web && bun test app/\[locale\]/learn/masterclass-28-07-2026/beats.test.ts`
Expected: FAIL — `Cannot find module './beats'`

- [ ] **Step 3: Write `beats.ts`**

```ts
import type { StepId } from "./steps";

export interface Beat {
  id: string;
  label: string;
}

/**
 * Presenter staging, one sequence per step. A step with no beats is never
 * gated — its demos render the moment the step does.
 *
 * The reading ladder gets one beat, not three: gates exist to stop the room
 * reading a punchline early, and three labelled year-pills spoil nothing.
 */
export const BEATS: Record<StepId, readonly Beat[]> = {
  intro: [],
  completion: [],
  integration: [
    { id: "tab", label: "a browser tab" },
    { id: "editor", label: "the chat moves in" },
  ],
  "agentic-engineering": [
    { id: "loop", label: "the loop" },
    { id: "reading", label: "where the reading went" },
    { id: "run", label: "get them green" },
    { id: "skipped", label: "what it skipped" },
    { id: "bent", label: "what it bent" },
    { id: "left", label: "what it left" },
    { id: "reached", label: "what it reached" },
    { id: "fenced", label: "out of reach" },
    { id: "parity", label: "pixel for pixel" },
    { id: "lanes", label: "three lanes" },
    { id: "meter", label: "the meter" },
  ],
  outlook: [],
  synthesis: [],
};

export function beatIndex(step: StepId, id: string): number {
  return BEATS[step].findIndex((b) => b.id === id);
}

export function firstBeat(step: StepId): string | null {
  return BEATS[step][0]?.id ?? null;
}

export function adjacentBeat(
  step: StepId,
  current: string,
  dir: "prev" | "next"
): string | null {
  const next = beatIndex(step, current) + (dir === "next" ? 1 : -1);
  return BEATS[step][next]?.id ?? null;
}

export function reached(
  step: StepId,
  target: string,
  furthest: string,
  presenter: boolean
): boolean {
  if (!presenter || BEATS[step].length === 0) {
    return true;
  }
  return beatIndex(step, furthest) >= beatIndex(step, target);
}

export function furthestBeatOf(step: StepId, a: string, b: string): string {
  return beatIndex(step, a) >= beatIndex(step, b) ? a : b;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd apps/web && bun test app/\[locale\]/learn/masterclass-28-07-2026/beats.test.ts`
Expected: PASS — 11 tests

- [ ] **Step 5: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/beats.ts" "apps/web/app/[locale]/learn/masterclass-28-07-2026/beats.test.ts"
git commit -m "feat(masterclass): one beat sequence per step"
```

---

### Task 4: Transport — hook, footer, slot, wiring

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/use-beats.ts`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/beat-footer.tsx`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/beat-slot.tsx`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/masterclass.tsx`

**Interfaces:**
- Consumes: Task 3's `beats.ts`; `getAdjacentStep` from `./steps`.
- Produces: `useBeats(step, presenter) → { current, furthest, go, has }`; `BeatFooter({ step, current, onSelect })`; `BeatSlot({ show, children })`.

- [ ] **Step 1: Write `use-beats.ts`**

```ts
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  firstBeat,
  furthestBeatOf,
  reached as beatReached,
} from "./beats";
import type { StepId } from "./steps";

/**
 * Visibility keys off `furthest`, never `current`, so stepping back to
 * re-explain something never removes a demo mid-sentence. Era I learned this
 * the hard way — see `era1-playground/disposition.ts`.
 */
export function useBeats(step: StepId, presenter: boolean) {
  const [current, setCurrent] = useState<string>(() => firstBeat(step) ?? "");
  const [furthest, setFurthest] = useState<string>(() => firstBeat(step) ?? "");

  useEffect(() => {
    const first = firstBeat(step) ?? "";
    setCurrent(first);
    setFurthest(first);
  }, [step]);

  const go = useCallback(
    (id: string) => {
      setCurrent(id);
      setFurthest((f) => furthestBeatOf(step, f, id));
    },
    [step]
  );

  const has = useCallback(
    (id: string) => beatReached(step, id, furthest, presenter),
    [step, furthest, presenter]
  );

  return { current, furthest, go, has };
}
```

- [ ] **Step 2: Write `beat-footer.tsx`**

```tsx
"use client";

import { cn } from "@repo/design-system/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { adjacentBeat, BEATS } from "./beats";
import type { StepId } from "./steps";

const CROSSFADE = { duration: 0.2 } as const;
/** Above this, numerals stop being countable at stage distance. */
const NUMERAL_LIMIT = 6;

interface BeatFooterProps {
  current: string;
  onSelect: (id: string) => void;
  step: StepId;
}

/**
 * The step-level transport, fixed to the viewport bottom because a step is now
 * taller than a screen and a document-flow footer would have to be scrolled to.
 *
 * Numerals up to six, grouped ticks beyond: eleven numerals read as a smear
 * from the back wall, where "third cluster, second tick" still reads. The
 * label sits in a reserved slot and crossfades in place — the numerals never
 * move, the same fixed-geometry rule `PhaseFooter` documents.
 */
export function BeatFooter({ current, onSelect, step }: BeatFooterProps) {
  const beats = BEATS[step];
  if (beats.length === 0) {
    return null;
  }
  const index = beats.findIndex((b) => b.id === current);
  const prev = adjacentBeat(step, current, "prev");
  const next = adjacentBeat(step, current, "next");
  const numerals = beats.length <= NUMERAL_LIMIT;

  return (
    <nav
      aria-label="Presentation beats"
      className="fixed inset-x-0 bottom-0 z-40 flex h-[4.5rem] flex-col items-center justify-center gap-1.5 border-foreground/10 border-t bg-background/95 px-2 backdrop-blur sm:px-4"
    >
      <div className="flex items-center gap-2">
        <button
          aria-label="Previous beat"
          className="shrink-0 rounded px-2 font-mono text-muted-foreground text-sm transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
          disabled={prev === null}
          onClick={() => prev && onSelect(prev)}
          type="button"
        >
          ←
        </button>

        <div className="flex items-center gap-2">
          {beats.map((b, i) => {
            const active = b.id === current;
            const gap = !numerals && i > 0 && b.id === "parity";
            return (
              <button
                aria-current={active ? "step" : undefined}
                aria-label={b.label}
                className={cn(
                  numerals
                    ? "flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-xs tabular-nums transition-colors"
                    : "h-2.5 w-2.5 shrink-0 rounded-[2px] transition-colors",
                  gap && "ml-3",
                  active
                    ? "bg-foreground text-background"
                    : numerals
                      ? "border border-foreground/20 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                      : "bg-foreground/20 hover:bg-foreground/40"
                )}
                key={b.id}
                onClick={() => onSelect(b.id)}
                type="button"
              >
                {numerals ? i + 1 : null}
              </button>
            );
          })}
        </div>

        <button
          aria-label="Next beat"
          className="shrink-0 rounded px-2 font-mono text-muted-foreground text-sm transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
          disabled={next === null}
          onClick={() => next && onSelect(next)}
          type="button"
        >
          →
        </button>
      </div>

      <div className="flex h-5 items-center">
        <AnimatePresence mode="wait">
          <motion.span
            animate={{ opacity: 1 }}
            className="whitespace-nowrap font-mono text-foreground text-xs"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key={current}
            transition={CROSSFADE}
          >
            {beats[index]?.label ?? ""}
          </motion.span>
        </AnimatePresence>
      </div>
    </nav>
  );
}
```

Note the tick grouping is driven by one explicit id (`parity`) rather than a computed grouping table — the only visual break the eleven-beat rail needs is between the reach demo and the demos after it.

- [ ] **Step 3: Write `beat-slot.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";

/**
 * Renders its children once their beat is reached, and pulls them into view the
 * first time. Without the scroll, every reveal that lands below the fold is a
 * fumble on stage.
 */
export function BeatSlot({
  children,
  show,
}: {
  children: React.ReactNode;
  show: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const focused = useRef(false);

  useEffect(() => {
    if (!show || focused.current || !ref.current) {
      return;
    }
    focused.current = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    ref.current.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "center",
    });
  }, [show]);

  if (!show) {
    return null;
  }
  return <div ref={ref}>{children}</div>;
}
```

- [ ] **Step 4: Wire `masterclass.tsx`**

Add imports:

```tsx
import { BeatFooter } from "./beat-footer";
import { BeatSlot } from "./beat-slot";
import { useBeats } from "./use-beats";
import { adjacentBeat } from "./beats";
```

Inside `Masterclass`, after the `presenter` state:

```tsx
const { current: beat, go: goBeat, has } = useBeats(step, presenter);
```

Replace the arrow-key branch of the `onKeyDown` handler (currently `masterclass.tsx:69-76`) with:

```tsx
const dir = stepKeyDirection(event);
if (!dir || isArrowConsumingTarget(event.target)) {
  return;
}
// One key for the whole talk: exhaust the step's beats, then move on.
if (presenter) {
  const nextBeat = adjacentBeat(step, beat, dir);
  if (nextBeat) {
    goBeat(nextBeat);
    return;
  }
}
const adjacent = getAdjacentStep(step, dir);
if (adjacent) {
  setStep(adjacent);
}
```

and add `beat`, `goBeat` to that `useEffect`'s dependency array.

Wrap Era II's children:

```tsx
<BeatSlot show={has("tab")}>
  <Era2Extraction />
</BeatSlot>
<BeatSlot show={has("editor")}>
  <p className="mb-4 max-w-2xl text-muted-foreground text-sm">
    Then the chat moved into the editor, and your selection became its
    context — no more ferrying. This is the Cursor moment. Watch what it
    still couldn&apos;t see:
  </p>
  <Era2Companion />
</BeatSlot>
```

Wrap Era III's children (`Era3Reach` stays ungated until Task 5):

```tsx
<BeatSlot show={has("loop")}>
  <Era3Loop />
</BeatSlot>
<BeatSlot show={has("reading")}>
  <Era3Ladder />
</BeatSlot>
<BeatSlot show={has("run")}>
  <Era3Reach />
</BeatSlot>
<BeatSlot show={has("parity")}>
  <p className="mt-10 mb-4 max-w-2xl text-muted-foreground text-sm">
    I don&apos;t write Playwright. I can say what pixel for pixel means, and
    I can tell when the answer is wrong. The agent wrote the measuring tool;
    I wrote the rule it measures against — a client&apos;s WordPress site,
    rebuilt in Next.js:
  </p>
  <Era3Harness />
</BeatSlot>
<BeatSlot show={has("lanes")}>
  <Era3Pipeline />
</BeatSlot>
<BeatSlot show={has("meter")}>
  <Era3Meter />
</BeatSlot>
```

Render the footer and reserve space for it, replacing the closing `</div>` region:

```tsx
      {presenter && (
        <BeatFooter current={beat} onSelect={goBeat} step={step} />
      )}
      {presenter && BEATS[step].length > 0 && <div className="h-[4.5rem]" />}
    </div>
```

(import `BEATS` alongside `adjacentBeat`.)

- [ ] **Step 5: Typecheck, lint, full test run**

Run: `cd apps/web && bunx tsc --noEmit && bun test`, then `bun run check` from repo root.
Expected: no type errors; 153 tests passing (142 baseline + 7 from Task 1 + 11 from Task 3, minus none).

- [ ] **Step 6: Verify in the browser**

Open `?step=integration&presenter=1`. Confirm: only the ChatGPT/editor pair is visible; `→` reveals the docked-chat demo and scrolls it into view; `←` does **not** remove it. Then `?step=agentic-engineering&presenter=1`: six numbered stops render as ticks, `→` at `meter` advances to the outlook step. Confirm `?step=completion&presenter=1` is unchanged — Era I still shows its own `PhaseFooter` and no `BeatFooter`.

- [ ] **Step 7: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/"
git commit -m "feat(masterclass): a transport that walks the whole step"
```

---

### Task 5: Gate the reach demo's four reveals

**Files:**
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/masterclass.tsx`

**Interfaces:**
- Consumes: `has` from `useBeats`; `Era3Reach`'s `revealed`/`fenced` props from Task 2.
- Produces: nothing new.

- [ ] **Step 1: Compute the reveal count from the beats**

In `Masterclass`, above the return:

```tsx
// The reach demo's four rows are beats in their own right; `fenced` fills the
// second column once all four are up.
const REACH_BEATS = ["skipped", "bent", "left", "reached"] as const;
const reachRevealed = presenter
  ? REACH_BEATS.filter((id) => has(id)).length
  : undefined;
const reachFenced = presenter ? has("fenced") : undefined;
```

- [ ] **Step 2: Pass them down**

```tsx
<BeatSlot show={has("run")}>
  <Era3Reach fenced={reachFenced} revealed={reachRevealed} />
</BeatSlot>
```

- [ ] **Step 3: Typecheck and full test run**

Run: `cd apps/web && bunx tsc --noEmit && bun test`
Expected: no type errors; 153 passing.

- [ ] **Step 4: Verify in the browser**

`?step=agentic-engineering&presenter=1`, then `→` eleven times. Confirm at each stop: beat 3 prints the transcript and stops at `done.`; beats 4–7 add exactly one row each; beat 7 turns the `TRUNCATE` line amber **without the transcript re-rendering or shifting**; beat 8 adds the right-hand column to all four rows at once plus the verdict; beats 9–11 add the remaining demos. Then reload without `presenter` and confirm the button reveals everything at once.

- [ ] **Step 5: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/masterclass.tsx"
git commit -m "feat(masterclass): walk the four failures one at a time"
```

---

## Deferred to after the presentation

- Fold `era1-playground/phase-footer.tsx` into `BeatFooter` and move Era I's four phases into `BEATS.completion`. Era I is verified and green; it is not being touched the night before the talk.
- `era3-reach` has no session store, so stepping away and back replays the transcript. Era I solved this with `session-store.ts`; apply the same pattern if it proves annoying on stage.

## Self-review

- **Spec coverage:** transport (Tasks 3–4), Era II beats (Task 4), Era III reorder + interstitial (Task 2), reach demo frame/transcript/reveals/annotation/verdict (Tasks 1–2), internal gating (Task 5), build order preserved as task order. Every spec section maps to a task.
- **Placeholders:** none — all copy is literal and all code is complete.
- **Type consistency:** `reached` is exported from both `beats.ts` and `era1-playground/phases.ts`; `use-beats.ts` imports it aliased as `beatReached` to avoid the collision. `Era3Reach`'s props are optional in Task 2 and supplied in Task 5, so Task 2 compiles standalone. `REVEALS.length` (4) is the single source for the reveal count; `REACH_BEATS` in Task 5 lists the same four ids and must stay in step with `reveals.ts`.
