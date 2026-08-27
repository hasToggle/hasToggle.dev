# The instrument design guide

`voice.md`'s sibling: that guide governs what a visitor reads, this one
governs what they see and press. It exists for the same reason — the design
drifts, and it drifts toward decoration. Every element on a demo earns its
place by answering one question: does this contribute to clarity? The page's
feel is a developer environment, not a course platform. Engineer, not
student.

The audience is four people at once — an aspiring developer, a non-technical
visitor, a junior, a senior — and they get **one experience legible at all
levels, never per-level modes**. When a value needs to reach all four, encode
it redundantly (two channels, one display), don't fork the interface.

---

## 1. The fixed grammar

Every demo sits in the same chassis, zones in fixed positions — like a car's
cockpit or an editor's panes, a visitor who has used one instrument has used
them all:

```
┌──────────────────────────────────────────────┐
│ ● live                        SLOW MOTION ⭘ │  chrome: state left, view right
│                                              │
│  bake #64f93b                                │  the specimen
│  provenance rows · one narration caption     │
├──────────────────────────────────────────────┤
│ [ actions, in execution order ]              │  the deck
├──────────────────────────────────────────────┤
│ ▸ bake.ts + actions.ts       docs ↗ source ↗ │  reference bar
└──────────────────────────────────────────────┘
```

- **Chrome, top-left — the state gauge.** `live` (cyan) at rest, `working`
  (amber) while any server round trip is out. One in-flight signal per
  instrument; this is it.
- **Chrome, top-right — view controls.** Mode switches (slow motion) live in
  the corner every editor keeps its view switches. Subject actions never live
  here; instrument housekeeping may — a reset that rewinds the bench sits in
  this corner, locked while the instrument is at rest (2026-08-27). Empty
  when a demo has no alternate view and nothing to rewind.
  - **The cause view is labeled by what the visitor gets, not by what the
    demo does.** Where the cause is the same events replayed slower, the
    label is `slow motion` — both replay views (02, 06) wear it, and 06's
    switch said `narrate` until 2026-08-27. Where the event already runs at
    human speed and what is hidden is somewhere else, the label names that
    place instead: 03's `response` draws the same live run as the server
    sent it (2026-08-27). Slowing a 1.9-second event would be padding, and
    a second label costs less than a wrong one.
- **Body — the specimen.** The observed value large, provenance rows as one
  aligned table, one narration caption. All describing text in one place.
- **Deck — actions only.** Execution order, left to right. When a flow has
  real sequence, the controls diagram it (numbered steps, an arrow, the later
  step dark until the earlier one fires). A deck may end in a **result chip —
  output, never input** — when the platform's own label for the sequence's
  outcome is knowable by rule (exhibit 02: `revalidated · tag-based
  deletion`, the badge Vercel files the refill under).
- **Reference bar — the status bar every editor ends in.** The code drawer's
  disclosure left (source opens inside the chassis, native `<details>`, zero
  JS); `docs` and `source` links pinned right, positioned so clicking them
  never toggles the drawer. Row height mirrors the chrome header.

What the grammar deliberately lacks: a panel label (the intro prose names the
subject once) and a readout footer (the source in the drawer is the spec
plate — a reader who wants identifiers is the reader who opens it).

Outside the chassis: the eyebrow names the chapter and its topic (`the
cache · caching & revalidation`) where engineers read identifiers — two
names, no numeral. Asides are set as `/* code comments */` in comment-gray
mono, because that is what they are.

## 2. Feedback

Anything in flight says so three ways: the gauge flips to `working`, the
specimen dims and pulses, and when the new value lands it takes one amber
wash (`.ht-land` — key-remount, skips first paint, reduced-motion safe) and
settles. No silent updates, ever.

A change spent behind a turning card was never spent. Where a demo hides
its own output while narrating — the state card flips to its source and
back — the face holds the old value for the length of the replay and
changes it only when the front is square to the reader again. The state
itself updates on the click frame, as it always did; what waits is the
display, and the aside under the card is where that gap is stated. The
reveal wears both marks at once, from the one commit: the landing wash
(the value is the key, so the remount plays it) and `.ht-settle`, 420ms,
the digits alone rising a hair into place. The eye's last movement is to
the thing that moved.

The React rule underneath: **client-owned state paints on the click frame;
only the server sync lives in a transition.** A mode flip inside the same
transition as its `router.refresh()` freezes the control until the round
trip resolves. While the flipped view waits for the server, the copy must
narrate the in-flight window honestly rather than claim a state the screen
doesn't show (see the settling readout in `rebake-copy.ts`).

## 3. Copy and demo co-evolve

A demo that gains a capability can obsolete prose that was accurate the day
it shipped — voice.md's three passes check a line against the panel *as it
is*, so re-run them whenever the panel changes. (Evidence: voice.md §6,
2026-08-19.)

