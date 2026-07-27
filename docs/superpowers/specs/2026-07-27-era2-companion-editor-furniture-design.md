# Masterclass — Design: Era II Companion Gets the Editor's Furniture

**Date:** 2026-07-27 · **Amends:** `2026-07-27-era2-extraction-two-chromes-design.md` · **Event:** 2026-07-28

Era II runs two demos on one step, separated by a single paragraph. The first —
the extraction demo — was just rebuilt as two windows with a gap. The second, the
companion demo, still draws its editor as a dark rectangle with `checkout.js`
written on it: no tab, no gutter, no syntax colour. The same fictional file
rendered two ways, one scroll apart, reads as an unfinished redesign.

This gives the companion's editor the same furniture. It does **not** give it the
same structure, for a reason worth writing down.

## The single window is load-bearing

The paragraph between the two demos reads:

> Then the chat moved into the editor, and your selection became its context — no
> more ferrying. **This is the Cursor moment.**

The two demos are a matched pair, and their *shapes* carry the argument:

| demo | shape | what it says |
|---|---|---|
| extraction | two windows, a gap between them | you were the transport |
| companion | one window, chat docked inside it | the chat moved in |

Splitting the companion into two cards would make both demos say the same thing
and leave the era without its turn. **The single chrome stays.** What changes is
what lives inside it.

## The editor pane

Identical furniture to the extraction demo's editor, for the same reasons:

- **A tab strip** carrying an active `checkout.js` tab, in the tab strip's own
  darker fill, with the active tab taking the code area's fill so it merges
  downward into the code.
- **A line-number gutter** — right-aligned muted digits, hairline divider.
- **Syntax-coloured code**, `github-dark` only, from tokens generated offline.

The colours stay hardcoded VS Code Dark+ and do not follow the page theme, as
next door.

### The gutter counts what is on screen, including the ghost

In the initial phase the editor shows the four file lines plus one **ghost
suggestion** line — dim italic, the thing you press to accept. Ghost text in a
real editor occupies a line and is numbered, so the gutter's row count is
`file.lines.length + (ghost showing ? 1 : 0)`.

The invariant that matters is that the gutter and the code column always render
the same number of rows. Everything else about the count is detail.

## The chat pane

It becomes a docked **side panel** rather than an undifferentiated dark box: its
own header rail, visually a panel *within* the window rather than a second
region of equal weight. That is what a Cursor sidebar looks like, and it is what
makes the single-window claim legible rather than merely asserted.

**The suggestion's code stays uncoloured.** Same rule as the browser chat next
door, and here it earns more: uncoloured code reads as *proposed*, not yet real,
which is exactly this demo's point — *"It can't run it. It can't see the rest of
your repo."* Colour arrives only when the code lands in the file.

## Three states, not one

The extraction demo's editor showed one static block. This file changes:

| phase | lines | how |
|---|---|---|
| `initial` | 4 | `INITIAL_FILE` |
| `applied` | 8 | `applySuggestion` splices the suggestion in after line 1 |
| `resolved` | 10 | `resolveMismatch` prepends the import and a blank line |

All three are deterministic and derivable at author time, so all three are
tokenised offline and committed, keyed by phase.

**The `resolved` state contains a genuinely empty line**, so the renderer's
empty-line guard — render a space when a line has no tokens, so the row still
forms a line box — stops being defensive and becomes load-bearing. Without it the
gutter would misalign from the import line down.

### The mismatch highlight survives tokenisation

In the `applied` phase the line referencing `logEvent` is marked with a red
background — that is the beat where the room sees the model wrote a call to
something that does not exist. The row keeps its background; the tokens render
inside it. Detecting the row by scanning its *tokens* for the reference is
equivalent to today's `line.includes(...)` and keeps the check where the data is.

## The fingerprint hashes outputs, not inputs

The extraction demo's guard hashes its source strings. This one hashes the
**three rendered file states**.

That is strictly stronger, and deliberately so: hashing outputs catches a change
to `INITIAL_FILE` or `SUGGESTION` *and* a change to `applySuggestion` or
`resolveMismatch`. Hashing inputs would let someone alter the splice logic and
leave the committed tokens describing a file the demo no longer produces, with a
green suite.

## Files

```
demos/era2-companion/highlight/
  generate.ts           extended: also computes the three file states
  tokens.generated.ts   gains FILE_TOKENS + FILE_FINGERPRINT
  fingerprint.test.ts   gains the companion's guards

demos/era2-companion/
  index.tsx             tab strip, gutter, highlighted code, panelled chat
```

`EditorToken` is reused unchanged. The extraction demo's `EDITOR_TOKENS` and
`SOURCE_FINGERPRINT` keep their own names and their own test, so a failure names
which demo drifted.

## Out of scope

- **Splitting the companion into two windows.** See above; it would cost the era
  its turn.
- **Colouring the chat's suggestion.** Deliberate, and doing more work now than
  it was.
- **Changing any phase logic, copy, or the amber/emerald verdict banners.** This
  is furniture and colour only.
- **The ghost suggestion's own styling.** It stays dim italic — that is what
  ghost text looks like.
