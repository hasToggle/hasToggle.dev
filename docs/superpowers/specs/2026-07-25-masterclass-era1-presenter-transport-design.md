# Masterclass — Design Update: Era I Presenter Transport

**Date:** 2026-07-25 · **Supersedes:** `2026-07-24-masterclass-era1-staged-console-design.md` · **Event:** 2026-07-28

The staged console shipped and was walked live. Four things came back from that
walk, and one of them moves a load-bearing wall.

**The transport is too much work.** Every beat costs a tap on `↩ what just
happened` before the next control appears. On stage that reads as leg work — the
presenter clicking his way forward rather than talking.

**The layout jumps.** Controls arrive, the whisper row leaves, the offer strip
appears, and the output panel grows with its own content — so the `Run` button
moves while the room is watching the output. Eric loses his own focus on what
changed.

**The chrome loses its identity.** `davinci-002` is replaced by the switch rather
than joined by it, and the temperature dial vanishes when post-trained loads.

**Progressive disclosure is wrong for the web.** It serves the room on the night
and punishes everyone who opens the link afterwards.

This redesign replaces the verdict-tap transport with a **presenter mode plus a
phase footer**, and makes the console geometrically fixed.

## 1 · Presenter mode

Progressive disclosure becomes opt-in rather than universal.

- **Default (no flag).** Everything is on screen: both switch positions, both
  prompt tabs, the dial. No phase footer. This is what a visitor gets from a
  shared link, and it is a complete demo — nothing to click your way through.
- **Presenter mode.** The console reveals itself one phase at a time, driven by
  the footer.

**Entry is `?presenter=1`**, read via `nuqs` in `masterclass.tsx` alongside the
existing `?step=`, with `history: "replace"`. Push history would put every toggle
in the back stack, so the global `←` arrow would start undoing presenter mode
instead of stepping eras.

**`Shift+P` toggles it live.** This is safe against the existing arrow-key
navigation by construction: `stepKeyDirection` already returns `null` for any
modified key, so it cannot see `Shift+P`. The new predicate's own guard is
narrower than the arrow guard — arrows must yield to sliders, tabs and radios,
but `P` only needs to yield to genuine text entry (`input`, `textarea`,
`[contenteditable]`), of which this page currently has none.

The flag is read once at the page level and passed to `<Era1Playground
presenter />` as a prop. No React context: one consumer today, and a prop is the
honest interface when Era II wants one.

**Not persisted to `localStorage`.** Sticky presenter mode is a trap — demo on a
borrowed laptop, or hand someone your bookmark, and the mode outlives the room it
was for. The URL is the memory.

### Why presenter mode retires the earlier objection

The 2026-07-24 conversation rejected a presenter mode because it was going to
control *page voice*: forget the toggle and the page narrates over you all
evening. Controlling *disclosure* inverts the failure mode. Forget the flag and
you get the site's normal view — a perfectly good demo, fully populated. Mild
instead of embarrassing.

## 2 · One disposition, no branching

There is no second code path for the two modes. A pure
`dispositionFor({ presenter, phase, reached })` returns the flags the console
reads, and it is the single place the two modes reconcile so that
`presenter ? … : …` never appears in JSX.

| | default | presenter |
|---|---|---|
| `post-trained` switch cell | present | from phase 4 |
| second prompt tab | present | from phase 2 |
| temperature dial | present | from phase 3 |
| phase footer | absent | present |
| `↺` reset | present | present |

**Disclosure follows `reached`, not `phase`.** Gates remain monotone: jumping
back to phase 1 after reaching 4 highlights phase 1 in the footer but does not
take the dial away. Closing gates would make the footer a trap — step back to
check something and lose the control you were about to use.

## 3 · The phase footer

Presenter mode only. A single fixed-height row inside the console's bottom
border.

```
┌────────────────────────────────────────────────────────────────┐
│  ←   ①   ②  nobody answers   ③   ④                           → │
└────────────────────────────────────────────────────────────────┘
```

**Accordion, one open at a time.** Only the current phase carries its label; the
rest collapse to bare numerals. Every numeral stays clickable, so a jump forward
or back is always one click. `←` / `→` step by one and disable at the bounds.

Cells animate their width. The motion is horizontal, in the last row of the
console, with nothing below it — layout-stable in the sense that matters.