## 4. Migration state — complete, 2026-08-20

All five exhibits are on the grammar; the legacy shapes (`LivePanel`
`label`/`readout`, standalone `CodeBlock`, `DemoSection`'s links row) are
deleted, not deprecated. Judgment calls worth keeping:

- **The specimen is not a control.** Exhibit 04's form and exhibit 01's
  click-me button stay in the body: a form wired to a Server Action is the
  lesson, and filing the subject under controls would misrepresent it. The
  deck holds instrument controls only (03's three arrangements, 05's title
  form — which drives the instrument rather than being it).
- **Unique readout facts became narration lines**; redundant readouts were
  cut without replacement (03, 04 — their facts live in the intro, the
  captions, or the source).
- **The gauge is wired where a client owns the panel** (02, 05, and 03
  since 2026-08-27 — the note here used to say wire it if the stream panel
  ever gained a client owner, and the rebuild below is that). 04 has no
  client round trip to gauge (its form works with JavaScript off, which is
  its point). 01 and 06 have client owners but no server round trip at all
  — their gauges stay `live`, because every event after arrival is a client
  render.
- **06's replay is slowed, not simulated — and labeled as such.** A press
  updates state immediately (the new number exists before the card
  finishes turning); in slow motion the card flips to its own source —
  Shiki-rendered on the server through the same cached pipeline as the
  reference drawers, zero highlighter in the browser — and the client
  walks one CSS class down the pre-rendered `.line` spans **top to
  bottom, every code line, the way a render re-runs the component**
  (Eric's correction: no jumping to the onClick first — that is not how
  code is processed). The full three-line history sits on the card from
  mid-flip, dimmed, each line lighting (○ → ●, the gauge-dot vocabulary
  at list scale) as the walk reaches it and staying lit — a record, not
  a ticker — with values read live at fire time. The back face carries
  the honesty label ("the last click, replayed slow · values real") and
  the aside repeats it. No deck: the re-render beat was a var-demo
  artifact and left with it (2026-08-21). The local-variable card is
  **not** in this chapter — it belongs to the /learn state lesson — and
  sits banked in the state folder (var-card.tsx), working and tested.

- **01 rebuilt as the belief performed, 2026-08-27.** The two-card
  comparison confronted the reader with the difference already resolved, so
  the misconception never happened on screen. Now one card (`card.tsx`,
  wearing its directive slot as a file wears its first line) walks four
  beats on a three-step deck: a Server Component at rest, doing the work
  developers expect of one — it fetches this repo's latest commit from the
  GitHub API and renders it (drift accepted and stated on the card:
  `cacheLife("hours")`, because a commit that lands inside the window
  ships with the deploy it triggers anyway) → *add a copy button* and the
  bench shows the compiler's refusal, quoted verbatim from the next-swc
  binary (a component that throws can never be on the bench — the
  intermediate state that made the old dead-button idea unshippable) →
  *"use client"* and the compiler refuses **again** — "use cache" has no
  client form — shown at diagnostic scale rather than as a second crash
  card: the file with the offending line squiggled and the error's first
  sentence (verbatim) as the editor note. Two crash screens in a row
  read as misery, not mechanism (Eric, 2026-08-27); the truth kept, the
  register changed → *extract the button* and the resolution is
  performed, not preached: card.tsx (server, fetch untouched) imports
  copy-button.tsx (client), and the button works for the first time. The
  boundary is drawn as a dashed line, always on and colored by residency
  — cyan server, orange client — with the rest seam as its legend. It
  moves: orange around the whole card in the crossed beat (what the
  directive claimed), and in the split an orange ring around
  copy-button.tsx nested inside the cyan server line — the chapter's
  diagram, drawn by the states themselves. The card body centers into
  the ghost-stack's reserved height, so no beat sits in dead space. The server slots
  cross into the client panel as props, which is the chapter's own
  mechanism. Two interaction rules came out of rejections here. From the
  counter (it felt disjointed — nobody adds a counter to a data card):
  **the specimen's interaction must be asked for by its own data, and
  must be legitimately client-only**, so no reader can retort "that
  wants a server action." From the working whole-file-client state (it
  rendered fine, which read as an endorsement): **an intermediate state
  that would require silently rewriting the specimen's code is a lie —
  show the refusal the real code produces instead.** The copy button
  copies a hash, which passes both. Rules from the copy rounds:
  - **The instrument never narrates its own construction.** Plumbing the
    demo needs but the mechanism doesn't (pre-shipped twins, replayed
    errors, swap-not-recompile) is not disclosed on the panel; seams and
    captions state mechanism facts only. The refusal's "replayed" honesty
    label was cut under this rule. Standing tension: 06's back-face label
    ("the last click, replayed slow · values real") predates this and
    still ships — revisit deliberately, not by sweep.
  - **Deck = subject actions; chrome = acts on the instrument.** Reset
    rewinds the bench, so it lives top-right, locked at rest, and the deck
    stays a pure diagram of the developer's two acts.

