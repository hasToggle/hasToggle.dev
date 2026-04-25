# Demo: Plausibility — "Grammar without meaning"

**Status:** Locked design. Implementation pending.
**Slot:** Replaces Demo 1 in the misconception sequence.
**Badge tag:** `Plausibility`
**Author:** Eric (with Claude)
**Date:** 2026-04-25
**Parent spec:** `2026-04-01-landing-page-positioning-design.md`

---

## Purpose

This demo teaches the mechanism of LLM generation (probabilistic next-token prediction) by enacting it visibly, then proves a deeper claim than the page has made yet: **grounding is necessary, but not sufficient**. The demo's terminal point is the page's identity lock — *"AI writes the grammar of software. You own the meaning."* — rendered concretely through three beats of the same prompt.

The demo's badge word, **Plausibility**, names the trap: every layer of LLM output looks credible, even when grounded. Grounding fixes the surface (APIs are real, syntax is current); judgment is what fixes the meaning.

---

## The three beats

The demo is one prompt, three answers, one move.

**Prompt (locked):** *"my dashboard takes 3s to load. how do I make it faster?"*

### Beat 1 — Ungrounded (the mechanism)

The LLM streams a confident answer word-by-word. Three deliberately chosen tokens pause to show top-5 probability candidates. The paragraph is plausible at every scale; the paragraph is wrong.

**Paragraph (Draft β):**

> First, move your data fetching to a Server Component if it isn't already. Then add `export const revalidate = 60` to cache the page for a minute at a time. For interactive parts, wrap them in `<Suspense>` so the shell streams in immediately. Most dashboards that follow this pattern see render times drop by 80–90%.

**Probability pause moments (3):**

| Pause | Token | Top-5 candidates (chosen first; weights illustrative) |
|-------|-------|--------------------------------------------------------|
| 1 | `revalidate = 60` | `revalidate = 60` (47%), `dynamic = 'force-static'` (23%), `'use cache'` (14%), `unstable_cache` (11%), `cache` (5%) |
| 2 | `<Suspense>` | `<Suspense>` (38%), `loading.tsx` (29%), `useDeferredValue` (16%), `Streaming` (11%), `<Skeleton>` (6%) |
| 3 | `80–90%` | `80–90%` (31%), `60–80%` (26%), `5x faster` (19%), `under a second` (15%), `dramatically` (9%) |

**Wrongness:** every API mentioned is real, but the *composition* is wrong. `revalidate = 60` exists but is the wrong tool here, and is superseded by `'use cache'` + `cacheLife` in Next.js 16. The "80–90%" claim is fabricated confidence. The deeper failure: *the answer addresses caching because the question framed it as a caching question*. The bottleneck was never the cache.

**End-of-stream label:** *"Each word was the most likely one. The paragraph is wrong anyway."*

### Beat 2 — Grounded (necessary, not sufficient)

The reader sees the prompt amended in place: `+ use Context7 for the current Next.js docs`. A short retrieval beat resolves into `↳ grounded in 4 docs.` The new paragraph renders statically — no streaming animation. The visual contrast is intentional: the mechanism was already taught.

**Paragraph (Draft γ):**

> Move your fetches to a Server Component and mark them with `'use cache'` plus `cacheLife('minutes')`. Use `<Suspense>` boundaries to stream the rest of the shell in parallel. If after that you're still seeing >1s loads, you can profile with the React DevTools Profiler or check the Network tab for slow requests. In most cases, though, the caching changes alone will get you under 500ms.

**Markup:** every API reference (`'use cache'`, `cacheLife('minutes')`, `<Suspense>`) carries a green underline; hover reveals *"verified against retrieved docs."* No red underline anywhere — the wrongness here is not lexical. The profiling sentence renders flat: not highlighted, not foreshadowed. Beat 3 will reach back and pull it forward.

**Hinge to beat 3 (γ Reality, placed inline):**

> *"A wrong answer that compiles is more dangerous than one that doesn't. The first you can fix. The second ships."*

Followed by a button: *"Show what was actually wrong."* Reader-clicked. No auto-reveal.

### Beat 3 — Owned (re-rank, don't regenerate)

