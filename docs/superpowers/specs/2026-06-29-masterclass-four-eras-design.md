# Masterclass: The Four Eras of Developer–AI Interaction — Design

**Date:** 2026-06-29
**Event:** Masterclass on 2026-07-28 (~45–60 min)
**Route:** `/[locale]/learn/masterclass-28-07-2026` (EN-only for now)
**Status of delivery:** Lives on a branch; deployed only as a **protected preview deployment** with a shareable link until the event. Not pushed to `main`/production yet. Not linked in site nav.

## Overview

An interactive, self-guided web exhibit that walks an audience of **aspiring/junior (and some senior) developers** through the evolution of developer–AI interaction across four eras. The page is the masterclass medium — not slides. The presenter narrates live; every attendee can open the same URL and walk it at their own pace, and the page remains a fully functional artifact after the event (nothing goes blank when shared).

The four-era lens bridges a **technological** arc with a **psychological** arc. The psychological arc — the *vibe* shift — is the real spine and is kept visible at all times:

| Era | Tech | Vibe |
|----|------|------|
| I · Completion | GPT-2 / base GPT-3 (davinci) | **skepticism** |
| II · Companion | ChatGPT / Copilot / Cursor chat | **guarded fascination** |
| III · Agent | Claude Code / Codex CLI / Conductor | **the trust pivot** |
| IV · Runtime | Generative UI / sandboxes / org context loops | **architectural liberation** |

**Thesis (stated in the Intro, paid off in the Synthesis):** the developer's role is shifting from *writing code syntax* to *architecting AI-native ecosystems*. The constant across all four eras is the developer's **judgment / ownership** — the AI changed; the thing that makes the work yours did not. This rhymes with the existing site thesis, *"AI produces the artifact. You hold the meaning."*

## Design Principles

- **Felt, not told.** Inherits the house DNA of the existing `(demos)` (Mirror, Proof, Contract, etc.): each era is a *playable* recreation that makes its mindset visceral, not an essay with a screenshot.
- **Never blank when shared.** No demo depends on a live network/LLM call to function. Live/real backends are optional enhancements behind a stable seam (see Era 4 and Decomposition).
- **House style.** Reuses existing primitives — `Container`, `Heading`/`Subheading`, `MetaAside`, `Expandable`, `motion/react`, the design-system components, mono accents, editorial prose.
- **B-first.** Build the self-guided exhibit first. A "present mode" (full-bleed, speaker affordances) is a later layer (C); standalone chrome is chosen partly to make that trivial.

## Placement & Chrome

- **Route:** `apps/web/app/[locale]/learn/masterclass-28-07-2026/`
- **Standalone chrome:** the page does **not** render the marketing `Navbar`/`Footer`. It inherits only what `[locale]/layout.tsx` provides (fonts + `NuqsAdapter`). The stepper owns the full viewport, so it reads as an app, not a marketing page. This also makes a future present-mode layer trivial.
- **Unlisted:** reachable only via the shared URL. Because it ships as a protected preview deployment until the event, indexing is not a concern now; when it eventually reaches production as a dated page, it should carry `robots: noindex`.
- **Locale:** structurally under `[locale]`, but EN-only content for this one-off event. No translation entries added.

## Structure — Stepped Switcher

A single client-island stepper with **6 steps**, one continuous walk:

```
Intro → Era I → Era II → Era III → Era IV → Synthesis
```

- **Persistent stepper header**, always visible, showing the four eras with each era's **vibe word** beneath it (skepticism → guarded fascination → trust pivot → liberation). Intro and Synthesis are compact end nodes. The header doubles as navigation (click any step) and as the at-a-glance psychology arc.
- **Step navigation:** Prev/Next controls + clickable header nodes. Current step is synced to the URL via `nuqs` (e.g. `?step=era-3`) so a given step is deep-linkable and shareable, and browser back/forward works. Default step = Intro.
- **Transitions:** subtle `motion/react` enter/exit between steps (consistent with existing fade-in usage). Respect `prefers-reduced-motion`.

### Shared Era-Panel Anatomy (Eras I–IV)

Each era step uses one template, **stacked** (framing above, full-width demo below):

1. **Framing block** — era label + year span, era name, a one-line *Reality* statement, and a *Vibe* line (italic, accent color).
2. **Interactive demo** — full width (the demos are wide; a side rail would crowd them).
3. **`Expandable` deep-cut** — a "Did you know?" essay-style reveal (house pattern) with the deeper lesson.

Intro and Synthesis are bespoke (not demo panels) but visually consistent.

## The Six Steps

### Step 0 — Intro
Title + thesis ("your role is shifting from writing syntax to architecting AI-native ecosystems") + one-line orientation to the four-era lens, framed so the audience knows the **vibe arc is the real story**. A "Begin" control advances to Era I. Tone: orienting, not a sales pitch.

