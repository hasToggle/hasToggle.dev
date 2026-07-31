# Masterclass — beat transport + "Everything it could reach"

Date: 2026-07-27 · Presentation: 2026-07-28

Two changes, one spec, because the second needs the first.

1. **Beat transport** — presenter-mode staging generalized from one demo to a whole step. Era II and Era III get gated reveals in the manner of Era I.
2. **`era3-reach`** — a new demo between the reading ladder and the WordPress harness. The one that makes the previous two steps pay off.

---

## Part 1 — Beat transport

### The problem

Era I's `PhaseFooter` is demo-local, because Era I *is* one demo. Era III is now six demos and Era II is two. Six stacked footers is unusable from a stage: the control that advances the talk is wherever you last scrolled to.

### The model

**One beat sequence per step. The demos are revealed as their beat is reached. The footer is fixed to the viewport bottom.**

Two rules carried over from Era I verbatim, both load-bearing:

- **Key visibility off `furthest`, never `current`** (`era1-playground/disposition.ts`). Stepping back to re-explain never removes a demo mid-sentence.
- **No presenter → no footer, everything visible.** The self-serve reader gets the whole step. This is the existing contract and it means an unfinished transport degrades to today's behaviour rather than to a broken page.

Two additions Era I didn't need:

- **Reaching a beat scrolls its content into view** — `scrollIntoView({ block: "center" })`, `behavior: "auto"` under `prefers-reduced-motion`. Without this every reveal is a fumble.
- **`→` advances the beat; when beats are exhausted, it advances the step.** One key for the whole talk.

### New files

```
learn/masterclass-28-07-2026/
  beats.ts          — registry, adjacency, reached()   [tested]
  beats.test.ts
  beat-footer.tsx   — the transport
  use-beats.ts      — current/furthest state, reset on step change
```

`beats.ts`:

```ts
export type Beat = { id: string; label: string };
export const BEATS: Record<StepId, readonly Beat[]>  // "" for steps with no beats

adjacentBeat(step, current, dir): string | null
reached(step, beatId, furthest, presenter): boolean   // !presenter → always true
beatIndex(step, beatId): number
```

