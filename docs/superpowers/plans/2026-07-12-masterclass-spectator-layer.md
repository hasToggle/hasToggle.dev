# Masterclass Spectator Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the spectator layer to the four-eras masterclass exhibit — rebuilt Intro (field report), Era I misconception setup, Era III reading ladder + pipeline board, field notes, placard normalization, and the Synthesis confession — per `docs/superpowers/specs/2026-07-12-masterclass-spectator-layer-design.md`.

**Architecture:** All work lives inside `apps/web/app/[locale]/learn/masterclass-28-07-2026/`. New beats follow the existing demo pattern: a folder with `index.tsx` + logic in plain `.ts` files with colocated Bun tests. The only new state machine is the pipeline-board reducer (same weight class as the existing `era3-harness/reducer.ts`). Everything is offline, deterministic, and reduced-motion safe.

**Tech Stack:** Next.js 16 / React 19 client components, Tailwind 4, Bun test runner, `@repo/design-system` primitives, `cn` from `@repo/design-system/lib/utils`.

## Global Constraints

- **Offline/deterministic:** no network calls, no `Math.random`, no wall-clock dependence. Timers are fixed-interval `setInterval` like the existing demos.
- **Reduced motion:** every animated beat checks `window.matchMedia("(prefers-reduced-motion: reduce)").matches` and jumps to end-states — but never removes *interaction gates* (clicks the visitor must make still wait for them).
- **Arena rule:** code stays code. Translation copy sits beside artifacts (placards, field notes), never inside them.
- **Verbatim copy:** the 2024 ladder line MUST contain the exact phrase `like a literature student`.
- **Four eras:** no new steps in `steps.ts`. The stepper is untouched.
- **Existing Era III harness demo stays untouched** — new beats are appended after it.
- **Style:** match the indentation of the file you edit (`masterclass.tsx` and `steps.ts` use tabs; demo files use 2 spaces; new files use 2 spaces). Mono accents via `font-mono`, house cyan via `ht-cyan-*` classes.
- **Test command:** `cd apps/web && bun test <path>` (run from repo root: `cd /Users/eric/conductor/workspaces/hasToggle.dev/banjul/apps/web`).
- **Typecheck command:** `cd apps/web && bun run typecheck`.
- **Commits:** one per task, message given in the task. End every commit message with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- All copy below is **drafted for live veto by Eric later** — implement it verbatim as written here; do not improvise alternative wording.

---

### Task 1: FieldNote component

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/field-note.tsx`

**Interfaces:**
- Produces: `FieldNote` React component — props `{ date: string; children: React.ReactNode; className?: string }`. Later tasks import it as `import { FieldNote } from "../../field-note"` (from inside a demo folder) or `"./field-note"` (from the route root).

No logic to unit-test (presentational; house pattern keeps Bun tests for `.ts` logic only). Verification is typecheck.

- [ ] **Step 1: Write the component**

```tsx
import { cn } from "@repo/design-system/lib/utils";

interface FieldNoteProps {
  children: React.ReactNode;
  className?: string;
  date: string;
}

export function FieldNote({ children, className, date }: FieldNoteProps) {
  return (
    <aside
      className={cn(
        "mt-8 max-w-2xl border-ht-cyan-700/30 border-l-2 pl-4 dark:border-ht-cyan-500/40",
        className
      )}
    >
      <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.2em]">
        field note · {date}
      </p>
      <div className="mt-2 font-mono text-foreground/70 text-sm/6">
        {children}
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `cd apps/web && bun run typecheck`
Expected: exit 0 (no errors).

- [ ] **Step 3: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/field-note.tsx"
git commit -m "feat(masterclass): add FieldNote content type

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Reading-ladder stage data (TDD)

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era3-ladder/stages.ts`
- Test: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era3-ladder/stages.test.ts`

**Interfaces:**
- Produces: `LadderStage` type and `LADDER_STAGES: readonly LadderStage[]` (exactly 3 entries, chronological). Task 3's component consumes them. The 2024 artifact is a diff over the **same feature Era II's demo fixes by hand** (`validateDiscount`) — the ladder deliberately reviews that feature at three altitudes.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, test } from "bun:test";
import { LADDER_STAGES } from "./stages";

