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
  the corner every editor keeps its view switches. Actions never live here.
  Empty when a demo has no alternate view.
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

Outside the chassis: exhibit order rides in the eyebrow (`02 · caching &
revalidation`) where engineers read identifiers — no watermark chapter
numerals. Asides are set as `/* code comments */` in comment-gray mono,
because that is what they are.

## 2. Feedback

Anything in flight says so three ways: the gauge flips to `working`, the
specimen dims and pulses, and when the new value lands it takes one amber
wash (`.ht-land` — key-remount, skips first paint, reduced-motion safe) and
settles. No silent updates, ever.

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
  deck holds instrument controls only (03's rerun, 05's title form — which
  drives the instrument rather than being it).
- **Unique readout facts became narration lines**; redundant readouts were
  cut without replacement (03, 04 — their facts live in the intro, the
  captions, or the source).
- **The gauge is wired where a client owns the panel** (02, 05). 03's
  in-flight signal is carried by the row skeletons and the rerun button's
  pending label instead — honest, but not the gauge; wire it if the stream
  panel ever gains a client owner. 01 and 04 have no client round trip to
  gauge (04's form works with JavaScript off, which is its point).

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
log badges must match this. The React DevTools extension throws spurious "The
children should not have changed if we pass in the same set." errors on
transition commits here; stacks resolving to `chrome-extension://…` are the
extension's mirror desyncing, not an app bug.

## 7. Keeping this current

Same contract as voice.md §9: update on a decision that no rule here
predicted, never on a schedule. §1–§3 are the rules and should grow
reluctantly; §4–§6 are state and evidence — keep them dated, and correct
them when the code moves.
