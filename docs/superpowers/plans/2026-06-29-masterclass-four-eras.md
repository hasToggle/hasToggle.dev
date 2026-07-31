# Masterclass: The Four Eras of Developer–AI Interaction — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a self-guided, six-step interactive web exhibit at `/[locale]/learn/masterclass-28-07-2026` that makes the four eras of developer–AI interaction *felt*, each as a playable demo, with the psychology arc as the spine.

**Architecture:** One server `page.tsx` (standalone chrome, `noindex`) renders a single client island `Masterclass` that drives a 6-step stepper (URL-synced via `nuqs`). Each era's *logic* lives in pure, unit-tested modules (`bun:test`); the React surfaces consume those modules and are verified by typecheck + manual preview. Era 4's generative dashboard sits behind a `generateDashboard(question)` seam backed by a curated cache of real json-render specs.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript (strict), `nuqs`, `motion/react`, `recharts` via `@repo/design-system` `chart.tsx`, Tailwind v4, Bun test runner, Biome/ultracite.

## Global Constraints

- **Route (exact):** `apps/web/app/[locale]/learn/masterclass-28-07-2026/`. EN-only; no i18n entries.
- **Standalone chrome:** the page does NOT render the marketing `Navbar` or `Footer`. It inherits only `[locale]/layout.tsx` (fonts + `NuqsAdapter`).
- **Metadata:** `export const metadata` includes `robots: { index: false, follow: false }`.
- **Never blank when shared:** no demo may require a network/LLM call to function. Era 4 reads only the curated cache in the shipped build; any future live path must fail safe to the cache.
- **Reuse house primitives:** `Container`, `Heading`, `Subheading`, `MetaAside`, `Expandable` from `apps/web/app/[locale]/components/`; `motion`/`AnimatePresence` from `"motion/react"`; design-system components via `@repo/design-system/components/ui/*`; `cn` from `@repo/design-system/lib/utils`.
- **Accessibility:** respect `prefers-reduced-motion` (animations degrade to instant end states); stepper is keyboard-navigable; every demo has a readable static end state.
- **Era labels & vibe words (verbatim):** I · Completion — *skepticism*; II · Companion — *guarded fascination*; III · Agent — *the trust pivot*; IV · Runtime — *architectural liberation*.
- **Tests:** `bun:test` (`import { describe, expect, test } from "bun:test"`), pure-logic only. Run from `apps/web`: `bun test <path-substring>`. Typecheck: `cd apps/web && bun run typecheck`. Lint/format: `bun run check` (root). Do not attempt to render React in `bun:test` — there is no DOM env configured.
- **Commits:** one commit per task, conventional-commit style, end with the Co-Authored-By trailer below.

```
Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```

## File Structure

All paths under `apps/web/app/[locale]/learn/masterclass-28-07-2026/`:

- `page.tsx` — server component; metadata (`noindex`); renders `<Masterclass />`.
- `masterclass.tsx` — client island; stepper state (nuqs), header, prev/next, renders current step.
- `steps.ts` (+ `steps.test.ts`) — step config + navigation helpers (pure).
- `stepper-header.tsx` — persistent stepper header with vibe words.
- `era-panel.tsx` — shared era anatomy (framing + full-width demo slot + `Expandable`).
- `intro.tsx`, `synthesis.tsx` — bespoke Step 0 and Step 5.
- `demos/era1-playground/` — `completions.ts`, `selector.ts` (+ `selector.test.ts`), `index.tsx`.
- `demos/era2-companion/` — `suggestions.ts`, `apply.ts` (+ `apply.test.ts`), `index.tsx`.
- `demos/era3-harness/` — `diff-data.ts`, `reducer.ts` (+ `reducer.test.ts`), `index.tsx`.
- `demos/era4-runtime/` — `render-spec.ts`, `cache.ts`, `match.ts` (+ `match.test.ts`), `generate-dashboard.ts` (+ `generate-dashboard.test.ts`), `dashboard-renderer.tsx`, `company-brain.tsx`, `index.tsx`.

---

### Task 1: Step config + stepper shell (route scaffold)

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/steps.ts`
- Test: `apps/web/app/[locale]/learn/masterclass-28-07-2026/steps.test.ts`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/stepper-header.tsx`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/masterclass.tsx`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/page.tsx`

**Interfaces:**
- Produces:
  - `type StepId = "intro" | "era-1" | "era-2" | "era-3" | "era-4" | "synthesis"`
  - `interface Step { id: StepId; label: string; era?: string; vibe?: string }`
  - `const STEPS: readonly Step[]`
  - `getStepIndex(id: StepId): number`
  - `getAdjacentStep(id: StepId, dir: "prev" | "next"): StepId | null`
  - `isStepId(value: string): value is StepId`

- [ ] **Step 1: Write the failing test**

Create `steps.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import { getAdjacentStep, getStepIndex, isStepId, STEPS } from "./steps";

describe("masterclass steps", () => {
  test("has six ordered steps starting at intro, ending at synthesis", () => {
    expect(STEPS.map((s) => s.id)).toEqual([
      "intro",
      "era-1",
      "era-2",
      "era-3",
      "era-4",
      "synthesis",
    ]);
  });

  test("the four eras carry their verbatim vibe words", () => {
    const vibes = STEPS.filter((s) => s.vibe).map((s) => s.vibe);
    expect(vibes).toEqual([
      "skepticism",
      "guarded fascination",
      "the trust pivot",
      "architectural liberation",
    ]);
  });

  test("getStepIndex returns position", () => {
    expect(getStepIndex("intro")).toBe(0);
    expect(getStepIndex("era-3")).toBe(3);
  });

  test("getAdjacentStep walks forward and back, clamping at ends", () => {
    expect(getAdjacentStep("intro", "prev")).toBeNull();
    expect(getAdjacentStep("intro", "next")).toBe("era-1");
    expect(getAdjacentStep("era-4", "next")).toBe("synthesis");
    expect(getAdjacentStep("synthesis", "next")).toBeNull();
  });

  test("isStepId narrows valid ids only", () => {
    expect(isStepId("era-2")).toBe(true);
    expect(isStepId("nope")).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/web && bun test steps`
Expected: FAIL (cannot find module `./steps`).

- [ ] **Step 3: Write `steps.ts`**

```ts
export type StepId =
  | "intro"
  | "era-1"
  | "era-2"
  | "era-3"
  | "era-4"
  | "synthesis";

export interface Step {
  id: StepId;
  label: string;
  era?: string;
  vibe?: string;
}

export const STEPS: readonly Step[] = [
  { id: "intro", label: "Intro" },
  { id: "era-1", label: "I · Completion", era: "Era I", vibe: "skepticism" },
  {
    id: "era-2",
    label: "II · Companion",
    era: "Era II",
    vibe: "guarded fascination",
  },
  { id: "era-3", label: "III · Agent", era: "Era III", vibe: "the trust pivot" },
  {
    id: "era-4",
    label: "IV · Runtime",
    era: "Era IV",
    vibe: "architectural liberation",
  },
  { id: "synthesis", label: "Synthesis" },
] as const;

const IDS = STEPS.map((s) => s.id);

export function isStepId(value: string): value is StepId {
  return (IDS as string[]).includes(value);
}

export function getStepIndex(id: StepId): number {
  return IDS.indexOf(id);
}

export function getAdjacentStep(
  id: StepId,
  dir: "prev" | "next"
): StepId | null {
  const next = getStepIndex(id) + (dir === "next" ? 1 : -1);
  return STEPS[next]?.id ?? null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd apps/web && bun test steps`
Expected: PASS (5 tests).

- [ ] **Step 5: Write `stepper-header.tsx`**

```tsx
"use client";

import { cn } from "@repo/design-system/lib/utils";
import { type Step, STEPS, type StepId } from "./steps";

interface StepperHeaderProps {
  current: StepId;
  onSelect: (id: StepId) => void;
}

export function StepperHeader({ current, onSelect }: StepperHeaderProps) {
  return (
    <nav
      aria-label="Masterclass progress"
      className="sticky top-0 z-10 border-foreground/10 border-b bg-background/80 backdrop-blur"
    >
      <ol className="mx-auto flex max-w-5xl items-stretch px-4">
        {STEPS.map((step: Step) => {
          const active = step.id === current;
          return (
            <li className="flex-1" key={step.id}>
              <button
                aria-current={active ? "step" : undefined}
                className={cn(
                  "w-full border-b-2 px-2 py-3 text-center transition-colors",
                  active
                    ? "border-ht-cyan-500 text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
                onClick={() => onSelect(step.id)}
                type="button"
              >
                <span className="block font-medium text-xs sm:text-sm">
                  {step.label}
                </span>
                {step.vibe && (
                  <span className="mt-0.5 block font-mono text-[10px] text-muted-foreground/70 tracking-wide">
                    {step.vibe}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
```

- [ ] **Step 6: Write `masterclass.tsx`** (placeholder step bodies; real ones land in later tasks)