- **03 rebuilt as the belief performed, 2026-08-27.** The old panel opened
  in the resolved world — three staggered rows and a `Run it again` button
  that replayed the same arrangement — so the belief never happened on
  screen, and staggered arrival with nothing to compare it against reads as
  latency rather than as a choice someone made. Now the instrument rests in
  the believer's own arrangement and a three-step deck walks the change
  developers actually make: **Fetch it all first** (one boundary,
  `fallback={null}` — the specimen is blank for the whole 1900 ms and all
  three rows land together) → **Add a fallback** (the same boundary with a
  placeholder, which is all `loading.tsx` is: something at +0, everything
  still late) → **Wrap each part** (a boundary per row, each landing on its
  own clock). A press writes `?mode=` and `?stream=` and the server really
  re-renders with its boundaries somewhere else; nothing is simulated but
  the delays, which the intro still admits.
  - **The argument is a column, not a sentence.** Every row carries two
    readings — `takes 400 ms · landed +1902 ms` — and in the belief's
    arrangement they disagree for every row but the slowest. The old
    wall-clock stamp (`landed 15:47:12`) could not show simultaneity at a
    glance; an offset from the response's own start can. The one payload
    the old exhibit never stated is now readable: streaming makes nothing
    faster, and the slow row still costs 1900 ms.
  - **The cause view is `response`** (§1). The same run drawn as one
    response held open: a bar per chunk against a 0–2s axis, the shell bar
    naming what the first chunk carried (`nothing to show` · `1
    placeholder` · `3 placeholders`). Every streamed unit emits **both**
    presentations and `data-view` on the stage decides which one has a
    size, so flipping the switch is a CSS change rather than a re-run —
    it works mid-flight, and the two drawings can never disagree about a
    number. The belief's arrangement is three bars ending on the same
    tick; the resolution is a staircase.
  - **The gauge is wired, and to the response rather than the
    navigation.** §4's standing note said to wire it if this panel ever
    gained a client owner; it has one now. A marker inside the run's last
    boundary reports when the server has nothing left to send. The
    navigation commits long before that, and the belief's arrangement then
    holds a blank specimen for 1500 ms — the one beat with no skeleton to
    carry the signal, so a gauge that went quiet there would be the
    panel's first lie.
  - **The deck locks for the first walk, then unlocks.** The lock exists
    only so the introduction happens in order; once the walk reaches the
    last arrangement all three steps are pressable, because comparing them
    is this chapter's payload. The step you are already on re-runs it,
    which is where `Run it again` went.
  - Casualties: `rerun-button.tsx`, `row-skeleton.tsx`, `stream-rows.tsx`,
    `slow-row.tsx`. The `loading.tsx` meta aside was obsoleted by becoming
    a beat and replaced with one on the exhibit's own argument — the
    granularity of waiting. voice.md §6 already predicted that failure
    mode, so it earns no new rule there (voice.md §9).

### The lab — site shape, 2026-08-20

The collection outgrew the landing page (half the syllabus is made of
routes — parallel/intercepted, not-found, params, view transitions — and
cannot run inside one page), so the playground has a book shape: a
contents page at `/lab`, one route segment per chapter at `/lab/<slug>`,
`/latest` redirecting to the newest chapter. One registry
(`apps/web/app/[locale]/lab/syllabus.ts`) drives every list — contents
rows, the landing roadmap, the contents bar, page-turns, sitemap, OG
titles — so shipping a chapter is one entry flip: planned → next →
shipped, belief and navLabel added.

- **Chapter pages** render the same demo wrapper the landing shows, with
  the belief promoted to the page's h1 (the eyebrow demotes to a
  non-heading element). The frame adds the making-of aside (the folder's
  commit history + the checkpoints repo) and the page-turn row
  (prev · contents · next), and `/api/og` draws each chapter's card from
  its belief.
- **Index readings.** A chapter may put one true value from its running
  instrument on its contents row, each inside its own Suspense — the
  index is itself a partial-prerender demonstration. Truth rule: a
  per-visitor value says so ("your presses · 3"); a global-sounding
  count would be the index's first lie.
- **Vocabulary.** Visitor prose says *the lab* and *chapter* (voice.md
  §6, 2026-08-20). "Exhibit" remains the working word in code comments
  and these docs.
- **Shelves (2026-08-21).** Ship order is historical — "assume we've
  covered everything, and the order we covered it in becomes
  irrelevant" — so the contents page displays the collection by section
  instead: components & state / data & caching / routing & navigation /
  metadata & assets / the platform, carved the way the React / Next.js /
  Vercel docs carve the territory. The landing roadmap stays flat.
