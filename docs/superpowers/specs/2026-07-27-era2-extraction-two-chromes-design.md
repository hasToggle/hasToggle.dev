# Masterclass — Design: Era II Extraction as Two Windows

**Date:** 2026-07-27 · **Amends:** `2026-07-15-masterclass-agentic-engineering-rework-design.md` · **Builds on:** `2026-07-27-era1-completion-window-highlighting-design.md` · **Event:** 2026-07-28

Era II opens on the ferrying years: the answer lives in a browser tab and your
code lives somewhere else, and you are the transport. The era's own copy says it
twice — *"in a browser tab, a world away from your code"*, and the demo's closing
line, *"You were the clipboard. Every answer crossed between those two worlds by
hand."*

The demo does not currently look like two worlds. Both halves live inside a
single bordered card separated by a divider, which reads as one window with two
panes. And the lower half — meant to be a code editor — has no editor furniture
at all: no tab, no gutter, no syntax colour. It is a dark rectangle with a
filename written on it.

## Two cards, and an empty gap

The outer wrapper loses its border and becomes a plain container holding **two
sibling cards**, each with its own border and rounding, separated by real
vertical space.

**The gap stays empty.** An arrow, a travelling payload, or a copy animation
between the two would explain the joke. The distance *is* the joke — the demo's
whole argument is that nothing crossed that space except by hand.

## Separation is carried by furniture, not tone

The editor's colours are hardcoded VS Code Dark+ (`#1e1e1e`, `#d4d4d4`,
`#858585`) and **stay that way in both themes**. In light mode that gives a white
browser window above a black editor and the point lands on contrast alone.

In dark mode — the likely projector setting — the browser chrome and the editor
are both dark, so tone cannot carry it. Separation therefore comes from
**vocabulary**: traffic lights and a URL pill say *browser*; a filename tab and a
line-number gutter say *editor*. Two applications are recognisably different on a
real desktop even when both are dark, and that is the effect being borrowed.

### Rejected: making the editor follow the page theme

A light-mode editor reads as a document, not a workbench, and it discards the
strongest cue that these are two different applications.

### Rejected: forcing the browser window light in both themes

Maximum contrast always, but a stubbornly pale panel inside a dark page reads as
a rendering bug on a projector.

## The browser window

Unchanged except that it becomes its own card: traffic lights, the
`chat.openai.com · 2022` pill, the question bubble, the answer bubble, and the
`Copy` button all stay as they are.

**The code in the chat bubble stays uncoloured.** This is now doing more work
than it was: uncoloured code in the chat against syntax-coloured code in the
editor is itself a signal that these are two different applications, and it keeps
the chat reading as a transcript rather than as a workbench.

## The editor window

```
┌────────────────────────────────────────────────────┐
│ ▣ checkout.js                          your editor │  tab strip
├────┬───────────────────────────────────────────────┤
│  1 │ // empty. The knowledge lives in another…     │
│  2 │                                               │  gutter │ code
│  3 │                                               │
└────┴───────────────────────────────────────────────┘
```

Two pieces of furniture, both load-bearing:

- **A tab strip** — darker than the code area, carrying a single active
  `checkout.js` tab, lifted and marked as active. This is the fastest possible
  "editor" signal.
- **A line-number gutter** — right-aligned muted digits with a hairline divider.
  The second-strongest signal, and it costs one column.

`your editor` moves to the right of the tab strip as muted text. It is narration
and it earns its place by naming whose window this is.

**No status bar.** It would add height for no argument, and inventing a plausible
`Ln 6, Col 1` is the kind of fake detail a room notices.

### `Reset` leaves the fiction

`Copy` stays in the chat bubble — it is ChatGPT's affordance and belongs to that
world. `Paste` stays in the editor for the same reason.

`Reset` moves **out of both chromes**, down beside the verdict line. It is a demo
control, not something either application would have, and leaving it inside the
editor's furniture undercuts the illusion that furniture exists to build.

## Highlighting

The editor's code renders in **full syntax colour**, `github-dark` only. No
light/dark token pair is generated, because the editor is a dark slab in both
themes — carrying two colours per token would be dead weight.

Tokenised offline and committed as data, exactly as Era I's window is:
`THREAD_ANSWER` is six static lines, known at author time.

**The two placeholder lines are not tokenised.** *"// empty. The knowledge lives
in another window."* and its copied-state sibling are narration wearing a
comment's clothes, not code — they keep their existing muted italic styling.
Running them through a JavaScript grammar would buy nothing and would put prose
in the token data.

A fingerprint guards the generated tokens against `THREAD_ANSWER` being edited
without regenerating, the same hazard and the same cheap guard as Era I.

## The shared core moves up

Era II needs three things Era I already has: the `Kind` union, the scope→kind
mapping, and the fingerprint hash. It needs none of Era I's cyan classes, its
streaming slicer, or its dual-theme token shape.

**`demos/highlight/` becomes the shared home** for exactly that much:

| moves up | stays in `era1-playground/highlight/` |
|---|---|
| `Kind` | `PrefixToken`, `CompletionToken` |
| `kindFromScopes` | `completionClass`, `prefixIsComment` |
| `fingerprintText(strings)` | `visibleTokens` |
| | `fingerprintSources(prompts)` |

**Token shapes are deliberately not shared.** Era I's prefix token carries two
hexes for its light/dark pair; Era II's editor token carries one. Forcing a
common shape would make one of them carry a field it never reads.

`fingerprintSources` becomes a thin wrapper: it flattens `PROMPTS` into strings
and defers to `fingerprintText`. That removes the `PromptSeed` import from the
shared core, so the hash has no knowledge of any era's data.

**Era I's public surface does not change.** Its `highlight/index.ts` re-exports
`Kind` and `kindFromScopes`, so `index.tsx`, `generate.ts` and the existing tests
keep their imports exactly as they are. The move is invisible from Era I's side
and its whole suite must stay green to prove it.

## Files

```
demos/highlight/
  index.ts              Kind, kindFromScopes, fingerprintText
  index.test.ts         both, moved from era1

demos/era1-playground/highlight/
  index.ts              re-exports the shared two; keeps its own four
  index.test.ts         loses the kindFromScopes cases, keeps the rest

demos/era2-companion/highlight/
  index.ts              EditorToken { c, k, t }, one hex per token
  tokens.generated.ts   editor tokens + fingerprint, single-theme
  generate.ts           imports shiki; never bundled
  fingerprint.test.ts   THREAD_ANSWER matches the generated fingerprint

demos/era2-companion/
  extraction-demo.tsx   two cards, editor furniture, highlighted code
```

## Out of scope

- **Any change to the second Era II demo** (`Era2Companion`, the in-editor
  suggestion beat). This is only the extraction demo.
- **A status bar, minimap, activity bar, or breadcrumbs.** One tab and one gutter
  are enough to say "editor"; more furniture is set dressing.
- **Making the chat bubble's code selectable-and-actually-copyable.** The `Copy`
  button is a prop in a story about manual transport; wiring the real clipboard
  would not change what the room sees.