**The accordion also retires progressive labelling.** An earlier draft used
`·····` placeholders so unreached phase names couldn't spoil the ending. Collapsed
cells are bare numerals regardless of how far you've got, so nothing is spoiled
and the placeholder concept disappears.

| # | label | on arrival |
|---|---|---|
| ① | `autocomplete` | function prompt, base, temp → 0.7 |
| ② | `nobody answers` | question prompt, base, temp → 0.7 |
| ③ | `turn the dial` | question prompt, base, temp → 0.7, dial revealed |
| ④ | `2022 · taught to answer` | question prompt, post-trained, **temp untouched** |

The `2022` rides inline on ④ alone. Repeating `2019` across the first three is
noise; the date matters on exactly one beat, because that beat *is* a date.

**Every phase configures the machine and stops.** Arrival sets the prompt, the
mode and (for ①–③) the dial, and clears the output. Nothing runs on its own and
nothing streams on navigation. Phase ④ deliberately inherits whatever the dial is
at, so the presenter can crank to 1.4 in base and step forward to hear the same
1.4 answered in format.

**Controls arriving still fade in** over 250ms. A fade is the opposite of a jump;
the instruction was that navigation must not *start* anything, and a reveal
doesn't.

### What is lost: the gates

The stage machine enforced discipline — the dial would not appear unless the
question had actually been run in base, and the offer would not appear unless the
dial had actually been moved. The footer hands that discipline to the presenter.
`stage.ts` and its twelve tests are deleted, and `phases.ts` is a plain ordered
list with a `reached` comparison. Recorded here so it reads as a decision rather
than an accident.

## 4 · The chrome

```
davinci-002  [ base ][ post-trained ]      temp ──●── 0.7 steady        ↺
             └─ fixed-width slot ─┘        └─ reserved from the start ─┘
```

**`davinci-002` never moves and never changes.** It is the machine's name, and
the machine does not change; only its training does.

**The switch is present from the first second with one cell.** A one-position
switch reads as a nameplate. `post-trained` fades into the slot beside it at
phase 4. There is no morph to serialise, which dissolves the two-phase
`AnimatePresence mode="wait"` crossfade flagged after the last build. The slot is
sized for both cells from the start, so nothing to its right ever shifts.

The dial's slot is reserved the same way — a fixed-width gap in the instrument
panel until phase 3, then the slider fades into it.

### The dial stays live in post-trained

The old design retracted the dial on the flip, arguing that post-training
flattened the dice. That argument was made by absence, and it was also close to
false — a post-trained model still has a temperature.

**The data gains per-band instruct completions**, so `instructAnswer: string`
becomes `instructAnswers: Record<Band, string>`, symmetrical with `continuations`.
The dial is then simply always live once revealed: no dimming, no disabled state,
no `—` readout, no rule to remember.

This buys a better beat than the one it replaces. Crank to 1.4 in base and the
machine asks *how do I reverse time? who is asking?*. Flip to post-trained at the
same 1.4, touch nothing, and it still answers the question — chattier, looser,
with an unsolicited aside, but in the shape you asked for. **The dice are still
there; the format doesn't care.** That is the true claim about what post-training
did, and it is the one the seniors in the room will recognise.

New copy required: two low-band and two high-band instruct completions (the
existing two become the mid band), plus `INSTRUCT_QUESTION_HIGH` and
`INSTRUCT_CONTINUE_HIGH` verdict lines. `verdictFor` already keys on band, so
this is new constants, not new machinery.

## 5 · Prompt tabs

```
┌─────────────────────────┬──────────────┐
│ a half-written function │ a question   │
├─────────────────────────┴──────────────┴─────────────┐
│ function reverseList(items) {                        │
│   return items.slice().reverse();                    │
└──────────────────────────────────────────────────────┘
```

The active tab shares the output panel's fill and opens its bottom edge into it,
so the tab strip and the generation window read as one object. Inactive tabs sit
muted above the panel's top border.

**The `PROMPT` eyebrow is deleted.** A tab strip does not need to announce that it
is a tab strip — and that removes one of the 11px labels.

In presenter mode phase 1 has a single tab; the second grows in rightward, so the
growth is horizontal and nothing below moves.

**These are plain buttons with `aria-pressed`, not `role="tab"`.** `role="tab"` is
in `ARROW_CONSUMING_SELECTOR`, so adopting it would silently swallow `→` on a
focused tab with nothing implementing roving focus — a live regression traded for
correct-looking ARIA. They become real tabs during the in-demo keyboard pass,
which is queued behind global shortcuts.