- **Chapter previews (2026-08-26).** A chapter that hasn't shipped can
  carry an index reading too, where the site itself already runs the
  feature it will be about: the next-up row counts the routes this page
  has prefetched while you read it. Three rules. It measures the site's
  own chrome, never a mockup of the chapter — a preview that simulates is
  an advertisement. It is keyed by the chapter's slug in `INDEX_VALUES`
  and lives in the chapter's own folder, so shipping changes the status
  and not the instrument. And it stays optional: where nothing true can
  be read from the running site — view transitions, cron, error recovery
  — the row is the topic and the date, because a slot that must be filled
  gets filled with something invented.
  - The correction that came with it: `next/link` prefetches on
    **viewport**, not hover, and not at all in `next dev`. The old bank
    note here said hover; five routes were already fetched before the
    pointer moved.

- **No ordinals (2026-08-26).** The numerals went with the ship order they
  encoded. A chapter's number only ever said which week it got built —
  arbitrary, since the digest extends the syllabus in whatever order the
  work happens, and there is no chapter 04 in the Next.js or Vercel docs
  to match it against. So nothing derived from arrival order reaches a
  page: not the contents rows, not the eyebrow, not the page-turn, not
  the anchors (`#demo-caching`, keyed by slug, which also survives a
  chapter changing shelves). The registry's array position still answers
  "what shipped last" for `/latest`, and nothing else.
  - **The page-turn walks shelf order** (`READING_ORDER`), so the book's
    spine is the learning arc the contents page displays rather than the
    build log.
  - **The row gutter keeps its column** and carries a status glyph in
    place of the numeral: a hairline rule for a chapter that is here, a
    `+` for one that isn't yet — the same `+` the still-to-build rows
    wear, so the next-Monday row reads as what it is, a planned topic
    with a date.

## 5. Banked

- The bake fingerprint is six hex characters — literally a CSS color — and
  the unlabeled `BakeSwatch` beside it renders that value. The discovery is
  intentional; the digest write-up is where it gets spelled out.
- Fruit/emoji hash encoding: rejected as primary (breaks instrument
  discipline), held as a possible easter-egg layer.
- Swatches in the machinery comparison rows: blocked until the string-based
  width-reservation (`StableSlot`) grows a JSX-safe design.
- Digest beats banked: the side-effect-runs-twice warning; the
  swatch-is-the-hash reveal.
- The Hazel counter: superseded 2026-08-21 by the state chapter (useState
  & re-renders), its reimagining on the instrument grammar; the old code
  (`(counter)/`, `components/ui/boundary` + `ping`) is deleted — git
  history keeps it. The narrative /learn lesson (variables in JS → state
  change vs. rendering in an SPA → useState as the solution to both)
  remains a path-layer candidate that reuses the state chapter's cards.

## 6. Verification

`next dev` lies about cache semantics (`updateTag` entries survive reloads
that die on Vercel) — preview deploys are the truth-bench for anything
touching `use cache`.

The verified badge sequence for the rebake flow on Vercel (2026-08-20,
preview logs): `PRERENDER` on first visit → `HIT` → `BYPASS` for the action
POST → `REVALIDATED`, reason "Tag-based deletion", for the request that
refills. `updateTag` never produces `STALE` (that badge is
stale-while-revalidate: `revalidateTag` or a lapsed `cacheLife` window), and
the tag-deletion miss is labeled `REVALIDATED`, not `MISS`. Copy that names
log badges must match this.

An accessibility audit here reports on one theme and one scroll position,
so a single green run proves less than it looks (2026-08-26). Two traps,
both caught on this site: axe skips elements it computes as invisible, and
every `.ht-reveal` block sits at `opacity: 0` until scrolled into view — so
the landing scored 100 while its five exhibits, roadmap, cohort and digest
were never examined, and the same defect was flagged on a chapter page
where the exhibit is above the fold. And the run inherits the browser's
colour scheme: the dim text tokens failed in light and passed in dark, so
a dark-mode run called the site clean. Audit both schemes, and read a 100
as "the part that was visible passed".

Build workers bake `use cache` entries independently (observed 2026-08-20,
lab build): the landing shell and /lab's contents row each prerendered
their own bake, so a fresh deploy can serve two fingerprints for "one
shared entry" until the first tag revalidation or cacheLife expiry
converges them at runtime. Copy must not claim cross-page agreement for
the static shells of a fresh deploy. The React DevTools extension throws spurious "The
children should not have changed if we pass in the same set." errors on
transition commits here; stacks resolving to `chrome-extension://…` are the
extension's mirror desyncing, not an app bug.

## 7. Keeping this current

Same contract as voice.md §9: update on a decision that no rule here
predicted, never on a schedule. §1–§3 are the rules and should grow
reluctantly; §4–§6 are state and evidence — keep them dated, and correct
them when the code moves.