Reader clicks. The buried profiling sentence in beat 2 pulses once and a thin connecting line draws down into beat 3. Beat 3 quotes that sentence back, with the dismissive clause struck through:

> *"…you can profile with the React DevTools Profiler or check the Network tab for slow requests.* ~~In most cases, though, the caching changes alone will get you under 500ms.~~*"*

Below the quote, one bold line — the demo's only direct second-person address:

> **The grounded answer mentioned profiling and dismissed it. That's the answer.**

Below that, the diagnosis paragraph:

> Open the React DevTools Profiler. Watch the dashboard load. The slow span is `getDashboardStats` — 47 sequential queries, one per project. Fix the N+1, not the cache. Cold load drops to ~140ms; the cache is no longer load-bearing.

And the diff:

```diff
- const stats = await Promise.all(
-   projects.map(p => prisma.metric.aggregate({ where: { projectId: p.id }, _sum: { value: true } }))
- );
+ const stats = await prisma.metric.groupBy({
+   by: ['projectId'],
+   _sum: { value: true },
+ });
```

No syntax highlighting beyond diff colors. No "before/after timing" chart. The fix is small. The thinking was the work.

**Hinge to wrapper Reality (γ Meta, placed inline):**

> *"Two paragraphs. Two increasingly correct-looking lies. The second had citations."*

---

## Wrapper copy (for `MisconceptionWrapper`)

| Slot | Copy |
|------|------|
| Hook | *"It's grounded in the docs. It has to be right."* |
| Question you didn't ask | *"Where is the time actually going?"* |
| Meta | *"What you're about to watch is exactly what AI does every time you ask it anything. We're just slowing it down enough that you can see it."* |
| Reality | *"AI writes the grammar of software. You own the meaning. Grounding doesn't change which one is which — it just makes the grammar more current."* |
| Tag (badge) | `Plausibility` |

---

## Component architecture

New folder: `apps/web/app/[locale]/(demos)/plausibility/`

| File | Responsibility |
|------|----------------|
| `index.tsx` | Public component. Mounted by `MisconceptionWrapper`. Orchestrates the three beats; holds beat-visibility state and stream-completion state. |
| `prompt-input.tsx` | Renders the user prompt at the top of the canvas. Static. Amendment in beat 2 is a CSS transition (no state). |
| `streaming-paragraph.tsx` | Beat 1's word-by-word stream. Surfaces probability-pause moments. Highlights the wrong span at completion. Reads from `paragraph-data.ts`. |
| `probability-popover.tsx` | The ghosted top-5 candidates. Receives candidates + chosen index + anchor; self-contained. |
| `grounded-paragraph.tsx` | Beat 2 static render. Profiling sentence rendered with a `data-` attribute so beat 3 can target it for the pulse + connecting line. |
| `owned-answer.tsx` | Beat 3. Quoted-and-struck sentence, bold one-liner, diagnosis paragraph, diff block. |
| `paragraph-data.ts` | Single edit-point for all copy. Pure data, no JSX, no logic. |
| `use-streaming.ts` | Hook driving the word-by-word reveal. Pauses at annotated indices; fires callback for popover mount/unmount. Test seam. |

**Modifications to existing files:**

- `apps/web/app/[locale]/page.tsx` — Demo 1's `MisconceptionWrapper` block updates: new hook/meta/reality/question copy, new `tag="Plausibility"`, import the new component.
- `apps/web/app/[locale]/(demos)/misconception-wrapper.tsx` — `status` prop (currently `"essay" | "sketch"`) is replaced by a `tag?: string` prop that renders verbatim in the badge. The badge's existing visual style (cyan outline, mono uppercase) is retained. The `STATUS_LABELS` map is removed.

**Why this shape:**

- One folder per demo keeps `(demos)` browseable. Demo 2's content currently lives in `page.tsx`; future moves can pull it into its own folder, but that's out of scope here.
- `paragraph-data.ts` isolates copy from animation. Eric edits wording without touching components.
- `use-streaming.ts` is the only piece worth unit-testing — it verifies pause indices fire in order. Components stay declarative.
- `probability-popover.tsx` is split out because the same primitive may reappear if any future demo needs the "show alternates" treatment.

