# Masterclass Rework: The Agentic Engineering Masterclass — Design

**Date:** 2026-07-15
**Amends:** `2026-06-29-masterclass-four-eras-design.md`, `2026-07-12-masterclass-spectator-layer-design.md`
**Event:** Masterclass on 2026-07-28

## The spine change

The exhibit stops being "four equal eras" and becomes a road that arrives somewhere: **agentic engineering** is the destination and the namesake. Eras I–II are the historical background that made it possible; Era III is the room we live in; the old Era IV is demoted to an **Outlook**. This explicitly overrides the earlier "four is the load-bearing number" rule.

Binding sentence, recurring across rooms (Eric's, kept near-verbatim):

> Every step was shaped by what the model could barely do — and by how people learned to use it.

New shape: **three rooms of history, one workshop, one horizon.**

All existing demos, their logic, and their tests are preserved; this rework is copy, framing, and four small new beats. All spectator-layer rules stay in force (spectator test, arena rule, senior tax, companion rule; offline/deterministic; reduced-motion safe; real data cited).

## Verified facts this rework leans on (cited in deep cuts)

- Base GPT-3 continued questions instead of answering; OpenAI post-trained with SFT + RLHF (InstructGPT, 2022); instruct answers preferred ~85% over base GPT-3; ChatGPT (Nov 2022) shipped on that post-training. The literature's canonical example — asked "What is the capital of France?", a base model continues "What is the capital of Germany?" — is our Era I question chip.
- Cursor forked VS Code because the extension API couldn't support deep AI integration (codebase indexing, multi-file edits, inline diffs need the editor core — "root access"); Copilot-as-plugin vs Cursor-as-fork.
- Claude Code's terminal choice (page carries the verified framing): Unix-utility philosophy, "do the simple thing first," smallest useful building block. Eric's "common denominator among Anthropic's own employees" anecdote stays spoken, not printed.
- Sequencing correction adopted: function-body-from-comment completion is Codex/Copilot (2021); reasoning models (late 2024) are the hinge from Era II into Era III, not the enabler of autocomplete.

## Stepper

Labels: `Intro · I · Completion · II · Integration · III · Agentic engineering · Outlook · Synthesis`. Vibe words: skepticism / guarded fascination / the trust pivot stay for I–III; the Outlook node carries **"the next frontier"** (replacing "architectural liberation"). Step ids (`era-1`…`era-4`) are unchanged for deep-link stability.

## Intro

- Eyebrow: **"Masterclass on agentic engineering · 2026-07-28"**.
- H1: **"Agentic Engineering"**. The four-eras lens moves into the subtitle as method: lived experience, recounted against the history of how the models developed and how engineers' minds had to move. Agentic engineering is something we *arrived at* — not possible, and not wanted, four years ago.
- Narrator paragraph, how-to-watch list (updated to the new shape), senior-rail advert, and RhythmFigure slot stay.

## Era I — The completion machine (2019–2022)

Reframe: nobody engineered with GPT-2/3 — this room exists to root everything that follows in the completion mechanism. Panel name: "The completion machine"; years end 2022 (to include the flip).

**New beat — the post-training flip (the strongest addition):** a mode toggle on the playground: `base (davinci)` vs `post-trained (instruct)`. Same prompt chips; base continues (existing behavior, temperature bands intact); post-trained **answers**. In instruct mode the question chip finally gets an answer, and the placard flips to: OpenAI taught the model the Q&A format with human feedback because extraction was too hard without it — that flip is the ChatGPT moment. Suddenly useful — for knowledge, not yet for engineering.

Instruct outputs are curated per prompt (single canonical answer each; temperature does not vary them — post-training made output *stable*, which is itself the lesson; the temperature slider is disabled in instruct mode with a mono note "post-training flattened the dice").

Deep cut gains the citable spine: InstructGPT, ~85% preference, the capital-of-France example from the actual literature mirroring our chip.

## Era II — Extraction → Integration (2022–2024)

Panel name: "Extraction → Integration". Two phases in one room.

**New beat — the browser-tab mock (playable, decided):** phase one rendered as a mini browser window (chrome bar, ChatGPT-style thread) above the editor demo. The thread shows a question ("how do I validate a discount code?") and a code-block answer with a **Copy** button; the editor below shows a **Paste** affordance. The visitor performs the fragmentation: click Copy in one world, click Paste in the other. Placard: *"You were the clipboard."* Deterministic two-state machine (copied → pasted); reduced motion unaffected (it's clicks, not animation).

The existing editor+chat demo becomes phase two, reframed as the Cursor moment: selection as context, chat beside the editor, no more copy/paste. Reality copy carries Eric's lived verdict: a senior engineer was still faster and better — the model missed the surrounding context and the framework's basic workings (React lifecycle class of errors); correcting it cost more than writing it. The missing-import punchline stays as the dramatization.

Deep cut: the fork story (extension API vs editor core, "root access") + the exit hinge: models learn to reason — multi-step thinking, late 2024 — the ingredient the next room requires.

## Era III — Agentic engineering (2024 → now)

Panel name: "Agentic engineering"; years "2024 → now". Reality copy rewritten: an agent, mechanistically, is **an LLM with tools, trapped in a loop**; Claude Code launched in the terminal; barely useful at first even on the strongest coding models; then horizons stretched — minutes became hours.

**New beat A — the loop (opens the room, before the harness):** a small deterministic animation of the mechanism: message → think → `Read(checkout.js)` → think → `Write(checkout.js)` → run tests → respond, cycling. Mono, flat, no robot. Reduced motion: all steps rendered static. The harness demo then reads as "that loop, grown up."

**New beat B — the Meter (closes the room, after the pipeline board):** the economics of living here, as an instrument panel:
- KPI: model usage at API prices — "thousands of € a month" (deliberately unranged; Eric doesn't know the exact figure and the page must not invent one).
- KPI: the subscription — €180 flat, ×2.
- KPI: weekly quota, resets Saturday 11:00 — "mine is gone by Wednesday."
- The window diagram: two flat timelines, mono labels. Top ("cold start"): first message 09:00 opens a 5-hour window, hard coding empties the quota by 12:00, wait until 14:00. Bottom ("greeted at 07:00"): a scripted hello at 07:00 opens the window early; coding starts 10:00; when the quota would bite, the window has already rolled — no waiting. The existing 7:00 field note becomes this beat's caption (moves inside the Meter; not duplicated).

Era III sequence: **loop → harness demo → reading ladder → pipeline board → Meter (with field-note caption) → deep cut.** Harness, ladder, and board are untouched.

## Outlook — the runtime frontier (was Era IV)

Demoted honestly. Subheading "Outlook · 2026 →"; panel name "The runtime frontier"; reality copy says it straight: this isn't a room the story's hero lives in — the story so far was about empowering one engineer; this is the model crossing from build-time into the runtime itself. Generative-UI demo, German/EU data, sources, company brain, placard: all unchanged. Stepper label: `Outlook`, vibe "the next frontier".

## Synthesis

Rewritten to land the new arc: three rooms of history, each shaped by what the model could barely do and how people learned to use it; agentic engineering as the place we arrived; judgment as the thing that never moved. Existing closing line ("AI produces the artifact. You hold the meaning.") and the confession block stay.

## Testing

- Era I selector: mode-aware `selectCompletion` (TDD; existing band tests keep passing; instruct answers stable across temperature; question chip answers in instruct mode only).
- Era II extraction: pure clipboard-state helper (TDD, small).
- Era III loop: step-sequence helper (TDD, small).
- Meter: static content, no logic to test beyond render (house pattern).
- All existing tests keep passing; `bun run typecheck` clean; scoped `bunx biome check` clean on the exhibit.

## Out of scope

Demo logic changes to harness/ladder/pipeline/Era-IV runtime; i18n; present mode; the rhythm-graphic asset (slot still reserved).

## Open inputs (Eric)

1. Rhythm graphic (unchanged, still incoming).
2. Line-by-line copy veto on the dev server, as before.
