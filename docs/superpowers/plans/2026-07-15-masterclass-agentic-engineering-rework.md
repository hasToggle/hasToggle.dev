# Masterclass Agentic-Engineering Rework Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorient the masterclass exhibit around the agentic-engineering narrative per `docs/superpowers/specs/2026-07-15-masterclass-agentic-engineering-rework-design.md` — new Intro/Synthesis/panel copy, post-training flip in Era I, browser-tab mock in Era II, loop + Meter beats in Era III, Era IV demoted to Outlook.

**Architecture:** All work in `apps/web/app/[locale]/learn/masterclass-28-07-2026/`. Existing demos (harness, ladder, pipeline, era4 runtime) keep their logic and tests untouched. New beats follow the house pattern: folder with `index.tsx` + logic in `.ts` with colocated Bun tests.

**Tech Stack:** Next.js 16 / React 19 client components, Tailwind 4, Bun test, `@repo/design-system`.

## Global Constraints

- **Offline/deterministic**; no network, no randomness; fixed-interval timers only.
- **Reduced motion:** animated beats collapse to static end-states; interaction gates (clicks) always remain.
- **Copy is final as written here** — transcribe verbatim (Eric vetoes line-by-line later); `&apos;` for apostrophes in JSX text.
- **Verbatim guards that must survive:** the ladder line "like a literature student"; the pipeline placard "Notice where your clicks went. That's where the job went."; the senior-rail advert "Engineers: the fine print under each demo is for you."
- **Step ids never change** (`intro`, `era-1`…`era-4`, `synthesis`) — deep links stay stable. Only labels/vibes/panel copy change.
- **Untouched files:** everything under `demos/era3-harness/`, `demos/era3-ladder/`, `demos/era3-pipeline/`, `demos/era4-runtime/`.
- **Test command:** `cd /Users/eric/conductor/workspaces/hasToggle.dev/banjul/apps/web && bun test` · **Typecheck:** `bun run typecheck` (same dir).
- **Format:** after each task, `bunx biome check --write <touched paths>` from repo root is allowed; never touch `bun.lock`; if `apps/web/public/**` or `apps/docs/**` SVGs appear modified, `git checkout --` them (known entire.io noise) before committing.
- **Commits:** one per task, message given; end with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Era I selector — instruct mode (TDD)

**Files:**
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/completions.ts`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/selector.ts`
- Test: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/selector.test.ts`

**Interfaces:**
- Produces: `type Mode = "base" | "instruct"` and `selectCompletion(id: string, temp: number, mode?: Mode): string` (default `"base"` — existing two-arg callers keep working). `PromptSeed` gains required `instructAnswer: string`.

- [ ] **Step 1: Add failing tests** — append inside the existing `describe` in `selector.test.ts`:

```ts
  test("instruct mode answers instead of continuing", () => {
    const answer = selectCompletion("how-do-i", 0.7, "instruct");
    expect(answer).not.toContain("how do I");
    expect(answer).toContain("reverse()");
  });

  test("instruct output is stable across temperature", () => {
    expect(selectCompletion("reverse-fn", 0.1, "instruct")).toBe(
      selectCompletion("reverse-fn", 1.3, "instruct")
    );
  });

  test("mode defaults to base", () => {
    const fn = PROMPTS.find((p) => p.id === "reverse-fn");
    expect(selectCompletion("reverse-fn", 0.1)).toBe(fn?.continuations.low);
  });
```

- [ ] **Step 2: Run to verify failure**

Run: `cd apps/web && bun test demos/era1-playground/selector.test.ts`
Expected: FAIL (instructAnswer/mode not implemented; 3-arg call type error surfaces at runtime as undefined behavior — any failure mode is fine).

- [ ] **Step 3: Implement** — in `completions.ts`, add `instructAnswer: string;` to `PromptSeed` (keep alphabetical member order: after `id`), and add to each prompt:

For `reverse-fn` (after `id` line, alphabetical):
```ts
    instructAnswer:
      "items.slice().reverse();\n}\n\n// slice() copies first, so the original array is untouched.",
```

For `how-do-i`:
```ts
    instructAnswer:
      "Use slice() to copy the array, then reverse():\n\nconst reversed = items.slice().reverse();\n\nCalling reverse() alone would mutate the original.",
```

In `selector.ts`:
```ts
export type Mode = "base" | "instruct";