---

## Data shape

`paragraph-data.ts` is the single source of demo content. Pure TypeScript, no runtime cost.

```ts
export const PROMPT = "my dashboard takes 3s to load. how do I make it faster?";

export const GROUNDING_AMENDMENT = "+ use Context7 for the current Next.js docs";

export const RETRIEVED_DOCS = [
  "nextjs.org/docs",
  "cache-components",
  "use-cache",
  "cacheLife",
] as const;

type PauseId = "revalidate" | "suspense" | "claim";
type Token = { text: string; pause?: PauseId; wrong?: boolean };

export const UNGROUNDED_TOKENS: Token[] = [ /* ~60 tokens */ ];

export const PROBABILITY_CANDIDATES: Record<
  PauseId,
  { text: string; weight: number; chosen: boolean }[]
> = { revalidate: [...], suspense: [...], claim: [...] };

export const GROUNDED_PARAGRAPH = {
  segments: [
    { text: "...", api?: "use cache" | "cacheLife" | "cacheTag" | "Suspense" },
    /* one segment for the profiling sentence; dismissive clause split out */
  ],
};

export const OWNED_ANSWER = {
  quotedFromGrounded: { text: "...", strikeThroughClause: "..." },
  diagnosis: "...",
  diff: { removed: ["..."], added: ["..."] },
};
```

Components consume the data; they don't carry strings.

---

## Interaction & motion

### Beat 1 — opt-in spectacle

- Layout: single canvas card, full-width within the demo content area. Top: prompt in input-styled monospace. Middle: empty paragraph region. Bottom-right: button + meta-aside.
- Button: *"▶ Watch how it generates"*. Accompanying meta-aside: *"This will take nine seconds. Every other AI demo lies about that."*
- On click: prompt caret blinks once, then paragraph reveals word-by-word.
- Pace: ~50ms / common word, ~150ms on punctuation, ~600ms held at each of the three pause moments.
- Cursor: thin vertical bar following the rightmost rendered token.
- At each pause: popover anchored above the cursor fades in over ~200ms, displays 5 candidates as horizontal probability bars, pauses 600ms, fades out, chosen token commits with brief highlight.
- End-of-stream: wrong span (the entire `revalidate = 60` clause and the `80–90%` claim) gets a red underline matching the existing "Misconception" red. End-of-stream label appears below.
- Replay: button re-labels to *"↻ Replay"*. Replay re-runs only beat 1 in place; beats 2 and 3 stay where they are.

### Beat 2 — amendment + retrieval + static reveal

- Reveal trigger: ~800ms after beat 1's end-of-stream label settles.
- Amendment: original prompt stays; `+ use Context7 for the current Next.js docs` is typed below it at ~30ms/char with a chevron prefix.
- Retrieval beat: thin status row appears under the amended prompt; four doc-pages render in sequence with ~250ms between each, then collapse into `↳ grounded in 4 docs.`
- Paragraph: instantly rendered (no streaming).
- Markup: green underline on each verified API; tooltip on hover. No red marks.
- Profiling sentence: rendered flat. No highlight.
- Hinge: γ Reality meta-aside fades in ~1s after paragraph renders. Button below it: *"Show what was actually wrong."*

### Beat 3 — re-rank, not regenerate

- Reveal trigger: reader clicks the hinge button.
- Re-rank moment (single use):
  - Profiling sentence in beat 2 pulses faintly once (~600ms).
  - Thin SVG line (~1px, muted foreground) draws down from the profiling sentence into beat 3's content area.
- Quoted sentence: italic, foreground-muted; dismissive clause struck through in "Misconception" red.
- Bold one-liner: *"The grounded answer mentioned profiling and dismissed it. That's the answer."*
- Diagnosis paragraph: three sentences, normal weight.
- Diff: 5-line code block, monospace, red `-` / green `+`, no syntax highlighting beyond diff colors, no language label.
- Hinge to wrapper Reality: γ Meta meta-aside fades in ~800ms after beat 3 settles.
- No replay on beat 3.

---

## Accessibility

