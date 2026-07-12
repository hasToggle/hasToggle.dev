# Masterclass Four Eras — Design Update: The Spectator Layer

**Date:** 2026-07-12
**Amends:** `2026-06-29-masterclass-four-eras-design.md`
**Event:** Masterclass on 2026-07-28
**Route:** `/[locale]/learn/masterclass-28-07-2026` (unchanged)

## Amendment 0 — Audience & Translation Model (spec correction)

The original spec's audience ("aspiring/junior developers plus some seniors") is superseded:

- **Audience:** genuinely general — people who've never thought about how software gets made — plus seniors watching along (bootcamp lead coaches, colleagues).
- **Takeaway for the non-technical majority:** comprehension. They're well-informed spectators of the developers' story. No job-transfer reframing, no hands-on-agency goal.
- **Translation is layered:** the presenter translates live; the page carries a quieter written version (setup lines, placards, field notes) that works cold when shared later but is written to *accompany* a narrator, not replace one.

Every addition below was tested against four rules, which join the spec's design principles:

1. **Spectator test** — a person with no software background follows the ball better.
2. **Arena rule** — the code stays code; translation sits beside the artifact, never inside it.
3. **Senior tax** — the deep-cut rail is never diluted.
4. **Companion rule** — coherent cold, written for a live voice.

## Amendment 1 — Intro rebuild: the field report

`intro.tsx` becomes a field-report opening — who's reporting, from where, at what altitude, how to watch. Four moves, in order:

1. **The narrator.** Principal engineer; burns through two Claude Code Max 20x subscriptions. Framed strictly as an instrument reading, not a flex — one clause of translation: the top plan is built so heavy professional users never run out; he empties two. (The driving-instructor-at-60,000-km register.)
2. **The rhythm graphic.** Eric-supplied asset (incoming; generated externally). Turtle-and-rabbit weekly rhythm — long "nothing is built" thinking/planning stretches vs. bursts of parallel sessions at speed. Execution stays dry/editorial: flat timeline, mono labels, the joke lives in the caption. Caption cross-references room III: the mechanism behind the bursts is shown there. Until the asset arrives, the design reserves a slot (component boundary + caption) with no placeholder art shipped.
3. **How to watch.** Three lines, operating instructions not disclaimers: you'll walk four rooms; everything is playable and nothing breaks; the vibe arc is the real story.
4. **The senior-rail advert.** Verbatim register: *"Engineers: the fine print under each demo is for you."* The rail stops hoping to be found.

The existing thesis lines (role shift; vibe arc; "the model kept changing…") survive, compressed. Bloat rule: anything that makes the Intro a biography moves to a field note. The Intro establishes the narrator; field notes keep him present in every room.

## Amendment 2 — Era I: the misconception setup

One imperative setup line at the top of the Era I demo (above the prompt chips):

> Most of the world met these models believing they're a search engine with better manners. Try it — ask it a question.

The existing post-answer caption ("You asked a question. It didn't answer… there's no one in there to ask") is thereby promoted from caption to punchline. Precision constraint: the lesson is *it doesn't retrieve, it continues* — never "it can't answer questions," because Era II visibly answers questions two minutes later. Setup and payoff live on one screen, so the beat survives deep-linking to `?step=era-1`.

## Amendment 3 — Era III: the reading ladder ("Where did the reading go?")

A second beat inside Era III, **after the harness demo** — the lived middle of the trust pivot, currently untold. Three dated tabs, **the same feature at three review altitudes**, the reading visibly moving up and shrinking:

| Tab | What's shown | The line |
|---|---|---|
| **2024** | A wall of generated diff, tiny scrollbar — plan-mode era | "I read every generated diff like a literature student. I have a literature degree. I did not expect to use it on diffs." *(verbatim)* |
| **2025** | A tidy numbered implementation plan | "I read the plan, not the code. I reviewed intentions, not artifacts." |
| **2026** | A short design paragraph + a test runner going red → green | "I plan the design. Claude writes the implementation plan. Tests read the code — I don't." |

Structural rules: this is a sub-stage of Era III, not a fifth era; four is the load-bearing number. Tab content is static, deterministic by construction; the 2026 tab's red → green runner respects reduced motion (instant green end-state). Spectator reading: *he used to read everything; now machines check and he decides.* Senior reading: review didn't disappear — it changed altitude.

## Amendment 4 — Era III: the pipeline board (three lanes, three tenses)

The closing beat of Era III and its exit door into Era IV: the working rhythm the trust pivot buys. **The existing harness demo stays untouched** — the board joins it; it never replaces it.

Three parallel lanes, each running **plan → execute → validate**.