```tsx
"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { getAdjacentStep, STEPS, type StepId } from "./steps";
import { StepperHeader } from "./stepper-header";

const STEP_IDS = STEPS.map((s) => s.id);

export function Masterclass() {
  const [step, setStep] = useQueryState(
    "step",
    parseAsStringLiteral(STEP_IDS as StepId[])
      .withDefault("intro")
      .withOptions({ history: "push" })
  );

  const prev = getAdjacentStep(step, "prev");
  const next = getAdjacentStep(step, "next");

  return (
    <div className="flex min-h-dvh flex-col">
      <StepperHeader current={step} onSelect={setStep} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:py-16">
        {/* Step bodies wired in later tasks */}
        <p className="font-mono text-muted-foreground text-sm">step: {step}</p>
      </main>
      <footer className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-8">
        <Button
          disabled={!prev}
          onClick={() => prev && setStep(prev)}
          type="button"
          variant="ghost"
        >
          ← Back
        </Button>
        <Button
          disabled={!next}
          onClick={() => next && setStep(next)}
          type="button"
        >
          Next →
        </Button>
      </footer>
    </div>
  );
}
```

- [ ] **Step 7: Write `page.tsx`**

```tsx
import type { Metadata } from "next";
import { Masterclass } from "./masterclass";

export const metadata: Metadata = {
  title: "The Four Eras of Developer–AI Interaction — Masterclass",
  description:
    "An interactive walk through how developer–AI interaction evolved — and how the developer's role transformed with it.",
  robots: { index: false, follow: false },
};

export default function MasterclassPage() {
  return <Masterclass />;
}
```

- [ ] **Step 8: Typecheck and lint**

Run: `cd apps/web && bun run typecheck` → Expected: no errors.
Run (from repo root): `bun run check` → Expected: no errors on new files.

- [ ] **Step 9: Manual verify**

Run: `cd apps/web && bun dev` (port 3001). Visit `http://localhost:3001/en/learn/masterclass-28-07-2026`. Confirm: stepper header shows 6 steps with vibe words; clicking a step and Back/Next updates the `?step=` URL; Back is disabled on Intro, Next disabled on Synthesis; no marketing nav/footer present.

- [ ] **Step 10: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026"
git commit -m "feat(masterclass): step config and stepper shell

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Era-panel anatomy + Intro + Synthesis

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/era-panel.tsx`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/intro.tsx`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/synthesis.tsx`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/masterclass.tsx`

**Interfaces:**
- Consumes: `StepId` (Task 1).
- Produces:
  - `interface EraPanelProps { era: string; years: string; name: string; reality: string; vibe: string; expandLabel: string; deepCut: React.ReactNode; children: React.ReactNode }`
  - `function EraPanel(props: EraPanelProps): JSX.Element`
  - `function Intro({ onBegin }: { onBegin: () => void }): JSX.Element`
  - `function Synthesis(): JSX.Element`

This task is presentational; gate is typecheck + lint + manual (no DOM test runner).

- [ ] **Step 1: Write `era-panel.tsx`**

```tsx
import { Expandable } from "../../components/expandable";
import { Heading, Subheading } from "../../components/text";

interface EraPanelProps {
  era: string;
  years: string;
  name: string;
  reality: string;
  vibe: string;
  expandLabel: string;
  deepCut: React.ReactNode;
  children: React.ReactNode;
}

export function EraPanel({
  era,
  years,
  name,
  reality,
  vibe,
  expandLabel,
  deepCut,
  children,
}: EraPanelProps) {
  return (
    <section className="fade-in animate-in duration-300">
      <Subheading>
        {era} · {years}
      </Subheading>
      <Heading as="h2" className="mt-3 text-4xl sm:text-5xl">
        {name}
      </Heading>
      <p className="mt-5 max-w-2xl text-foreground/75 text-lg leading-8">
        {reality}
      </p>
      <p className="mt-3 font-display text-ht-cyan-700 text-xl italic dark:text-ht-cyan-300">
        Vibe: {vibe}
      </p>
      <div className="mt-10">{children}</div>
      <Expandable label={expandLabel}>{deepCut}</Expandable>
    </section>
  );
}
```

- [ ] **Step 2: Write `intro.tsx`**

```tsx
"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Heading, Subheading } from "../../components/text";

export function Intro({ onBegin }: { onBegin: () => void }) {
  return (
    <section className="fade-in animate-in py-10 duration-300 sm:py-16">
      <Subheading>A masterclass · 2026-07-28</Subheading>
      <Heading
        as="h1"
        className="mt-4 text-balance text-5xl sm:text-6xl md:text-7xl"
      >
        The Four Eras of Developer–AI Interaction
      </Heading>
      <p className="mt-8 max-w-2xl text-balance text-foreground/75 text-xl leading-9">
        Your role is shifting — from writing code syntax to architecting
        AI-native ecosystems. We&apos;ll walk four eras of how we work with
        these models. Watch the tech change. Watch the{" "}
        <em>vibe</em> change more.
      </p>
      <p className="mt-4 max-w-2xl text-foreground/55 text-base leading-7">
        Skepticism → guarded fascination → the trust pivot → architectural
        liberation. The model kept changing. The thing that makes the work
        yours didn&apos;t.
      </p>
      <Button className="mt-10" onClick={onBegin} size="lg" type="button">
        Begin →
      </Button>
    </section>
  );
}
```

- [ ] **Step 3: Write `synthesis.tsx`**

```tsx
import { Heading, Subheading } from "../../components/text";

export function Synthesis() {
  return (
    <section className="fade-in animate-in py-10 duration-300 sm:py-16">
      <Subheading>Where this leaves you</Subheading>
      <Heading as="h2" className="mt-3 text-4xl sm:text-5xl">
        The model changed. You didn&apos;t.
      </Heading>
      <div className="mt-8 max-w-2xl space-y-5 text-foreground/75 text-lg leading-8">
        <p>
          Skepticism, then guarded fascination, then the trust pivot, then
          architectural liberation. Four eras, four postures — and one constant
          underneath all of them.
        </p>
        <p>
          Across every era, the thing that made the work <em>yours</em> was
          never the syntax. It was the judgment: what to ask, what to trust,
          where to draw the boundary, what counts as done.
        </p>
        <p className="font-display text-2xl text-foreground italic">
          AI produces the artifact. You hold the meaning.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Wire steps into `masterclass.tsx`**

Replace the `<main>` body placeholder. Full new `<main>` block:

```tsx
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:py-16">
        {step === "intro" && <Intro onBegin={() => setStep("era-1")} />}
        {step === "era-1" && <Era1Placeholder />}
        {step === "era-2" && <Era2Placeholder />}
        {step === "era-3" && <Era3Placeholder />}
        {step === "era-4" && <Era4Placeholder />}
        {step === "synthesis" && <Synthesis />}
      </main>
```

Add imports at top of `masterclass.tsx`:

```tsx
import { Intro } from "./intro";
import { Synthesis } from "./synthesis";
```

Add these temporary placeholders at the bottom of `masterclass.tsx` (each replaced in its era task):

```tsx
function Era1Placeholder() {
  return <p className="font-mono text-muted-foreground text-sm">Era 1 demo</p>;
}
function Era2Placeholder() {
  return <p className="font-mono text-muted-foreground text-sm">Era 2 demo</p>;
}
function Era3Placeholder() {
  return <p className="font-mono text-muted-foreground text-sm">Era 3 demo</p>;
}
function Era4Placeholder() {
  return <p className="font-mono text-muted-foreground text-sm">Era 4 demo</p>;
}
```

- [ ] **Step 5: Typecheck, lint, manual verify**

Run: `cd apps/web && bun run typecheck` → no errors.
Run: `bun run check` → no errors.
Manual: reload the page; Intro shows title + thesis + "Begin →" (advances to Era 1); Synthesis renders its copy; era steps show placeholders.

- [ ] **Step 6: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026"
git commit -m "feat(masterclass): era panel anatomy, intro and synthesis steps

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Era 1 — Playground demo (JavaScript)

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/completions.ts`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/selector.ts`
- Test: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/selector.test.ts`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/index.tsx`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/masterclass.tsx`

**Interfaces:**
- Produces:
  - `type Band = "low" | "mid" | "high"`
  - `bandFor(temp: number): Band`
  - `interface PromptSeed { id: string; label: string; isQuestion: boolean; prefix: string; continuations: Record<Band, string> }`
  - `const PROMPTS: readonly PromptSeed[]`
  - `selectCompletion(id: string, temp: number): string`
  - `function Era1Playground(): JSX.Element`

- [ ] **Step 1: Write the failing test**

Create `selector.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import { bandFor, PROMPTS, selectCompletion } from "./selector";

describe("era1 selector", () => {
  test("bandFor splits the temperature range", () => {
    expect(bandFor(0.1)).toBe("low");
    expect(bandFor(0.7)).toBe("mid");
    expect(bandFor(1.3)).toBe("high");
  });

  test("selectCompletion returns the band-specific continuation", () => {
    const fn = PROMPTS.find((p) => p.id === "reverse-fn");
    expect(fn).toBeDefined();
    expect(selectCompletion("reverse-fn", 0.1)).toBe(fn?.continuations.low);
    expect(selectCompletion("reverse-fn", 1.3)).toBe(fn?.continuations.high);
  });

  test("the question prompt never answers — it continues into more questions", () => {
    const q = PROMPTS.find((p) => p.id === "how-do-i");
    expect(q?.isQuestion).toBe(true);
    // Every continuation keeps asking rather than answering.
    for (const band of ["low", "mid", "high"] as const) {
      expect(q?.continuations[band]).toContain("?");
    }
  });

  test("unknown id falls back to an empty string (never throws)", () => {
    expect(selectCompletion("nope", 0.5)).toBe("");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/web && bun test era1-playground/selector`