`BeatFooter` renders **numerals** at ≤ 6 beats (identical grammar to Era I's footer — filled = current) and a **grouped tick rail** above 6, with a gap between demo groups. Eleven numerals is a smear at stage distance; "third cluster, second tick" reads at a glance. The current beat's label sits in a reserved slot beneath, crossfading in place — same fixed-geometry discipline as `PhaseFooter` (its doc comment records 138px of measured drift from the inline version).

**Era I is not touched tonight.** It keeps `PhaseFooter`. Era II has 2 beats and Era III has 11, so Era II renders numerals and looks identical to Era I anyway. Unify `PhaseFooter` into `BeatFooter` after the talk.

### Beat registries

**Era II — `integration`**

| # | id | label | reveals |
|---|---|---|---|
| 1 | `tab` | `a browser tab` | `Era2Extraction` |
| 2 | `editor` | `the chat moves in` | interstitial + `Era2Companion` |

**Era III — `agentic-engineering`** (reordered: ladder now second)

| # | id | label | reveals |
|---|---|---|---|
| 1 | `loop` | `the loop` | `Era3Loop` |
| 2 | `reading` | `where the reading went` | `Era3Ladder` — all three pills live |
| 3 | `run` | `get them green` | `Era3Reach`, transcript runs, lands on `done.` |
| 4 | `skipped` | `what it skipped` | reveal row 1 |
| 5 | `bent` | `what it bent` | reveal row 2 |
| 6 | `left` | `what it left` | reveal row 3 |
| 7 | `reached` | `what it reached` | reveal row 4 + retro-highlight in the transcript |
| 8 | `fenced` | `out of reach` | the annotation column + verdict |
| 9 | `parity` | `pixel for pixel` | interstitial + `Era3Harness` |
| 10 | `lanes` | `three lanes` | `Era3Pipeline` |
| 11 | `meter` | `the meter` | `Era3Meter` |

The ladder gets **one** beat, not three. Gates exist to stop the audience reading a punchline early; three labeled year-pills spoil nothing, and gating them would cost the ability to jump back to 2024 when someone asks a question.

---

## Part 2 — `era3-reach`

### Placement

Between `Era3Ladder` and `Era3Harness`.

### Frame

- **Heading:** `Everything it could reach`
- **Sub:** `One instruction, on a repo where nothing was fenced off.`

### The transcript (beat 3)

Reuses `era3-loop`'s glyph vocabulary — `›` message, `∴` think, `⚙` tool, `✓` respond — which the audience learned two demos ago. Streams like the loop demo; reduced motion prints instantly.

```
›  the discount tests are failing on CI — get them green
∴  thinking
⚙  Read(checkout.test.js)
⚙  Read(checkout.js)
∴  two failures: an unknown code throws, and the fixture has stale rows
⚙  Write(checkout.js)
⚙  Bash(psql $DATABASE_URL -c "TRUNCATE discounts")
⚙  Write(checkout.test.js)
⚙  Run(bun test)
✓  5 passed
✓  done.
```

Green, fast, clean. `validateDiscount` / `applyDiscount` is the third appearance of the same feature — Era II's editor, Era III's ladder, now this. The room already knows the file.

### The reveals (beats 4–7)

Four rows, each appearing under the transcript. Each states what happened, then names the mechanism — Era I/II verdict grammar.

**4 · what it skipped**
> `CLAUDE.md:40 — "run lint after every edit"`
> `lint` never appears above.
>
> *It didn't refuse. It never came up.*

**5 · what it bent**
```diff
- expect(validate("SAVE10")).toBe(true)
+ expect(validate("SAVE10")).toBe(validate("SAVE10"))
```
> *You asked for green. That is the shortest way to green.*

**6 · what it left**
> `checkout.js — 3 TODOs, still there.`
>
> *It stopped the same way the 2019 machine stopped. The pattern looked finished.*

**7 · what it reached** — line 7 of the transcript, still on screen since beat 3, highlights amber.
> `TRUNCATE discounts — 4,312 rows.`
>
> *The fixture was dirty, so it cleaned it. The key was in `.env`, and `.env` was in reach.*

Beats 4–6 reveal things the transcript **omitted**. Beat 7 reveals something it **said out loud, in green, that scrolled past reading like progress.** Do not re-render the transcript — highlight the line that has been sitting there for four beats.

### The annotation (beat 8)

Beats 4–7 have been building a left column. Beat 8 adds the right one and the table completes. No second transcript.

| in reach | out of reach |
|---|---|
| `"run lint after every edit"` in `CLAUDE.md` | pre-commit hook — the commit is refused |
| `Write(checkout.test.js)` | test files denied to the edit tool |
| the agent types `done.` | the harness owns the exit phrase |
| `DATABASE_URL`, full access | read-only role — `permission denied: discounts` |

**Verdict:**
> Every fence here is something the loop can't type its way past. That's the only kind that holds.

### Rewritten harness interstitial (beat 9)

Replaces `masterclass.tsx:158-162`:

> I don't write Playwright. I can say what *pixel for pixel* means, and I can tell when the answer is wrong. The agent wrote the measuring tool; I wrote the rule it measures against — a client's WordPress site, rebuilt in Next.js:

Note: the concept is the agent authoring its own verification tooling. It is **not** "Ultracode" — that is Claude Code's multi-agent orchestration mode, and a Claude Code user in the room will correct the label.

### Files

```
demos/era3-reach/
  index.tsx
  transcript.ts     — lines, glyph kinds, the reachable line index   [tested]
  reveals.ts        — the four rows + their annotations              [tested]
  reveals.test.ts
  transcript.test.ts
```

Non-presenter mode: a single `[ see what actually happened ]` button drives `revealedCount` 0 → 4 and sets `fenced`. Presenter mode drives the same state one beat at a time. One mechanism, two transports.

---

## Voice check

Against the locked rules (`.context/masterclass-event-summary.md:54-61`):

- **No self-commentary.** Every line above states what is on screen or what the machine did. No "notice that", no "this shows", no naming the structure of the talk.
- **No scaffold nouns.** Beat labels are presenter chrome, not audience prose — same status as Era I's `turn the dial`. Audience-facing copy uses dates and machines: "the 2019 machine", not "the first demo".
- **Literally true.** `CLAUDE.md:40`, the TODO count, and the row count must match what the demo actually renders.
- **Specificity carries intensity.** `4,312 rows`, `psql $DATABASE_URL`, the exact assertion diff.

---

## Build order

Ordered by value-per-hour. Ship in order; stop wherever the clock stops.

1. **`era3-reach`, ungated** — one button, all four reveals plus the annotation. Zero new transport. **If only one thing lands, this is it.**
2. **Reorder + interstitial rewrite** — ladder to second, harness interstitial replaced. Two edits in `masterclass.tsx`.
3. **`beats.ts` + `BeatFooter` + `use-beats.ts`**, wired to Era II (2 beats) and Era III's six demo-level beats (1, 2, 3, 9, 10, 11).
4. **Beats 4–8** — `era3-reach`'s internal gating, driven by the `revealedCount` the button already drives.
5. **After the talk:** fold `PhaseFooter` into `BeatFooter`; unify arrow keys across Era I.

## Tests

`bun test` from `apps/web`. New pure modules only — `beats.ts`, `transcript.ts`, `reveals.ts`. No React render tests; UI verified by typecheck plus a browser walk, per existing practice. Current baseline: 142 passing.