### Step 1 — Era I · Raw Pattern Matching & Code Completion
**Tech:** GPT-2 / base GPT-3 (davinci). **Vibe:** skepticism.
**Reality:** you can't *ask* it anything — you feed the start of a pattern and it continues, unaware of intent, unpredictable.

**Demo — "Playground" (the real davinci surface), JavaScript:**
- A monospace "playground" text field seeded with a JS prefix (e.g. a half-written `reverseList` / array function). A **Submit** action streams a continuation appended inline (continuation visually shaded distinct from the prompt).
- **Reveal 1 — you can't ask it:** typing a *question* ("how do I reverse a list?") does **not** answer — it continues the text into *more* questions / more prose. There is no one to ask.
- **Reveal 2 — unpredictability:** a **temperature slider** makes it tangible — low temp loops/repeats, high temp derails into nonsense; the same prompt regenerates differently each time (no stable answer).
- **Self-contained:** a curated set of seeded prefixes (incl. the question case) map to believable davinci-era continuations across temperature bands. No live model.

**Deep-cut:** why this felt like a "neat trick, too unpredictable for real work" — there was no intent model, only continuation.

### Step 2 — Era II · Conversational Assistants & Inline Companions
**Tech:** ChatGPT / early Copilot / Cursor chat. **Vibe:** guarded fascination.
**Reality:** it can talk now, but it's **localized** — sees one file/selection, has no repo awareness, and **you are the integration layer**. Nothing reaches the code until you copy/paste or accept the diff.

**Demo — side-panel chat + editor (the Cursor/Copilot surface), both modalities:**
- **Side-panel chat:** ask for a change → a code block appears **in the panel** with **Apply** / **Copy**. It can't run it and can't see the rest of the repo; *you* decide if it's right and move it across.
- **Inline ghost-text:** a Copilot-style ghost completion in the editor that you Tab-to-accept.
- **The "no repo awareness" twist (included):** the suggested block doesn't quite fit the file — references a variable that isn't there or dupes an import — so "Apply" leaves a small manual cleanup only you can reconcile. Drives home: it sees the selection, not the system.
- **Self-contained:** scripted request → suggestion pairs and a small editor model; "Apply" mutates local component state with the deliberate mismatch.

**Deep-cut:** appreciating the contextual speed boost while keeping absolute, manual, file-by-file control — and why that ceiling existed.

### Step 3 — Era III · Systems-Driven Agentic Engineering *(centerpiece)*
**Tech:** Claude Code / Codex CLI / Conductor. **Vibe:** the trust pivot.
**Reality:** you stop writing syntax and start writing the **rules**. The agent has repo access, runs commands, runs test loops, and self-corrects. You manage the spec and constraints; you realize *you* are the bottleneck and learn to get out of the way.