Expected: FAIL (cannot find module `./selector`).

- [ ] **Step 3: Write `completions.ts`**

```ts
import type { Band } from "./selector";

export interface PromptSeed {
  id: string;
  label: string;
  isQuestion: boolean;
  prefix: string;
  continuations: Record<Band, string>;
}

export const PROMPTS: readonly PromptSeed[] = [
  {
    id: "reverse-fn",
    label: "A half-written function",
    isQuestion: false,
    prefix: "function reverseList(items) {\n  return ",
    continuations: {
      low: "items.reverse();\n}\n\nfunction reverseList(items) {\n  return items.reverse();\n}\n",
      mid: "items.slice().reverse();\n}\n\n// reverse a string too\nfunction reverseStr(s) {\n  return s.split('')",
      high: "items.reduceRight((a,b)=>[...a,b],[]);\n}\n\nconst x = 🦆; // TODO: ship it\nexport default function App(){return",
    },
  },
  {
    id: "how-do-i",
    label: "A question (watch what happens)",
    isQuestion: true,
    prefix: "// how do I reverse a list in JavaScript?\n",
    continuations: {
      low: "// how do I sort a list in JavaScript?\n// how do I filter a list in JavaScript?\n// how do I",
      mid: "// and how do I do it without mutating the original?\n// is reverse() stable?\n// why does this matter?\n",
      high: "// how do I reverse time? how do I reverse a decision?\n// what is a list, really? who is asking?\n",
    },
  },
] as const;
```

- [ ] **Step 4: Write `selector.ts`**

```ts
import { PROMPTS, type PromptSeed } from "./completions";

export type Band = "low" | "mid" | "high";

export { PROMPTS };
export type { PromptSeed };

export function bandFor(temp: number): Band {
  if (temp < 0.4) {
    return "low";
  }
  if (temp < 1.0) {
    return "mid";
  }
  return "high";
}

export function selectCompletion(id: string, temp: number): string {
  const prompt = PROMPTS.find((p) => p.id === id);
  if (!prompt) {
    return "";
  }
  return prompt.continuations[bandFor(temp)];
}
```

Note: `completions.ts` imports the `Band` type from `selector.ts` and `selector.ts` re-exports `PROMPTS`/`PromptSeed` from `completions.ts`. This split keeps data and logic separate while the type lives with the logic. Type-only import avoids a runtime cycle.

- [ ] **Step 5: Run test to verify it passes**

Run: `cd apps/web && bun test era1-playground/selector`
Expected: PASS (4 tests).

- [ ] **Step 6: Write `index.tsx`** (streaming completion + temperature slider)

```tsx
"use client";

import { Slider } from "@repo/design-system/components/ui/slider";
import { useCallback, useEffect, useRef, useState } from "react";
import { bandFor, PROMPTS, selectCompletion } from "./selector";

const STREAM_MS = 18;

export function Era1Playground() {
  const [promptId, setPromptId] = useState(PROMPTS[0].id);
  const [temp, setTemp] = useState(0.7);
  const [shown, setShown] = useState("");
  const [streaming, setStreaming] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const prompt = PROMPTS.find((p) => p.id === promptId) ?? PROMPTS[0];

  const stop = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    setStreaming(false);
  }, []);

  const run = useCallback(() => {
    stop();
    const full = selectCompletion(promptId, temp);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
  }, [promptId, temp, stop]);

  useEffect(() => stop, [stop]);

  return (
    <div className="rounded-xl border border-foreground/10 bg-background p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap gap-2">
        {PROMPTS.map((p) => (
          <button
            className={`rounded-full border px-3 py-1 text-xs ${
              p.id === promptId
                ? "border-ht-cyan-500 text-foreground"
                : "border-foreground/15 text-muted-foreground hover:text-foreground"
            }`}
            key={p.id}
            onClick={() => {
              setPromptId(p.id);
              setShown("");
            }}
            type="button"
          >
            {p.label}
          </button>
        ))}
      </div>

      <pre className="min-h-40 overflow-x-auto whitespace-pre-wrap rounded-lg border border-foreground/10 bg-muted/40 p-4 font-mono text-sm leading-relaxed">
        <span className="text-foreground">{prompt.prefix}</span>
        <span className="text-ht-cyan-700 dark:text-ht-cyan-300">{shown}</span>
        {streaming && <span className="animate-pulse">▋</span>}
      </pre>

      <div className="mt-4 flex items-center gap-4">
        <span className="font-mono text-muted-foreground text-xs uppercase tracking-wide">
          temperature
        </span>
        <Slider
          className="max-w-xs flex-1"
          max={1.5}
          min={0}
          onValueChange={([v]) => setTemp(v)}
          step={0.1}
          value={[temp]}
        />
        <span className="font-mono text-muted-foreground text-xs">
          {temp.toFixed(1)} · {bandFor(temp)}
        </span>
        <button
          className="ml-auto rounded-md bg-foreground px-4 py-1.5 text-background text-sm"
          onClick={run}
          type="button"
        >
          Submit ⏎
        </button>
      </div>

      {prompt.isQuestion && shown.length > 0 && !streaming && (
        <p className="mt-4 text-foreground/55 text-sm italic">
          You asked a question. It didn&apos;t answer — it just kept going.
          There&apos;s no one in there to ask.
        </p>
      )}
    </div>
  );
}
```

