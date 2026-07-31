# Era I Staged Console Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Era I playground as a console that reveals one control at a time, in the order the presenter walks the room, with the verdict tap as its transport control.

**Architecture:** Two pure modules carry all the logic — a five-state stage machine (`stage.ts`) and a verdict lookup (`verdicts.ts`) — both TDD'd with `bun:test`. A presentational `console-chrome.tsx` owns the machine's top strip (nameplate → switch, temperature dial, reset). `index.tsx` shrinks to orchestration: streaming, run snapshots, and wiring. A module-level session store keeps the revealed stage alive across step navigation and lets it die on reload.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5.9, Tailwind CSS 4.1, `motion/react` (already a dependency), shadcn `Slider` + `Button` from `@repo/design-system`, Bun test runner, Biome 2.3.1.

**Spec:** `docs/superpowers/specs/2026-07-24-masterclass-era1-staged-console-design.md`

## Global Constraints

- All work happens in `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/`. No other demo, the stepper header, the fade scrim, or arrow-key navigation may change.
- **Cyan is machine output and active-state marks only.** `text-ht-cyan-700 dark:text-ht-cyan-300` for the streamed completion; `border-ht-cyan-500` for the active prompt underline. No cyan prose line anywhere in this demo — cyan prose belongs to the engineers' register (`//` asides, field notes).
- **`▸` is reserved for the senior folds.** The verdict affordance uses `↩`.
- The page never speaks first: no verdict line renders until the reader taps for it.
- Existing verdict copy is preserved verbatim where the spec doesn't replace it.
- Bun test runner, `bun:test` imports, `describe`/`test`/`expect`. Tests live beside the module as `<name>.test.ts`.
- Biome: avoid inline arrow functions in JSX props (`noJsxPropsBind`). Use `useCallback`-bound handlers and read the target from `event.currentTarget.dataset`.
- Baseline before starting: **75 tests pass, 0 fail** (`cd apps/web && bun test`).
- Verification per task: `cd apps/web && bun test`, `cd apps/web && bun run typecheck`, and `bunx biome check <changed files>` from the repo root.

---

### Task 1: The stage machine and its session store

**Files:**
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/selector.ts` (add `INITIAL_TEMP`)
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/stage.ts`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/stage.test.ts`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/session-store.ts`

**Interfaces:**
- Consumes: `bandFor(temp: number): Band` and the `Band` / `Mode` types from `./selector` (already exist).
- Produces:
  - `INITIAL_TEMP: number` (= `0.7`) from `./selector`
  - `type Stage = "continuation" | "question" | "dial" | "offer" | "flip"`
  - `type StageEvent = { type: "verdict"; band: Band; isQuestion: boolean; mode: Mode } | { type: "accept-offer" } | { type: "reset" }`
  - `advance(stage: Stage, event: StageEvent): Stage`
  - `reached(stage: Stage, target: Stage): boolean`
  - `showsPromptSelector(stage: Stage): boolean`
  - `showsDial(stage: Stage, mode: Mode): boolean`
  - `showsDialWhisper(stage: Stage): boolean`
  - `showsOffer(stage: Stage): boolean`
  - `showsModeSwitch(stage: Stage): boolean`
  - `showsReset(stage: Stage): boolean`
  - `getRevealedStage(): Stage` and `setRevealedStage(stage: Stage): void` from `./session-store`

- [ ] **Step 1: Add `INITIAL_TEMP` to `selector.ts`**

The dial's opening value has to be one constant that both the stage gate and the component read. Add it directly under the `Band`/`Mode` type declarations in `selector.ts`:

```ts
/** The dial's standing value. The S3 gate opens only on a band the presenter moved to. */
export const INITIAL_TEMP = 0.7;
```

- [ ] **Step 2: Write the failing stage machine test**

