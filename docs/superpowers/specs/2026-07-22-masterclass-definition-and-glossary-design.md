# Masterclass — Design Update: The Definition Card & the Spectator's Fold

**Date:** 2026-07-22 · **Amends:** `2026-07-15-masterclass-agentic-engineering-rework-design.md` · **Event:** 2026-07-28

Two additions, one shipped now, one designed now and built later.

## 1 · The definition card (ships now)

The exhibit's title is its first jargon. The Intro defines the *practice* in a buried
clause and the *mechanism* ("an LLM with tools, trapped in a loop") only in Era III.
The word itself — what "agentic" means — is never defined. Fix: a definition card,
styled as a dictionary entry, placed between the narrator paragraph and the thesis
paragraph.

Approved copy:

> **agentic** · from *agent* — one who acts.
> Software that doesn't just answer. It does things: reads your files, writes code,
> runs the tests, tries again.
>
> **agentic engineering** · the practice of planning and directing such agents,
> rather than typing the code yourself.

Rules:

- The card defines the **word**, not the mechanism. Era III's loop beat remains the
  payoff; the card must never mention tools or loops.
- The thesis paragraph sheds its defining clause ("hand entire features to agents
  that write, test, and check the code on their own… The practice has a name:
  agentic engineering") — the card now carries that weight, so the paragraph
  keeps only the handoff image and the road.
- Styling: semantic `<dl>`, mono terms, neutral left rule — **not** the cyan
  meta/fine-print register. This is primary audience content, not an aside.
- Rejected: the psychology fold (Bandura/Milgram word-origin deep cut). Eric's call.

## 2 · The spectator's fold (designed now, deferred)

The event summary promises two layers: plain language for a general audience,
fine print for engineers. The ▸ folds exist; the plain-language layer has no
mechanism. Approved design — option D:

- A `<Term>` component: jargon terms get a subtle dotted underline; tap/hover
  reveals one plain-language sentence. The mirror of the senior rail: ▸ folds
  down for engineers, dotted terms open up for everyone else.
- One source of truth: `glossary.ts` (term → one plain sentence). The Synthesis
  (or footer) renders the same data as a quiet take-home list — "every technical
  word used tonight, in one plain sentence each."
- The Intro's `// Engineers: the folds marked ▸ are for you.` line gains a sibling
  advertising the dotted terms (wording to be drafted at build time).

Dictionary rules:

1. **First occurrence per step gets the mark; repeats don't.**
2. **No spoilers.** Terms the exhibit teaches as beats point home instead of
   preempting ("agent" → "software that acts on your behalf — the 2024 → now
   room takes this machine apart").
3. **One sentence, no metaphor.** The arena rule holds inside a popover.

Draft inventory (~20, curated at build time): LLM, agent, prompt, diff, repo, CI,
deployment, API, terminal, framework, migration, test / test runner, harness,
eval, RAG, runtime, token, quota, open source, pull request.

**Deferral trigger:** implementation starts only after Eric declares the demo copy
final — the term list depends on the exact final wording, so building it earlier
means curating it twice.

## Out of scope

Everything else. No changes to demos, chrome, or step structure.