## 6 · The console speaks one line

A single fixed-height slot below the output panel, always rendered, showing at
most one line of secondary text:

1. the run's verdict, if a run has finished; otherwise
2. `temperature — how much the dice get to decide`, if the dial is visible and
   nothing has been run; otherwise
3. nothing.

This folds away two separate regions that each used to appear and disappear: the
bordered whisper row and the `↩ what just happened` affordance. Rule 2 also means
the whisper now labels the dial for cold readers in default mode, where it
previously had no home.

**The verdict fades in ~1.5s after streaming finishes.** The page still doesn't
beat the presenter to the line — it arrives after he's said it, quietly, agreeing
rather than announcing. Cold readers get the narration for free.

The `2022 · humans taught it a format` offer strip is **deleted**. Its date lives
in phase ④'s label and its sentence already lives in the `INSTRUCT_QUESTION`
verdict.

## 7 · Nothing moves

Five measures, in order of cost:

1. **The output panel gets a fixed height, not `min-h-40`.** Sized to the tallest
   prefix + completion across every prompt × band × mode, expressed as an
   `OUTPUT_LINES` constant with a test asserting no combination exceeds it — so
   adding copy later fails loudly instead of quietly reintroducing the jump.
   Overflow scrolls. **This means a visibly empty console at phase 1**, which is
   the accepted price of the `Run` button never moving.
2. **Fixed chrome row height**, with reserved slots for the switch's second cell
   and the dial.
3. **The always-present one-line slot** (§6).
4. **The offer strip and whisper row deleted** rather than animated.
5. **The footer is a fixed-height row**, present for the whole session in
   presenter mode.

## 8 · Session snapshot

"Stepping away and back should keep the state wherever it's at" is taken
literally. The module-level store grows from a single `Stage` to the full
snapshot:

```
phase, reached, mode, promptId, temp, output, verdict, lastRun
```

Step to Era II and back and the screen is identical — mid-demo, output and all.
A run in flight is stored as its *finished* text rather than frozen mid-stream,
so navigating away during streaming returns you to a completed run rather than a
truncated one.

A page reload still starts fresh. `↺` still re-arms deliberately, and re-arming
means **`reached` resets too** — in presenter mode it returns to phase ① *and*
closes the gates, which is the only way to rehearse the reveal twice. In default
mode there are no gates, so it just clears the output and restores the function
prompt, base mode and 0.7.

**Toggling `Shift+P` mid-session preserves the snapshot.** Leaving presenter mode
keeps `phase` and `reached` in the store and simply shows everything and hides the
footer; returning restores the same phase highlight. The toggle changes what is
displayed, never what has happened.

## 9 · Code shape

**New, pure, TDD:**

- `phases.ts` — the ordered phase list, labels, arrival configuration, adjacency,
  `reached` comparison.
- `disposition.ts` — `dispositionFor({ presenter, phase, reached })`.

**New components:**

- `prompt-tabs.tsx` — the tab strip joined to the output panel.
- `phase-footer.tsx` — the accordion TOC and its arrows.

**Deleted:** `stage.ts`, `stage.test.ts`.

**Rewritten:** `index.tsx` (orchestration only), `console-chrome.tsx`,
`session-store.ts`.

**Amended:** `completions.ts` (`instructAnswers` per band), `selector.ts`
(`selectCompletion` reads the band in instruct mode too), `selector.test.ts` (new
instruct-band assertions; existing ones still pass), `verdicts.ts` +
`verdicts.test.ts` (two new high-band lines), `step-keys.ts` + `step-keys.test.ts`
(`isPresenterToggle`, `isTextEntryTarget`), `masterclass.tsx` (read the flag, bind
the chord, pass the prop).

## Out of scope

- **Keyboard navigation inside the demo.** Phase arrows and prompt tabs are
  mouse-only. Global shortcuts are the prerequisite and are being solved first;
  `Shift+P` is admitted now only because it provably cannot collide with the one
  global binding that exists.
- **`aria-pressed` on the mode switch** and an accessible name for the slider —
  both pre-existing, both house-wide rather than regressions from this work.
- **Presenter mode for Era II–IV.** The flag is page-level so those demos can opt
  in later; none does in this pass.