Create `stage.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import {
  advance,
  reached,
  type Stage,
  showsDial,
  showsDialWhisper,
  showsModeSwitch,
  showsOffer,
  showsPromptSelector,
  showsReset,
} from "./stage";

const continuationVerdict = {
  band: "mid",
  isQuestion: false,
  mode: "base",
  type: "verdict",
} as const;

const questionVerdict = {
  band: "mid",
  isQuestion: true,
  mode: "base",
  type: "verdict",
} as const;

describe("era1 stage machine", () => {
  test("the first verdict opens the second prompt", () => {
    expect(advance("continuation", continuationVerdict)).toBe("question");
  });

  test("only the question's verdict opens the dial", () => {
    expect(advance("question", continuationVerdict)).toBe("question");
    expect(advance("question", questionVerdict)).toBe("dial");
  });

  test("the offer waits until the dial has actually been moved", () => {
    // The dial opens at INITIAL_TEMP, which lands in the mid band.
    expect(advance("dial", { ...questionVerdict, band: "mid" })).toBe("dial");
    expect(advance("dial", { ...questionVerdict, band: "high" })).toBe("offer");
    expect(advance("dial", { ...questionVerdict, band: "low" })).toBe("offer");
  });

  test("only accepting the offer flips the machine", () => {
    expect(advance("offer", questionVerdict)).toBe("offer");
    expect(advance("offer", { type: "accept-offer" })).toBe("flip");
  });

  test("accepting the offer early is a no-op", () => {
    expect(advance("continuation", { type: "accept-offer" })).toBe(
      "continuation"
    );
    expect(advance("dial", { type: "accept-offer" })).toBe("dial");
  });

  test("the flip is terminal", () => {
    expect(advance("flip", questionVerdict)).toBe("flip");
    expect(advance("flip", { type: "accept-offer" })).toBe("flip");
  });

  test("gates never close", () => {
    const stages: Stage[] = [
      "continuation",
      "question",
      "dial",
      "offer",
      "flip",
    ];
    for (const stage of stages) {
      for (const band of ["low", "mid", "high"] as const) {
        for (const isQuestion of [true, false]) {
          for (const mode of ["base", "instruct"] as const) {
            const next = advance(stage, {
              band,
              isQuestion,
              mode,
              type: "verdict",
            });
            expect(reached(next, stage)).toBe(true);
          }
        }
      }
      expect(reached(advance(stage, { type: "accept-offer" }), stage)).toBe(
        true
      );
    }
  });

  test("reset re-arms the demo from anywhere", () => {
    expect(advance("flip", { type: "reset" })).toBe("continuation");
    expect(advance("dial", { type: "reset" })).toBe("continuation");
  });

  test("nothing is on screen before its beat", () => {
    expect(showsPromptSelector("continuation")).toBe(false);
    expect(showsPromptSelector("question")).toBe(true);
    expect(showsDial("question", "base")).toBe(false);
    expect(showsDial("dial", "base")).toBe(true);
    expect(showsModeSwitch("offer")).toBe(false);
    expect(showsModeSwitch("flip")).toBe(true);
    expect(showsReset("continuation")).toBe(false);
    expect(showsReset("question")).toBe(true);
  });

  test("the dial belongs to the base machine only", () => {
    expect(showsDial("flip", "base")).toBe(true);
    expect(showsDial("flip", "instruct")).toBe(false);
  });

  test("the offer is a moment, not a fixture", () => {
    expect(showsOffer("dial")).toBe(false);
    expect(showsOffer("offer")).toBe(true);
    expect(showsOffer("flip")).toBe(false);
  });

  test("the dial whisper is said once, during its own stage", () => {
    expect(showsDialWhisper("question")).toBe(false);
    expect(showsDialWhisper("dial")).toBe(true);
    expect(showsDialWhisper("offer")).toBe(false);
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `cd apps/web && bun test app/\[locale\]/learn/masterclass-28-07-2026/demos/era1-playground/stage.test.ts`

Expected: FAIL — `Cannot find module './stage'`.

- [ ] **Step 4: Write `stage.ts`**

```ts
import { type Band, bandFor, INITIAL_TEMP, type Mode } from "./selector";

export type Stage = "continuation" | "question" | "dial" | "offer" | "flip";

export type StageEvent =
  | { band: Band; isQuestion: boolean; mode: Mode; type: "verdict" }
  | { type: "accept-offer" }
  | { type: "reset" };

const ORDER: Record<Stage, number> = {
  continuation: 0,
  dial: 2,
  flip: 4,
  offer: 3,
  question: 1,
};

/** The band the dial is standing in when it first appears. */
const OPENING_BAND = bandFor(INITIAL_TEMP);

export function reached(stage: Stage, target: Stage): boolean {
  return ORDER[stage] >= ORDER[target];
}