- **Beat 1 streaming canvas:** `aria-live="polite"`. Full paragraph also rendered into a visually-hidden container at play-button click so screen readers receive complete text at once (token-by-token announcement would be incoherent).
- **Probability popovers:** `aria-hidden="true"`. Decorative for sighted readers. Single descriptive aside in a visually-hidden region after stream completion: *"Three of these word choices had four plausible alternatives. The model picked the most probable one each time."*
- **Play / Replay button:** `aria-label="Play the LLM generation animation"`. Design-system focus ring.
- **Beat 2 retrieval status:** `aria-live="polite"`, collapsed to single final announcement: *"Grounded in 4 documents."*
- **Beat 3 strikethrough:** announced as *"struck through"* via screen-reader-only text wrapping the strike. Strike communicated semantically, not just visually.
- **Connecting line:** `aria-hidden="true"`. Structural relationship is conveyed by the quoted text.
- **Keyboard:** Enter / Space on each interactive button. Tab order: prompt → play → (post-stream) replay → grounded paragraph → reveal button → owned answer. No focus trap.
- **`prefers-reduced-motion`:**
  - Beat 1: instant render of the full paragraph. The three popovers shown statically alongside their target tokens (small annotations, not floating).
  - Beat 2: `↳ grounded in 4 docs.` rendered as static line; no chevron typing, no per-doc landing. Paragraph and meta-aside appear immediately.
  - Beat 3: pulse and connecting line skipped. All content renders in final positions on click.

---

## Edge cases

- **Reader scrolls past beat 1 without playing.** Beat 1 stays in initial state (prompt + button). Beats 2 and 3 do not auto-reveal. Button is the only way forward.
- **Reader plays beat 1, scrolls past, comes back.** State persists. Replay button shown. Beat 2's reveal trigger fires on stream completion regardless of viewport.
- **Reader replays beat 1 after beats 2/3 have rendered.** Beats 2 and 3 stay in place. Replay only re-runs beat 1 in place. State is monotonic.
- **Slow device / paint thrash.** Streaming hook uses `requestAnimationFrame`; dropped frames stretch the animation rather than skipping tokens. Probability popovers fade with CSS only (no layout).
- **JavaScript disabled.** SSR renders all three beats in their final state, with the wrong-claim red-underlined and the strikethrough applied. Lesson lands; spectacle is missing.
- **Mobile (< 640px).** Probability popover anchors *below* the cursor to avoid clipping above the canvas. Beats stack full-width. Smaller monospace size for prompt + amendment. Diff in beat 3 may scroll horizontally.
- **Dark mode.** Reuses existing `ht-cyan-*` and `red-*` tokens from `MisconceptionWrapper`. No new color tokens. Connecting line uses `text-foreground/20`.

---

## What we're not building

- No probability slider or temperature control.
- No "regenerate with different seed" affordance.
- No comparison view that auto-animates beats 1 → 2 → 3 on a single click.
- No analytics events.
- No A/B testing of prompt wording.
- No "explain the mechanism" tooltip on the probability bars. The visual carries the lesson.
- No status-style demo badge labels (`essay`, `sketch`). Replaced by freeform `tag`.

---

## Open follow-ups for implementation

- Final word counts and exact token boundaries for `UNGROUNDED_TOKENS` to be authored during implementation against the locked paragraph (Draft β). Pause indices map to the three pause moments above.
- Probability weights in the candidate tables are illustrative; they should sum to 1.00 in implementation. Visual bar widths follow weights directly.
- The four `RETRIEVED_DOCS` entries are placeholders matching real Next.js 16 doc-page slugs; verify against current doc structure during implementation.
- The pulse + connecting-line animation needs a small SVG component; this is the only bespoke motion in the demo and should ship co-located with `owned-answer.tsx`.
- Visual QA: ensure the green underline weight on beat 2 reads as "verified" rather than "highlighted as suspicious." If the visual confuses, replace with a small green check glyph next to each API.
- Voice QA: the bold one-liner *"The grounded answer mentioned profiling and dismissed it. That's the answer."* is the demo's only second-person sentence. Eric to confirm the posture lands; alternates can be drafted if it reads too direct.
