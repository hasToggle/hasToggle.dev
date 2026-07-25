# Era I Presenter Transport Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Era I's verdict-tap transport with a presenter-mode phase footer, and make the console geometrically fixed so nothing shifts while the room is watching.

**Architecture:** Progressive disclosure becomes opt-in behind `?presenter=1` (toggled live with `Shift+P`); the default view shows every control. A pure `phases.ts` replaces the gated `stage.ts`, and a pure `disposition.ts` is the single place the two modes reconcile so no `presenter ? … : …` appears in JSX. The demo's whole state lives in one snapshot object that survives step navigation.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS 4, `motion/react`, `nuqs` for URL state, Bun test runner, Biome/ultracite.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-07-25-masterclass-era1-presenter-transport-design.md`. Read it before Task 1.
- **Working directory:** all paths below are relative to the repo root. The demo lives in `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/`. That path contains brackets — always quote it in shell commands.
- **Tests run from `apps/web`:** `cd apps/web && bun test`. Baseline at the start of this plan is **94 pass / 0 fail across 16 files**.
- **Typecheck:** `cd apps/web && bun run typecheck`.
- **Lint:** `bunx biome check --write <files>` from the repo root, on every file the task touched.
- **Cyan is reserved** for machine output and active-state marks. No cyan prose anywhere in the demo. Use `text-ht-cyan-700 dark:text-ht-cyan-300` for output, `border-ht-cyan-500` for active-state underlines.
- **"Underline = you are here"** is the house grammar, set by `stepper-header.tsx`. The phase footer and the prompt tabs both speak it.
- **`▸` is spoken for** elsewhere in the exhibit. Do not use it.
- **No verdict line may contain `//` or `▸`** — there is an existing test asserting this.
- **Commit after every task.** Messages follow the repo's existing voice: `feat(masterclass): …` / `refactor(masterclass): …`, lowercase subject, no trailing period, ending with the `Co-Authored-By: Claude <noreply@anthropic.com>` trailer.
- **Named exports only**, `interface` over `type` for object shapes, object properties sorted alphabetically (Biome's `useSortedKeys` is on — write them sorted the first time).

---

### Task 1: Per-band instruct answers, new verdict lines, and the output-height guard

The dial currently controls nothing in post-trained mode, because `instructAnswer` is one string per prompt. This task gives the instruct side its own dice, adds the two high-band verdict lines that pay it off, and introduces the constant that stops the output panel from growing.

**Files:**
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/completions.ts`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/selector.ts`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/verdicts.ts`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/selector.test.ts`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/verdicts.test.ts`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/completions.test.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces:
  - `PromptSeed.instructAnswers: Record<Band, string>` — replaces `instructAnswer: string`.
  - `OUTPUT_LINES: number` and `OUTPUT_COLUMNS: number` exported from `completions.ts`, re-exported from `selector.ts`.
  - `selectCompletion(id: string, temp: number, mode?: Mode): string` — signature unchanged, now band-sensitive in both modes.
  - `verdictFor({ band, isQuestion, mode }): string` — signature unchanged, now band-sensitive in instruct mode.

- [ ] **Step 1: Write the failing guard test for output geometry**

Create `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/completions.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import { OUTPUT_COLUMNS, OUTPUT_LINES, PROMPTS } from "./completions";
import { type Band, bandFor } from "./selector";

const BANDS: Band[] = ["low", "mid", "high"];

/** Every string the output panel can ever be asked to render. */
function everyRendering(): string[] {
  const out: string[] = [];
  for (const prompt of PROMPTS) {
    for (const band of BANDS) {
      out.push(prompt.prefix + prompt.continuations[band]);
      out.push(prompt.prefix + prompt.instructAnswers[band]);
    }
  }
  return out;
}

describe("era1 output geometry", () => {
  test("no rendering exceeds the reserved line count", () => {
    for (const text of everyRendering()) {
      expect(text.split("\n").length).toBeLessThanOrEqual(OUTPUT_LINES);
    }
  });

  test("no line is wide enough to wrap into a second one", () => {
    for (const text of everyRendering()) {
      for (const line of text.split("\n")) {
        expect(line.length).toBeLessThanOrEqual(OUTPUT_COLUMNS);
      }
    }
  });

  test("bandFor covers every reserved band", () => {
    expect(BANDS.map((b) => b)).toEqual(["low", "mid", "high"]);
    expect(bandFor(0.1)).toBe("low");
    expect(bandFor(0.7)).toBe("mid");
    expect(bandFor(1.4)).toBe("high");
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `cd apps/web && bun test era1-playground/completions.test.ts`
Expected: FAIL — `OUTPUT_LINES`, `OUTPUT_COLUMNS` and `instructAnswers` do not exist.

- [ ] **Step 3: Rewrite `completions.ts` with per-band instruct answers**

Replace the whole file:

```ts
import type { Band } from "./selector";

export interface PromptSeed {
  continuations: Record<Band, string>;
  id: string;
  instructAnswers: Record<Band, string>;
  isQuestion: boolean;
  label: string;
  prefix: string;
}

/**
 * The console reserves this much room so the Run button never moves when a
 * completion lands. `completions.test.ts` fails if any prefix + completion
 * would overflow either dimension — so new copy breaks the build rather than
 * quietly reintroducing the jump.
 */
export const OUTPUT_LINES = 9;
export const OUTPUT_COLUMNS = 72;

export const PROMPTS: readonly PromptSeed[] = [
  {
    continuations: {
      high: "items.reduceRight((a,b)=>[...a,b],[]);\n}\n\nconst x = 🦆; // TODO: ship it\nexport default function App(){return",
      low: "items.reverse();\n}\n\nfunction reverseList(items) {\n  return items.reverse();\n}\n",
      mid: "items.slice().reverse();\n}\n\n// reverse a string too\nfunction reverseStr(s) {\n  return s.split('')",
    },
    id: "reverse-fn",
    instructAnswers: {
      high: "items.slice().reverse();\n}\n\n// slice() copies first — the original survives. reverse() alone\n// would not. Newer runtimes have toReversed(), which copies for you.\n// Whether you needed a reversed copy is a separate question entirely.",
      low: "items.slice().reverse();\n}\n\n// slice() copies first, so the original array is untouched.",
      mid: "items.slice().reverse();\n}\n\n// slice() copies the array first, so the original is left untouched.\n// reverse() on its own would mutate it in place.",
    },
    isQuestion: false,
    label: "a half-written function",
    prefix: "function reverseList(items) {\n  return ",
  },
  {
    continuations: {
      high: "// how do I reverse time? how do I reverse a decision?\n// what is a list, really? who is asking?\n",
      low: "// how do I sort a list in JavaScript?\n// how do I filter a list in JavaScript?\n// how do I",
      mid: "// and how do I do it without mutating the original?\n// is reverse() stable?\n// why does this matter?\n",
    },
    id: "how-do-i",
    instructAnswers: {
      high: "Copy it first, then reverse:\n\nconst reversed = items.slice().reverse();\n\nreverse() alone mutates in place. If your runtime is recent enough,\ntoReversed() does the copying for you. And if the list is large\nenough to worry about, you probably wanted an iterator instead.",
      low: "Use slice() to copy the array, then reverse():\n\nconst reversed = items.slice().reverse();\n\nCalling reverse() alone would mutate the original.",
      mid: "Copy the array first, then reverse it:\n\nconst reversed = items.slice().reverse();\n\nreverse() on its own mutates the array in place, which is\nrarely what you want.",
    },
    isQuestion: true,
    label: "a question",
    prefix: "// how do I reverse a list in JavaScript?\n",
  },
] as const;
```

- [ ] **Step 4: Run the guard test to verify it passes**

Run: `cd apps/web && bun test era1-playground/completions.test.ts`
Expected: PASS, 3 tests.

- [ ] **Step 5: Make `selectCompletion` read the band in both modes**

In `selector.ts`, extend the re-export line and rewrite `selectCompletion`:

```ts
import { OUTPUT_COLUMNS, OUTPUT_LINES, PROMPTS, type PromptSeed } from "./completions";
```

```ts
export type { PromptSeed };
export { OUTPUT_COLUMNS, OUTPUT_LINES, PROMPTS };
```

```ts
export function selectCompletion(
  id: string,
  temp: number,
  mode: Mode = "base"
): string {
  const prompt = PROMPTS.find((p) => p.id === id);
  if (!prompt) {
    return "";
  }
  const band = bandFor(temp);
  return mode === "instruct"
    ? prompt.instructAnswers[band]
    : prompt.continuations[band];
}
```

- [ ] **Step 6: Invert the stale selector test**

In `selector.test.ts`, **delete** the test named `"instruct output is stable across temperature"` and replace it with:

```ts
  test("instruct mode has its own dice — the band still changes the answer", () => {
    expect(selectCompletion("reverse-fn", 0.1, "instruct")).not.toBe(
      selectCompletion("reverse-fn", 1.3, "instruct")
    );
    expect(selectCompletion("how-do-i", 0.1, "instruct")).not.toBe(
      selectCompletion("how-do-i", 1.3, "instruct")
    );
  });

  test("every instruct answer answers, at every temperature", () => {
    for (const band of [0.1, 0.7, 1.4]) {
      const answer = selectCompletion("how-do-i", band, "instruct");
      expect(answer).not.toContain("how do I");
      expect(answer).toContain("slice()");
    }
  });
```

- [ ] **Step 7: Run the selector tests**

Run: `cd apps/web && bun test era1-playground/selector.test.ts`
Expected: PASS, 8 tests.

- [ ] **Step 8: Add the two high-band instruct verdicts**

In `verdicts.ts`, add two constants after `INSTRUCT_CONTINUE` and rewrite the instruct branch of `verdictFor`:

```ts
const INSTRUCT_QUESTION_HIGH =
  "The dial is still up, and it still answers — in the shape you asked for. Post-training didn't take the dice away. It made the format survive them.";

const INSTRUCT_CONTINUE_HIGH =
  "It wanders a little, and still lands the completion. The format holds at any temperature.";
```

```ts
  if (mode === "instruct") {
    if (isQuestion) {
      return band === "high" ? INSTRUCT_QUESTION_HIGH : INSTRUCT_QUESTION;
    }
    return band === "high" ? INSTRUCT_CONTINUE_HIGH : INSTRUCT_CONTINUE;
  }
```

- [ ] **Step 9: Invert the stale verdict test**

In `verdicts.test.ts`, **delete** the test named `"post-training flattened the dice, so the band stops mattering"` and replace it with:

```ts
  test("post-training did not flatten the dice — the high band still reads differently", () => {
    for (const isQuestion of [true, false]) {
      const low = verdictFor({ band: "low", isQuestion, mode: "instruct" });
      const mid = verdictFor({ band: "mid", isQuestion, mode: "instruct" });
      const high = verdictFor({ band: "high", isQuestion, mode: "instruct" });
      expect(low).toBe(mid);
      expect(high).not.toBe(mid);
    }
  });
```

- [ ] **Step 10: Run the whole suite**

Run: `cd apps/web && bun test`
Expected: PASS. Count rises from 94 to **98** (three new in `completions.test.ts`, one net new in `selector.test.ts`).

- [ ] **Step 11: Typecheck and lint**

Run: `cd apps/web && bun run typecheck`
Expected: clean.

Run from repo root:
```bash
bunx biome check --write "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/completions.ts" "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/completions.test.ts" "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/selector.ts" "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/selector.test.ts" "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/verdicts.ts" "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/verdicts.test.ts"
```
Expected: clean. **Note:** `selector.ts:1` has a pre-existing Biome finding — leave it alone, it is not part of this work.

- [ ] **Step 12: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/"
git commit -m "$(cat <<'EOF'
feat(masterclass): the post-trained model gets its own dice

The dial controlled nothing once instruct loaded, so the old design
retracted it and called that an argument. Per-band instruct answers make
it true instead: crank to 1.4, flip, and it still answers — chattier, with
an unsolicited aside, but in the shape you asked for.

Also reserves the output panel's geometry as a constant, guarded by a test,
so new copy fails loudly rather than moving the Run button.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: `phases.ts` — the ordered transport

The stage machine's gates are gone; what replaces them is a plain ordered list of four beats, each carrying the machine configuration it applies on arrival. Pure module, no React.

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/phases.ts`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/phases.test.ts`

**Interfaces:**
- Consumes: `Mode`, `PROMPTS` from `./selector` (Task 1 left both unchanged).
- Produces, for Tasks 3, 5 and 6:
  - `type PhaseId = "autocomplete" | "unanswered" | "dial" | "taught"`
  - `interface PhaseArrival { mode: Mode; promptId: string; resetTemp: boolean }`
  - `interface Phase { arrival: PhaseArrival; id: PhaseId; label: string; year?: string }`
  - `const PHASES: readonly Phase[]`
  - `const FIRST_PHASE: PhaseId`
  - `phaseFor(id: PhaseId): Phase`
  - `reached(furthest: PhaseId, target: PhaseId): boolean`
  - `furthestOf(a: PhaseId, b: PhaseId): PhaseId`
  - `adjacentPhase(id: PhaseId, dir: "prev" | "next"): PhaseId | null`

- [ ] **Step 1: Write the failing test**

Create `phases.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import {
  adjacentPhase,
  FIRST_PHASE,
  furthestOf,
  PHASES,
  phaseFor,
  reached,
} from "./phases";
import { PROMPTS } from "./selector";

describe("era1 phases", () => {
  test("four beats, in the order the presenter walks them", () => {
    expect(PHASES.map((p) => p.id)).toEqual([
      "autocomplete",
      "unanswered",
      "dial",
      "taught",
    ]);
    expect(FIRST_PHASE).toBe("autocomplete");
  });

  test("every arrival loads a prompt that actually exists", () => {
    for (const phase of PHASES) {
      expect(PROMPTS.some((p) => p.id === phase.arrival.promptId)).toBe(true);
    }
  });

  test("only the last beat loads the post-trained model", () => {
    const instruct = PHASES.filter((p) => p.arrival.mode === "instruct");
    expect(instruct.map((p) => p.id)).toEqual(["taught"]);
  });

  test("only the last beat inherits the dial — the rest park it", () => {
    const inherits = PHASES.filter((p) => !p.arrival.resetTemp);
    expect(inherits.map((p) => p.id)).toEqual(["taught"]);
  });

  test("only the beat that is a date carries a year", () => {
    const dated = PHASES.filter((p) => p.year !== undefined);
    expect(dated.map((p) => p.id)).toEqual(["taught"]);
    expect(phaseFor("taught").year).toBe("2022");
  });

  test("reached includes the phase itself and everything behind it", () => {
    expect(reached("dial", "autocomplete")).toBe(true);
    expect(reached("dial", "dial")).toBe(true);
    expect(reached("dial", "taught")).toBe(false);
  });

  test("furthestOf never goes backwards", () => {
    expect(furthestOf("dial", "autocomplete")).toBe("dial");
    expect(furthestOf("autocomplete", "dial")).toBe("dial");
    expect(furthestOf("taught", "taught")).toBe("taught");
  });

  test("the arrows stop at the ends", () => {
    expect(adjacentPhase("autocomplete", "prev")).toBeNull();
    expect(adjacentPhase("autocomplete", "next")).toBe("unanswered");
    expect(adjacentPhase("taught", "next")).toBeNull();
    expect(adjacentPhase("taught", "prev")).toBe("dial");
  });

  test("labels stay out of the engineers' register", () => {
    for (const phase of PHASES) {
      expect(phase.label).not.toContain("//");
      expect(phase.label).not.toContain("▸");
    }
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `cd apps/web && bun test era1-playground/phases.test.ts`
Expected: FAIL — `Cannot find module './phases'`.

- [ ] **Step 3: Write `phases.ts`**

```ts
import type { Mode } from "./selector";

export type PhaseId = "autocomplete" | "unanswered" | "dial" | "taught";

export interface PhaseArrival {
  mode: Mode;
  promptId: string;
  /** Beats before the flip park the dial; the flip inherits wherever it is. */
  resetTemp: boolean;
}

export interface Phase {
  arrival: PhaseArrival;
  id: PhaseId;
  label: string;
  /** Rides inline before the label. Only the beat that *is* a date has one. */
  year?: string;
}

/**
 * The four beats, in the order the presenter walks them. Arriving at a phase
 * configures the machine and stops — nothing runs on its own.
 */
export const PHASES: readonly Phase[] = [
  {
    arrival: { mode: "base", promptId: "reverse-fn", resetTemp: true },
    id: "autocomplete",
    label: "autocomplete",
  },
  {
    arrival: { mode: "base", promptId: "how-do-i", resetTemp: true },
    id: "unanswered",
    label: "nobody answers",
  },
  {
    arrival: { mode: "base", promptId: "how-do-i", resetTemp: true },
    id: "dial",
    label: "turn the dial",
  },
  {
    arrival: { mode: "instruct", promptId: "how-do-i", resetTemp: false },
    id: "taught",
    label: "taught to answer",
    year: "2022",
  },
] as const;

export const FIRST_PHASE: PhaseId = PHASES[0].id;

function indexOf(id: PhaseId): number {
  return PHASES.findIndex((p) => p.id === id);
}

export function phaseFor(id: PhaseId): Phase {
  return PHASES.find((p) => p.id === id) ?? PHASES[0];
}

export function reached(furthest: PhaseId, target: PhaseId): boolean {
  return indexOf(furthest) >= indexOf(target);
}

export function furthestOf(a: PhaseId, b: PhaseId): PhaseId {
  return indexOf(a) >= indexOf(b) ? a : b;
}

export function adjacentPhase(
  id: PhaseId,
  dir: "prev" | "next"
): PhaseId | null {
  const next = indexOf(id) + (dir === "next" ? 1 : -1);
  return PHASES[next]?.id ?? null;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd apps/web && bun test era1-playground/phases.test.ts`
Expected: PASS, 9 tests.

- [ ] **Step 5: Typecheck, lint, commit**

Run: `cd apps/web && bun run typecheck` — expected clean.

Run from repo root:
```bash
bunx biome check --write "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/phases.ts" "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/phases.test.ts"
```

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/phases.ts" "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/phases.test.ts"
git commit -m "$(cat <<'EOF'
feat(masterclass): Era I's four beats become a list you can walk

The stage machine earned each control by making the presenter perform the
run that unlocked it. The footer hands that discipline back to him, so what
is left is an ordered list: four beats, each carrying the machine
configuration it applies on arrival.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: `disposition.ts` — where the two modes reconcile

One pure function decides what is on screen. It is the only place that knows presenter mode exists, which is what keeps `presenter ? … : …` out of the JSX.

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/disposition.ts`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/disposition.test.ts`

**Interfaces:**
- Consumes: `PhaseId`, `reached` from `./phases` (Task 2).
- Produces, for Task 6:
  - `interface Disposition { showDial: boolean; showFooter: boolean; showPostTrainedCell: boolean; showSecondPrompt: boolean }`
  - `dispositionFor({ furthest, presenter }: { furthest: PhaseId; presenter: boolean }): Disposition`

**Note for the implementer:** the spec's §2 names the argument `reached`; the plan calls it `furthest` to avoid shadowing the imported `reached()` predicate. Same concept — the furthest phase the presenter has visited. Disclosure keys off it and never off the *current* phase, so stepping back never takes a control away.

- [ ] **Step 1: Write the failing test**

Create `disposition.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import { dispositionFor } from "./disposition";
import { PHASES } from "./phases";

describe("era1 disposition", () => {
  test("without presenter mode everything is on screen and there is no footer", () => {
    for (const phase of PHASES) {
      const d = dispositionFor({ furthest: phase.id, presenter: false });
      expect(d).toEqual({
        showDial: true,
        showFooter: false,
        showPostTrainedCell: true,
        showSecondPrompt: true,
      });
    }
  });

  test("presenter mode opens at beat one with an almost empty machine", () => {
    const d = dispositionFor({ furthest: "autocomplete", presenter: true });
    expect(d).toEqual({
      showDial: false,
      showFooter: true,
      showPostTrainedCell: false,
      showSecondPrompt: false,
    });
  });

  test("the second prompt arrives at beat two", () => {
    expect(
      dispositionFor({ furthest: "unanswered", presenter: true }).showSecondPrompt
    ).toBe(true);
    expect(
      dispositionFor({ furthest: "unanswered", presenter: true }).showDial
    ).toBe(false);
  });

  test("the dial arrives at beat three, the switch's second cell at beat four", () => {
    const dial = dispositionFor({ furthest: "dial", presenter: true });
    expect(dial.showDial).toBe(true);
    expect(dial.showPostTrainedCell).toBe(false);

    const taught = dispositionFor({ furthest: "taught", presenter: true });
    expect(taught.showPostTrainedCell).toBe(true);
  });

  test("gates never close — the furthest beat reached opens everything", () => {
    const d = dispositionFor({ furthest: "taught", presenter: true });
    expect(d).toEqual({
      showDial: true,
      showFooter: true,
      showPostTrainedCell: true,
      showSecondPrompt: true,
    });
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `cd apps/web && bun test era1-playground/disposition.test.ts`
Expected: FAIL — `Cannot find module './disposition'`.

- [ ] **Step 3: Write `disposition.ts`**

```ts
import { type PhaseId, reached } from "./phases";

export interface Disposition {
  showDial: boolean;
  showFooter: boolean;
  showPostTrainedCell: boolean;
  showSecondPrompt: boolean;
}

/**
 * The only place the two modes reconcile. Without presenter mode the console
 * is fully populated and there are no beats; with it, disclosure follows the
 * furthest phase visited — never the current one, so stepping back never takes
 * a control away mid-talk.
 */
export function dispositionFor({
  furthest,
  presenter,
}: {
  furthest: PhaseId;
  presenter: boolean;
}): Disposition {
  if (!presenter) {
    return {
      showDial: true,
      showFooter: false,
      showPostTrainedCell: true,
      showSecondPrompt: true,
    };
  }
  return {
    showDial: reached(furthest, "dial"),
    showFooter: true,
    showPostTrainedCell: reached(furthest, "taught"),
    showSecondPrompt: reached(furthest, "unanswered"),
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd apps/web && bun test era1-playground/disposition.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 5: Run the whole suite**

Run: `cd apps/web && bun test`
Expected: PASS, **112** (98 after Task 1, +9 phases, +5 disposition).

- [ ] **Step 6: Typecheck, lint, commit**

Run: `cd apps/web && bun run typecheck` — expected clean.

```bash
bunx biome check --write "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/disposition.ts" "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/disposition.test.ts"
```

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/disposition.ts" "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/disposition.test.ts"
git commit -m "$(cat <<'EOF'
feat(masterclass): one function decides what is on screen

Presenter mode and the shared link are the same console wearing two
dispositions. Keeping that in a pure function is what stops the ternary
from spreading through the JSX — and it lets the rule "gates never close"
be a test rather than a habit.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: The `Shift+P` chord

Presenter mode needs a live toggle that provably cannot collide with the one global key binding the page already has.

**Files:**
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/step-keys.ts`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/step-keys.test.ts`

**Interfaces:**
- Consumes: the existing `StepKeyEvent` interface and `stepKeyDirection` in the same file.
- Produces, for Task 6:
  - `isPresenterToggle(event: StepKeyEvent): boolean`
  - `isTextEntryTarget(target: EventTarget | null): boolean`

**Why a second, narrower target guard:** arrows must yield to sliders, tabs, radios and spinbuttons, because those controls consume arrows. `P` consumes nothing — it only needs to yield to genuine text entry. Reusing `isArrowConsumingTarget` would wrongly disable the chord whenever the temperature slider has focus, which on stage is most of the time.

- [ ] **Step 1: Write the failing test**

Append to `step-keys.test.ts`, and extend its import line to
`import { isPresenterToggle, isTextEntryTarget, type StepKeyEvent, stepKeyDirection } from "./step-keys";`

```ts
describe("isPresenterToggle", () => {
  it("fires on Shift+P", () => {
    expect(isPresenterToggle(keyEvent({ key: "P", shiftKey: true }))).toBe(true);
    expect(isPresenterToggle(keyEvent({ key: "p", shiftKey: true }))).toBe(true);
  });

  it("does not fire without the shift", () => {
    expect(isPresenterToggle(keyEvent({ key: "p" }))).toBe(false);
  });

  it("yields to browser and OS shortcuts", () => {
    expect(
      isPresenterToggle(keyEvent({ key: "P", metaKey: true, shiftKey: true }))
    ).toBe(false);
    expect(
      isPresenterToggle(keyEvent({ ctrlKey: true, key: "P", shiftKey: true }))
    ).toBe(false);
    expect(
      isPresenterToggle(keyEvent({ altKey: true, key: "P", shiftKey: true }))
    ).toBe(false);
  });

  it("ignores held-down repeats and already-handled events", () => {
    expect(
      isPresenterToggle(keyEvent({ key: "P", repeat: true, shiftKey: true }))
    ).toBe(false);
    expect(
      isPresenterToggle(
        keyEvent({ defaultPrevented: true, key: "P", shiftKey: true })
      )
    ).toBe(false);
  });

  it("cannot collide with step navigation — the arrows never see a chord", () => {
    expect(stepKeyDirection(keyEvent({ key: "P", shiftKey: true }))).toBeNull();
  });

  it("treats a null target as safe to handle", () => {
    expect(isTextEntryTarget(null)).toBe(false);
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `cd apps/web && bun test step-keys.test.ts`
Expected: FAIL — `isPresenterToggle is not a function`.

- [ ] **Step 3: Add both functions to `step-keys.ts`**

Append after `isArrowConsumingTarget`, and update the file's leading doc comment to say it covers the exhibit's global key bindings rather than arrows alone:

```ts
/**
 * `P` consumes nothing, so the presenter chord only has to yield to genuine
 * text entry — not to the sliders and tabs the arrows must respect.
 */
const TEXT_ENTRY_SELECTOR = [
  "input",
  "textarea",
  "[contenteditable='true']",
  "[contenteditable='']",
].join(", ");

export function isTextEntryTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element && target.closest(TEXT_ENTRY_SELECTOR) !== null
  );
}

export function isPresenterToggle(event: StepKeyEvent): boolean {
  if (event.defaultPrevented || event.repeat) {
    return false;
  }
  if (event.altKey || event.ctrlKey || event.metaKey) {
    return false;
  }
  return event.shiftKey && event.key.toLowerCase() === "p";
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd apps/web && bun test step-keys.test.ts`
Expected: PASS, 11 tests (5 existing + 6 new).

- [ ] **Step 5: Typecheck, lint, commit**

Run: `cd apps/web && bun run typecheck` — expected clean.

```bash
bunx biome check --write "apps/web/app/[locale]/learn/masterclass-28-07-2026/step-keys.ts" "apps/web/app/[locale]/learn/masterclass-28-07-2026/step-keys.test.ts"
```

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/step-keys.ts" "apps/web/app/[locale]/learn/masterclass-28-07-2026/step-keys.test.ts"
git commit -m "$(cat <<'EOF'
feat(masterclass): Shift+P, and a test proving the arrows can't see it

Step navigation already refuses any modified key, so the chord is safe by
construction — but "by construction" is worth an assertion, because the
next person to relax that rule should hear about it from the suite.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: The two new components

Both are presentational and unwired at the end of this task — nothing imports them until Task 6, so the app keeps working throughout. There is no React test runner in this repo; these are verified by typecheck, Biome, and the beat walk in Task 7.

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/prompt-tabs.tsx`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/phase-footer.tsx`

**Interfaces:**
- Consumes: `PROMPTS` from `./selector`; `PHASES`, `PhaseId`, `adjacentPhase` from `./phases` (Task 2).
- Produces, for Task 6:
  - `<PromptTabs activeId={string} onSelect={(event: MouseEvent<HTMLButtonElement>) => void} showSecond={boolean} />` — reads the prompt id from `event.currentTarget.dataset.prompt`.
  - `<PhaseFooter current={PhaseId} onSelect={(id: PhaseId) => void} />`

- [ ] **Step 1: Write `prompt-tabs.tsx`**

The tabs are the top of the panel, not folder tabs overlapping it — one bordered box holds the strip and the output, separated by a divider, with the active tab underlined onto that divider. That is what "visually connects to the generation window" means here, and it avoids the fragile overlap tricks that semi-transparent fills break.

```tsx
"use client";

import { cn } from "@repo/design-system/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import type { MouseEvent } from "react";
import { PROMPTS } from "./selector";

const FADE = { duration: 0.25 } as const;

interface PromptTabsProps {
  activeId: string;
  onSelect: (event: MouseEvent<HTMLButtonElement>) => void;
  showSecond: boolean;
}

/**
 * Lives inside the output panel's border, above a divider the active tab
 * underlines. Same "underline = you are here" grammar as the stepper, one
 * altitude down.
 */
export function PromptTabs({
  activeId,
  onSelect,
  showSecond,
}: PromptTabsProps) {
  const visible = showSecond ? PROMPTS : PROMPTS.slice(0, 1);
  return (
    <div className="flex h-10 items-stretch gap-4 border-foreground/10 border-b px-4">
      <AnimatePresence initial={false}>
        {visible.map((prompt) => {
          const active = prompt.id === activeId;
          return (
            <motion.button
              animate={{ opacity: 1 }}
              aria-pressed={active}
              className={cn(
                "-mb-px whitespace-nowrap border-b-2 font-mono text-xs transition-colors sm:text-sm",
                active
                  ? "border-ht-cyan-500 text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              data-prompt={prompt.id}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key={prompt.id}
              onClick={onSelect}
              transition={FADE}
              type="button"
            >
              {prompt.label}
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
```

**Do not use `role="tab"`.** It is listed in `ARROW_CONSUMING_SELECTOR` in `step-keys.ts`, so adopting it would silently swallow `→` on a focused tab with nothing implementing roving focus — a live regression traded for correct-looking ARIA. `aria-pressed` is the honest description of what these currently are.

- [ ] **Step 2: Write `phase-footer.tsx`**

```tsx
"use client";

import { cn } from "@repo/design-system/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { adjacentPhase, type PhaseId, PHASES } from "./phases";

const NUMERALS = ["①", "②", "③", "④"] as const;
const ACCORDION = { duration: 0.25 } as const;

interface ArrowProps {
  dir: "prev" | "next";
  onSelect: (id: PhaseId) => void;
  target: PhaseId | null;
}

function Arrow({ dir, onSelect, target }: ArrowProps) {
  return (
    <button
      aria-label={dir === "prev" ? "Previous beat" : "Next beat"}
      className="shrink-0 rounded px-2 py-1 font-mono text-muted-foreground text-sm transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
      disabled={target === null}
      onClick={() => target && onSelect(target)}
      type="button"
    >
      {dir === "prev" ? "←" : "→"}
    </button>
  );
}

interface PhaseFooterProps {
  current: PhaseId;
  onSelect: (id: PhaseId) => void;
}

/**
 * Presenter mode's transport. An accordion: only the current beat carries its
 * label, the rest collapse to bare numerals — still clickable, so a jump is
 * always one click, and so nothing on the projector reads ahead of the room.
 */
export function PhaseFooter({ current, onSelect }: PhaseFooterProps) {
  return (
    <nav
      aria-label="Demo beats"
      className="flex h-12 items-center gap-1 border-foreground/10 border-t px-2 sm:px-4"
    >
      <Arrow dir="prev" onSelect={onSelect} target={adjacentPhase(current, "prev")} />
      {PHASES.map((phase, index) => {
        const active = phase.id === current;
        return (
          <button
            aria-current={active ? "step" : undefined}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap border-b-2 px-2 py-1 font-mono text-xs transition-colors",
              active
                ? "border-ht-cyan-500 text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            key={phase.id}
            onClick={() => onSelect(phase.id)}
            type="button"
          >
            <span>{NUMERALS[index]}</span>
            <AnimatePresence initial={false}>
              {active ? (
                <motion.span
                  animate={{ opacity: 1, width: "auto" }}
                  className="overflow-hidden"
                  exit={{ opacity: 0, width: 0 }}
                  initial={{ opacity: 0, width: 0 }}
                  key="label"
                  transition={ACCORDION}
                >
                  {phase.year ? `${phase.year} · ` : ""}
                  {phase.label}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </button>
        );
      })}
      <Arrow dir="next" onSelect={onSelect} target={adjacentPhase(current, "next")} />
    </nav>
  );
}
```

The row height is fixed at `h-12` and the only motion is one label's width — horizontal, in the last row of the console, with nothing below it to shove.

- [ ] **Step 3: Typecheck**

Run: `cd apps/web && bun run typecheck`
Expected: clean. (Unused-export warnings are fine; nothing imports these yet.)

- [ ] **Step 4: Run the suite to confirm nothing regressed**

Run: `cd apps/web && bun test`
Expected: PASS, 112 — unchanged from Task 3.

- [ ] **Step 5: Lint and commit**

```bash
bunx biome check --write "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/prompt-tabs.tsx" "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/phase-footer.tsx"
```

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/prompt-tabs.tsx" "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/phase-footer.tsx"
git commit -m "$(cat <<'EOF'
feat(masterclass): tabs that belong to the window, and a footer that opens one beat at a time

The prompts stop being a floating row and become the top of the panel they
feed — one box, one divider, the active one underlined onto it. The footer
is an accordion, so the numerals are always there to click and the labels
never read ahead of the room.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: The swap

Everything above was additive. This task is necessarily atomic: the session store's API, the chrome's props and the orchestrator all change together, and `stage.ts` dies. Work through it in order and don't run the app until Step 9.

**Files:**
- Rewrite: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/session-store.ts`
- Rewrite: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/console-chrome.tsx`
- Rewrite: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/index.tsx`
- Delete: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/stage.ts`
- Delete: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/stage.test.ts`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/masterclass.tsx`

**Interfaces:**
- Consumes: `PHASES`, `PhaseId`, `FIRST_PHASE`, `phaseFor`, `furthestOf` from `./phases`; `dispositionFor` from `./disposition`; `PromptTabs`, `PhaseFooter` from Task 5; `isPresenterToggle`, `isTextEntryTarget` from `./step-keys`; `OUTPUT_LINES`, `INITIAL_TEMP`, `PROMPTS`, `bandFor`, `selectCompletion`, `Mode`, `Band` from `./selector`; `verdictFor` from `./verdicts`.
- Produces: `<Era1Playground presenter={boolean} />`.

- [ ] **Step 1: Delete the stage machine**

```bash
git rm "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/stage.ts" "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/stage.test.ts"
```

Those twelve tests encoded the gates — *the dial won't open unless you actually ran the question in base; the offer won't open unless you actually moved the dial.* The footer hands that discipline to the presenter, so the assertions have nothing left to describe. This is the one point in the plan where the test count goes down.

- [ ] **Step 2: Rewrite `session-store.ts` as the full snapshot**

```ts
import { FIRST_PHASE, type PhaseId } from "./phases";
import { type Band, INITIAL_TEMP, type Mode, PROMPTS } from "./selector";

/** What the last run was, which is what the verdict describes. */
export interface RunSnapshot {
  band: Band;
  isQuestion: boolean;
  mode: Mode;
}

export interface DemoSnapshot {
  /** The furthest beat visited. Disclosure keys off this, never off `phase`. */
  furthest: PhaseId;
  lastRun: RunSnapshot | null;
  mode: Mode;
  output: string;
  phase: PhaseId;
  promptId: string;
  temp: number;
  verdict: string | null;
}

export function freshSnapshot(): DemoSnapshot {
  return {
    furthest: FIRST_PHASE,
    lastRun: null,
    mode: "base",
    output: "",
    phase: FIRST_PHASE,
    promptId: PROMPTS[0].id,
    temp: INITIAL_TEMP,
    verdict: null,
  };
}

/**
 * The demo unmounts when the presenter steps to Era II. This survives that and
 * dies on reload, so stepping away and back returns the screen exactly as it
 * was — mid-demo, output and all. Written only from client event handlers, so
 * the server copy never leaves its default.
 */
let snapshot: DemoSnapshot = freshSnapshot();

export function getSnapshot(): DemoSnapshot {
  return snapshot;
}

export function saveSnapshot(next: DemoSnapshot): void {
  snapshot = next;
}
```

- [ ] **Step 3: Rewrite `console-chrome.tsx`**

Three changes: `davinci-002` becomes a constant that never leaves; the switch is present from the first second with one cell and gains its second by fading in; the dial never retracts and is never disabled. Both the switch and the dial sit in fixed-width slots so nothing to their right ever moves.

```tsx
"use client";

import { Slider } from "@repo/design-system/components/ui/slider";
import { cn } from "@repo/design-system/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import type { MouseEvent } from "react";
import { useCallback } from "react";
import { bandFor, type Mode } from "./selector";

const MODES: readonly { id: Mode; label: string }[] = [
  { id: "base", label: "base" },
  { id: "instruct", label: "post-trained" },
] as const;

const FADE = { duration: 0.25 } as const;

interface ConsoleChromeProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  onReset: () => void;
  onTempChange: (temp: number) => void;
  showDial: boolean;
  showPostTrainedCell: boolean;
  temp: number;
}

export function ConsoleChrome({
  mode,
  onModeChange,
  onReset,
  onTempChange,
  showDial,
  showPostTrainedCell,
  temp,
}: ConsoleChromeProps) {
  const handleModeClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const next = event.currentTarget.dataset.mode as Mode | undefined;
      if (next) {
        onModeChange(next);
      }
    },
    [onModeChange]
  );

  const handleTemp = useCallback(
    ([value]: number[]) => onTempChange(value),
    [onTempChange]
  );

  const cells = showPostTrainedCell ? MODES : MODES.slice(0, 1);

  return (
    <div className="flex h-14 items-center gap-x-5 border-foreground/10 border-b bg-muted/30 px-4 sm:px-6">
      {/* The machine's name. It does not change — only its training does. */}
      <span className="shrink-0 font-mono text-foreground/80 text-sm">
        davinci-002
      </span>

      {/* Sized for both cells from the start, so nothing to the right moves. */}
      <div className="w-44 shrink-0">
        <div className="inline-flex gap-0.5 rounded-md bg-foreground/5 p-0.5">
          <AnimatePresence initial={false}>
            {cells.map((m) => (
              <motion.button
                animate={{ opacity: 1 }}
                aria-pressed={mode === m.id}
                className={cn(
                  "rounded px-2.5 py-1 font-mono text-xs transition-colors",
                  mode === m.id
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                )}
                data-mode={m.id}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key={m.id}
                onClick={handleModeClick}
                transition={FADE}
                type="button"
              >
                {m.label}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Reserved whether or not the dial has arrived. */}
      <div className="h-8 w-60 shrink-0">
        <AnimatePresence initial={false}>
          {showDial ? (
            <motion.div
              animate={{ opacity: 1 }}
              className="flex h-full items-center gap-3"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key="dial"
              transition={FADE}
            >
              <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
                temp
              </span>
              <Slider
                className="w-24"
                max={1.5}
                min={0}
                onValueChange={handleTemp}
                step={0.1}
                value={[temp]}
              />
              <span className="font-mono text-muted-foreground text-xs tabular-nums">
                {temp.toFixed(1)} · {bandFor(temp)}
              </span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <button
        aria-label="Start the demo over"
        className="ml-auto shrink-0 font-mono text-muted-foreground text-sm hover:text-foreground"
        onClick={onReset}
        title="Start the demo over"
        type="button"
      >
        ↺
      </button>
    </div>
  );
}
```

Note what is *gone*: `showSwitch`, `showReset`, and every trace of the dial being retracted or disabled. The dial is live in both modes now, which is the whole point of Task 1.

- [ ] **Step 4: Rewrite `index.tsx`**

The whole demo state is one snapshot object, which is what makes persistence a two-line effect rather than eight. Replace the file:

```tsx
"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import type { MouseEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ConsoleChrome } from "./console-chrome";
import { dispositionFor } from "./disposition";
import { PhaseFooter } from "./phase-footer";
import { furthestOf, type PhaseId, phaseFor } from "./phases";
import { PromptTabs } from "./prompt-tabs";
import {
  bandFor,
  INITIAL_TEMP,
  type Mode,
  OUTPUT_LINES,
  PROMPTS,
  selectCompletion,
} from "./selector";
import {
  type DemoSnapshot,
  freshSnapshot,
  getSnapshot,
  saveSnapshot,
} from "./session-store";
import { verdictFor } from "./verdicts";

const STREAM_MS = 18;

/** Long enough that Eric has already said the line and the page agrees. */
const VERDICT_DELAY_MS = 1500;

/** `OUTPUT_LINES` at leading-7, plus p-4 top and bottom. */
const OUTPUT_HEIGHT = `calc(${OUTPUT_LINES} * 1.75rem + 2rem)`;

const DIAL_WHISPER = "temperature — how much the dice get to decide";

interface Era1PlaygroundProps {
  presenter: boolean;
}

export function Era1Playground({ presenter }: Era1PlaygroundProps) {
  const [snap, setSnap] = useState<DemoSnapshot>(getSnapshot);
  const [streaming, setStreaming] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const target = useRef("");
  const latest = useRef(snap);

  useEffect(() => {
    latest.current = snap;
    saveSnapshot(snap);
  }, [snap]);

  const stopTimer = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    setStreaming(false);
  }, []);

  // Navigating away mid-stream stores the *finished* text, so stepping back
  // returns a completed run rather than a sentence cut in half.
  useEffect(
    () => () => {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
        saveSnapshot({ ...latest.current, output: target.current });
      }
    },
    []
  );

  const patch = useCallback((next: Partial<DemoSnapshot>) => {
    setSnap((s) => ({ ...s, ...next }));
  }, []);

  const run = useCallback(
    (runMode: Mode, runPromptId: string, runTemp: number) => {
      stopTimer();
      const runPrompt =
        PROMPTS.find((p) => p.id === runPromptId) ?? PROMPTS[0];
      const full = selectCompletion(runPromptId, runTemp, runMode);
      target.current = full;
      const lastRun = {
        band: bandFor(runTemp),
        isQuestion: runPrompt.isQuestion,
        mode: runMode,
      };
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduce) {
        patch({ lastRun, output: full, verdict: null });
        return;
      }
      patch({ lastRun, output: "", verdict: null });
      setStreaming(true);
      let i = 0;
      timer.current = setInterval(() => {
        i += 1;
        setSnap((s) => ({ ...s, output: full.slice(0, i) }));
        if (i >= full.length) {
          stopTimer();
        }
      }, STREAM_MS);
    },
    [patch, stopTimer]
  );

  // The page never speaks first: the verdict arrives a beat after the stream
  // finishes, agreeing with what Eric has already said.
  const { lastRun, verdict } = snap;
  useEffect(() => {
    // The ternary rather than an early return: TypeScript narrows `lastRun`
    // inside the true branch, and the effect returns a cleanup on every path.
    const id =
      !streaming && lastRun !== null && verdict === null
        ? setTimeout(
            () => patch({ verdict: verdictFor(lastRun) }),
            VERDICT_DELAY_MS
          )
        : null;
    return () => {
      if (id) {
        clearTimeout(id);
      }
    };
  }, [lastRun, patch, streaming, verdict]);

  const handleRun = useCallback(
    () => run(snap.mode, snap.promptId, snap.temp),
    [run, snap.mode, snap.promptId, snap.temp]
  );

  const goToPhase = useCallback(
    (id: PhaseId) => {
      stopTimer();
      const { arrival } = phaseFor(id);
      setSnap((s) => ({
        ...s,
        furthest: furthestOf(s.furthest, id),
        lastRun: null,
        mode: arrival.mode,
        output: "",
        phase: id,
        promptId: arrival.promptId,
        temp: arrival.resetTemp ? INITIAL_TEMP : s.temp,
        verdict: null,
      }));
    },
    [stopTimer]
  );

  const handleModeChange = useCallback(
    (next: Mode) => {
      stopTimer();
      setSnap((s) =>
        s.mode === next
          ? s
          : { ...s, lastRun: null, mode: next, output: "", verdict: null }
      );
    },
    [stopTimer]
  );

  const handlePromptClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const id = event.currentTarget.dataset.prompt;
      if (!id) {
        return;
      }
      stopTimer();
      setSnap((s) =>
        s.promptId === id
          ? s
          : { ...s, lastRun: null, output: "", promptId: id, verdict: null }
      );
    },
    [stopTimer]
  );

  const handleReset = useCallback(() => {
    stopTimer();
    setSnap(freshSnapshot());
  }, [stopTimer]);

  const handleTempChange = useCallback(
    (temp: number) => patch({ temp }),
    [patch]
  );

  const disposition = dispositionFor({
    furthest: snap.furthest,
    presenter,
  });
  const prompt =
    PROMPTS.find((p) => p.id === snap.promptId) ?? PROMPTS[0];

  // One slot, one line: the run's verdict, or the dial's whisper before any
  // run, or nothing. Both regions this replaces used to appear and disappear.
  const line =
    snap.verdict ??
    (disposition.showDial && snap.lastRun === null ? DIAL_WHISPER : "");

  return (
    <div className="mb-6">
      <div className="overflow-hidden rounded-xl border border-foreground/10 bg-background">
        <ConsoleChrome
          mode={snap.mode}
          onModeChange={handleModeChange}
          onReset={handleReset}
          onTempChange={handleTempChange}
          showDial={disposition.showDial}
          showPostTrainedCell={disposition.showPostTrainedCell}
          temp={snap.temp}
        />

        <div className="p-4 sm:p-6">
          <div className="overflow-hidden rounded-lg border border-foreground/10 bg-muted/40">
            <PromptTabs
              activeId={snap.promptId}
              onSelect={handlePromptClick}
              showSecond={disposition.showSecondPrompt}
            />
            <pre
              className="overflow-auto whitespace-pre-wrap p-4 font-mono text-[15px] leading-7"
              style={{ height: OUTPUT_HEIGHT }}
            >
              <span className="text-foreground">{prompt.prefix}</span>
              <span className="text-ht-cyan-700 dark:text-ht-cyan-300">
                {snap.output}
              </span>
              {streaming ? <span className="animate-pulse">▋</span> : null}
            </pre>
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={handleRun} type="button">
              Run ⏎
            </Button>
          </div>
        </div>

        <div
          aria-live="polite"
          className="flex h-14 items-center border-foreground/10 border-t px-4 sm:px-6"
          role="status"
        >
          <AnimatePresence mode="wait">
            {line ? (
              <motion.p
                animate={{ opacity: 1 }}
                className="max-w-2xl text-foreground/55 text-sm italic"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key={line}
                transition={{ duration: 0.35 }}
              >
                {line}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>

        {disposition.showFooter ? (
          <PhaseFooter current={snap.phase} onSelect={goToPhase} />
        ) : null}
      </div>
    </div>
  );
}
```

Two things worth reading twice. The output panel's height is **fixed**, not a minimum — that is what stops the `Run` button moving, and it costs a visibly empty console at beat one. And `handleTempChange` deliberately does **not** clear the output: run at 1.4, drag back to 0.7, and you keep the high-band verdict, because the verdict describes the run rather than the dial.

- [ ] **Step 5: Wire `masterclass.tsx`**

Add to the imports:

```tsx
import { parseAsBoolean, parseAsStringLiteral, useQueryState } from "nuqs";
import {
  isArrowConsumingTarget,
  isPresenterToggle,
  isTextEntryTarget,
  stepKeyDirection,
} from "./step-keys";
```

Add the flag below the existing `step` state:

```tsx
  const [presenter, setPresenter] = useQueryState(
    "presenter",
    parseAsBoolean.withDefault(false).withOptions({ history: "replace" })
  );
```

`history: "replace"` is load-bearing — pushing would put every toggle in the back stack, so the global `←` would start undoing presenter mode instead of stepping eras.

Extend the keydown handler, chord first, and add `presenter`/`setPresenter` to the effect's dependency array:

```tsx
    const onKeyDown = (event: KeyboardEvent) => {
      if (isPresenterToggle(event) && !isTextEntryTarget(event.target)) {
        event.preventDefault();
        setPresenter(!presenter);
        return;
      }
      const dir = stepKeyDirection(event);
      if (!dir || isArrowConsumingTarget(event.target)) {
        return;
      }
      const adjacent = getAdjacentStep(step, dir);
      if (adjacent) {
        setStep(adjacent);
      }
    };
```

```tsx
  }, [presenter, setPresenter, step, setStep]);
```

And pass the prop at the single call site:

```tsx
                <Era1Playground presenter={presenter} />
```

- [ ] **Step 6: Typecheck**

Run: `cd apps/web && bun run typecheck`
Expected: clean. If it complains about a missing `stage` import anywhere, that file was missed in Step 1 — `grep -rn "from \"./stage\"" "apps/web/app/[locale]/learn/masterclass-28-07-2026/"` should return nothing.

- [ ] **Step 7: Run the suite**

Run: `cd apps/web && bun test`
Expected: PASS, **106** — 118 carried in from Task 4, minus the twelve deleted stage tests. Confirm `stage.test.ts` no longer appears in the file list.

- [ ] **Step 8: Lint**

```bash
bunx biome check --write "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/session-store.ts" "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/console-chrome.tsx" "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/index.tsx" "apps/web/app/[locale]/learn/masterclass-28-07-2026/masterclass.tsx"
```
Expected: clean.

- [ ] **Step 9: Smoke-test in the browser**

Run `bun dev` (or `turbo dev --filter=web`) and open
**`localhost:3001/learn/masterclass-28-07-2026?step=completion`**.

The `/en/`-prefixed URL 500s in middleware. That is pre-existing and unrelated, but it will make the page look broken if you hit it.

Confirm only that the page renders, the console is fully populated, and `Run` streams. The full walk is Task 7.

- [ ] **Step 10: Commit**

```bash
git add -A "apps/web/app/[locale]/learn/masterclass-28-07-2026/"
git commit -m "$(cat <<'EOF'
feat(masterclass): Era I gets a transport, and the console stops moving

The verdict tap is gone. Presenter mode drives from a footer instead, the
shared link shows everything, and the whole demo state lives in one snapshot
so stepping to Era II and back returns the screen exactly as it was.

The output panel's height is now fixed rather than minimum, which is what
stops the Run button sliding out from under the cursor when a completion
lands. It costs a visibly empty console on the first beat. Worth it.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: The beat walk

Unit tests cannot reach any of the four things this redesign was for. Walk them on the dev server and write down what you saw.

**Files:** none — this task produces a verification report, not a diff.

- [ ] **Step 1: Start the server and open the demo**

Run `bun dev`, open `localhost:3001/learn/masterclass-28-07-2026?step=completion`.

- [ ] **Step 2: Walk the default view (the shared link)**

Confirm, in order:
1. Every control is present at once — `davinci-002`, both switch cells, both prompt tabs, the dial.
2. There is **no** footer.
3. The slot under the output reads `temperature — how much the dice get to decide`.
4. Press `Run`. The completion streams; **the `Run` button does not move**. Watch the button, not the output.
5. About a second and a half after the stream stops, the verdict fades in and replaces the whisper. The row does not change height.

- [ ] **Step 3: Prove the dial is live on both sides**

1. Select `a question`, drag the dial to 1.4, `Run`. It should ask *how do I reverse time? who is asking?* and the verdict should be the high-band base line.
2. Without touching the dial, click `post-trained`, `Run`. It should **answer**, discursively, with an aside about `toReversed()`. The verdict should be `INSTRUCT_QUESTION_HIGH`.
3. Drag to 0.1, `Run`. A shorter, tighter answer. This is the beat the whole of Task 1 exists for — if steps 2 and 3 produce identical text, `selectCompletion` is not reading the band.

- [ ] **Step 4: Enter presenter mode and walk the four beats**

Press `Shift+P`. Confirm the URL gains `presenter=true` and the footer appears.

Then press `↺` to close the gates, and confirm at beat ①:
- one prompt tab, no dial, one switch cell, and `davinci-002` still there
- the footer reads `① autocomplete` with `②③④` collapsed to numerals

Walk `→` through all four. At each beat confirm the arrival configuration from the plan's Task 2 table, that **nothing runs on its own**, and that pressing `Run` is what produces output.

At ④ confirm the second switch cell fades in beside `base` rather than replacing `davinci-002`.

- [ ] **Step 5: The three hazards unit tests can't reach**

1. **Step away and back.** At beat ③, run something, wait for the verdict, then `→` to Era II and `←` back. The console must return **identical** — same phase, same mode, same dial position, same output, same verdict.
2. **Step away mid-stream.** Press `Run` and navigate to Era II while it is still streaming. Come back: the output must be the **complete** text, not a truncated one.
3. **Arrow keys on the focused dial.** Click the slider, press `←`/`→`. The dial must move and the page must **not** change era.

- [ ] **Step 6: The two toggle hazards**

1. **`Shift+P` mid-demo.** At beat ③, press `Shift+P`. The footer disappears and everything shows; press it again and you are back at beat ③ with the same highlight. State is preserved across the toggle.
2. **Jump backwards.** From ④, click `①`. The dial and both tabs must **stay** — gates never close. Only `↺` closes them.

- [ ] **Step 7: Report**

Write up what you saw, naming anything that jumped, anything that ran by itself, and anything that did not survive step navigation. Do not claim the walk passed without having done every numbered item above.

---

## Notes for the reviewer

**Test count trajectory:** 94 baseline → 98 (Task 1) → 107 (Task 2) → 112 (Task 3) → 118 (Task 4) → 118 (Task 5) → **106** (Task 6, minus twelve stage tests). Ending above baseline but *below* the peak is expected, and the drop is called out in Task 6 Step 1.

**Known and deliberately not fixed:** the temperature slider still has no accessible name (design-system limitation), and the prompt tabs are `aria-pressed` buttons rather than a real tablist (see Task 5). Both are recorded in the spec's "Out of scope".

**Pre-existing Biome findings** in `selector.ts:1` and `selector.test.ts` were present at the base commit. Leave them.