export function selectCompletion(
  id: string,
  temp: number,
  mode: Mode = "base"
): string {
  const prompt = PROMPTS.find((p) => p.id === id);
  if (!prompt) {
    return "";
  }
  if (mode === "instruct") {
    return prompt.instructAnswer;
  }
  return prompt.continuations[bandFor(temp)];
}
```
(Only the function changes; keep `bandFor` and re-exports as they are.)

- [ ] **Step 4: Run tests** — `cd apps/web && bun test demos/era1-playground/selector.test.ts` → all pass (7 tests).

- [ ] **Step 5: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/"
git commit -m "feat(masterclass): add instruct mode to Era I selector

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Era I UI — the post-training flip + panel reframe

**Files:**
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/index.tsx`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/masterclass.tsx` (era-1 panel props only)

**Interfaces:** consumes `Mode`, 3-arg `selectCompletion` from Task 1.

- [ ] **Step 1: Add the mode toggle and mode-aware behavior** in `era1-playground/index.tsx`:

1. Import `type Mode` from `./selector`. Add state `const [mode, setMode] = useState<Mode>("base");`
2. Above the prompt-chip row (below the existing setup line), add the toggle:

```tsx
      <div className="mb-4 flex items-center gap-2">
        {(
          [
            ["base", "base (davinci)"],
            ["instruct", "post-trained (instruct)"],
          ] as const
        ).map(([m, label]) => (
          <button
            className={`rounded-md border px-3 py-1 font-mono text-xs ${
              mode === m
                ? "border-ht-cyan-500 text-foreground"
                : "border-foreground/15 text-muted-foreground hover:text-foreground"
            }`}
            key={m}
            onClick={() => {
              setMode(m);
              setShown("");
            }}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
```

3. In `run`, pass the mode: `const full = selectCompletion(promptId, temp, mode);` and add `mode` to the `useCallback` deps.
4. Disable the slider in instruct mode: add `disabled={mode === "instruct"}` to the `Slider`, and replace the band read-out span content with:

```tsx
        <span className="font-mono text-muted-foreground text-xs">
          {mode === "instruct"
            ? "post-training flattened the dice"
            : `${temp.toFixed(1)} · ${bandFor(temp)}`}
        </span>
```

5. Placards — replace the two existing conditional placards with mode-aware ones (same position, after the controls):

```tsx
      {prompt.isQuestion && shown.length > 0 && !streaming && mode === "base" && (
        <p className="mt-4 text-foreground/55 text-sm italic">
          You asked a question. It didn&apos;t answer — it just kept going.
          There&apos;s no one in there to ask.
        </p>
      )}
      {prompt.isQuestion && shown.length > 0 && !streaming && mode === "instruct" && (
        <p className="mt-4 text-foreground/55 text-sm italic">
          Now it answers. Not because it became something else — because humans
          taught it the format. That flip is the ChatGPT moment.
        </p>
      )}
      {!prompt.isQuestion && shown.length > 0 && !streaming && mode === "base" && (
        <p className="mt-4 text-foreground/55 text-sm italic">
          It isn&apos;t looking anything up. It&apos;s continuing your pattern —
          that&apos;s all it ever does.
        </p>
      )}
      {!prompt.isQuestion && shown.length > 0 && !streaming && mode === "instruct" && (
        <p className="mt-4 text-foreground/55 text-sm italic">
          One clean completion, every time. Same machine — new manners.
        </p>
      )}
```

- [ ] **Step 2: Reframe the era-1 panel** in `masterclass.tsx` — replace the era-1 `EraPanel` props `name`, `years`, `reality`, and `deepCut` with:

```tsx
								deepCut={
									<p>
										There was no intent model here — only continuation. OpenAI&apos;s
										fix was post-training: humans wrote answers, the model was tuned
										on them, then ranked by preference (InstructGPT, 2022). The
										canonical failure in the literature is this very demo — asked for
										the capital of France, a base model offers the capital of Germany,
										as a question. Post-trained answers were preferred roughly 85% of
										the time over the base model&apos;s; ChatGPT shipped on that flip
										nine months later.
									</p>
								}
								era="Era I"
								expandLabel="Did you know? It was never listening."
								name="The completion machine"
								reality="Nobody engineered with this. It matters because everything that follows is still this machine underneath: you feed it the start of a pattern and it continues — unaware of what you meant. Extracting knowledge took prompt craft, until OpenAI taught it a format."
								vibe="skepticism"
								years="2019–2022"
```
(Keep tabs; keep `<Era1Playground />` and the FieldNote child as they are.)

- [ ] **Step 3: Verify** — `cd apps/web && bun test && bun run typecheck` → clean.
- [ ] **Step 4: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/"
git commit -m "feat(masterclass): Era I post-training flip and completion-machine reframe

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Era II — clipboard state (TDD) + browser-tab mock + panel reframe

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/extraction.ts`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/extraction.test.ts`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/extraction-demo.tsx`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/masterclass.tsx` (era-2 children + panel props)

**Interfaces:**
- Produces: `ClipPhase`, `clipTransition(phase, action)`, `THREAD_QUESTION`, `THREAD_ANSWER` from `./extraction`; component `Era2Extraction` (no props) from `./extraction-demo`.

- [ ] **Step 1: Failing test** — `extraction.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import { clipTransition, THREAD_ANSWER } from "./extraction";

describe("era2 clipboard machine", () => {
  test("copy then paste is the only path through", () => {
    expect(clipTransition("idle", "paste")).toBe("idle");
    expect(clipTransition("idle", "copy")).toBe("copied");
    expect(clipTransition("copied", "copy")).toBe("copied");
    expect(clipTransition("copied", "paste")).toBe("pasted");
    expect(clipTransition("pasted", "copy")).toBe("pasted");
  });

  test("reset returns to idle from anywhere", () => {
    expect(clipTransition("pasted", "reset")).toBe("idle");
    expect(clipTransition("copied", "reset")).toBe("idle");
  });

  test("the answer is a code block", () => {
    expect(THREAD_ANSWER.length).toBeGreaterThan(0);
    expect(THREAD_ANSWER[0]).toContain("function");
  });
});
```

- [ ] **Step 2: Run to verify failure** — `cd apps/web && bun test demos/era2-companion/extraction.test.ts` → FAIL (module missing).

- [ ] **Step 3: Implement `extraction.ts`:**

```ts
export type ClipPhase = "idle" | "copied" | "pasted";
export type ClipAction = "copy" | "paste" | "reset";

export function clipTransition(
  phase: ClipPhase,
  action: ClipAction
): ClipPhase {
  if (action === "reset") {
    return "idle";
  }
  if (action === "copy" && phase === "idle") {
    return "copied";
  }
  if (action === "paste" && phase === "copied") {
    return "pasted";
  }
  return phase;
}

export const THREAD_QUESTION =
  "how do I stop an unknown discount code from crashing checkout?";

export const THREAD_ANSWER: readonly string[] = [
  "function validateCode(code) {",
  "  if (!(code in DISCOUNTS)) {",
  "    return { ok: false };",
  "  }",
  "  return { ok: true, rate: DISCOUNTS[code] };",
  "}",
];
```

- [ ] **Step 4: Run tests** — same command → 3 pass.

- [ ] **Step 5: Build the mock** — `extraction-demo.tsx`:

```tsx
"use client";

import { useState } from "react";
import {
  type ClipPhase,
  clipTransition,
  THREAD_ANSWER,
  THREAD_QUESTION,
} from "./extraction";

export function Era2Extraction() {
  const [phase, setPhase] = useState<ClipPhase>("idle");

  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-foreground/10">
      {/* browser window */}
      <div className="border-foreground/10 border-b bg-muted/40 p-0">
        <div className="flex items-center gap-2 border-foreground/10 border-b px-3 py-2">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          </span>
          <span className="rounded bg-background px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
            chat.openai.com · 2022
          </span>
        </div>
        <div className="space-y-3 p-4 text-xs">
          <div className="ml-auto w-fit max-w-[80%] rounded-lg bg-ht-cyan-600/10 px-3 py-2">
            {THREAD_QUESTION}
          </div>
          <div className="w-fit max-w-[80%] rounded-lg border border-foreground/10 bg-background p-3">
            <pre className="font-mono leading-5">
              {THREAD_ANSWER.join("\n")}
            </pre>
            <button
              className="mt-2 rounded border border-foreground/15 px-2 py-1 font-mono text-[11px] text-muted-foreground hover:text-foreground disabled:opacity-40"
              disabled={phase !== "idle"}
              onClick={() => setPhase((p) => clipTransition(p, "copy"))}
              type="button"
            >
              {phase === "idle" ? "Copy" : "Copied ✓"}
            </button>
          </div>
        </div>
      </div>

      {/* your editor, a world away */}
      <div className="bg-[#1e1e1e] p-4 font-mono text-[#d4d4d4] text-xs leading-6">
        <div className="mb-2 flex items-center justify-between text-[#858585]">
          <span>checkout.js — your editor</span>
          <span className="flex gap-2">
            <button
              className="rounded border border-[#3c3c3c] px-2 py-0.5 text-[11px] disabled:opacity-40"
              disabled={phase !== "copied"}
              onClick={() => setPhase((p) => clipTransition(p, "paste"))}
              type="button"
            >
              Paste
            </button>
            <button
              className="rounded border border-[#3c3c3c] px-2 py-0.5 text-[11px]"
              onClick={() => setPhase("idle")}
              type="button"
            >
              Reset
            </button>
          </span>
        </div>
        {phase === "pasted" ? (
          THREAD_ANSWER.map((l) => <div key={l}>{l}</div>)
        ) : (
          <div className="text-[#858585] italic">
            {phase === "copied"
              ? "// the answer is on your clipboard. Bring it over yourself."
              : "// empty. The knowledge lives in another window."}
          </div>
        )}
      </div>

      {phase === "pasted" && (
        <p className="border-foreground/10 border-t px-4 py-3 text-foreground/55 text-sm italic">
          You were the clipboard. Every answer crossed between those two worlds
          by hand.
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Rewire era-2** in `masterclass.tsx` (tabs): import `Era2Extraction` from `./demos/era2-companion/extraction-demo`; era-2 children become `<Era2Extraction />` then `<Era2Companion />`; replace era-2 panel props `name`, `years`, `reality`, `deepCut` with:

```tsx
								deepCut={
									<p>
										The speed was real, and so was the ceiling: the model saw one
										file, one selection. Cursor had to fork VS Code to raise it —
										the extension API allows a sidebar, not an editor that thinks;
										indexing a codebase and editing across files needs the core.
										That&apos;s why Copilot rode along as a plugin while Cursor
										rebuilt the vehicle. The door out of this room opened late in
										2024, when models learned to reason — multi-step thinking, the
										ingredient the next room was waiting for.
									</p>
								}
								era="Era II"
								expandLabel="Did you know? You were the bus."
								name="Extraction → Integration"
								reality="It answers now — in a browser tab, a world away from your code. You ferry context in and answers out by hand, until the chat moves into the editor and your selection becomes its context. Either way the verdict held: a senior engineer was faster. The model missed the file next door and the framework's basics, and correcting it cost more than writing it."
								vibe="guarded fascination"
								years="2022–2024"
```

- [ ] **Step 7: Verify** — `cd apps/web && bun test && bun run typecheck` → clean.
- [ ] **Step 8: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/"
git commit -m "feat(masterclass): Era II browser-tab extraction mock and reframe

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Era III — the loop beat (TDD)

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era3-loop/sequence.ts`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era3-loop/sequence.test.ts`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era3-loop/index.tsx`

**Interfaces:**
- Produces: `LOOP_STEPS`, `nextLoopStep(i: number): number` from `./sequence`; component `Era3Loop` (no props). Task 5 wires it into `masterclass.tsx`.

- [ ] **Step 1: Failing test** — `sequence.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import { LOOP_STEPS, nextLoopStep } from "./sequence";

describe("era3 loop sequence", () => {
  test("starts with a message and ends with a response", () => {
    expect(LOOP_STEPS[0].kind).toBe("message");
    expect(LOOP_STEPS.at(-1)?.kind).toBe("respond");
  });

  test("the loop wraps", () => {
    expect(nextLoopStep(LOOP_STEPS.length - 1)).toBe(0);
    expect(nextLoopStep(0)).toBe(1);
  });

  test("tools appear between thinking", () => {
    expect(LOOP_STEPS.some((s) => s.kind === "tool")).toBe(true);
    expect(LOOP_STEPS.some((s) => s.kind === "think")).toBe(true);
  });
});
```

- [ ] **Step 2: Run to verify failure** — `cd apps/web && bun test demos/era3-loop/sequence.test.ts` → FAIL.

- [ ] **Step 3: Implement `sequence.ts`:**

```ts
export type LoopStepKind = "message" | "think" | "tool" | "respond";

export interface LoopStep {
  kind: LoopStepKind;
  label: string;
}

export const LOOP_STEPS: readonly LoopStep[] = [
  { kind: "message", label: "“unknown discount codes crash checkout — fix it”" },
  { kind: "think", label: "thinking" },
  { kind: "tool", label: "Read(checkout.js)" },
  { kind: "think", label: "the guard throws — it should fail soft" },
  { kind: "tool", label: "Write(checkout.js)" },
  { kind: "tool", label: "Run(bun test)" },
  { kind: "respond", label: "done — 5 tests passing" },
];

export function nextLoopStep(i: number): number {
  return (i + 1) % LOOP_STEPS.length;
}
```

- [ ] **Step 4: Run tests** — 3 pass.

- [ ] **Step 5: Build the component** — `index.tsx`:

```tsx
"use client";

import { cn } from "@repo/design-system/lib/utils";
import { useEffect, useState } from "react";
import { LOOP_STEPS, nextLoopStep } from "./sequence";

const STEP_MS = 900;

const KIND_GLYPH: Record<string, string> = {
  message: "›",
  think: "∴",
  tool: "⚙",
  respond: "✓",
};

export function Era3Loop() {
  const [active, setActive] = useState(0);
  const [cycling, setCycling] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      setCycling(false);
      return;
    }
    const id = setInterval(() => setActive(nextLoopStep), STEP_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mb-10 rounded-xl border border-foreground/10 p-4 sm:p-6">
      <p className="font-medium text-sm">
        An LLM with tools, trapped in a loop
      </p>
      <p className="mt-1 max-w-2xl text-muted-foreground text-sm">
        Strip away the debate about what an agent is, and mechanically this is
        all of it:
      </p>
      <ol className="mt-4 space-y-1 font-mono text-xs">
        {LOOP_STEPS.map((step, i) => (
          <li
            className={cn(
              "flex items-center gap-3 rounded px-2 py-1",
              cycling && i === active
                ? "bg-ht-cyan-500/10 text-foreground"
                : "text-muted-foreground"
            )}
            key={step.label}
          >
            <span className="w-4 text-center opacity-70">
              {KIND_GLYPH[step.kind]}
            </span>
            {step.label}
          </li>
        ))}
      </ol>
      <p className="mt-3 font-mono text-[11px] text-muted-foreground">
        ↺ and again, until the rules are satisfied
      </p>
      <p className="mt-3 max-w-2xl text-foreground/55 text-sm italic">
        That&apos;s the whole mechanism — a model, tools, and a loop.
        Everything since is scale.
      </p>
    </div>
  );
}
```

- [ ] **Step 6: Verify** — `cd apps/web && bun test && bun run typecheck` → clean.
- [ ] **Step 7: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era3-loop/"
git commit -m "feat(masterclass): add the-loop beat for Era III

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Era III — the Meter + room rewiring + panel reframe

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era3-meter/index.tsx`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/masterclass.tsx` (era-3 children + panel props)

**Interfaces:** consumes `Era3Loop` (Task 4) and `FieldNote` (existing, already imported in masterclass.tsx). Produces `Era3Meter` (no props).

- [ ] **Step 1: Build the Meter** — `era3-meter/index.tsx`. Static, no timers. The timeline is 07:00–17:00 (10h); segment widths are percentages of that span.

```tsx
import { cn } from "@repo/design-system/lib/utils";
import { FieldNote } from "../../field-note";

interface Segment {
  className: string;
  from: number; // hour, 24h clock
  label?: string;
  to: number;
}

const DAY_START = 7;
const DAY_END = 17;

function widthPct(from: number, to: number): string {
  return `${((to - from) / (DAY_END - DAY_START)) * 100}%`;
}

const COLD_START: readonly Segment[] = [
  { className: "bg-muted/40", from: 7, to: 9, label: "asleep" },
  {
    className: "bg-ht-cyan-500/30",
    from: 9,
    to: 12,
    label: "coding — quota gone by 12:00",
  },
  { className: "bg-red-500/20", from: 12, to: 14, label: "locked out" },
  { className: "bg-ht-cyan-500/30", from: 14, to: 17, label: "coding again" },
] as const;

const GREETED: readonly Segment[] = [
  {
    className: "bg-muted/40",
    from: 7,
    to: 10,
    label: "window open, untouched",
  },
  { className: "bg-ht-cyan-500/30", from: 10, to: 12, label: "coding" },
  {
    className: "bg-ht-cyan-500/30",
    from: 12,
    to: 17,
    label: "fresh window — no waiting",
  },
] as const;

const KPIS: readonly { label: string; value: string }[] = [
  {
    label: "My monthly usage at API prices",
    value: "thousands of €",
  },
  { label: "The subscription, flat", value: "€180 · ×2" },
  {
    label: "Weekly quota — resets Saturday 11:00",
    value: "gone by Wednesday",
  },
] as const;

function TimelineRow({
  segments,
  title,
}: {
  segments: readonly Segment[];
  title: string;
}) {
  return (
    <div>
      <p className="mb-1 font-mono text-[11px] text-muted-foreground uppercase tracking-wide">
        {title}
      </p>
      <div className="flex h-8 w-full overflow-hidden rounded-md border border-foreground/10">
        {segments.map((s) => (
          <div
            className={cn(
              "flex items-center overflow-hidden border-foreground/10 border-r px-2 last:border-r-0",
              s.className
            )}
            key={`${s.from}-${s.to}`}
            style={{ width: widthPct(s.from, s.to) }}
          >
            <span className="truncate font-mono text-[10px] text-foreground/70">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Era3Meter() {
  return (
    <div className="mt-10 rounded-xl border border-foreground/10 p-4 sm:p-6">
      <p className="font-medium text-sm">The meter</p>
      <p className="mt-1 max-w-2xl text-muted-foreground text-sm">
        Working like this has an economy. Five-hour windows that start at your
        first message; a weekly quota; a flat price for what would otherwise be
        unaffordable.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {KPIS.map((k) => (
          <div
            className="rounded-lg border border-foreground/10 p-3"
            key={k.label}
          >
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
              {k.label}
            </p>
            <p className="mt-1 font-semibold text-xl">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        <TimelineRow segments={COLD_START} title="cold start · 09:00" />
        <TimelineRow segments={GREETED} title="greeted at 07:00 sharp" />
        <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
          <span>07:00</span>
          <span>09:00</span>
          <span>12:00</span>
          <span>14:00</span>
          <span>17:00</span>
        </div>
      </div>

      <FieldNote className="mt-6" date="2026-07">
        I say hi to the agent at seven sharp. Not to be polite — the five-hour
        meter starts when I do. Start coding at ten, and the next window opens
        just as the first would bite. The greeting is load-bearing.
      </FieldNote>
    </div>
  );
}
```

- [ ] **Step 2: Rewire era-3** in `masterclass.tsx` (tabs): import `Era3Loop` from `./demos/era3-loop` and `Era3Meter` from `./demos/era3-meter`. Era-3 children become, in order: `<Era3Loop />`, `<Era3Harness />`, `<Era3Ladder />`, `<Era3Pipeline />`, `<Era3Meter />`. **Remove** the standalone `<FieldNote date="2026-07">…</FieldNote>` block from era-3 children (its text now lives inside the Meter; the `FieldNote` import stays — era-1 uses it). Replace era-3 panel props `name`, `years`, `reality` with (deep cut and expandLabel unchanged):

```tsx
								name="Agentic engineering"
								reality="Strip the debate away: an agent is an LLM with tools, trapped in a loop. Claude Code put that loop in a terminal — barely useful at first, even on the strongest coding models. Then the loop learned to run longer; minutes became hours. You stop writing syntax and start writing the rules the loop must satisfy."
								vibe="the trust pivot"
								years="2024 → now"
```

- [ ] **Step 3: Verify** — `cd apps/web && bun test && bun run typecheck` → clean.
- [ ] **Step 4: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/"
git commit -m "feat(masterclass): Era III meter beat and agentic-engineering reframe

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Stepper labels, Outlook demotion, Intro + Synthesis rewrite (TDD on steps)

**Files:**
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/steps.test.ts`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/steps.ts`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/masterclass.tsx` (era-4 panel props)
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/intro.tsx`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/synthesis.tsx`

- [ ] **Step 1: Update the steps test first** — in `steps.test.ts`, replace the vibe assertion:

```ts
  test("the eras carry their verbatim vibe words", () => {
    const vibes = STEPS.filter((s) => s.vibe).map((s) => s.vibe);
    expect(vibes).toEqual([
      "skepticism",
      "guarded fascination",
      "the trust pivot",
      "the next frontier",
    ]);
  });
```

- [ ] **Step 2: Run to verify failure** — `cd apps/web && bun test steps.test.ts` → FAIL on the vibe list.

- [ ] **Step 3: Update `steps.ts`** (tabs) — labels and the era-4 vibe:

```ts
	{ id: "era-1", label: "I · Completion", era: "Era I", vibe: "skepticism" },
	{
		id: "era-2",
		label: "II · Integration",
		era: "Era II",
		vibe: "guarded fascination",
	},
	{
		id: "era-3",
		label: "III · Agentic engineering",
		era: "Era III",
		vibe: "the trust pivot",
	},
	{
		id: "era-4",
		label: "Outlook",
		era: "Outlook",
		vibe: "the next frontier",
	},
```

- [ ] **Step 4: Demote era-4 to Outlook** in `masterclass.tsx` — replace the era-4 panel props `era`, `name`, `reality`, `vibe`, `years` (deep cut, expandLabel, children unchanged):

```tsx
								era="Outlook"
								expandLabel="Did you know? That dashboard didn't exist a second ago."
								name="The runtime frontier"
								reality="An honest label: this is not a room the story's hero lives in. Everything so far was about empowering one engineer. This is the model crossing out of the build phase into the runtime itself — interfaces compiled from questions, code as a just-in-time byproduct. Not our era. The next frontier."
								vibe="the next frontier"
								years="2026 →"
```

- [ ] **Step 5: Rewrite the Intro** — in `intro.tsx`, replace the Subheading text, the H1 text, the thesis paragraph (the `text-foreground/55` one), and `HOW_TO_WATCH`; the narrator paragraph, MetaAside, RhythmFigure, and Button stay:

Subheading: `Masterclass on agentic engineering · 2026-07-28`
H1: `Agentic Engineering`

Thesis paragraph replacement:
```tsx
      <p className="mt-4 max-w-2xl text-foreground/55 text-base leading-7">
        Agentic engineering is something we arrived at — it wasn&apos;t
        possible four years ago, and nobody was asking for it. This masterclass
        recounts how we got here: lived experience, against the history of how
        the models grew up and how engineers&apos; minds had to move. Every
        step was shaped by what the model could barely do — and by how people
        learned to use it.
      </p>
```

`HOW_TO_WATCH` replacement:
```tsx
const HOW_TO_WATCH = [
  "Three rooms of history, one workshop, one horizon — walk them in order.",
  "Everything is playable, and nothing breaks.",
  "The tech changes in every room. The vibe changes more — that arc is the real story.",
] as const;
```

- [ ] **Step 6: Rewrite the Synthesis** — in `synthesis.tsx`, replace the first two paragraphs inside the `space-y-5` div (confession block and closing italic line stay):

```tsx
        <p>
          Three rooms of history. A machine that could only continue, taught to
          answer. An answerer in a browser tab, moved into the editor. A model
          with tools, trapped in a loop — until the loop could carry real work.
          Every step was shaped by what the model could barely do, and by how
          people learned to use it.
        </p>
        <p>
          Across every room, the thing that made the work <em>yours</em> was
          never the syntax. It was the judgment: what to ask, what to trust,
          where to draw the boundary, what counts as done.
        </p>
```

- [ ] **Step 7: Verify** — `cd apps/web && bun test && bun run typecheck` → all pass (steps test now green).
- [ ] **Step 8: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/"
git commit -m "feat(masterclass): agentic-engineering spine — stepper, Outlook, Intro, Synthesis

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: Verification sweep

- [ ] **Step 1:** `cd apps/web && bun test` → all pass, zero failures (expect ~70 tests).
- [ ] **Step 2:** `cd apps/web && bun run typecheck` → exit 0.
- [ ] **Step 3:** From repo root: `bunx biome check --write "apps/web/app/[locale]/learn/masterclass-28-07-2026/"` → apply fixes; re-run `bun test` if files were rewritten. If any `apps/web/public/**` or `apps/docs/**` SVGs show as modified, `git checkout --` them (known noise). Never stage `bun.lock`.
- [ ] **Step 4:** Commit any formatter fallout:

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/"
git diff --cached --quiet || git commit -m "chore(masterclass): formatter fixes after rework

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

## Post-plan notes

- All spectator-facing copy above is drafted for Eric's line-by-line veto on the dev server.
- The Era I resting-placard test in `selector.test.ts` ("never answers") remains true — it asserts base-mode continuations only.