export function advance(stage: Stage, event: StageEvent): Stage {
  if (event.type === "reset") {
    return "continuation";
  }
  if (event.type === "accept-offer") {
    return stage === "offer" ? "flip" : stage;
  }
  if (stage === "continuation") {
    // Only one prompt exists here, so any verdict is the continuation's.
    return "question";
  }
  if (stage === "question") {
    return event.isQuestion && event.mode === "base" ? "dial" : stage;
  }
  if (stage === "dial") {
    return event.band === OPENING_BAND ? stage : "offer";
  }
  return stage;
}

export function showsPromptSelector(stage: Stage): boolean {
  return reached(stage, "question");
}

export function showsDial(stage: Stage, mode: Mode): boolean {
  return reached(stage, "dial") && mode === "base";
}

export function showsDialWhisper(stage: Stage): boolean {
  return stage === "dial";
}

export function showsOffer(stage: Stage): boolean {
  return stage === "offer";
}

export function showsModeSwitch(stage: Stage): boolean {
  return reached(stage, "flip");
}

export function showsReset(stage: Stage): boolean {
  return stage !== "continuation";
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd apps/web && bun test app/\[locale\]/learn/masterclass-28-07-2026/demos/era1-playground/stage.test.ts`

Expected: PASS, 11 tests.

- [ ] **Step 6: Write the session store**

Create `session-store.ts`. Module-level mutable state is only ever written from browser event handlers, so the server's copy stays at `"continuation"` for every request and hydration always matches.

```ts
import type { Stage } from "./stage";

/**
 * The revealed stage survives step navigation (the demo unmounts when the
 * presenter steps to Era II) but not a page reload, which is how the demo
 * re-arms for a fresh run. Written only from client event handlers, so the
 * server copy never leaves its default.
 */
let revealed: Stage = "continuation";

export function getRevealedStage(): Stage {
  return revealed;
}

export function setRevealedStage(stage: Stage): void {
  revealed = stage;
}
```

- [ ] **Step 7: Run the whole suite and typecheck**

Run: `cd apps/web && bun test && bun run typecheck`

Expected: 86 pass, 0 fail. Typecheck clean.

- [ ] **Step 8: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/stage.ts" \
        "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/stage.test.ts" \
        "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/session-store.ts" \
        "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/selector.ts"
git commit -m "feat(masterclass): Era I stage machine — nothing on screen before its beat"
```

---

### Task 2: The verdict lookup

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/verdicts.ts`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/verdicts.test.ts`

**Interfaces:**
- Consumes: `Band`, `Mode` types from `./selector`.
- Produces: `verdictFor(key: { band: Band; isQuestion: boolean; mode: Mode }): string`

This replaces the four inline conditional blocks at the bottom of `index.tsx` (lines 138–172 of the current file). Four of the six lines are the existing copy verbatim; the two `high`-band lines are new, because the dial beat deserves its own reading.

- [ ] **Step 1: Write the failing test**

Create `verdicts.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import type { Band, Mode } from "./selector";
import { verdictFor } from "./verdicts";

const BANDS: Band[] = ["low", "mid", "high"];
const MODES: Mode[] = ["base", "instruct"];

describe("era1 verdicts", () => {
  test("every reachable combination has a line", () => {
    for (const band of BANDS) {
      for (const mode of MODES) {
        for (const isQuestion of [true, false]) {
          expect(verdictFor({ band, isQuestion, mode }).length).toBeGreaterThan(
            0
          );
        }
      }
    }
  });

  test("the base machine never answers the question", () => {
    const line = verdictFor({ band: "mid", isQuestion: true, mode: "base" });
    expect(line).toContain("There's no one in there to ask");
  });

  test("the high band earns its own reading", () => {
    const mid = verdictFor({ band: "mid", isQuestion: true, mode: "base" });
    const high = verdictFor({ band: "high", isQuestion: true, mode: "base" });
    expect(high).not.toBe(mid);
  });

  test("low and mid share a reading — only the high band is strange", () => {
    expect(verdictFor({ band: "low", isQuestion: false, mode: "base" })).toBe(
      verdictFor({ band: "mid", isQuestion: false, mode: "base" })
    );
  });

  test("post-training flattened the dice, so the band stops mattering", () => {
    for (const isQuestion of [true, false]) {
      const lines = BANDS.map((band) =>
        verdictFor({ band, isQuestion, mode: "instruct" })
      );
      expect(new Set(lines).size).toBe(1);
    }
  });

  test("the flip names the ChatGPT moment", () => {
    expect(
      verdictFor({ band: "mid", isQuestion: true, mode: "instruct" })
    ).toContain("ChatGPT moment");
  });

  test("no verdict borrows the engineers' register", () => {
    for (const band of BANDS) {
      for (const mode of MODES) {
        for (const isQuestion of [true, false]) {
          const line = verdictFor({ band, isQuestion, mode });
          expect(line).not.toContain("//");
          expect(line).not.toContain("▸");
        }
      }
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd apps/web && bun test app/\[locale\]/learn/masterclass-28-07-2026/demos/era1-playground/verdicts.test.ts`

Expected: FAIL — `Cannot find module './verdicts'`.

- [ ] **Step 3: Write `verdicts.ts`**

```ts
import type { Band, Mode } from "./selector";

const BASE_CONTINUE =
  "It isn't looking anything up. It's continuing your pattern — that's all it ever does.";

const BASE_CONTINUE_HIGH =
  "Still continuing — just with worse judgment. The dial doesn't add knowledge, only nerve.";

const BASE_QUESTION =
  "You asked a question. It didn't answer — it just kept going. There's no one in there to ask.";

const BASE_QUESTION_HIGH =
  "Nothing broke. You widened the odds, and it kept continuing the only pattern it could see — someone typing questions.";

const INSTRUCT_QUESTION =
  "Now it answers. Not because it became something else — because humans taught it the format. That flip is the ChatGPT moment.";

const INSTRUCT_CONTINUE =
  "One clean completion, every time. Same machine — new manners.";

export function verdictFor({
  band,
  isQuestion,
  mode,
}: {
  band: Band;
  isQuestion: boolean;
  mode: Mode;
}): string {
  if (mode === "instruct") {
    return isQuestion ? INSTRUCT_QUESTION : INSTRUCT_CONTINUE;
  }
  if (isQuestion) {
    return band === "high" ? BASE_QUESTION_HIGH : BASE_QUESTION;
  }
  return band === "high" ? BASE_CONTINUE_HIGH : BASE_CONTINUE;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd apps/web && bun test app/\[locale\]/learn/masterclass-28-07-2026/demos/era1-playground/verdicts.test.ts`

Expected: PASS, 7 tests.

- [ ] **Step 5: Run the whole suite and typecheck**

Run: `cd apps/web && bun test && bun run typecheck`

Expected: 93 pass, 0 fail. Typecheck clean.

- [ ] **Step 6: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/verdicts.ts" \
        "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/verdicts.test.ts"
git commit -m "feat(masterclass): Era I verdicts as data — the dial beat gets its own line"
```

---

### Task 3: The console chrome

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/console-chrome.tsx`

**Interfaces:**
- Consumes: `showsDial` / `showsModeSwitch` / `showsReset` results are passed in as booleans by the caller (Task 4); this component makes no stage decisions. `bandFor` and `Mode` from `./selector`.
- Produces: `<ConsoleChrome mode onModeChange onReset onTempChange showDial showReset showSwitch temp />`

This is the machine's top strip. Until the flip it holds a **nameplate** — a label, not a control, so nobody in the room hunts for a second mode. At the flip it becomes a **solid slab switch**, which reads as hardware rather than as another pill.

- [ ] **Step 1: Write the component**

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

const MORPH = { duration: 0.25 } as const;

interface ConsoleChromeProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  onReset: () => void;
  onTempChange: (temp: number) => void;
  showDial: boolean;
  showReset: boolean;
  showSwitch: boolean;
  temp: number;
}

