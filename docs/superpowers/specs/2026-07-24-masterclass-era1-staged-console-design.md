# Masterclass — Design Update: Era I as a Staged Console

**Date:** 2026-07-24 · **Amends:** `2026-07-15-masterclass-agentic-engineering-rework-design.md` · **Event:** 2026-07-28

Era I's playground currently exposes every control at once: a mode row (`base` /
`post-trained`) and a prompt row rendered in the *same* pill treatment, both live
from the first second, with the temperature dial and Submit stranded below the
output. Two problems follow.

**The controls collide.** "Which machine am I talking to" and "what am I feeding
it" are different species of decision wearing the same clothes.

**The room is spoiled.** Post-training is the room's payoff — the ChatGPT moment.
Sitting on screen from the start, it announces the ending before the story begins.

This redesign rebuilds the demo as a **staged console** that reveals itself one
beat at a time, in the order the presenter actually walks.

## The presentation frame

Two rules govern everything below.

1. **Nothing is on screen that the presenter hasn't reached.** Confirmed beat
   order: continuation → the question → the dial → the flip. The dial beat is
   always performed.
2. **The page does not speak first.** Verdict lines no longer appear on their own
   when a run finishes. Eric says the line; then he taps, and the page agrees with
   him. Cold readers tap it themselves, so the exhibit still works from a shared
   link with nobody narrating.

Rule 2 supplies the mechanism for rule 1: **the verdict tap is the demo's
transport control.** One gesture per beat — pick prompt → `Run` → talk → tap —
and the tap both prints the confirmation and opens the next door. No extra
gesture to remember on stage.

The affordance appears under the output only once streaming has finished, and is
replaced in place by the verdict line when tapped. The next `Run` clears the
verdict and re-arms the affordance.

## The stage machine

Five stages. Gates are monotone — once open, never closed. A page reload starts
fresh; a `↺` in the console chrome re-arms deliberately. The revealed stage lives
in a module-level session store so stepping to Era II and back does **not**
re-lock the demo.

| stage | on screen | opens when |
|---|---|---|
| **S0 · continuation** | nameplate `davinci-002 · base`, the half-written function already loaded, `Run ⏎`. No prompt selector, no dial, no mode control. | — |
| **S1 · the question** | a second prompt appears; the selector materialises, with the question **unselected** so the turn to it is the presenter's | S0 run completes + verdict tap |
| **S2 · the dial** | temperature enters the console chrome | question run in base mode + verdict tap |
| **S3 · the offer** | strip below the console: `2022 · humans taught it a format` → `Load the post-trained model →` | a run at a band the presenter moved the dial to (the dial must actually be turned) + verdict tap |
| **S4 · the flip** | the nameplate **becomes** a `base ⇄ post-trained` switch; the dial retracts; the same question **auto-runs** and is answered | pressing the offer |

S4 is terminal and unrestricted: both prompts available, the switch flippable
live as often as the room needs. The dial's rule from S4 onward is simply
*visible when the switch reads `base`* — the story restated as a layout rule.

**Why the S3 gate requires a real dial move:** the beat is "the same prompt goes
strange." Opening the offer on a tap at the default temperature would put the
payoff on screen while the presenter is still mid-beat. Precisely: the dial
appears at its standing value of `0.7` (band `mid`), and S3 opens only on a run
whose band is **not** the band in effect when the dial appeared — pushing to
`high` or dropping to `low` both qualify. Accepted cost: a run at the opening
band does not advance the stage.

**Why the flip auto-runs:** pressing the offer makes the machine answer the very
question it just failed, in place, with no further gesture. That is the ChatGPT
moment compressed into one press.

## The console

```
┌──────────────────────────────────────────────────────────┐
│ davinci-002 · base                 temp ──●── 0.7 steady │  chrome: identity | dial | ↺
├──────────────────────────────────────────────────────────┤
│ PROMPT   a half-written function   a question            │  body: content
│                                                          │
│ function reverseList(items) {                            │  prefix in foreground,
│   return items.slice().reverse();                        │  completion in cyan
│ }                                                        │
│                                                [Run ⏎]   │
├──────────────────────────────────────────────────────────┤
│ ↩ what just happened                                     │  the transport
└──────────────────────────────────────────────────────────┘
```