**Interaction law — clicks only exist where attention exists.** Planning is the only broadly interactive phase; the click that ends it is labeled **Hand off**. Execution animates by itself; validation resolves by itself wherever no human gate exists. When a lane enters execution, the next lane's planning phase lights up and the attention cursor moves. Placard, written cold:

> Notice where your clicks went. That's where the job went.

**The lanes** (all real streams; plain label + mono sublabel + validation instrument):

| | Lane | Plain label | Mono | Court | Tense / visitor click |
|---|---|---|---|---|---|
| 1 | RAG retrieval + debiasing | "A fairer job search — same query, same results, whoever's asking" | `rag-retrieval · bias-evals` | eval suite (retrieval parity) | **present** — the visitor plans this lane and performs the **Hand off** click |
| 2 | WordPress → Next.js rebuilder | "Rebuilding a site, pixel for pixel — the demo above" | `wp-next · parity-harness` | the parity harness — reuses the exact green `VALIDATED ✓` treatment from the demo above, so recognition does the teaching | **past** — already mid-execution on mount; the visitor played its planning without knowing it. No click. |
| 3 | Automated package updates | "Every library kept current, on a schedule" | `deps · eve agent` | **CI + a human signature** — every PR is reviewed; CI goes green, then the lane waits at `awaiting signature` until the visitor clicks **Approve merge** | **permanent** — planned once, re-running on a schedule ever since; the only click is the signature at the end |

The three lanes put the visitor's clicks in three different places — lane 2: none (already handed off), lane 1: at planning, lane 3: at the final merge signature. *Clicks live where judgment lives*, shown three ways. Past, present, permanent: the board is a gradient of autonomy, and its far end — an agent running on a schedule with human judgment surviving only as a signature — is the doorstep of Era IV.

Lane 1's plain label is deliberately the exhibit's most universally legible sentence; exactly one clause of the debiasing story appears on the board, no more.

Deterministic timers; reduced-motion collapses to instant end-states; the lane×phase state machine is a reducer developed TDD, in the same weight class as the existing harness reducer.

**Era III final sequence:** harness demo → reading ladder → pipeline board → deep cut ("I didn't build the harness either").

## Amendment 5 — Field notes: a new content type

Small, dated, true artifacts of daily practice. A `FieldNote` component derived from the `MetaAside` register (the landing page's fine-print voice), styled lab-notebook: date in mono, one short paragraph, 1–2 per era. Hard rule: **only notes actually lived**; where an era predates the practice, the note says so honestly.

Seeded notes (approved material):

- *`field note · 2026-07`* — saying hi to the agent at 7:00 sharp so the five-hour window opens early; some days the window burns in three hours and the last two are spent waiting. (Era III.)
- An Era I honesty note in the confessed-gap form ("I was teaching juniors to write this by hand while a model autocompleted it badly" — exact wording Eric's, drafted for veto).

Remaining notes are drafted during implementation and individually approved — the container ships regardless of how many notes fill it at launch.

## Amendment 6 — Placard normalization + the confession

**Placards.** The italic demo-footer line becomes a deliberate, consistent surface — every demo ends with one "what just happened" beat (the layered-translation decision made physical). Era III's already exists; Era I gains a resting placard (its current line appears only after the question chip); Era II's lives in the resolved banner (kept); Era IV gains one after the dashboard renders. Written to accompany a narrator: short, dry, no metaphor in the arena.

**The exhibit confesses — placed in the Synthesis.** One late beat: this page was itself built by the process it describes — design spec → implementation plan → TDD — pointing at the real dated documents and tests on the branch (rendered as mono file-path artifacts; no dependency on external links resolving). Synthesis over Era III deep cut: Era III is now the exhibit's heaviest room, and the confession is strongest standing next to the closing line — *"AI produces the artifact. You hold the meaning"* — the page itself as the last exhibit.

## Not in scope

Live backends, present mode, i18n (unchanged from the original spec). No fifth era. No TypeScript/Octoverse material (considered, discarded). Turtle-rabbit asset production happens outside this repo; the design reserves its slot and caption.

## Testing

- **Unit (Bun):** pipeline-board reducer (lane×phase progression, hand-off transitions, lane-3 signature gate, full-board completion); reading-ladder tab state; existing masterclass tests keep passing.
- **Manual / preview:** walk all six steps; verify reduced-motion end-states; verify every demo carries its placard; verify the Era III sequence reads demo → ladder → board → deep cut.

## Open inputs (Eric)

1. **Rhythm graphic** — share when generated; slot and caption are reserved.
2. **Copy approvals during live iteration** — lane 1 plain label, field-note wordings, Intro instrument-reading clause. All drafted; vetoed line by line on the running dev server.