**Demo — playable recreation of the real WordPress → Next.js pixel-parity harness:**
- **Layout:** **Target** (a representative WordPress-style section — hero/CTA with classic WP quirks, built for the demo; safe to share) beside **Candidate** (the Next.js rebuild, initially with visible diffs).
- **Diff list:** computed-style mismatches + pixel deltas (e.g. `padding-top 48→32`, `color ΔE 4.2`, `heading width −16px / pixel Δ 312`, `font-weight 600→500`), with one **iframe/widget flagged as an honest exception** (a judgment call about what isn't worth it).
- **Self-correcting loop:** **cinematic auto-run** — hit "Run audit" and watch the agent screenshot → diff computed styles → pixel-match → fix → re-run, on its own, the candidate visibly morphing toward the target, the diff counter ticking toward zero, **VALIDATE** flipping from pending to green. Includes pause/replay for stage pacing.
- **Role inversion is the point:** you wrote the validation rules; the agent runs the loop. The attendee watches ~42h of work they didn't have to do, manually or iteratively.
- **Self-contained:** the loop is a scripted, deterministic animation over fixed diff data; no real agent runs.

**Deep-cut:** *"I didn't even build the harness myself."* The agent built the auditor; the developer set its rules. The judgment moved up a level — from writing syntax to designing the boundary the system self-corrects against.

### Step 4 — Era IV · The Runtime-Driven, AI-Native Horizon
**Tech:** real-time generative-UI frameworks, secure execution sandboxes, continuous org-context loops. **Vibe:** architectural liberation.
**Reality:** the LLM moves past the build phase into the **runtime** boundary — code becomes an ephemeral, just-in-time byproduct of user intent.

**Primary demo — generative UI (powered by json-render), dev-job-market data:**
- A prompt box pre-filled with *"What skills land junior full-stack & AI engineering roles right now?"*, plus suggested-question **chips**, each compiling a genuinely different UI:
  1. **Most-wanted AI-eng skills** → bar chart (RAG, agent/LLM orchestration, vector DBs, evals, prompt design, model serving) by % of postings + a KPI (e.g. *"AI-eng postings ▲ 240% YoY"*).
  2. **Full-stack vs AI-eng pay** → grouped comparison + a junior/mid trend line.
  3. **Junior-friendly stacks** → sortable table (e.g. *Next.js + Postgres + Prisma*, *Python + FastAPI + pgvector*, *TS + tRPC + Drizzle*) with demand + a "junior-openness" score.
  4. **What's rising, 2024 → 2026** → trend lines (AI-eng skills climbing, some full-stack staples flat).
- **The compile moment:** on ask, the **json-render spec streams in** (visible), then renders into the interactive dashboard that didn't exist a second ago. Different question → different UI. This is the felt surface: *the interface is a byproduct of the question.*
- **Under-the-hood reveal (`Expandable`):** it's **json-render** — and the *same* engine is what lets **end users build their own UI without a developer**. Authentic depth because the cached specs are real generated output.
- **Data:** plausible-but-synthetic, clearly framed as illustrative (not scraped) for the initial build.

**Secondary beat — ambient context / the company brain:**
- A compact animation, **not** a second heavy demo: source chips (Email, Slack, Meet transcripts, Docs, Tickets) animate their text flowing into a central **markdown "company brain"** via the LLM. Contrasts Era 2's friction (copy context *in*, copy answer *back out*) with Era 4's ambient context (the LLM is already in the surface — e.g. Claude in WhatsApp). Pure motion, no backend.

### Step 5 — Synthesis
Ties the vibe arc together: skepticism → guarded fascination → trust pivot → liberation. Lands the through-line: the **constant** across all four eras is the developer's judgment / ownership. Rhymes with *"AI produces the artifact. You hold the meaning."* Explicitly **not** a hasToggle sales pitch.

## Era 4 Generative Seam (Architecture)

A single boundary isolates the generation source from the UI:

```ts
generateDashboard(question: string): RenderSpec   // json-render spec
```

Two interchangeable implementations behind it:

- **Curated cache (default, always shipped).** The suggested questions map to **real, pre-generated** json-render specs captured from the actual LLM during dev. Works offline, zero cost, instant, demo-safe, never blank. Free-text fuzzy-matches to the nearest cached intent.
- **Live LLM (optional; dev + on-stage).** Real json-render + endpoint + component catalog + system prompt. Same interface; flipped on when a key/network is available to take a live free-text question.

This seam is itself an Era 3/4 lesson made literal: design the boundary, swap the implementation. It also keeps this page shippable independent of the live backend.

## Decomposition (Separate, Later Sub-Projects)

These are explicitly **out of scope for this spec** and swap in behind stable seams later:

1. **Live json-render backend** — adding json-render to the app proper (component catalog, generation endpoint, system prompt). Swapped behind `generateDashboard`. Wanted independently of the masterclass.
2. **Real scraped job-market data** — replaces synthetic Era 4 data to make the demo *meta and factual*. Swapped behind the same data source the cache reads from.
3. **Present mode (C)** — full-bleed, keyboard-driven, speaker affordances over the same B-first exhibit. Standalone chrome is chosen now to make this cheap later.

## State, Data & Error Handling

- **Step state** in the URL via `nuqs` (deep-linkable, back/forward safe). Default = Intro.
- **Per-demo state** is local component state; demos are deterministic and reset cleanly on step change / replay.
- **No network in the shipped build.** Era 4 reads the curated cache; the live path (when enabled) must fail safe — on any error/timeout/missing key it falls back to the cache so the demo never blanks. A free-text question with no good match falls back to the nearest cached intent with a gentle note.
- **Accessibility:** respect `prefers-reduced-motion` (animations degrade to instant states); stepper is keyboard-navigable; demos have non-animated readable end states.

## Testing

- **Unit (Bun):** the Era 4 fuzzy-match/intent resolver; `generateDashboard` cache path returns a valid `RenderSpec` for every suggested chip; the Era 1 prompt→continuation selector (incl. the question case); the Era 2 "apply" mismatch logic; the Era 3 diff-reduction state machine reaching zero + validate.
- **Component:** stepper navigation (URL sync, prev/next, header clicks, deep-link to a step), reduced-motion behavior.
- **Manual / preview:** walk all six steps in the protected preview deployment; verify nothing requires network; verify replay/reset on each demo.

## Reuse of Existing Patterns

- `Container`, `Heading`, `Subheading`, `MetaAside`, `Expandable` from the existing web app components.
- `motion/react` for transitions/animations (already a dependency, used across demos).
- Design-system components (`Button`, `Separator`, charts) via `@repo/design-system`.
- Follows the `(demos)` structure: a folder per demo with an `index.tsx` entry + supporting files; the masterclass route composes them inside the stepper.

## Out of Scope

- The three decomposed sub-projects above (live json-render backend, real scraped data, present mode).
- i18n/translation of masterclass content.
- Any production/`main` deployment or nav linking before the event.
