# Masterclass — Design: Era I Completion Window Highlighting

**Date:** 2026-07-27 · **Amends:** `2026-07-25-masterclass-era1-presenter-transport-design.md` · **Event:** 2026-07-28

The Era I console renders its output as two flat spans: the prompt prefix in
`text-foreground`, the machine's completion in cyan. The colour split is the
demo's central signal — Era I's argument is *you feed it the start of a pattern
and it continues*, and the room can only see where the prompt ends and the
continuation begins because the continuation is cyan.

The code inside that window is hard to read. This adds syntax structure without
spending the signal.

## The constraint that shapes everything

**Cyan means machine output.** It is reserved for exactly that, house-wide.
Handing the window to a syntax highlighter would colour tokens by grammar
instead, so `function` looks identical whether the presenter typed it or the
model produced it — and the boundary, along with the point of the beat,
disappears.

So the two halves are highlighted in **different registers**, not different
palettes:

| | register |
|---|---|
| **prefix** — what the presenter typed | full theme colour |
| **completion** — what the machine wrote | one hue (cyan), structure carried by weight, opacity and italics |

"Everything cyan is the machine" stays literally true, so the boundary is
exactly as absolute as it was with flat cyan. What changes is that the
completion now has visible shape.

### Rejected: highlighting only the prefix

Considered and dropped. It protects the boundary perfectly but delivers almost
none of the readability the change exists for — the prefix is two lines and the
completion is the bulk of what is on screen.

### Rejected: tinting both halves toward each other

Muddies the one distinction the demo cannot afford to lose.

## Precomputation

There are exactly **fourteen** strings the window can ever render: two prefixes,
plus twelve completions (2 prompts × 3 bands × 2 modes). All static, all known
at author time. Every one is tokenised offline and committed as data.

**The reason is correctness, not bundle size.** The output streams one character
per frame. Highlighting live would retokenise syntactically incomplete code on
every frame — `return items.slice().reverse` parses differently from the
finished line — so colours would churn for roughly 250 frames and settle only at
the end. Tokens computed from the *finished* text and revealed progressively
cannot flicker; the code is coloured correctly from its first character.

Shipping no Shiki to the browser is a welcome side effect, not the argument.

## Rendering

**Prefix.** Each token carries its light and dark hex. Rendered as a span with
the pair as inline CSS custom properties and
`className="text-[var(--tl)] dark:text-[var(--td)]"`. No global CSS, no
`dangerouslySetInnerHTML`, and no runtime theme lookup.

**Completion.** Each token carries a *kind*, never a colour:

| kind | treatment |
|---|---|
| `keyword` | cyan, `font-medium` |
| `plain`, `string` | cyan |
| `punct` | cyan at 70% |
| `comment` | cyan at 55%, italic |

### The question prefix is a comment, and gets an opacity floor

`// how do I reverse a list in JavaScript?` tokenises as a comment, so ordinary
treatment would render the one line the room must read at roughly 55% contrast,
in italics, on a projector.

There is a real argument for allowing that: it *is* a comment, that is *why* the
base model continues it with more comments, and dimming it says "this is a file,
not a chat box" — which is the era's point. It is not worth the back wall.

**Comments in the prefix are rendered at `text-foreground/85` and italic, not in
the theme's comment colour.** The mechanism matters: the problem is not opacity
but the hue itself — GitHub's comment grey is `#6e7781` light / `#8b949e` dark,
which is mid-grey by design and simply too quiet at distance. Dialling opacity
on a grey that is already low-contrast does not help; substituting the colour
does. Italics carry "this is a comment" on their own.

This applies to the prefix register only. Comments in the completion stay dimmed,
because there the dimming is doing useful structural work rather than hiding the
one sentence the room has to read.

## Theme

`github-light` / `github-dark`. Legible at distance, high contrast, and its
palette runs blue/red/purple — so it will not compete with cyan the way a
teal-heavy theme would. One line to change once it can be seen on the wall.

## Streaming

Only the completion streams; the prefix is rendered whole and never changes.

`visibleTokens(completionTokens, charCount)` walks the token list against a
character budget and slices the final token. Pure, and tested: an off-by-one here
silently truncates the machine's last character on every single run, which is
invisible in review and obvious on stage.

The streaming loop itself is untouched — it still counts characters, and the
character count remains the source of truth for how much has been revealed.

## Staleness

Generated code that can drift from its source is a trap. The generated file
carries a **fingerprint of the fourteen source strings**; a test hashes the
current `PROMPTS` and compares.

This catches the real hazard — a completion edited without regenerating — in
microseconds, with no Shiki loaded. It does not re-verify the tokens themselves,
which is acceptable because tokens cannot drift without a source change.

**Why not verify by regenerating:** the honest check re-runs Shiki and compares
token-for-token, but loading grammars costs 1–2s against a suite that currently
runs in 60ms, and it would dominate every run. **Why not put that in CI:** this
repository has no CI that runs tests. The only workflows are
`claude-code-review.yml` and `claude.yml`, both Claude-triggered; nothing runs
lint, typecheck or the suite on push. Standing up a build pipeline is out of
scope for this change and days before the event.

Regeneration is a script: `bun run gen:era1-highlight`.

## Files

```
demos/era1-playground/highlight/
  tokens.generated.ts   data + fingerprint; committed, never hand-edited
  index.ts              Kind, kind→class maps, visibleTokens()
  generate.ts           imports shiki; run by the script, never bundled
  index.test.ts         visibleTokens
  fingerprint.test.ts   source strings match the generated fingerprint
```

`index.tsx` swaps its two spans for two token lists. Everything else in the
console is untouched: fixed height, the `OUTPUT_LINES` geometry guard, the
streaming cursor, the verdict slot, the phase footer.

## Out of scope

- **Highlighting the instruct answers as prose.** They are tokenised as
  JavaScript like everything else; English lands as `plain` and the embedded
  code line gets keyword treatment, which is the desired outcome.
- **Line numbers, copy buttons, or any other code-block furniture.** This is a
  machine's output window, not a documentation snippet.
- **A second language.** Everything in the window is JavaScript or prose that
  tokenises acceptably as JavaScript.