### Visual grammar

The collision is resolved by making the two controls different species:

- **Model identity** lives in the chrome. Until S4 it is not a control at all —
  a mono nameplate, no border, nothing to click, so nobody hunts for a second
  mode. At S4 it becomes a **solid slab switch**: two cells on a muted track,
  active cell filled (`bg-foreground` / `text-background`), inactive muted. It
  reads as hardware — one of two, physical.
- **Prompts** live in the body, directly above the text they load, under a small
  uppercase mono `prompt` label. No borders, no pills: mono text, the active one
  carrying a cyan underline. That is the same "underline = you are here" grammar
  the stepper header now speaks, so it costs the audience no new vocabulary.

The nameplate → switch morph is a single ~250ms movement (`motion/react`, already
a dependency). No bounce.

### Colour discipline

Cyan stays on **machine output** (the streamed completion) and active-state marks
only. No cyan prose line anywhere in the demo — cyan prose belongs to the
engineers' register (`//` asides, field-note rules) per the ruling in `eb9721b`.

The verdict affordance is `↩ what just happened`. It must **not** use `▸`, which
is reserved for the senior folds.

### Projection legibility

Output moves from `text-sm` to roughly `15px` with `leading-7`; controls move up
one notch from `text-xs`. The exhibit is presented on a projector.

## Copy consequences

- **Prompt labels lose their stage directions.** `A question (watch what happens)`
  → `a question`; `A half-written function` → `a half-written function`. The
  parenthetical was the presenter's line.
- **The demo's opening italic is cut** — *"Most of the world met these models
  believing they're a search engine with better manners. Try it — ask it a
  question."* It directs the room, and at S0 it points at a question that is not
  loaded yet. The era panel's reality paragraph already frames the room, and the
  search-engine belief is spoken live.
- **Verdicts become band-aware.** `verdictFor({ promptId, mode, band })` replaces
  the four inline conditionals, and the high band earns its own line — the
  *"how do I reverse time? who is asking?"* continuation deserves more than the
  generic "it's continuing your pattern."
- **One new mono whisper** when the dial arrives:
  `temperature — how much the dice get to decide`.

Existing verdict copy is otherwise preserved verbatim.

## Code shape

`index.tsx` is 175 lines containing four near-duplicate verdict blocks; this
change would push it past 300. It splits:

| file | responsibility |
|---|---|
| `stage.ts` | `Stage` type, `advance(stage, event)`, visibility predicates. Pure. |
| `verdicts.ts` | `verdictFor({ promptId, mode, band })`. Pure. |
| `console-chrome.tsx` | nameplate → switch, dial, `↺` |
| `index.tsx` | orchestration and streaming only |
| `session-store.ts` | module-level revealed stage; survives step navigation, dies on reload |

`selector.ts` and `completions.ts` change only in label copy; `bandFor` and
`selectCompletion` keep their current behaviour and their current tests.

## Testing

TDD on the two pure modules, per house pattern:

- **`stage.ts`** — each gate opens on its own event and no other; gates are
  monotone (a later event never regresses the stage); the S3 gate rejects a run
  at the opening band and accepts a run at a moved band; `↺` returns to S0.
- **`verdicts.ts`** — one line per `(promptId, mode, band)` combination the demo
  can reach; instruct mode ignores band; no combination returns empty.
- Existing `selector.test.ts` keeps passing unchanged.
- `bun run typecheck` clean; scoped `bunx biome check` clean on the changed files.

## Out of scope

- Era II, III, IV demos and their controls.
- The deferred glossary layer (`2026-07-22` spec) — still waiting on Eric's
  declaration that demo copy is final. This redesign changes Era I copy, so the
  glossary remains parked.
- The stepper header, the fade scrim, and arrow-key navigation.
- Keyboard `Enter` binding for `Run` (the global arrow-key listener already makes
  page-level key handling delicate; not worth the risk for this change).