Note: confirm `slider` exists at `@repo/design-system/components/ui/slider`. If absent, run `cd packages/design-system && bunx shadcn@latest add slider` (the repo's documented `bump-ui` flow), then re-run typecheck.

- [ ] **Step 7: Wire into `masterclass.tsx`**

Add import: `import { Era1Playground } from "./demos/era1-playground";` (create `demos/era1-playground/index.tsx`'s component is named `Era1Playground`; export it from that file).

Replace `{step === "era-1" && <Era1Placeholder />}` with:

```tsx
        {step === "era-1" && (
          <EraPanel
            deepCut={
              <p>
                There was no intent model here — only continuation. You
                weren&apos;t asking; you were seeding a pattern and hoping. That
                unpredictability is exactly why it read as a neat trick, not a
                tool.
              </p>
            }
            era="Era I"
            expandLabel="Did you know? It was never listening."
            name="Raw pattern matching"
            reality="You can't ask it anything. You feed it the start of a pattern and it continues — unaware of what you meant, and rarely twice the same way."
            vibe="skepticism"
            years="2019–2021"
          >
            <Era1Playground />
          </EraPanel>
        )}
```

Add import: `import { EraPanel } from "./era-panel";`. Remove the `Era1Placeholder` function.

- [ ] **Step 8: Typecheck, lint, manual verify**

Run: `cd apps/web && bun run typecheck` → no errors.
Run: `bun run check` → no errors.
Manual: on Era 1, pick the "question" chip, hit Submit — confirm it streams *more questions*, not an answer, and the italic note appears; drag temperature to max and Submit again — output derails.

- [ ] **Step 9: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026"
git commit -m "feat(masterclass): era 1 playground demo

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Era 2 — Companion demo (chat panel + ghost text + mismatch twist)

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/suggestions.ts`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/apply.ts`
- Test: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/apply.test.ts`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/index.tsx`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/masterclass.tsx`

**Interfaces:**
- Produces:
  - `interface FileModel { lines: string[] }`
  - `interface Suggestion { code: string[]; insertAfterLine: number; missingRef: string; fixLine: string }`
  - `const INITIAL_FILE: FileModel`
  - `const SUGGESTION: Suggestion`
  - `applySuggestion(file: FileModel, s: Suggestion): { file: FileModel; hasMismatch: boolean; mismatchRef: string }`
  - `resolveMismatch(file: FileModel, s: Suggestion): FileModel`
  - `function Era2Companion(): JSX.Element`

- [ ] **Step 1: Write the failing test**

Create `apply.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import {
  applySuggestion,
  INITIAL_FILE,
  resolveMismatch,
  SUGGESTION,
} from "./apply";

describe("era2 apply", () => {
  test("applying inserts the suggested block after the target line", () => {
    const { file } = applySuggestion(INITIAL_FILE, SUGGESTION);
    expect(file.lines.length).toBe(
      INITIAL_FILE.lines.length + SUGGESTION.code.length
    );
    expect(file.lines[SUGGESTION.insertAfterLine + 1]).toBe(SUGGESTION.code[0]);
  });

  test("applying flags the mismatch because the block references a missing symbol", () => {
    const { hasMismatch, mismatchRef } = applySuggestion(
      INITIAL_FILE,
      SUGGESTION
    );
    expect(hasMismatch).toBe(true);
    expect(mismatchRef).toBe(SUGGESTION.missingRef);
    // The original file does not define the referenced symbol.
    expect(INITIAL_FILE.lines.join("\n")).not.toContain(SUGGESTION.missingRef);
  });

  test("resolving the mismatch adds the missing definition", () => {
    const applied = applySuggestion(INITIAL_FILE, SUGGESTION).file;
    const fixed = resolveMismatch(applied, SUGGESTION);
    expect(fixed.lines.join("\n")).toContain(SUGGESTION.fixLine.trim());
  });

  test("applySuggestion does not mutate the input file", () => {
    const before = INITIAL_FILE.lines.length;
    applySuggestion(INITIAL_FILE, SUGGESTION);
    expect(INITIAL_FILE.lines.length).toBe(before);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/web && bun test era2-companion/apply`
Expected: FAIL (cannot find module `./apply`).

- [ ] **Step 3: Write `suggestions.ts`**

```ts
export interface FileModel {
  lines: string[];
}

export interface Suggestion {
  code: string[];
  insertAfterLine: number;
  missingRef: string;
  fixLine: string;
}

export const INITIAL_FILE: FileModel = {
  lines: [
    "function applyDiscount(cart, code) {",
    "  const rate = DISCOUNTS[code];",
    "  return cart.total * (1 - rate);",
    "}",
  ],
};

// The assistant only saw the selection — it invents `logEvent`, which this
// file never imports or defines. Applying compiles a reference to nothing.
export const SUGGESTION: Suggestion = {
  insertAfterLine: 1,
  missingRef: "logEvent",
  fixLine: 'import { logEvent } from "./analytics";',
  code: [
    "  if (!(code in DISCOUNTS)) {",
    '    logEvent("bad_discount_code", { code });',
    '    throw new Error("Unknown discount code");',
    "  }",
  ],
};
```

- [ ] **Step 4: Write `apply.ts`**

```ts
import {
  type FileModel,
  INITIAL_FILE,
  type Suggestion,
  SUGGESTION,
} from "./suggestions";

export { INITIAL_FILE, SUGGESTION };
export type { FileModel, Suggestion };

export function applySuggestion(
  file: FileModel,
  s: Suggestion
): { file: FileModel; hasMismatch: boolean; mismatchRef: string } {
  const lines = [...file.lines];
  lines.splice(s.insertAfterLine + 1, 0, ...s.code);
  const defined = file.lines.join("\n").includes(s.missingRef);
  return {
    file: { lines },
    hasMismatch: !defined,
    mismatchRef: s.missingRef,
  };
}

export function resolveMismatch(file: FileModel, s: Suggestion): FileModel {
  return { lines: [s.fixLine, "", ...file.lines] };
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd apps/web && bun test era2-companion/apply`
Expected: PASS (4 tests).

- [ ] **Step 6: Write `index.tsx`** (editor + ghost text + chat panel + Apply/fix flow)

```tsx
"use client";

import { useState } from "react";
import {
  applySuggestion,
  INITIAL_FILE,
  resolveMismatch,
  SUGGESTION,
} from "./apply";

type Phase = "initial" | "applied" | "resolved";

export function Era2Companion() {
  const [phase, setPhase] = useState<Phase>("initial");
  const [file, setFile] = useState(INITIAL_FILE);
  const [ghostAccepted, setGhostAccepted] = useState(false);

  const apply = () => {
    const { file: next } = applySuggestion(INITIAL_FILE, SUGGESTION);
    setFile(next);
    setPhase("applied");
  };
  const fix = () => {
    setFile((f) => resolveMismatch(f, SUGGESTION));
    setPhase("resolved");
  };
  const reset = () => {
    setFile(INITIAL_FILE);
    setPhase("initial");
    setGhostAccepted(false);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-foreground/10">
      <div className="grid md:grid-cols-[1.4fr_1fr]">
        {/* editor */}
        <div className="bg-[#1e1e1e] p-4 font-mono text-[#d4d4d4] text-xs leading-6">
          <div className="mb-2 text-[#858585]">checkout.js</div>
          {file.lines.map((line, i) => {
            const bad = phase === "applied" && line.includes(SUGGESTION.missingRef);
            return (
              <div
                className={bad ? "bg-[#5a1d1d]" : undefined}
                key={`${i}-${line}`}
              >
                {line || " "}
              </div>
            );
          })}
          {phase === "initial" && (
            <button
              className="mt-1 block w-full text-left text-[#858585] italic hover:text-[#bbb]"
              onClick={() => setGhostAccepted(true)}
              type="button"
            >
              {ghostAccepted
                ? "  // discount applied"
                : "  // ghost: press to accept →"}
            </button>
          )}
        </div>

        {/* chat panel */}
        <div className="bg-[#252526] p-4 text-[#ccc] text-xs">
          <div className="mb-2 text-[#858585] uppercase tracking-wide">Chat</div>
          <div className="mb-2 rounded bg-[#2d2d30] px-2 py-1.5">
            add validation so an unknown code doesn&apos;t crash
          </div>
          <div className="rounded border border-[#3c3c3c] bg-[#1e1e1e] p-2 font-mono leading-5">
            {SUGGESTION.code.map((l) => (
              <div key={l}>{l}</div>
            ))}
            <div className="mt-2 flex gap-2">
              <button
                className="rounded bg-ht-cyan-600 px-2 py-1 text-[11px] text-white disabled:opacity-40"
                disabled={phase !== "initial"}
                onClick={apply}
                type="button"
              >
                Apply
              </button>
              <button
                className="rounded border border-[#555] px-2 py-1 text-[#aaa] text-[11px]"
                onClick={reset}
                type="button"
              >
                Reset
              </button>
            </div>
          </div>
          <p className="mt-2 text-[#858585] italic">
            It can&apos;t run it. It can&apos;t see the rest of your repo. You
            decide if it&apos;s right — and you move it.
          </p>
        </div>
      </div>

      {phase === "applied" && (
        <div className="flex items-center justify-between gap-3 bg-amber-50 px-4 py-3 text-amber-900 text-sm dark:bg-amber-950/40 dark:text-amber-200">
          <span>
            Applied — but <code>{SUGGESTION.missingRef}</code> isn&apos;t
            imported in this file. It only saw the selection, not the system.
          </span>
          <button
            className="shrink-0 rounded-md bg-amber-600 px-3 py-1 text-white"
            onClick={fix}
            type="button"
          >
            Fix it yourself
          </button>
        </div>
      )}
      {phase === "resolved" && (
        <div className="bg-emerald-50 px-4 py-3 text-emerald-800 text-sm dark:bg-emerald-950/40 dark:text-emerald-200">
          You added the import. You were the integration layer — every accept,
          file by file.
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 7: Wire into `masterclass.tsx`**

Add import: `import { Era2Companion } from "./demos/era2-companion";`. Replace `{step === "era-2" && <Era2Placeholder />}` with an `EraPanel` wrapping `<Era2Companion />`:

```tsx
        {step === "era-2" && (
          <EraPanel
            deepCut={
              <p>
                The speed was real, and so was the ceiling: the model saw one
                file, one selection. You held absolute, manual control — and
                paid for it in copy-paste and context you carried in your head.
              </p>
            }
            era="Era II"
            expandLabel="Did you know? You were the bus."
            name="Conversational companions"
            reality="It can talk now — but it's localized. It sees one file, has no repo awareness, and nothing reaches your code until you move it. You are the integration layer."
            vibe="guarded fascination"
            years="2021–2023"
          >
            <Era2Companion />
          </EraPanel>
        )}
```

Remove the `Era2Placeholder` function.

- [ ] **Step 8: Typecheck, lint, manual verify**

Run: `cd apps/web && bun run typecheck` → no errors.
Run: `bun run check` → no errors.
Manual: on Era 2, click "Apply" → the inserted `logEvent` line highlights red and the amber "isn't imported" bar appears; "Fix it yourself" prepends the import and shows the emerald note; "Reset" returns to start; the ghost-text line accepts on click.

- [ ] **Step 9: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026"
git commit -m "feat(masterclass): era 2 companion demo

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Era 3 — Harness demo (the centerpiece)

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era3-harness/diff-data.ts`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era3-harness/reducer.ts`
- Test: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era3-harness/reducer.test.ts`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era3-harness/index.tsx`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/masterclass.tsx`

**Interfaces:**
- Produces:
  - `type DiffStatus = "pending" | "resolved" | "excepted"`
  - `interface DiffItem { id: string; label: string; status: DiffStatus; log: string }`
  - `const INITIAL_DIFFS: readonly DiffItem[]`
  - `interface HarnessState { diffs: DiffItem[]; running: boolean; validated: boolean; log: string[] }`
  - `type HarnessAction = { type: "run" } | { type: "tick" } | { type: "validate" } | { type: "reset" }`
  - `function initialHarnessState(): HarnessState`
  - `function harnessReducer(state: HarnessState, action: HarnessAction): HarnessState`
  - `function remainingCount(state: HarnessState): number`
  - `function isClear(state: HarnessState): boolean`
  - `function Era3Harness(): JSX.Element`

- [ ] **Step 1: Write the failing test**

Create `reducer.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import {
  harnessReducer,
  initialHarnessState,
  isClear,
  remainingCount,
} from "./reducer";

function run(state = initialHarnessState()) {
  return harnessReducer(state, { type: "run" });
}

describe("era3 harness reducer", () => {
  test("starts with pending diffs and the iframe excepted, not validated", () => {
    const s = initialHarnessState();
    expect(s.validated).toBe(false);
    expect(s.diffs.some((d) => d.status === "excepted")).toBe(true);
    expect(remainingCount(s)).toBeGreaterThan(0);
  });

  test("excepted items never count toward remaining", () => {
    const s = initialHarnessState();
    const pending = s.diffs.filter((d) => d.status === "pending").length;
    expect(remainingCount(s)).toBe(pending);
  });

  test("tick resolves the next pending diff and logs it", () => {
    const s = run();
    const t = harnessReducer(s, { type: "tick" });
    expect(remainingCount(t)).toBe(remainingCount(s) - 1);
    expect(t.log.length).toBeGreaterThan(s.log.length);
  });

  test("ticking to zero clears all pending; isClear becomes true", () => {
    let s = run();
    while (remainingCount(s) > 0) {
      s = harnessReducer(s, { type: "tick" });
    }
    expect(isClear(s)).toBe(true);
    expect(s.running).toBe(false);
  });

  test("validate only succeeds when clear", () => {
    const notClear = run();
    expect(harnessReducer(notClear, { type: "validate" }).validated).toBe(false);
    let s = run();
    while (remainingCount(s) > 0) {
      s = harnessReducer(s, { type: "tick" });
    }
    expect(harnessReducer(s, { type: "validate" }).validated).toBe(true);
  });

  test("reset returns to the initial state", () => {
    let s = run();
    s = harnessReducer(s, { type: "tick" });
    const r = harnessReducer(s, { type: "reset" });
    expect(remainingCount(r)).toBe(remainingCount(initialHarnessState()));
    expect(r.validated).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/web && bun test era3-harness/reducer`
Expected: FAIL (cannot find module `./reducer`).

- [ ] **Step 3: Write `diff-data.ts`**

```ts
export type DiffStatus = "pending" | "resolved" | "excepted";

export interface DiffItem {
  id: string;
  label: string;
  status: DiffStatus;
  log: string;
}

export const INITIAL_DIFFS: readonly DiffItem[] = [
  {
    id: "padding",
    label: "padding-top 48px → 32px",
    status: "pending",
    log: "fixing hero padding-top…",
  },
  {
    id: "color",
    label: "heading color #1a1a1a → #333 (ΔE 4.2)",
    status: "pending",
    log: "correcting heading color…",
  },
  {
    id: "width",
    label: "heading width −16px (pixel Δ 312)",
    status: "pending",
    log: "matching heading width…",
  },
  {
    id: "button",
    label: "button width 120px → 108px",
    status: "pending",
    log: "resizing CTA button…",
  },
  {
    id: "weight",
    label: "font-weight 600 → 500",
    status: "pending",
    log: "adjusting font-weight…",
  },
  {
    id: "iframe",
    label: "stripe iframe — excepted (judgment call)",
    status: "excepted",
    log: "iframe left as-is — not worth pixel-chasing",
  },
] as const;
```

- [ ] **Step 4: Write `reducer.ts`**

```ts
import { type DiffItem, INITIAL_DIFFS } from "./diff-data";

export type { DiffItem };
export { INITIAL_DIFFS };

export interface HarnessState {
  diffs: DiffItem[];
  running: boolean;
  validated: boolean;
  log: string[];
}

export type HarnessAction =
  | { type: "run" }
  | { type: "tick" }
  | { type: "validate" }
  | { type: "reset" };

export function initialHarnessState(): HarnessState {
  return {
    diffs: INITIAL_DIFFS.map((d) => ({ ...d })),
    running: false,
    validated: false,
    log: [],
  };
}

export function remainingCount(state: HarnessState): number {
  return state.diffs.filter((d) => d.status === "pending").length;
}

export function isClear(state: HarnessState): boolean {
  return remainingCount(state) === 0;
}

export function harnessReducer(
  state: HarnessState,
  action: HarnessAction
): HarnessState {
  switch (action.type) {
    case "run":
      return {
        ...state,
        running: true,
        log: ["screenshot captured", "computed styles diffed"],
      };
    case "tick": {
      const idx = state.diffs.findIndex((d) => d.status === "pending");
      if (idx === -1) {
        return { ...state, running: false };
      }
      const diffs = state.diffs.map((d, i) =>
        i === idx ? { ...d, status: "resolved" as const } : d
      );
      const log = [...state.log, state.diffs[idx].log];
      const stillPending = diffs.some((d) => d.status === "pending");
      return {
        ...state,
        diffs,
        log: stillPending ? log : [...log, "re-running audit… 0 remaining"],
        running: stillPending,
      };
    }
    case "validate":
      return { ...state, validated: isClear(state) };
    case "reset":
      return initialHarnessState();
    default:
      return state;
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd apps/web && bun test era3-harness/reducer`
Expected: PASS (6 tests).

- [ ] **Step 6: Write `index.tsx`** (target vs candidate, diff list, auto-run loop, validate)

```tsx
"use client";

import { cn } from "@repo/design-system/lib/utils";
import { useEffect, useReducer, useRef } from "react";
import {
  harnessReducer,
  initialHarnessState,
  isClear,
  remainingCount,
} from "./reducer";

const TICK_MS = 650;

export function Era3Harness() {
  const [state, dispatch] = useReducer(harnessReducer, undefined, initialHarnessState);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!state.running) {
      return;
    }
    timer.current = setInterval(() => dispatch({ type: "tick" }), TICK_MS);
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [state.running]);

  const resolved = (id: string) =>
    state.diffs.find((d) => d.id === id)?.status === "resolved";

  return (
    <div className="rounded-xl border border-foreground/10 p-4 sm:p-6">
      {/* target vs candidate */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Mock label="Target · WordPress" tight={false} />
        <Mock
          converged={isClear(state)}
          label="Candidate · Next.js"
          // candidate tightens toward target as diffs resolve
          tight={resolved("padding")}
        />
      </div>

      {/* diff list + loop */}
      <div className="mt-4 grid gap-4 md:grid-cols-[1.3fr_1fr]">
        <ul className="overflow-hidden rounded-lg border border-foreground/10 font-mono text-xs">
          {state.diffs.map((d) => (
            <li
              className={cn(
                "border-foreground/5 border-b px-3 py-2 last:border-0",
                d.status === "resolved" && "text-emerald-600 line-through opacity-60",
                d.status === "pending" && "bg-red-50 text-red-700 dark:bg-red-950/30",
                d.status === "excepted" && "bg-amber-50 text-amber-700 dark:bg-amber-950/30"
              )}
              key={d.id}
            >
              {d.status === "resolved" ? "✓ " : d.status === "excepted" ? "⚠ " : "● "}
              {d.label}
            </li>
          ))}
        </ul>

        <div className="rounded-lg border border-foreground/10 bg-[#0d1117] p-3 font-mono text-[#8b949e] text-xs leading-6">
          {state.log.map((line, i) => (
            <div className="text-[#3fb950]" key={`${i}-${line}`}>
              › {line}
            </div>
          ))}
          <div className="mt-2">
            diff count:{" "}
            <span className={isClear(state) ? "text-[#3fb950]" : "text-[#e5707e]"}>
              {remainingCount(state)}
            </span>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              className="rounded bg-[#21262d] px-3 py-1 text-[#c9d1d9] disabled:opacity-40"
              disabled={state.running || isClear(state)}
              onClick={() => dispatch({ type: "run" })}
              type="button"
            >
              Run audit
            </button>
            <button
              className="rounded border border-[#30363d] px-3 py-1"
              onClick={() => dispatch({ type: "reset" })}
              type="button"
            >
              Reset
            </button>
            <button
              className={cn(
                "rounded px-3 py-1",
                state.validated
                  ? "bg-[#238636] text-white"
                  : "border border-[#30363d] text-[#8b949e]"
              )}
              disabled={!isClear(state)}
              onClick={() => dispatch({ type: "validate" })}
              type="button"
            >
              {state.validated ? "VALIDATED ✓" : "Validate"}
            </button>
          </div>
        </div>
      </div>

      <p className="mt-4 text-foreground/55 text-sm italic">
        You wrote the validation rules. The agent screenshots, diffs, fixes, and
        re-runs — on its own — until the count hits zero. The iframe stays
        flagged: knowing what isn&apos;t worth it is your judgment too.
      </p>
    </div>
  );
}

function Mock({
  label,
  tight,
  converged,
}: {
  label: string;
  tight: boolean;
  converged?: boolean;
}) {
  return (
    <div>
      <div className="mb-1 font-mono text-[10px] text-muted-foreground uppercase tracking-wide">
        {label}
        {converged && <span className="text-emerald-600"> ▸ match</span>}
      </div>
      <div className="rounded-lg border border-foreground/10 bg-background p-4">
        <div
          className={cn(
            "h-2.5 w-3/5 rounded bg-foreground transition-all",
            tight ? "mb-2" : "mb-3"
          )}
        />
        <div className="mb-1.5 h-1.5 w-11/12 rounded bg-foreground/30" />
        <div className="mb-3 h-1.5 w-4/5 rounded bg-foreground/30" />
        <div className="h-6 w-28 rounded bg-emerald-500" />
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Wire into `masterclass.tsx`**

Add import: `import { Era3Harness } from "./demos/era3-harness";`. Replace `{step === "era-3" && <Era3Placeholder />}` with an `EraPanel`:

```tsx
        {step === "era-3" && (
          <EraPanel
            deepCut={
              <p>
                Here&apos;s the part that should reframe everything: I
                didn&apos;t build the harness myself. The agent built its own
                auditor; I set its rules. A page that used to take hours of
                manual diffing came in at 2–3 hours of the agent working a list
                I never had to touch — about a week of work I didn&apos;t do.
              </p>
            }
            era="Era III"
            expandLabel="Did you know? I didn't build the harness either."
            name="Systems-driven agentic engineering"
            reality="You stop writing syntax and start writing the rules. The agent reads the repo, runs the loop, audits itself against your spec, and self-corrects. You realize you're the bottleneck — and you learn to get out of the way."
            vibe="the trust pivot"
            years="2024–2025"
          >
            <Era3Harness />
          </EraPanel>
        )}
```

Remove the `Era3Placeholder` function.

- [ ] **Step 8: Typecheck, lint, manual verify**

Run: `cd apps/web && bun run typecheck` → no errors.
Run: `bun run check` → no errors.
Manual: on Era 3, click "Run audit" → diffs resolve one by one (~650ms each), the candidate mock tightens toward the target, the counter ticks to 0, the iframe stays amber/excepted, and "Validate" enables then flips to "VALIDATED ✓". "Reset" restores. Re-test with reduced-motion on (the loop still completes; just verify it doesn't error).

- [ ] **Step 9: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026"
git commit -m "feat(masterclass): era 3 harness demo

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Era 4 — generative seam (render-spec, cache, match, generateDashboard)

Pure logic only — no UI. Establishes the seam the renderer (Task 7) consumes.

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era4-runtime/render-spec.ts`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era4-runtime/cache.ts`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era4-runtime/match.ts`
- Test: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era4-runtime/match.test.ts`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era4-runtime/generate-dashboard.ts`
- Test: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era4-runtime/generate-dashboard.test.ts`

**Interfaces:**
- Produces (`render-spec.ts`):
  - `interface KpiWidget { kind: "kpi"; label: string; value: string; delta?: string }`
  - `interface BarWidget { kind: "bar"; title: string; unit?: string; data: { label: string; value: number }[] }`
  - `interface LineWidget { kind: "line"; title: string; series: { name: string; points: { x: string; y: number }[] }[] }`
  - `interface TableWidget { kind: "table"; title: string; columns: string[]; rows: (string | number)[][]; sortableColumn?: number }`
  - `type Widget = KpiWidget | BarWidget | LineWidget | TableWidget`
  - `interface RenderSpec { title: string; widgets: Widget[] }`
- Produces (`match.ts`):
  - `type IntentId = "ai-skills" | "pay" | "stacks" | "rising"`
  - `const INTENTS: readonly { id: IntentId; label: string; question: string; keywords: string[] }[]`
  - `matchIntent(question: string): { id: IntentId; matched: boolean }`
- Produces (`cache.ts`): `const DASHBOARD_CACHE: Record<IntentId, RenderSpec>`
- Produces (`generate-dashboard.ts`): `generateDashboard(question: string): { intent: IntentId; spec: RenderSpec; matched: boolean }`

- [ ] **Step 1: Write the failing test for matching**

Create `match.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import { matchIntent } from "./match";

describe("era4 matchIntent", () => {
  test("routes salary/pay phrasing to pay", () => {
    expect(matchIntent("how does the pay compare?").id).toBe("pay");
    expect(matchIntent("what salary for junior roles").id).toBe("pay");
  });
  test("routes skills/demand phrasing to ai-skills", () => {
    expect(matchIntent("most in-demand AI engineering skills").id).toBe(
      "ai-skills"
    );
  });
  test("routes stack phrasing to stacks", () => {
    expect(matchIntent("which tech stack should a junior learn").id).toBe(
      "stacks"
    );
  });
  test("routes trend phrasing to rising", () => {
    expect(matchIntent("what is rising from 2024 to 2026").id).toBe("rising");
  });
  test("unmatched questions fall back to ai-skills with matched=false", () => {
    const r = matchIntent("tell me about the weather");
    expect(r.matched).toBe(false);
    expect(r.id).toBe("ai-skills");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/web && bun test era4-runtime/match`
Expected: FAIL (cannot find module `./match`).

- [ ] **Step 3: Write `render-spec.ts`**

```ts
export interface KpiWidget {
  kind: "kpi";
  label: string;
  value: string;
  delta?: string;
}
export interface BarWidget {
  kind: "bar";
  title: string;
  unit?: string;
  data: { label: string; value: number }[];
}
export interface LineWidget {
  kind: "line";
  title: string;
  series: { name: string; points: { x: string; y: number }[] }[];
}
export interface TableWidget {
  kind: "table";
  title: string;
  columns: string[];
  rows: (string | number)[][];
  sortableColumn?: number;
}
export type Widget = KpiWidget | BarWidget | LineWidget | TableWidget;
export interface RenderSpec {
  title: string;
  widgets: Widget[];
}
```

- [ ] **Step 4: Write `match.ts`**

```ts
export type IntentId = "ai-skills" | "pay" | "stacks" | "rising";

export const INTENTS: readonly {
  id: IntentId;
  label: string;
  question: string;
  keywords: string[];
}[] = [
  {
    id: "ai-skills",
    label: "Most-wanted AI-eng skills",
    question: "What AI-engineering skills are most in demand?",
    keywords: ["skill", "demand", "wanted", "ai", "rag", "agent"],
  },
  {
    id: "pay",
    label: "Full-stack vs AI-eng pay",
    question: "How does full-stack pay compare to AI-engineering pay?",
    keywords: ["pay", "salary", "compensation", "money", "compare"],
  },
  {
    id: "stacks",
    label: "Junior-friendly stacks",
    question: "Which stacks are most junior-friendly?",
    keywords: ["stack", "learn", "framework", "tech", "junior-friendly"],
  },
  {
    id: "rising",
    label: "What's rising, 2024 → 2026",
    question: "What is rising from 2024 to 2026?",
    keywords: ["rising", "trend", "growing", "2024", "2025", "2026", "future"],
  },
] as const;

const FALLBACK: IntentId = "ai-skills";

export function matchIntent(question: string): {
  id: IntentId;
  matched: boolean;
} {
  const q = question.toLowerCase();
  let best: { id: IntentId; score: number } = { id: FALLBACK, score: 0 };
  for (const intent of INTENTS) {
    const score = intent.keywords.reduce(
      (acc, kw) => acc + (q.includes(kw) ? 1 : 0),
      0
    );
    if (score > best.score) {
      best = { id: intent.id, score };
    }
  }
  return { id: best.id, matched: best.score > 0 };
}
```

- [ ] **Step 5: Run match test to verify it passes**

Run: `cd apps/web && bun test era4-runtime/match`
Expected: PASS (5 tests).

- [ ] **Step 6: Write `cache.ts`** (real-shaped synthetic specs, one per intent)

```ts
import type { RenderSpec } from "./render-spec";
import type { IntentId } from "./match";

export const DASHBOARD_CACHE: Record<IntentId, RenderSpec> = {
  "ai-skills": {
    title: "Most-wanted AI-engineering skills",
    widgets: [
      { kind: "kpi", label: "AI-eng postings YoY", value: "+240%", delta: "▲" },
      {
        kind: "bar",
        title: "Share of AI-eng job posts mentioning…",
        unit: "%",
        data: [
          { label: "RAG / retrieval", value: 71 },
          { label: "Agent orchestration", value: 64 },
          { label: "Vector DBs", value: 58 },
          { label: "Evals", value: 49 },
          { label: "Prompt design", value: 41 },
          { label: "Model serving", value: 33 },
        ],
      },
    ],
  },
  pay: {
    title: "Full-stack vs AI-engineering pay (junior → mid, illustrative)",
    widgets: [
      { kind: "kpi", label: "AI-eng junior premium", value: "+18%" },
      {
        kind: "line",
        title: "Median base by level (indexed)",
        series: [
          {
            name: "Full-stack",
            points: [
              { x: "Junior", y: 100 },
              { x: "Mid", y: 135 },
              { x: "Senior", y: 175 },
            ],
          },
          {
            name: "AI engineering",
            points: [
              { x: "Junior", y: 118 },
              { x: "Mid", y: 160 },
              { x: "Senior", y: 205 },
            ],
          },
        ],
      },
    ],
  },
  stacks: {
    title: "Junior-friendly stacks",
    widgets: [
      {
        kind: "table",
        title: "Demand vs junior-openness (illustrative)",
        columns: ["Stack", "Demand", "Junior-openness"],
        sortableColumn: 1,
        rows: [
          ["Next.js + Postgres + Prisma", 82, 74],
          ["Python + FastAPI + pgvector", 76, 68],
          ["TS + tRPC + Drizzle", 61, 71],
          ["Rails + Postgres", 44, 80],
        ],
      },
    ],
  },
  rising: {
    title: "What's rising, 2024 → 2026 (illustrative)",
    widgets: [
      {
        kind: "line",
        title: "Mentions in job posts (indexed to 2024)",
        series: [
          {
            name: "AI-eng skills",
            points: [
              { x: "2024", y: 100 },
              { x: "2025", y: 190 },
              { x: "2026", y: 295 },
            ],
          },
          {
            name: "Full-stack staples",
            points: [
              { x: "2024", y: 100 },
              { x: "2025", y: 104 },
              { x: "2026", y: 107 },
            ],
          },
        ],
      },
    ],
  },
};
```

- [ ] **Step 7: Write the failing test for generateDashboard**

Create `generate-dashboard.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import { generateDashboard } from "./generate-dashboard";
import { INTENTS } from "./match";

describe("generateDashboard", () => {
  test("returns a non-empty spec for every known intent question", () => {
    for (const intent of INTENTS) {
      const r = generateDashboard(intent.question);
      expect(r.intent).toBe(intent.id);
      expect(r.matched).toBe(true);
      expect(r.spec.widgets.length).toBeGreaterThan(0);
      expect(r.spec.title.length).toBeGreaterThan(0);
    }
  });

  test("falls back to a valid spec for an unrecognized question", () => {
    const r = generateDashboard("what's the weather like");
    expect(r.matched).toBe(false);
    expect(r.spec.widgets.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 8: Run generate-dashboard test to verify it fails**

Run: `cd apps/web && bun test era4-runtime/generate-dashboard`
Expected: FAIL (cannot find module `./generate-dashboard`).

- [ ] **Step 9: Write `generate-dashboard.ts`**

```ts
import { DASHBOARD_CACHE } from "./cache";
import { type IntentId, matchIntent } from "./match";
import type { RenderSpec } from "./render-spec";

/**
 * The seam. In the shipped build this reads the curated cache of real,
 * pre-generated json-render specs. A future live LLM implementation can sit
 * behind this same signature and must fall back to the cache on any failure.
 */
export function generateDashboard(question: string): {
  intent: IntentId;
  spec: RenderSpec;
  matched: boolean;
} {
  const { id, matched } = matchIntent(question);
  return { intent: id, spec: DASHBOARD_CACHE[id], matched };
}
```

- [ ] **Step 10: Run generate-dashboard test to verify it passes**

Run: `cd apps/web && bun test era4-runtime/generate-dashboard`
Expected: PASS (2 tests).

- [ ] **Step 11: Typecheck, lint, commit**

Run: `cd apps/web && bun run typecheck` → no errors.
Run: `bun run check` → no errors.

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026"
git commit -m "feat(masterclass): era 4 generative seam, cache and intent matching

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Era 4 — dashboard renderer + prompt/chips/stream UI

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era4-runtime/dashboard-renderer.tsx`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era4-runtime/index.tsx`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/masterclass.tsx`

**Interfaces:**
- Consumes: `generateDashboard` (Task 6), `RenderSpec`/`Widget` types, `INTENTS`.
- Produces:
  - `function DashboardRenderer({ spec }: { spec: RenderSpec }): JSX.Element`
  - `function Era4Runtime(): JSX.Element`

This task's gate is typecheck + lint + manual (DOM-dependent rendering; the underlying spec selection is already unit-tested in Task 6).

- [ ] **Step 1: Write `dashboard-renderer.tsx`**

Renders each `Widget` kind. Bars/lines use recharts via the design-system chart wrapper; table renders a sortable HTML table; KPIs are cards.

```tsx
"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/design-system/components/ui/chart";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import type { RenderSpec, TableWidget, Widget } from "./render-spec";

const SERIES_COLORS = ["var(--color-ht-cyan-500)", "var(--color-foreground)"];

function BarBlock({ widget }: { widget: Extract<Widget, { kind: "bar" }> }) {
  return (
    <ChartContainer className="h-64 w-full" config={{}}>
      <BarChart data={widget.data} layout="vertical" margin={{ left: 24 }}>
        <CartesianGrid horizontal={false} />
        <XAxis hide type="number" />
        <YAxis
          dataKey="label"
          tickLine={false}
          type="category"
          width={140}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" fill={SERIES_COLORS[0]} radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

function LineBlock({ widget }: { widget: Extract<Widget, { kind: "line" }> }) {
  // Flatten series into rows keyed by x for recharts.
  const xs = widget.series[0]?.points.map((p) => p.x) ?? [];
  const data = xs.map((x, i) => {
    const row: Record<string, string | number> = { x };
    for (const s of widget.series) {
      row[s.name] = s.points[i]?.y ?? 0;
    }
    return row;
  });
  return (
    <ChartContainer className="h-64 w-full" config={{}}>
      <LineChart data={data} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="x" tickLine={false} />
        <YAxis tickLine={false} width={36} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {widget.series.map((s, i) => (
          <Line
            dataKey={s.name}
            dot={false}
            key={s.name}
            stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}

function TableBlock({ widget }: { widget: TableWidget }) {
  const [desc, setDesc] = useState(true);
  const col = widget.sortableColumn ?? -1;
  const rows =
    col >= 0
      ? [...widget.rows].sort((a, b) => {
          const av = Number(a[col]);
          const bv = Number(b[col]);
          return desc ? bv - av : av - bv;
        })
      : widget.rows;
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-foreground/10 border-b text-left text-muted-foreground">
          {widget.columns.map((c, i) => (
            <th className="py-2 pr-4" key={c}>
              {col === i ? (
                <button onClick={() => setDesc((d) => !d)} type="button">
                  {c} {desc ? "↓" : "↑"}
                </button>
              ) : (
                c
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr className="border-foreground/5 border-b" key={String(row[0])}>
            {row.map((cell, i) => (
              <td className="py-2 pr-4" key={`${row[0]}-${i}`}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function DashboardRenderer({ spec }: { spec: RenderSpec }) {
  return (
    <div className="space-y-6">
      <h3 className="font-medium text-lg">{spec.title}</h3>
      <div className="grid gap-4">
        {spec.widgets.map((w, i) => {
          const key = `${w.kind}-${i}`;
          if (w.kind === "kpi") {
            return (
              <div
                className="rounded-lg border border-foreground/10 p-4"
                key={key}
              >
                <div className="text-muted-foreground text-xs uppercase tracking-wide">
                  {w.label}
                </div>
                <div className="mt-1 font-semibold text-3xl">
                  {w.delta} {w.value}
                </div>
              </div>
            );
          }
          return (
            <div
              className="rounded-lg border border-foreground/10 p-4"
              key={key}
            >
              {"title" in w && (
                <div className="mb-3 text-muted-foreground text-sm">
                  {w.title}
                </div>
              )}
              {w.kind === "bar" && <BarBlock widget={w} />}
              {w.kind === "line" && <LineBlock widget={w} />}
              {w.kind === "table" && <TableBlock widget={w} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

Note: confirm `--color-ht-cyan-500` resolves in `apps/web/app/styles.css`. If the cyan scale isn't exposed as a CSS var, substitute a literal like `"#06b6d4"` in `SERIES_COLORS`.

- [ ] **Step 2: Write `index.tsx`** (prompt + chips + spec stream → render)

```tsx
"use client";

import { useCallback, useRef, useState } from "react";
import { DashboardRenderer } from "./dashboard-renderer";
import { generateDashboard } from "./generate-dashboard";
import { INTENTS } from "./match";
import type { RenderSpec } from "./render-spec";

type View = "idle" | "compiling" | "rendered";
const CHAR_MS = 6;

export function Era4Runtime() {
  const [question, setQuestion] = useState(
    "What skills land junior full-stack & AI engineering roles right now?"
  );
  const [view, setView] = useState<View>("idle");
  const [specText, setSpecText] = useState("");
  const [spec, setSpec] = useState<RenderSpec | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const ask = useCallback((q: string) => {
    if (timer.current) {
      clearInterval(timer.current);
    }
    const { spec: result } = generateDashboard(q);
    const json = JSON.stringify(result, null, 2);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setSpec(result);
    if (reduce) {
      setSpecText(json);
      setView("rendered");
      return;
    }
    setView("compiling");
    setSpecText("");
    let i = 0;
    timer.current = setInterval(() => {
      i += 24;
      setSpecText(json.slice(0, i));
      if (i >= json.length) {
        if (timer.current) {
          clearInterval(timer.current);
        }
        setView("rendered");
      }
    }, CHAR_MS);
  }, []);

  return (
    <div className="rounded-xl border border-foreground/10 p-4 sm:p-6">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          ask(question);
        }}
      >
        <input
          className="flex-1 rounded-md border border-foreground/15 bg-background px-3 py-2 text-sm"
          onChange={(e) => setQuestion(e.target.value)}
          value={question}
        />
        <button
          className="rounded-md bg-foreground px-4 py-2 text-background text-sm"
          type="submit"
        >
          Ask
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {INTENTS.map((intent) => (
          <button
            className="rounded-full border border-foreground/15 px-3 py-1 text-muted-foreground text-xs hover:text-foreground"
            key={intent.id}
            onClick={() => {
              setQuestion(intent.question);
              ask(intent.question);
            }}
            type="button"
          >
            {intent.label}
          </button>
        ))}
      </div>

      {view === "compiling" && (
        <pre className="mt-5 max-h-64 overflow-auto rounded-lg border border-foreground/10 bg-muted/40 p-4 font-mono text-xs">
          {specText}
          <span className="animate-pulse">▋</span>
        </pre>
      )}

      {view === "rendered" && spec && (
        <div className="mt-5 fade-in animate-in duration-300">
          <DashboardRenderer spec={spec} />
        </div>
      )}

      {view === "idle" && (
        <p className="mt-5 text-muted-foreground text-sm">
          Ask a question — there is no pre-built dashboard. The UI is compiled
          from your question.
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Wire into `masterclass.tsx`**

Add import: `import { Era4Runtime } from "./demos/era4-runtime";`. Replace `{step === "era-4" && <Era4Placeholder />}` with an `EraPanel`. (Keep the `Era4Placeholder` function for now — the company-brain beat in Task 8 also goes inside this panel; we replace the whole block in Task 8. For this task, render just the dashboard.)

```tsx
        {step === "era-4" && (
          <EraPanel
            deepCut={
              <p>
                The dashboard you just watched assemble is json-render under the
                hood — a spec the model emits and the page compiles at runtime.
                The same engine lets an end user build their own UI without a
                developer in the loop. Code stops being a permanent artifact and
                becomes a byproduct of intent.
              </p>
            }
            era="Era IV"
            expandLabel="Did you know? That dashboard didn't exist a second ago."
            name="The runtime-driven, AI-native horizon"
            reality="The model moves past the build phase into the runtime boundary. Ask a question and the interface is compiled on the fly — code as an ephemeral, just-in-time byproduct of what you wanted to see."
            vibe="architectural liberation"
            years="2026 →"
          >
            <Era4Runtime />
          </EraPanel>
        )}
```

Remove the `Era4Placeholder` function.

- [ ] **Step 4: Typecheck, lint, manual verify**

Run: `cd apps/web && bun run typecheck` → no errors.
Run: `bun run check` → no errors.
Manual: on Era 4, click each chip — confirm the json spec streams in, then a *different* UI renders (bar for skills, line for pay/rising, sortable table for stacks); the stacks table re-sorts on header click; free-text "how does pay compare" renders the pay view. Toggle reduced-motion → spec appears instantly then renders.

- [ ] **Step 5: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026"
git commit -m "feat(masterclass): era 4 generative dashboard renderer and UI

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Era 4 — company-brain ambient-context beat

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era4-runtime/company-brain.tsx`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era4-runtime/index.tsx`

**Interfaces:**
- Produces: `function CompanyBrain(): JSX.Element`
- Consumes: rendered inside `Era4Runtime` (Task 7), below the dashboard.

Presentational/animation; gate is typecheck + lint + manual.

- [ ] **Step 1: Write `company-brain.tsx`**

```tsx
"use client";

import { motion } from "motion/react";

const SOURCES = ["Email", "Slack", "Meet transcripts", "Docs", "Tickets"];

export function CompanyBrain() {
  return (
    <div className="mt-10 rounded-xl border border-foreground/10 p-4 sm:p-6">
      <p className="mb-1 font-medium text-sm">The other half: ambient context</p>
      <p className="mb-6 max-w-2xl text-muted-foreground text-sm">
        Era 2 made you carry context by hand — paste it in, copy the answer back
        out. Era 4 dissolves that: the org&apos;s communication flows into one
        living markdown brain the model already stands inside.
      </p>
      <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <ul className="space-y-2">
          {SOURCES.map((s, i) => (
            <motion.li
              animate={{ opacity: [0.4, 1, 0.4], x: [0, 8, 0] }}
              className="rounded-md border border-foreground/10 bg-muted/40 px-3 py-1.5 text-sm"
              key={s}
              transition={{
                duration: 2.4,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.3,
              }}
            >
              {s}
            </motion.li>
          ))}
        </ul>
        <div className="text-center font-mono text-muted-foreground text-xs">
          → LLM →
        </div>
        <div className="rounded-lg border border-ht-cyan-500/40 bg-ht-cyan-50/60 p-4 dark:bg-ht-cyan-950/30">
          <div className="font-mono text-muted-foreground text-xs">
            company-brain.md
          </div>
          <div className="mt-2 space-y-1 font-mono text-foreground/70 text-xs">
            <div># Decisions</div>
            <div># People &amp; ownership</div>
            <div># Open questions</div>
            <div className="text-muted-foreground">…silos collapsed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

Note: the `motion` infinite-repeat animation should be skipped under reduced motion. Wrap the `animate` value so it falls back to static when reduced motion is set — add at the top of the component:

```tsx
const reduce =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
```

and use `animate={reduce ? { opacity: 1 } : { opacity: [0.4, 1, 0.4], x: [0, 8, 0] }}`.

- [ ] **Step 2: Render it inside `Era4Runtime`**

In `demos/era4-runtime/index.tsx`, add import `import { CompanyBrain } from "./company-brain";` and render `<CompanyBrain />` immediately after the closing `</div>` of the dashboard card (as a sibling, so it always shows under the generative demo). Concretely, wrap the existing returned `<div className="rounded-xl …">…</div>` and the new component in a fragment:

```tsx
  return (
    <>
      <div className="rounded-xl border border-foreground/10 p-4 sm:p-6">
        {/* …existing content unchanged… */}
      </div>
      <CompanyBrain />
    </>
  );
```

- [ ] **Step 3: Typecheck, lint, manual verify**

Run: `cd apps/web && bun run typecheck` → no errors.
Run: `bun run check` → no errors.
Manual: on Era 4, below the dashboard, the source chips pulse/flow toward the `company-brain.md` card; with reduced motion on, chips are static.

- [ ] **Step 4: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026"
git commit -m "feat(masterclass): era 4 company-brain ambient context beat

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Integration polish + full verification

**Files:**
- Modify (as needed): `apps/web/app/[locale]/learn/masterclass-28-07-2026/masterclass.tsx` (step transition animation)

- [ ] **Step 1: Add a step transition wrapper**

In `masterclass.tsx`, wrap the `<main>` body in `AnimatePresence` keyed by `step` so steps cross-fade (respecting reduced motion). Import `AnimatePresence, motion` from `"motion/react"`. Replace the `<main>` element with:

```tsx
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:py-16">
        <AnimatePresence mode="wait">
          <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key={step}
            transition={{ duration: 0.2 }}
          >
            {step === "intro" && <Intro onBegin={() => setStep("era-1")} />}
            {/* …all six step blocks exactly as wired in prior tasks… */}
            {step === "synthesis" && <Synthesis />}
          </motion.div>
        </AnimatePresence>
      </main>
```

(`motion` honors `prefers-reduced-motion` globally when the user sets it; no extra guard needed for a simple opacity fade.)

- [ ] **Step 2: Run the full test suite**

Run: `cd apps/web && bun test masterclass-28-07-2026`
Expected: PASS — all logic suites (steps, era1 selector, era2 apply, era3 reducer, era4 match, era4 generate-dashboard).

- [ ] **Step 3: Full typecheck + lint + build**

Run: `cd apps/web && bun run typecheck` → no errors.
Run (root): `bun run check` → no errors.
Run: `cd apps/web && bun run build` → succeeds.

- [ ] **Step 4: Manual end-to-end walkthrough**

Run `bun dev`; at `http://localhost:3001/en/learn/masterclass-28-07-2026` walk all six steps via Next/Back and via stepper-header clicks. Verify: `?step=` deep-links restore the right step on reload; no marketing nav/footer; every demo functions with the network tab offline (DevTools → offline) — nothing blanks. Repeat once with `prefers-reduced-motion: reduce` enabled (DevTools rendering emulation): all demos still reach their readable end states.

- [ ] **Step 5: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026"
git commit -m "feat(masterclass): step transitions and final integration

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**
- Route/placement/standalone chrome/noindex/EN-only → Task 1 (`page.tsx`, `masterclass.tsx`) + Global Constraints. ✓
- 6-step stepper, URL-synced, vibe words, keyboard nav → Task 1. ✓
- Era-panel anatomy (framing + full-width demo + Expandable), Intro, Synthesis → Task 2. ✓
- Era 1 Playground (JS, can't-ask reveal, temperature) → Task 3. ✓
- Era 2 companion (chat panel + ghost text + mismatch twist) → Task 4. ✓
- Era 3 harness (target/candidate, diff list, iframe exception, auto-run to green, "didn't build it myself" deep-cut) → Task 5. ✓
- Era 4 generative seam + cache + match + generateDashboard → Task 6; renderer + chips + spec-stream → Task 7; company-brain → Task 8. ✓
- json-render reveal copy + "code as ephemeral byproduct" → Task 7 deep-cut. ✓
- Reduced-motion, deep-link, offline-safe, full build → Task 9. ✓
- Decomposed items (live backend, real scraped data, present mode) → intentionally out of scope; the `generateDashboard` seam (Task 6) is the swap point. ✓

**Placeholder scan:** No "TBD"/"add error handling"/"similar to Task N" left; all code shown in full. Two explicit verification notes (shadcn `slider`, the `--color-ht-cyan-500` CSS var) are conditional install/substitution instructions, not deferred work.

**Type consistency:** `StepId`/`STEPS`/`getAdjacentStep` consistent across Tasks 1–9. `RenderSpec`/`Widget`/`IntentId` defined in Task 6 and consumed unchanged in Task 7. `generateDashboard` return shape `{ intent, spec, matched }` matches its test and the renderer call site. `harnessReducer`/`remainingCount`/`isClear` names consistent between Task 5's reducer, test, and `index.tsx`. `applySuggestion`/`resolveMismatch`/`SUGGESTION`/`INITIAL_FILE` consistent between Task 4's modules, test, and UI.