export function ConsoleChrome({
  mode,
  onModeChange,
  onReset,
  onTempChange,
  showDial,
  showReset,
  showSwitch,
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

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-foreground/10 border-b bg-muted/30 px-4 py-2.5 sm:px-6">
      <AnimatePresence initial={false} mode="wait">
        {showSwitch ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="flex gap-0.5 rounded-md bg-foreground/5 p-0.5"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="switch"
            transition={MORPH}
          >
            {MODES.map((m) => (
              <button
                className={cn(
                  "rounded px-2.5 py-1 font-mono text-xs transition-colors",
                  mode === m.id
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                )}
                data-mode={m.id}
                key={m.id}
                onClick={handleModeClick}
                type="button"
              >
                {m.label}
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.span
            animate={{ opacity: 1 }}
            className="font-mono text-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="nameplate"
            transition={MORPH}
          >
            <span className="text-foreground/80">davinci-002</span>
            <span className="text-muted-foreground"> · base</span>
          </motion.span>
        )}
      </AnimatePresence>

      {showDial && (
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
            temp
          </span>
          <Slider
            className="w-28"
            max={1.5}
            min={0}
            onValueChange={handleTemp}
            step={0.1}
            value={[temp]}
          />
          <span className="font-mono text-muted-foreground text-xs tabular-nums">
            {temp.toFixed(1)} · {bandFor(temp)}
          </span>
        </div>
      )}

      {showReset && (
        <button
          aria-label="Start the demo over"
          className="ml-auto font-mono text-muted-foreground text-sm hover:text-foreground"
          onClick={onReset}
          title="Start the demo over"
          type="button"
        >
          ↺
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `cd apps/web && bun run typecheck`

Expected: clean. (The component is not yet imported anywhere; typecheck still compiles it.)

- [ ] **Step 3: Lint the new file**

Run from the repo root: `bunx biome check "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/console-chrome.tsx"`

Expected: no findings. If `useSortedKeys` complains, apply its ordering rather than disabling it.

- [ ] **Step 4: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/console-chrome.tsx"
git commit -m "feat(masterclass): Era I console chrome — the nameplate that becomes a switch"
```

---

### Task 4: The console body and the wiring

**Files:**
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/completions.ts:23` and `:36` (prompt labels)
- Rewrite: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/index.tsx`

**Interfaces:**
- Consumes: everything produced by Tasks 1–3 — `advance`, `showsPromptSelector`, `showsDial`, `showsDialWhisper`, `showsOffer`, `showsModeSwitch`, `showsReset`, `Stage`, `getRevealedStage`, `setRevealedStage`, `verdictFor`, `ConsoleChrome`, `INITIAL_TEMP`.
- Produces: `<Era1Playground />` — unchanged export name and signature, so `masterclass.tsx:87` needs no edit.

- [ ] **Step 1: Strip the stage directions from the prompt labels**

In `completions.ts`, two label strings change. The parenthetical was the presenter's line, and the sentence case reads as a spoken list rather than a set of buttons.

```ts
    label: "a half-written function",
```

```ts
    label: "a question",
```

Everything else in `completions.ts` — prefixes, continuations, `instructAnswer`, `isQuestion` — stays exactly as it is.

- [ ] **Step 2: Run the suite to confirm the label change broke nothing**

Run: `cd apps/web && bun test`

Expected: 93 pass, 0 fail. (`selector.test.ts` asserts on ids and completion text, not labels.)

- [ ] **Step 3: Rewrite `index.tsx`**

Replace the whole file. Note three things the old version did that this one must not: it printed verdicts on its own, it showed a disabled slider with a caption explaining its own corpse, and it opened with an italic line that directed the room at a prompt that wasn't loaded. All three are gone.

```tsx
"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { cn } from "@repo/design-system/lib/utils";
import type { MouseEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ConsoleChrome } from "./console-chrome";
import {
  type Band,
  bandFor,
  INITIAL_TEMP,
  type Mode,
  PROMPTS,
  selectCompletion,
} from "./selector";
import { getRevealedStage, setRevealedStage } from "./session-store";
import {
  advance,
  type Stage,
  showsDial,
  showsDialWhisper,
  showsModeSwitch,
  showsOffer,
  showsPromptSelector,
  showsReset,
} from "./stage";
import { verdictFor } from "./verdicts";

const STREAM_MS = 18;

interface RunSnapshot {
  band: Band;
  isQuestion: boolean;
  mode: Mode;
}

export function Era1Playground() {
  const [stage, setStage] = useState<Stage>(getRevealedStage);
  const [promptId, setPromptId] = useState(PROMPTS[0].id);
  const [temp, setTemp] = useState(INITIAL_TEMP);
  const [mode, setMode] = useState<Mode>("base");
  const [shown, setShown] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [lastRun, setLastRun] = useState<RunSnapshot | null>(null);
  const [verdict, setVerdict] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const prompt = PROMPTS.find((p) => p.id === promptId) ?? PROMPTS[0];

  const stop = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    setStreaming(false);
  }, []);

  const clear = useCallback(() => {
    stop();
    setShown("");
    setLastRun(null);
    setVerdict(null);
  }, [stop]);

  const run = useCallback(
    (runMode: Mode) => {
      stop();
      setVerdict(null);
      setLastRun({
        band: bandFor(temp),
        isQuestion: prompt.isQuestion,
        mode: runMode,
      });
      const full = selectCompletion(promptId, temp, runMode);
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduce) {
        setShown(full);
        return;
      }
      setShown("");
      setStreaming(true);
      let i = 0;
      timer.current = setInterval(() => {
        i += 1;
        setShown(full.slice(0, i));
        if (i >= full.length) {
          stop();
        }
      }, STREAM_MS);
    },
    [promptId, prompt.isQuestion, temp, stop]
  );

  const reveal = useCallback((next: Stage) => {
    setStage(next);
    setRevealedStage(next);
  }, []);

  const handleRun = useCallback(() => run(mode), [run, mode]);

  const handleVerdict = useCallback(() => {
    if (!lastRun) {
      return;
    }
    setVerdict(verdictFor(lastRun));
    reveal(advance(stage, { type: "verdict", ...lastRun }));
  }, [lastRun, reveal, stage]);

  const handleAcceptOffer = useCallback(() => {
    reveal(advance(stage, { type: "accept-offer" }));
    setMode("instruct");
    run("instruct");
  }, [reveal, run, stage]);

  const handleModeChange = useCallback(
    (next: Mode) => {
      clear();
      setMode(next);
    },
    [clear]
  );

  const handlePromptClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const id = event.currentTarget.dataset.prompt;
      if (!id) {
        return;
      }
      clear();
      setPromptId(id);
    },
    [clear]
  );

  const handleReset = useCallback(() => {
    clear();
    setPromptId(PROMPTS[0].id);
    setMode("base");
    setTemp(INITIAL_TEMP);
    reveal("continuation");
  }, [clear, reveal]);

  useEffect(() => stop, [stop]);

  const armed = lastRun !== null && !streaming && verdict === null;

  return (
    <div className="mb-6">
      <div className="overflow-hidden rounded-xl border border-foreground/10 bg-background">
        <ConsoleChrome
          mode={mode}
          onModeChange={handleModeChange}
          onReset={handleReset}
          onTempChange={setTemp}
          showDial={showsDial(stage, mode)}
          showReset={showsReset(stage)}
          showSwitch={showsModeSwitch(stage)}
          temp={temp}
        />

        {showsDialWhisper(stage) && (
          <p className="border-foreground/10 border-b px-4 py-2 font-mono text-[11px] text-muted-foreground sm:px-6">
            temperature — how much the dice get to decide
          </p>
        )}

        <div className="p-4 sm:p-6">
          {showsPromptSelector(stage) && (
            <div className="mb-4 flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
                prompt
              </span>
              {PROMPTS.map((p) => (
                <button
                  className={cn(
                    "border-b-2 pb-0.5 font-mono text-sm transition-colors",
                    p.id === promptId
                      ? "border-ht-cyan-500 text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                  data-prompt={p.id}
                  key={p.id}
                  onClick={handlePromptClick}
                  type="button"
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          <pre className="min-h-40 overflow-x-auto whitespace-pre-wrap rounded-lg border border-foreground/10 bg-muted/40 p-4 font-mono text-[15px] leading-7">
            <span className="text-foreground">{prompt.prefix}</span>
            <span className="text-ht-cyan-700 dark:text-ht-cyan-300">
              {shown}
            </span>
            {streaming && <span className="animate-pulse">▋</span>}
          </pre>

          <div className="mt-4 flex justify-end">
            <Button onClick={handleRun} type="button">
              Run ⏎
            </Button>
          </div>
        </div>

        {(armed || verdict !== null) && (
          <div className="border-foreground/10 border-t px-4 py-3 sm:px-6">
            {verdict === null ? (
              <button
                className="font-mono text-muted-foreground text-sm hover:text-foreground"
                onClick={handleVerdict}
                type="button"
              >
                ↩ what just happened
              </button>
            ) : (
              <p className="max-w-2xl text-foreground/55 text-sm italic">
                {verdict}
              </p>
            )}
          </div>
        )}
      </div>

      {showsOffer(stage) && (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl border border-foreground/15 border-dashed px-4 py-3 sm:px-6">
          <span className="font-mono text-muted-foreground text-xs">2022</span>
          <span className="text-foreground/70 text-sm">
            humans taught it a format
          </span>
          <Button
            className="ml-auto"
            onClick={handleAcceptOffer}
            size="sm"
            type="button"
          >
            Load the post-trained model →
          </Button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run the suite and typecheck**

Run: `cd apps/web && bun test && bun run typecheck`

Expected: 93 pass, 0 fail. Typecheck clean.

- [ ] **Step 5: Lint the changed files**

Run from the repo root:

```bash
bunx biome check "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/index.tsx" \
                 "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/completions.ts"
```

Expected: no findings. Every handler is `useCallback`-bound and the two `.map()`s dispatch through `dataset`, so `noJsxPropsBind` has nothing to catch.

- [ ] **Step 6: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/index.tsx" \
        "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/completions.ts"
git commit -m "feat(masterclass): Era I reveals itself one beat at a time"
```

---

### Task 5: Walk the beats on the dev server

**Files:** none — this task verifies behaviour that unit tests can't reach.

**Interfaces:**
- Consumes: the whole demo as shipped by Tasks 1–4.
- Produces: a confirmed beat walk, or a list of defects to fix before handing back.

- [ ] **Step 1: Start the dev server**

Run: `turbo dev --filter=web` and open `http://localhost:3001/en/learn/masterclass-28-07-2026?step=completion`

- [ ] **Step 2: Walk the four beats and check each gate**

Confirm, in order:

1. **S0** — the console shows only the nameplate `davinci-002 · base`, the half-written function, and `Run ⏎`. No prompt selector, no dial, no mode control, no `↺`.
2. Press `Run` — the completion streams in cyan. When it stops, `↩ what just happened` appears; **nothing else appears on its own.**
3. Tap it — the verdict prints in its place, and the **prompt selector materialises** with `a question` unselected.
4. Tap `a question`, `Run`, tap the verdict — the **dial** enters the chrome and the whisper line reads `temperature — how much the dice get to decide`.
5. `Run` again without touching the dial, tap the verdict — **no offer appears** (the gate holds).
6. Push the dial to ~1.4, `Run`, tap the verdict — the **offer strip** appears below the console.
7. Press `Load the post-trained model →` — the nameplate **morphs into the switch**, the dial **retracts**, and the same question **auto-runs and gets answered**.
8. Flip the switch back to `base` — the dial **returns**. Flip to `post-trained` — it leaves again.

- [ ] **Step 3: Check the two hazards**

- **Step navigation:** press `→` to Era II, then `←` back. The demo must still be at the flip, not re-locked. Then reload the page — it must be back at S0.
- **Arrow keys vs the dial:** focus the temperature slider and press `←`/`→`. The slider must move and the **step must not change** (`isArrowConsumingTarget` already guards this; confirm the new markup didn't break it).

- [ ] **Step 4: Check it at projector size**

Zoom the browser to 150% and confirm the output block, the prompt labels, and the switch are all legible, and that the chrome doesn't wrap into an ugly stack at `sm`.

- [ ] **Step 5: Report**

Report the walk back to Eric with anything that felt wrong under the hand, especially: the morph's speed, whether `↩ what just happened` is discoverable enough for a cold reader, and whether the offer strip is too loud sitting under the console.

---

## Self-Review

**Spec coverage.** Presentation frame → Tasks 1 and 4. Stage machine (all five stages, both special gates) → Task 1, walked in Task 5. Console anatomy and visual grammar → Tasks 3 and 4. Colour discipline → global constraints, asserted in Task 2's last test. Projection legibility → Task 4 (`text-[15px] leading-7`, `text-sm` controls), checked in Task 5 Step 4. Copy consequences (labels, cut italic, band-aware verdicts, the whisper) → Tasks 2 and 4. Code shape (five files) → Tasks 1–4. Testing → Tasks 1, 2, and 5. Out-of-scope items are untouched: no task edits Era II–IV, the stepper, the scrim, or the key handler, and none binds `Enter`.

**Placeholders.** None. Every code step carries the code it needs; every test step carries its assertions and its expected output.

**Type consistency.** `Stage`, `StageEvent`, `Band`, `Mode`, `RunSnapshot` are spelled the same in every task. `RunSnapshot` is structurally the `verdictFor` argument and the `verdict` event's payload minus `type`, which is why `{ type: "verdict", ...lastRun }` typechecks. `INITIAL_TEMP` is declared once in `selector.ts` and read by `stage.ts` and `index.tsx`. `showsDial` takes `(stage, mode)`; every other `shows*` takes `(stage)` — matched at all call sites.