describe("LADDER_STAGES", () => {
  test("has exactly three chronological stages", () => {
    expect(LADDER_STAGES.length).toBe(3);
    expect(LADDER_STAGES.map((s) => s.year)).toEqual(["2024", "2025", "2026"]);
  });

  test("2024 keeps the literature-student line verbatim", () => {
    expect(LADDER_STAGES[0].line).toContain("like a literature student");
  });

  test("each stage shows a distinct artifact kind", () => {
    expect(LADDER_STAGES.map((s) => s.artifact)).toEqual([
      "diff",
      "plan",
      "design",
    ]);
  });

  test("the reading visibly shrinks: artifact body lines decrease", () => {
    const [a, b, c] = LADDER_STAGES;
    expect(a.body.length).toBeGreaterThan(b.body.length);
    expect(b.body.length).toBeGreaterThan(c.body.length);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/web && bun test demos/era3-ladder/stages.test.ts`
(Bun resolves test paths from anywhere under the package; if the path isn't picked up, run `bun test stages.test.ts`.)
Expected: FAIL — cannot resolve `./stages`.

- [ ] **Step 3: Write the data**

```ts
export interface LadderStage {
  artifact: "diff" | "plan" | "design";
  /** the artifact's rendered lines (mono) */
  body: readonly string[];
  line: string;
  read: string;
  year: "2024" | "2025" | "2026";
}

export const LADDER_STAGES: readonly LadderStage[] = [
  {
    year: "2024",
    artifact: "diff",
    read: "I read the code.",
    line: "Plan mode, then a wall of diffs. I read every generated line like a literature student. I have a literature degree. I did not expect to use it on diffs.",
    body: [
      "+ import { validateDiscount } from './validation';",
      "+",
      "+ export function applyDiscount(cart, code) {",
      "+   const result = validateDiscount(code);",
      "+   if (!result.valid) {",
      "+     return { ...cart, discount: 0, warning: result.reason };",
      "+   }",
      "+   return { ...cart, discount: result.amount };",
      "+ }",
      "- export function applyDiscount(cart, code) {",
      "-   return { ...cart, discount: DISCOUNTS[code] };",
      "- }",
      "+ export function validateDiscount(code) {",
      "+   if (typeof code !== 'string' || code.length === 0) {",
      "+     return { valid: false, reason: 'empty code' };",
      "+   }",
      "+   const known = DISCOUNTS[code.toUpperCase()];",
      "+   if (known === undefined) {",
      "+     return { valid: false, reason: 'unknown code' };",
      "+   }",
      "+   return { valid: true, amount: known };",
      "+ }",
      "+ describe('validateDiscount', () => {",
      "+   test('rejects an unknown code', () => { … });",
      "+   test('rejects an empty code', () => { … });",
      "+   test('accepts a known code', () => { … });",
      "+ });",
      "  // …214 more lines",
    ],
    },
  {
    year: "2025",
    artifact: "plan",
    read: "I read the plan.",
    line: "The design was mine; Claude wrote the implementation plan. I reviewed intentions, not artifacts.",
    body: [
      "1. Extract validation into validateDiscount(code)",
      "2. Unknown / empty codes fail soft — cart survives, warning attached",
      "3. Wire into applyDiscount; never throw at checkout",
      "4. Tests first: unknown, empty, known, case-insensitive",
      "5. Migrate call sites; delete the naked DISCOUNTS lookup",
    ],
  },
  {
    year: "2026",
    artifact: "design",
    read: "I read the design. Tests read the code.",
    line: "I plan the design. Claude writes the implementation plan. TDD runs the execution — tests read the code, I don't.",
    body: [
      "Design: a discount code a customer mistypes must never",
      "break checkout. Validation owns that guarantee; tests own",
      "the proof.",
    ],
  },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd apps/web && bun test demos/era3-ladder/stages.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era3-ladder/"
git commit -m "feat(masterclass): add reading-ladder stage data

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Reading-ladder component + Era III wiring

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era3-ladder/index.tsx`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/masterclass.tsx` (era-3 children)

**Interfaces:**
- Consumes: `LADDER_STAGES`, `LadderStage` from `./stages` (Task 2).
- Produces: `Era3Ladder` component (no props). Wired after `<Era3Harness />`.

- [ ] **Step 1: Write the component**

The 2026 tab has a deterministic test-runner beat: five test rows flip red ✗ → green ✓ one at a time (fixed interval), instantly all-green under reduced motion. Tab switching resets it.

```tsx
"use client";

import { cn } from "@repo/design-system/lib/utils";
import { useEffect, useState } from "react";
import { LADDER_STAGES, type LadderStage } from "./stages";

const RUNNER_TESTS = [
  "validateDiscount › rejects an unknown code",
  "validateDiscount › rejects an empty code",
  "validateDiscount › accepts a known code",
  "validateDiscount › is case-insensitive",
  "applyDiscount › never throws at checkout",
] as const;
const RUNNER_MS = 450;

export function Era3Ladder() {
  const [year, setYear] = useState<LadderStage["year"]>("2024");
  const stage =
    LADDER_STAGES.find((s) => s.year === year) ?? LADDER_STAGES[0];

  return (
    <div className="mt-10 rounded-xl border border-foreground/10 p-4 sm:p-6">
      <p className="font-medium text-sm">Where did the reading go?</p>
      <p className="mt-1 max-w-2xl text-muted-foreground text-sm">
        The same feature — the discount validation you fixed by hand one room
        ago — reviewed at three altitudes.
      </p>

      <div className="mt-4 flex gap-2">
        {LADDER_STAGES.map((s) => (
          <button
            className={cn(
              "rounded-full border px-3 py-1 font-mono text-xs",
              s.year === year
                ? "border-ht-cyan-500 text-foreground"
                : "border-foreground/15 text-muted-foreground hover:text-foreground"
            )}
            key={s.year}
            onClick={() => setYear(s.year)}
            type="button"
          >
            {s.year} · {s.read}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-foreground/10 bg-muted/40 p-4">
        {stage.artifact === "diff" && (
          <pre className="max-h-44 overflow-y-auto font-mono text-xs leading-5">
            {stage.body.map((l, i) => (
              <div
                className={
                  l.startsWith("+")
                    ? "text-emerald-700 dark:text-emerald-400"
                    : l.startsWith("-")
                      ? "text-red-700 dark:text-red-400"
                      : "text-muted-foreground"
                }
                key={`${i}-${l}`}
              >
                {l}
              </div>
            ))}
          </pre>
        )}
        {stage.artifact === "plan" && (
          <ol className="list-decimal space-y-1 pl-5 font-mono text-xs leading-6">
            {stage.body.map((l) => (
              <li key={l}>{l.replace(/^\d+\.\s*/, "")}</li>
            ))}
          </ol>
        )}
        {stage.artifact === "design" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <p className="font-mono text-xs leading-6">
              {stage.body.join(" ")}
            </p>
            <TestRunner key={year} />
          </div>
        )}
      </div>

      <p className="mt-3 max-w-2xl text-foreground/55 text-sm italic">
        {stage.line}
      </p>
    </div>
  );
}

function TestRunner() {
  const [passed, setPassed] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      setPassed(RUNNER_TESTS.length);
      return;
    }
    const id = setInterval(() => {
      setPassed((p) => {
        if (p >= RUNNER_TESTS.length) {
          clearInterval(id);
          return p;
        }
        return p + 1;
      });
    }, RUNNER_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-md bg-[#0d1117] p-3 font-mono text-xs leading-6">
      {RUNNER_TESTS.map((t, i) => (
        <div
          className={i < passed ? "text-[#3fb950]" : "text-[#e5707e]"}
          key={t}
        >
          {i < passed ? "✓" : "✗"} {t}
        </div>
      ))}
      <div className="mt-1 text-[#8b949e]">
        {passed === RUNNER_TESTS.length
          ? `${RUNNER_TESTS.length} passed — nobody read the code.`
          : "running…"}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire into Era III**

In `masterclass.tsx` (tab-indented file — keep tabs):
add the import next to the other demo imports:

```tsx
import { Era3Ladder } from "./demos/era3-ladder";
```

and change the era-3 `EraPanel` children from:

```tsx
							>
								<Era3Harness />
							</EraPanel>
```

to:

```tsx
							>
								<Era3Harness />
								<Era3Ladder />
							</EraPanel>
```

- [ ] **Step 3: Verify**

Run: `cd apps/web && bun test && bun run typecheck`
Expected: all existing tests + Task 2 tests PASS; typecheck exit 0.

- [ ] **Step 4: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/"
git commit -m "feat(masterclass): add reading-ladder beat to Era III

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Pipeline-board reducer (TDD)

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era3-pipeline/reducer.ts`
- Test: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era3-pipeline/reducer.test.ts`

**Interfaces:**
- Produces (Task 5 consumes exactly these):

```ts
type LaneId = "rag" | "wp" | "deps";
type LanePhase = "plan" | "execute" | "validate" | "awaiting-signature" | "done";
interface LaneState { phase: LanePhase; ticksInPhase: number }
interface BoardState { lanes: Record<LaneId, LaneState> }
type BoardAction =
  | { type: "tick" } | { type: "handOff" } | { type: "approveMerge" }
  | { type: "fastForward" } | { type: "reset" };
initialBoardState(): BoardState
boardReducer(state: BoardState, action: BoardAction): BoardState
attentionTarget(state: BoardState): "rag-plan" | "deps-signature" | null
isSettled(state: BoardState): boolean   // no auto-advance pending (gates/done only)
isBoardDone(state: BoardState): boolean
EXECUTE_TICKS = 4; VALIDATE_TICKS = 2
```

**Machine rules:**
- Initial: `rag` in `plan` (gate), `wp` in `execute` (already running on mount), `deps` in `execute`.
- On `tick`, every lane advances `ticksInPhase`; `execute` → `validate` after `EXECUTE_TICKS`; `validate` → `done` after `VALIDATE_TICKS` — **except `deps`, whose `validate` exits to `awaiting-signature`** (a gate that never auto-advances: every PR is reviewed).
- `plan` and `awaiting-signature` never advance on tick. `done` is terminal.
- `handOff`: only when `rag.phase === "plan"` → `rag` enters `execute`; otherwise no-op.
- `approveMerge`: only when `deps.phase === "awaiting-signature"` → `deps` enters `done`; otherwise no-op.
- `fastForward`: applies `tick` repeatedly until `isSettled` (used for reduced motion). Gates still hold.
- `reset`: back to initial.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, test } from "bun:test";
import {
  attentionTarget,
  boardReducer,
  type BoardState,
  EXECUTE_TICKS,
  initialBoardState,
  isBoardDone,
  isSettled,
  VALIDATE_TICKS,
} from "./reducer";

const tick = (s: BoardState, n = 1) => {
  let next = s;
  for (let i = 0; i < n; i += 1) {
    next = boardReducer(next, { type: "tick" });
  }
  return next;
};
const AUTO_TICKS = EXECUTE_TICKS + VALIDATE_TICKS;

describe("initial board", () => {
  test("rag plans, wp and deps are already executing", () => {
    const s = initialBoardState();
    expect(s.lanes.rag.phase).toBe("plan");
    expect(s.lanes.wp.phase).toBe("execute");
    expect(s.lanes.deps.phase).toBe("execute");
  });

  test("attention starts at the rag plan gate", () => {
    expect(attentionTarget(initialBoardState())).toBe("rag-plan");
  });
});

describe("automatic lanes", () => {
  test("wp reaches done without any click", () => {
    const s = tick(initialBoardState(), AUTO_TICKS);
    expect(s.lanes.wp.phase).toBe("done");
  });

  test("deps parks at awaiting-signature and never auto-merges", () => {
    const s = tick(initialBoardState(), AUTO_TICKS + 20);
    expect(s.lanes.deps.phase).toBe("awaiting-signature");
  });

  test("rag never leaves plan without the hand-off click", () => {
    const s = tick(initialBoardState(), 50);
    expect(s.lanes.rag.phase).toBe("plan");
  });
});

describe("gates", () => {
  test("handOff moves rag into execute, then ticks carry it to done", () => {
    let s = boardReducer(initialBoardState(), { type: "handOff" });
    expect(s.lanes.rag.phase).toBe("execute");
    s = tick(s, AUTO_TICKS);
    expect(s.lanes.rag.phase).toBe("done");
  });

  test("approveMerge is a no-op until deps awaits a signature", () => {
    const early = boardReducer(initialBoardState(), { type: "approveMerge" });
    expect(early.lanes.deps.phase).toBe("execute");
    const parked = tick(initialBoardState(), AUTO_TICKS);
    const merged = boardReducer(parked, { type: "approveMerge" });
    expect(merged.lanes.deps.phase).toBe("done");
  });
});

describe("attention + completion", () => {
  test("attention moves to the deps signature once rag is handed off", () => {
    let s = boardReducer(initialBoardState(), { type: "handOff" });
    s = tick(s, AUTO_TICKS);
    expect(attentionTarget(s)).toBe("deps-signature");
  });

  test("board completes only after both clicks and all ticks", () => {
    let s = boardReducer(initialBoardState(), { type: "handOff" });
    s = tick(s, AUTO_TICKS);
    expect(isBoardDone(s)).toBe(false);
    s = boardReducer(s, { type: "approveMerge" });
    expect(isBoardDone(s)).toBe(true);
    expect(attentionTarget(s)).toBe(null);
  });
});

describe("fastForward and reset", () => {
  test("fastForward settles the board but holds every gate", () => {
    const s = boardReducer(initialBoardState(), { type: "fastForward" });
    expect(isSettled(s)).toBe(true);
    expect(s.lanes.rag.phase).toBe("plan");
    expect(s.lanes.wp.phase).toBe("done");
    expect(s.lanes.deps.phase).toBe("awaiting-signature");
  });

  test("reset returns to the initial state", () => {
    let s = boardReducer(initialBoardState(), { type: "fastForward" });
    s = boardReducer(s, { type: "reset" });
    expect(s).toEqual(initialBoardState());
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/web && bun test demos/era3-pipeline/reducer.test.ts`
Expected: FAIL — cannot resolve `./reducer`.

- [ ] **Step 3: Write the reducer**

```ts
export type LaneId = "rag" | "wp" | "deps";

export type LanePhase =
  | "plan"
  | "execute"
  | "validate"
  | "awaiting-signature"
  | "done";

export interface LaneState {
  phase: LanePhase;
  ticksInPhase: number;
}

export interface BoardState {
  lanes: Record<LaneId, LaneState>;
}

export type BoardAction =
  | { type: "tick" }
  | { type: "handOff" }
  | { type: "approveMerge" }
  | { type: "fastForward" }
  | { type: "reset" };

export const EXECUTE_TICKS = 4;
export const VALIDATE_TICKS = 2;

const LANE_IDS: readonly LaneId[] = ["rag", "wp", "deps"];

export function initialBoardState(): BoardState {
  return {
    lanes: {
      rag: { phase: "plan", ticksInPhase: 0 },
      wp: { phase: "execute", ticksInPhase: 0 },
      deps: { phase: "execute", ticksInPhase: 0 },
    },
  };
}

function tickLane(id: LaneId, lane: LaneState): LaneState {
  if (
    lane.phase === "plan" ||
    lane.phase === "awaiting-signature" ||
    lane.phase === "done"
  ) {
    return lane;
  }
  const ticks = lane.ticksInPhase + 1;
  if (lane.phase === "execute") {
    return ticks >= EXECUTE_TICKS
      ? { phase: "validate", ticksInPhase: 0 }
      : { phase: "execute", ticksInPhase: ticks };
  }
  // validate
  if (ticks >= VALIDATE_TICKS) {
    return id === "deps"
      ? { phase: "awaiting-signature", ticksInPhase: 0 }
      : { phase: "done", ticksInPhase: 0 };
  }
  return { phase: "validate", ticksInPhase: ticks };
}

function tickBoard(state: BoardState): BoardState {
  return {
    lanes: {
      rag: tickLane("rag", state.lanes.rag),
      wp: tickLane("wp", state.lanes.wp),
      deps: tickLane("deps", state.lanes.deps),
    },
  };
}

export function isSettled(state: BoardState): boolean {
  return LANE_IDS.every((id) => {
    const { phase } = state.lanes[id];
    return (
      phase === "plan" || phase === "awaiting-signature" || phase === "done"
    );
  });
}

export function isBoardDone(state: BoardState): boolean {
  return LANE_IDS.every((id) => state.lanes[id].phase === "done");
}

export function attentionTarget(
  state: BoardState
): "rag-plan" | "deps-signature" | null {
  if (state.lanes.rag.phase === "plan") {
    return "rag-plan";
  }
  if (state.lanes.deps.phase === "awaiting-signature") {
    return "deps-signature";
  }
  return null;
}

export function boardReducer(
  state: BoardState,
  action: BoardAction
): BoardState {
  switch (action.type) {
    case "tick":
      return tickBoard(state);
    case "handOff":
      if (state.lanes.rag.phase !== "plan") {
        return state;
      }
      return {
        lanes: {
          ...state.lanes,
          rag: { phase: "execute", ticksInPhase: 0 },
        },
      };
    case "approveMerge":
      if (state.lanes.deps.phase !== "awaiting-signature") {
        return state;
      }
      return {
        lanes: {
          ...state.lanes,
          deps: { phase: "done", ticksInPhase: 0 },
        },
      };
    case "fastForward": {
      let next = state;
      while (!isSettled(next)) {
        next = tickBoard(next);
      }
      return next;
    }
    case "reset":
      return initialBoardState();
    default:
      return state;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd apps/web && bun test demos/era3-pipeline/reducer.test.ts`
Expected: PASS (10 tests).

- [ ] **Step 5: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era3-pipeline/"
git commit -m "feat(masterclass): add pipeline-board reducer

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Pipeline-board UI + Era III wiring + Era III field note

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era3-pipeline/lanes.ts`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era3-pipeline/index.tsx`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/masterclass.tsx` (era-3 children)

**Interfaces:**
- Consumes: everything Task 4 produces; `FieldNote` from Task 1.
- Produces: `Era3Pipeline` component (no props).

- [ ] **Step 1: Write the lane metadata**

`lanes.ts`:

```ts
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
    id: "rag",
    plain: "A fairer job search — same query, same results, whoever's asking",
    mono: "rag-retrieval · bias-evals",
    court: "evals",
    tense: "present — you plan this one",
  },
  {
    id: "wp",
    plain: "Rebuilding a site, pixel for pixel — the demo above",
    mono: "wp-next · parity-harness",
    court: "parity harness",
    tense: "past — you already planned it",
  },
  {
    id: "deps",
    plain: "Every library kept current, on a schedule",
    mono: "deps · eve agent",
    court: "CI + your signature",
    tense: "permanent — planned once, runs weekly",
  },
];
```

- [ ] **Step 2: Write the board component**

`index.tsx`. Layout: one row per lane; each row = labels block + three phase cells (`plan`, `execute`, `validate`). Cell states: **future** (transparent/inactive), **active** (pulsing), **done** (check). `wp`'s validate-done cell reuses the harness's green `VALIDATED ✓` treatment. Gates render buttons: **Hand off** (rag, plan cell), **Approve merge** (deps, validate cell at `awaiting-signature`). The attention target gets a cyan ring. Interval ticks while unsettled; reduced motion dispatches `fastForward` instead (gates still wait — reduced motion never removes clicks).

```tsx
"use client";

import { cn } from "@repo/design-system/lib/utils";
import { useEffect, useReducer } from "react";
import { LANES, type LaneMeta } from "./lanes";
import {
  attentionTarget,
  boardReducer,
  type BoardState,
  initialBoardState,
  isBoardDone,
  isSettled,
  type LanePhase,
} from "./reducer";

const TICK_MS = 700;
const PHASES = ["plan", "execute", "validate"] as const;
type Column = (typeof PHASES)[number];

const PHASE_COLUMN: Record<LanePhase, Column> = {
  plan: "plan",
  execute: "execute",
  validate: "validate",
  "awaiting-signature": "validate",
  done: "validate",
};

export function Era3Pipeline() {
  const [state, dispatch] = useReducer(
    boardReducer,
    undefined,
    initialBoardState
  );

  useEffect(() => {
    if (isSettled(state)) {
      return;
    }
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      dispatch({ type: "fastForward" });
      return;
    }
    const id = setInterval(() => dispatch({ type: "tick" }), TICK_MS);
    return () => clearInterval(id);
  }, [state]);

  const target = attentionTarget(state);
  const done = isBoardDone(state);

  return (
    <div className="mt-10 rounded-xl border border-foreground/10 p-4 sm:p-6">
      <p className="font-medium text-sm">Three lanes, one week</p>
      <p className="mt-1 max-w-2xl text-muted-foreground text-sm">
        Three real streams from my board. Every lane runs plan → execute →
        validate. The board runs itself — click where it asks you.
      </p>

      <div className="mt-5 space-y-4">
        {LANES.map((lane) => (
          <LaneRow
            dispatch={dispatch}
            key={lane.id}
            lane={lane}
            state={state}
            target={target}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="max-w-2xl text-foreground/55 text-sm italic">
          {done
            ? "Notice where your clicks went. That's where the job went."
            : "Only one column ever needs you."}
        </p>
        <button
          className="shrink-0 rounded border border-foreground/15 px-3 py-1 text-muted-foreground text-xs hover:text-foreground"
          onClick={() => dispatch({ type: "reset" })}
          type="button"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function LaneRow({
  dispatch,
  lane,
  state,
  target,
}: {
  dispatch: React.Dispatch<Parameters<typeof boardReducer>[1]>;
  lane: LaneMeta;
  state: BoardState;
  target: ReturnType<typeof attentionTarget>;
}) {
  const laneState = state.lanes[lane.id];
  const activeColumn = PHASE_COLUMN[laneState.phase];

  return (
    <div className="rounded-lg border border-foreground/10 p-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-foreground/80 text-sm">{lane.plain}</p>
        <p className="font-mono text-[10px] text-muted-foreground tracking-wide">
          {lane.mono} · court: {lane.court}
        </p>
      </div>
      <p className="mt-0.5 font-mono text-[10px] text-muted-foreground/70 italic">
        {lane.tense}
      </p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {PHASES.map((column) => (
          <PhaseCell
            column={column}
            dispatch={dispatch}
            key={column}
            lane={lane}
            laneState={laneState}
            reached={PHASES.indexOf(column) <= PHASES.indexOf(activeColumn)}
            target={target}
          />
        ))}
      </div>
    </div>
  );
}

function PhaseCell({
  column,
  dispatch,
  lane,
  laneState,
  reached,
  target,
}: {
  column: Column;
  dispatch: React.Dispatch<Parameters<typeof boardReducer>[1]>;
  lane: LaneMeta;
  laneState: { phase: LanePhase };
  reached: boolean;
  target: ReturnType<typeof attentionTarget>;
}) {
  const isActive = PHASE_COLUMN[laneState.phase] === column;
  const isDone =
    laneState.phase === "done"
      ? reached
      : reached && !isActive;
  const isRagGate =
    lane.id === "rag" && column === "plan" && laneState.phase === "plan";
  const isDepsGate =
    lane.id === "deps" &&
    column === "validate" &&
    laneState.phase === "awaiting-signature";
  const isTargeted =
    (isRagGate && target === "rag-plan") ||
    (isDepsGate && target === "deps-signature");

  return (
    <div
      className={cn(
        "rounded-md border px-2 py-2 text-center font-mono text-[11px]",
        isDone && "border-foreground/10 text-muted-foreground",
        isActive && !isRagGate && !isDepsGate &&
          "animate-pulse border-ht-cyan-500/50 text-foreground",
        !reached && "border-foreground/5 text-muted-foreground/40 opacity-50",
        isTargeted && "ring-2 ring-ht-cyan-500"
      )}
    >
      {isRagGate ? (
        <button
          className="w-full rounded bg-foreground px-2 py-1 text-background"
          onClick={() => dispatch({ type: "handOff" })}
          type="button"
        >
          Hand off →
        </button>
      ) : isDepsGate ? (
        <button
          className="w-full rounded bg-foreground px-2 py-1 text-background"
          onClick={() => dispatch({ type: "approveMerge" })}
          type="button"
        >
          Approve merge ✓
        </button>
      ) : lane.id === "wp" &&
        column === "validate" &&
        laneState.phase === "done" ? (
        <span className="rounded bg-[#238636] px-2 py-0.5 text-white">
          VALIDATED ✓
        </span>
      ) : (
        <span>
          {isDone ? "✓ " : ""}
          {column}
          {lane.id === "deps" && column === "validate" && isDone
            ? " · merged"
            : ""}
        </span>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Wire into Era III with the field note**

In `masterclass.tsx` (tabs), add imports:

```tsx
import { Era3Pipeline } from "./demos/era3-pipeline";
import { FieldNote } from "./field-note";
```

and extend the era-3 children (after Task 3 they read `<Era3Harness /><Era3Ladder />`):

```tsx
							>
								<Era3Harness />
								<Era3Ladder />
								<Era3Pipeline />
								<FieldNote date="2026-07">
									I say hi to the agent at seven sharp. Not to be polite — the
									five-hour meter starts when I do. Some days the window burns
									out by ten, and I spend two hours waiting for my own tools to
									let me back in.
								</FieldNote>
							</EraPanel>
```

- [ ] **Step 4: Verify**

Run: `cd apps/web && bun test && bun run typecheck`
Expected: all tests PASS; typecheck exit 0.

- [ ] **Step 5: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/"
git commit -m "feat(masterclass): add pipeline board and Era III field note

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Era I — misconception setup, resting placard, honesty field note

**Files:**
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/index.tsx`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/masterclass.tsx` (era-1 children)

**Interfaces:**
- Consumes: `FieldNote` (Task 1). No new exports.

- [ ] **Step 1: Add the setup line**

In `era1-playground/index.tsx`, immediately inside the outer `<div className="rounded-xl …">`, **above** the prompt-chip row, add:

```tsx
      <p className="mb-4 max-w-2xl text-foreground/55 text-sm italic">
        Most of the world met these models believing they&apos;re a search
        engine with better manners. Try it — ask it a question.
      </p>
```

- [ ] **Step 2: Add the resting placard**

The question chip's punchline block stays exactly as is. Below it, add the non-question placard so every run ends with a beat:

```tsx
      {!prompt.isQuestion && shown.length > 0 && !streaming && (
        <p className="mt-4 text-foreground/55 text-sm italic">
          It isn&apos;t looking anything up. It&apos;s continuing your pattern —
          that&apos;s all it ever does.
        </p>
      )}
```

- [ ] **Step 3: Add the Era I honesty note**

In `masterclass.tsx`, era-1 children become:

```tsx
							>
								<Era1Playground />
								<FieldNote date="2019–2021">
									No notes survive from this era, because I have none: I was
									teaching juniors to write these functions by hand while a
									model autocompleted them badly. We hadn&apos;t met yet.
								</FieldNote>
							</EraPanel>
```

(`FieldNote` is already imported in `masterclass.tsx` after Task 5.)

- [ ] **Step 4: Verify**

Run: `cd apps/web && bun test && bun run typecheck`
Expected: PASS / exit 0. (`era1-playground/selector.test.ts` must still pass — logic untouched.)

- [ ] **Step 5: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/"
git commit -m "feat(masterclass): Era I misconception setup, placard, field note

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: Era IV placard

**Files:**
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era4-runtime/index.tsx`

- [ ] **Step 1: Add the post-render placard**

In the `view === "rendered"` block, after `<DashboardRenderer spec={spec} />` (inside the same wrapping `<div>`), add:

```tsx
            <p className="mt-4 text-foreground/55 text-sm italic">
              That interface didn&apos;t exist until you asked. Nothing here was
              pre-built — the question compiled it, and the next question will
              throw it away.
            </p>
```

- [ ] **Step 2: Verify**

Run: `cd apps/web && bun test && bun run typecheck`
Expected: PASS / exit 0.

- [ ] **Step 3: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era4-runtime/index.tsx"
git commit -m "feat(masterclass): add Era IV what-just-happened placard

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 8: Intro rebuild — the field report

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/rhythm-figure.tsx`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/intro.tsx` (full rewrite)

**Interfaces:**
- Produces: `RhythmFigure` component — props `{ src?: string }`; renders `null` when `src` is absent (the reserved slot; Eric's asset arrives later). When present: the image plus its fixed caption.

- [ ] **Step 1: Write the rhythm-figure slot**

`rhythm-figure.tsx`:

```tsx
export function RhythmFigure({ src }: { src?: string }) {
  if (!src) {
    return null;
  }
  return (
    <figure className="mt-10 max-w-2xl">
      {/* biome-ignore lint/performance/noImgElement: static local asset, no optimization pipeline needed */}
      <img alt="A week of work: long flat stretches labeled thinking and planning, then narrow bands where twenty parallel sessions land at once" className="w-full rounded-lg border border-foreground/10" src={src} />
      <figcaption className="mt-2 font-mono text-muted-foreground text-xs">
        A normal week. Aesop had opinions about this race — he never considered
        the turtle might employ the rabbits. The mechanism is in room III.
      </figcaption>
    </figure>
  );
}
```

- [ ] **Step 2: Rewrite the Intro**

`intro.tsx` becomes (2-space indentation, matching the current file):

```tsx
"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Heading, Subheading } from "../../components/text";
import { MetaAside } from "../../components/meta-aside";
import { RhythmFigure } from "./rhythm-figure";

const HOW_TO_WATCH = [
  "You'll walk four rooms, one era each. Everything is playable, and nothing breaks.",
  "The tech changes in every room. The vibe changes more — that arc is the real story.",
  "Go at your own pace. The page works with me on stage or without me.",
] as const;

export function Intro({ onBegin }: { onBegin: () => void }) {
  return (
    <section className="fade-in animate-in py-10 duration-300 sm:py-16">
      <Subheading>A field report · 2026-07-28</Subheading>
      <Heading
        as="h1"
        className="mt-4 text-balance text-5xl sm:text-6xl md:text-7xl"
      >
        The Four Eras of Developer–AI Interaction
      </Heading>

      <p className="mt-8 max-w-2xl text-balance text-foreground/75 text-xl leading-9">
        I&apos;m a principal engineer, and I burn through two of the largest
        Claude Code subscriptions there are — plans built so heavy professional
        users never run out. Read that as an instrument, not a boast: it tells
        you the altitude and speed this report was written at.
      </p>

      <p className="mt-4 max-w-2xl text-foreground/55 text-base leading-7">
        Your role is shifting — from writing code syntax to architecting
        AI-native ecosystems. We&apos;ll walk four eras of how that happened.
        Skepticism → guarded fascination → the trust pivot → architectural
        liberation. The model kept changing. The thing that makes the work
        yours didn&apos;t.
      </p>

      <RhythmFigure />

      <ul className="mt-8 max-w-2xl space-y-2">
        {HOW_TO_WATCH.map((line) => (
          <li
            className="flex gap-3 text-base text-foreground/70 leading-7"
            key={line}
          >
            <span
              aria-hidden="true"
              className="select-none font-mono text-muted-foreground/60"
            >
              ·
            </span>
            {line}
          </li>
        ))}
      </ul>

      <MetaAside className="mt-6 max-w-2xl">
        Engineers: the fine print under each demo is for you.
      </MetaAside>

      <Button className="mt-10" onClick={onBegin} size="lg" type="button">
        Begin →
      </Button>
    </section>
  );
}
```

- [ ] **Step 3: Verify**

Run: `cd apps/web && bun test && bun run typecheck`
Expected: PASS / exit 0.

- [ ] **Step 4: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/"
git commit -m "feat(masterclass): rebuild Intro as field report with rhythm slot

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 9: Synthesis — the exhibit confesses

**Files:**
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/synthesis.tsx`

- [ ] **Step 1: Add the confession beat**

In `synthesis.tsx`, inside the existing `space-y-5` div, **between** the "Across every era…" paragraph and the closing display line, insert:

```tsx
        <div className="rounded-xl border border-foreground/10 p-5">
          <p className="text-base text-foreground/75">
            One more thing. The page you&apos;re standing in was built by the
            process it describes: a design spec I wrote, an implementation plan
            Claude wrote, and tests that read the code so nobody had to. The
            documents are real, and dated:
          </p>
          <ul className="mt-4 space-y-1 font-mono text-muted-foreground text-xs">
            <li>docs/superpowers/specs/2026-06-29-masterclass-four-eras-design.md</li>
            <li>docs/superpowers/plans/2026-06-29-masterclass-four-eras.md</li>
            <li>apps/web/…/masterclass-28-07-2026/demos/**/*.test.ts</li>
          </ul>
          <p className="mt-4 text-foreground/55 text-sm italic">
            The exhibit is its own final exhibit.
          </p>
        </div>
```

- [ ] **Step 2: Verify**

Run: `cd apps/web && bun test && bun run typecheck`
Expected: PASS / exit 0.

- [ ] **Step 3: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/synthesis.tsx"
git commit -m "feat(masterclass): add the-exhibit-confesses beat to Synthesis

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 10: Full verification sweep

**Files:** none created; formatting fixes only if the formatter demands them.

- [ ] **Step 1: Full test suite**

Run: `cd apps/web && bun test`
Expected: every masterclass test passes — `steps.test.ts`, `era1-playground/selector.test.ts`, `era2-companion/apply.test.ts`, `era3-harness/reducer.test.ts`, `era3-ladder/stages.test.ts`, `era3-pipeline/reducer.test.ts`, `era4-runtime/*.test.ts`. Zero failures.

- [ ] **Step 2: Typecheck**

Run: `cd apps/web && bun run typecheck`
Expected: exit 0.

- [ ] **Step 3: Format/lint the touched files**

Run from repo root: `bunx biome check --write "apps/web/app/[locale]/learn/masterclass-28-07-2026/"`
Expected: exit 0 (fixes applied are fine). Known hazard: if Biome's `useSortedKeys` or the root config errors on unrelated files, scope to the masterclass directory only (as above) and do not chase root-level failures. Re-run `bun test` if any file was rewritten.

- [ ] **Step 4: Commit any formatter fallout**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/"
git diff --cached --quiet || git commit -m "chore(masterclass): formatter fixes

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Post-plan notes (not tasks)

- The rhythm graphic ships later: when Eric provides the asset, place it under `apps/web/public/` and pass its path to `<RhythmFigure src="…" />` in `intro.tsx`. The slot and caption already exist.
- All spectator-facing copy in this plan is a draft for Eric's line-by-line veto during live dev-server iteration; expect wording churn, not structural churn.
