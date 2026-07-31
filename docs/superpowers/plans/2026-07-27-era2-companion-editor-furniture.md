# Era II Companion Editor Furniture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the Era II companion demo's editor the same tab strip, line-number gutter and syntax colour as the extraction demo next door, without splitting it into two windows — the single window is what makes it the Cursor moment.

**Architecture:** The demo's three file states are deterministic, so all three are tokenised offline by the existing Era II generator and committed alongside the extraction demo's tokens. The component keeps its single card and its grid, gains editor furniture on the left pane and a docked panel treatment on the right.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS 4, `shiki@4.3.1`, Bun test runner, Biome/ultracite.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-07-27-era2-companion-editor-furniture-design.md`. Read it before Task 1.
- **The demo stays ONE window.** Do not split it into two cards. The paragraph above it in `masterclass.tsx` says *"the chat moved into the editor… This is the Cursor moment"*, and the two Era II demos are a matched pair whose shapes carry the argument.
- **Paths contain square brackets.** Everything lives under `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/`. Always quote paths in shell commands.
- **Tests run from `apps/web`:** `cd apps/web && bun test`. Baseline at the start of this plan is **136 pass / 0 fail across 22 files**. `bun test <bare-filename>` filtering is unreliable because of the bracketed `[locale]` segment — pass the full quoted relative path from `apps/web`.
- **Typecheck:** `cd apps/web && bun run typecheck`. **Lint:** `bunx biome check --write <files>` from the repo root, quoted, only on files you touched.
- **Never lint any `*.generated.ts` file** — the root `biome.jsonc` excludes them so the committed file stays byte-identical to what the generator writes.
- **The editor's colours are hardcoded VS Code Dark+ and stay dark in both page themes.** No `dark:` variants on editor or panel chrome; no conversion to Tailwind theme classes.
- **The chat's suggestion code stays uncoloured.** Only the file in the editor gets syntax colour.
- **No phase logic, copy, or verdict-banner changes.** This is furniture and colour only.
- **Named exports only**, `interface` over `type` for object shapes, object literal keys sorted alphabetically.
- **Biome judgment-rule findings** (`noJsxPropsBind`, array-index keys) are pre-existing house style here and are not regressions.
- **Do NOT start a dev server** — one runs on port 3001 and Next 16 refuses a second. **Never use `curl`** against this page; it 500s even when the browser renders fine. Drive the running server with Playwright or Chrome DevTools MCP at `http://localhost:3001/learn/masterclass-28-07-2026?step=integration`.
- **Commit style:** `feat(masterclass): <lowercase subject, no trailing period>`, body explaining the *why*, ending with the trailer `Co-Authored-By: Claude <noreply@anthropic.com>`.

## Verified facts you can rely on

Probed against the installed `shiki@4.3.1` and the demo's own pure functions; do not re-derive.

| phase | lines | notes |
|---|---|---|
| `initial` | 4 | `INITIAL_FILE` |
| `applied` | 8 | `logEvent` is on **index 3** |
| `resolved` | 10 | **index 1 is an empty line** |

- All three states tokenise with `tokens.length === lines.length` and reconstruct their source exactly.
- The `resolved` state's empty line comes back from Shiki as a **zero-token line**, so the renderer's empty-line guard is load-bearing here, not defensive.
- `apply.ts` re-exports `INITIAL_FILE` and `SUGGESTION` from `suggestions.ts`, and exports `applySuggestion(file, s) → { file, hasMismatch, mismatchRef }` and `resolveMismatch(file, s) → FileModel`.

---

### Task 1: Tokenise the three file states

**Files:**
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/highlight/index.ts`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/highlight/generate.ts`
- Regenerate: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/highlight/tokens.generated.ts`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/highlight/fingerprint.test.ts`

**Interfaces:**
- Consumes: `fingerprintText`, `kindFromScopes` from `../../highlight`; `EditorToken` from `./index`; `applySuggestion`, `INITIAL_FILE`, `resolveMismatch`, `SUGGESTION` from `../apply`.
- Produces, for Task 2:
  - `type FilePhase = "applied" | "initial" | "resolved"` exported from `./highlight/index`.
  - `FILE_TOKENS: Record<FilePhase, EditorToken[][]>` exported from `./highlight/tokens.generated`.
  - `FILE_FINGERPRINT: string` exported from the same.
  - The existing `EDITOR_TOKENS` and `SOURCE_FINGERPRINT` keep their names and meaning.

- [ ] **Step 1: Add the phase type**

Append to `highlight/index.ts`:

```ts
/**
 * The three states the companion demo's file passes through. They are
 * deterministic — `applySuggestion` and `resolveMismatch` are pure — so all
 * three are tokenised at author time rather than at render.
 */
export type FilePhase = "applied" | "initial" | "resolved";
```

- [ ] **Step 2: Extend the generator**

In `highlight/generate.ts`, add these imports alongside the existing ones:

```ts
import {
  applySuggestion,
  INITIAL_FILE,
  resolveMismatch,
  SUGGESTION,
} from "../apply";
import type { EditorToken, FilePhase } from "./index";
```

(The file already imports `EditorToken`; extend that import rather than duplicating it.)

Extract the tokenising logic the file already has into a named helper so both consumers share it, then add the file states. Place this after the existing `const source = …` / `const lines = …` block:

```ts
function tokeniseToLines(code: string): EditorToken[][] {
  return highlighter
    .codeToTokens(code, {
      includeExplanation: "scopeName",
      lang: "javascript",
      theme: THEME,
    })
    .tokens.map((line) =>
      line.map((t) => ({
        c: t.color ?? "#D4D4D4",
        k: kindFromScopes(
          t.explanation?.[0]?.scopes.map((s) => s.scopeName) ?? []
        ),
        t: t.content,
      }))
    );
}

// The demo's own pure functions produce these, so the committed tokens
// describe exactly what the component will render.
const appliedFile = applySuggestion(INITIAL_FILE, SUGGESTION).file;
const resolvedFile = resolveMismatch(appliedFile, SUGGESTION);

/** Explicit order — the fingerprint depends on it. */
const FILE_SOURCES: readonly [FilePhase, string][] = [
  ["initial", INITIAL_FILE.lines.join("\n")],
  ["applied", appliedFile.lines.join("\n")],
  ["resolved", resolvedFile.lines.join("\n")],
];

const fileTokens: Record<string, EditorToken[][]> = {};
for (const [phase, code] of FILE_SOURCES) {
  fileTokens[phase] = tokeniseToLines(code);
}
```

Rewrite the existing `const lines = …` assignment to use the helper:

```ts
const lines: EditorToken[][] = tokeniseToLines(source);
```

Then extend the emitted `body` template so it also writes the two new exports. Add these two blocks to the template string, after the existing `EDITOR_TOKENS` export:

```ts
export const FILE_FINGERPRINT = ${JSON.stringify(fingerprintText(FILE_SOURCES.map(([, code]) => code)))};

export const FILE_TOKENS: Record<FilePhase, EditorToken[][]> = ${JSON.stringify(fileTokens, null, 2)};
```

and extend the generated file's import line so the emitted file imports both types:

```ts
import type { EditorToken, FilePhase } from "./index";
```

Finally update the closing `process.stdout.write` so it reports both:

```ts
process.stdout.write(
  `wrote ${lines.length} answer lines and ${FILE_SOURCES.length} file states\n`
);
```

**Why the fingerprint hashes the rendered states rather than `INITIAL_FILE` and `SUGGESTION`:** hashing outputs catches a change to the source data *and* a change to `applySuggestion` or `resolveMismatch`. Hashing inputs would let someone alter the splice logic and leave committed tokens describing a file the demo no longer produces, with a green suite.

- [ ] **Step 3: Regenerate**

Run: `cd apps/web && bun run gen:era2-highlight`
Expected: `wrote 6 answer lines and 3 file states`.

- [ ] **Step 4: Extend the guards**

In `highlight/fingerprint.test.ts`, add these imports to the existing ones:

```ts
import {
  applySuggestion,
  INITIAL_FILE,
  resolveMismatch,
  SUGGESTION,
} from "../apply";
```

and add `FILE_FINGERPRINT, FILE_TOKENS` to the existing import from `./tokens.generated`.

Then append this describe block:

```ts
describe("era2 companion file tokens", () => {
  const applied = applySuggestion(INITIAL_FILE, SUGGESTION).file;
  const resolved = resolveMismatch(applied, SUGGESTION);
  const states = [
    ["initial", INITIAL_FILE.lines],
    ["applied", applied.lines],
    ["resolved", resolved.lines],
  ] as const;

  test("the committed tokens describe what the demo actually produces", () => {
    // Hashes the rendered states, so this fails if INITIAL_FILE, SUGGESTION,
    // applySuggestion or resolveMismatch changed.
    // Fix: cd apps/web && bun run gen:era2-highlight
    expect(
      fingerprintText(states.map(([, lines]) => lines.join("\n")))
    ).toBe(FILE_FINGERPRINT);
  });

  test("every phase has one token line per source line", () => {
    for (const [phase, lines] of states) {
      expect(FILE_TOKENS[phase].length).toBe(lines.length);
    }
  });

  test("each line's tokens reconstruct that line exactly", () => {
    // The gutter numbers lines and the code column renders them, so a token
    // list that does not rebuild its own line would misalign the two.
    for (const [phase, lines] of states) {
      FILE_TOKENS[phase].forEach((tokens, index) => {
        expect(tokens.map((t) => t.t).join("")).toBe(lines[index]);
      });
    }
  });

  test("the resolved state really does contain an empty line", () => {
    // Not trivia: it is why the renderer must emit a space for a zero-token
    // line. Without that the row collapses and the gutter slips by one for
    // every line below it.
    expect(FILE_TOKENS.resolved.some((tokens) => tokens.length === 0)).toBe(
      true
    );
  });

  test("the applied state still contains the reference that is missing", () => {
    // The red-line beat depends on finding this token; if the suggestion copy
    // changes so the reference vanishes, the highlight silently stops.
    const hit = FILE_TOKENS.applied.some((tokens) =>
      tokens.map((t) => t.t).join("").includes(SUGGESTION.missingRef)
    );
    expect(hit).toBe(true);
  });
});
```

- [ ] **Step 5: Run the tests**

Run: `cd apps/web && bun test`
Expected: PASS, **141 pass / 0 fail** (136 + 5 new).

- [ ] **Step 6: Prove the output-hashing guard earns its keep**

The point of hashing outputs is that it catches a *logic* change, not just a data change. Prove it: temporarily change `insertAfterLine: 1` to `insertAfterLine: 2` in `era2-companion/suggestions.ts`, then:

Run: `cd apps/web && bun test "./app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/highlight/fingerprint.test.ts"`
Expected: **FAIL** on "the committed tokens describe what the demo actually produces".

Revert with `git checkout -- "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/suggestions.ts"`, re-run, confirm green.

- [ ] **Step 7: Typecheck, lint, commit**

Run: `cd apps/web && bun run typecheck` — expected clean.

```bash
bunx biome check --write "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/highlight/index.ts" "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/highlight/generate.ts" "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/highlight/fingerprint.test.ts"
```

**Do not lint `tokens.generated.ts`.**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/highlight/"
git commit -m "$(cat <<'EOF'
feat(masterclass): tokenise the file the companion demo edits

The companion's file passes through three states — as written, after the
suggestion is applied, and after the missing import is added by hand. All three
come from pure functions, so all three are tokenised at author time.

The fingerprint hashes the rendered states rather than their inputs. That is
deliberate: it catches a change to the splice logic as well as to the copy, so
nobody can leave committed tokens describing a file the demo no longer
produces.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: The furniture

**Files:**
- Rewrite: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/index.tsx`

**Interfaces:**
- Consumes: `FilePhase` from `./highlight/index`; `FILE_TOKENS` from `./highlight/tokens.generated`; `applySuggestion`, `INITIAL_FILE`, `resolveMismatch`, `SUGGESTION` from `./apply` (unchanged).
- Produces: nothing.

**What must not change:** the single card, the `grid md:grid-cols-[1.4fr_1fr]`, the three phases, the `Apply` / `Reset` / `Fix it yourself` behaviour, the ghost-suggestion interaction, and both verdict banners. Furniture and colour only.

- [ ] **Step 1: Rewrite the component**

Replace the whole file:

```tsx
"use client";

import { useState } from "react";
import { SUGGESTION } from "./apply";
import type { FilePhase } from "./highlight/index";
import { FILE_TOKENS } from "./highlight/tokens.generated";

/** VS Code Dark+, held deliberately outside the page's theme. */
const EDITOR_BG = "#1e1e1e";
const TABSTRIP_BG = "#252526";
const EDITOR_FG = "#d4d4d4";
const EDITOR_DIM = "#858585";
const GUTTER_FG = "#6e7681";
const RULE = "#2b2b2b";
const BAD_BG = "#5a1d1d";

export function Era2Companion() {
  const [phase, setPhase] = useState<FilePhase>("initial");
  const [ghostAccepted, setGhostAccepted] = useState(false);

  const apply = () => setPhase("applied");
  const fix = () => setPhase("resolved");
  const reset = () => {
    setPhase("initial");
    setGhostAccepted(false);
  };

  const lines = FILE_TOKENS[phase];
  const ghostShowing = phase === "initial";
  const rowCount = lines.length + (ghostShowing ? 1 : 0);
  // The beat: the model wrote a call to something this file never imports.
  // Found by scanning the tokens, so it stays true if the copy is re-tokenised.
  const badIndex =
    phase === "applied"
      ? lines.findIndex((tokens) =>
          tokens
            .map((t) => t.t)
            .join("")
            .includes(SUGGESTION.missingRef)
        )
      : -1;

  return (
    <div
      className="overflow-hidden rounded-xl border border-foreground/10"
      style={{ backgroundColor: EDITOR_BG }}
    >
      {/* One window. The chat is docked inside it — that is the Cursor moment,
          and it is what distinguishes this demo from the two-window one above. */}
      <div className="grid md:grid-cols-[1.4fr_1fr]">
        <div>
          <div
            className="flex items-stretch font-mono text-[11px]"
            style={{ backgroundColor: TABSTRIP_BG }}
          >
            {/* The active tab takes the code area's fill and merges downward. */}
            <span
              className="flex items-center gap-2 px-3 py-2"
              style={{ backgroundColor: EDITOR_BG, color: EDITOR_FG }}
            >
              <span
                aria-hidden="true"
                className="size-2 rounded-sm"
                style={{ backgroundColor: "#e5c07b" }}
              />
              checkout.js
            </span>
          </div>

          <div className="flex font-mono text-[13px] leading-6">
            <div
              aria-hidden="true"
              className="select-none border-r px-3 py-3 text-right"
              style={{ borderColor: RULE, color: GUTTER_FG }}
            >
              {Array.from({ length: rowCount }, (_, i) => (
                <div key={`ln${i + 1}`}>{i + 1}</div>
              ))}
            </div>
            {/* `whitespace-pre` keeps the indentation HTML would otherwise
                collapse, and stops a long line wrapping out of step with the
                gutter beside it. */}
            <div
              className="flex-1 overflow-x-auto whitespace-pre px-3 py-3"
              style={{ color: EDITOR_FG }}
            >
              {lines.map((tokens, lineIndex) => (
                <div
                  key={`l${lineIndex}`}
                  style={
                    lineIndex === badIndex
                      ? { backgroundColor: BAD_BG }
                      : undefined
                  }
                >
                  {tokens.length === 0
                    ? " "
                    : tokens.map((token, tokenIndex) => (
                        <span key={`t${tokenIndex}`} style={{ color: token.c }}>
                          {token.t}
                        </span>
                      ))}
                </div>
              ))}
              {/* `hover:brightness-125` rather than a `hover:text-*` class: the
                  colour is an inline style, and inline styles beat classes, so
                  a hover colour utility would never appear. A filter is not
                  competing with the style attribute, so it does. */}
              {ghostShowing ? (
                <button
                  className="block w-full text-left italic hover:brightness-125"
                  onClick={() => setGhostAccepted(true)}
                  style={{ color: EDITOR_DIM }}
                  type="button"
                >
                  {ghostAccepted
                    ? "  // discount applied"
                    : "  // ghost: press to accept →"}
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* The chat, docked as a side panel rather than a second region. */}
        <div className="border-l" style={{ borderColor: RULE }}>
          <div
            className="border-b px-3 py-2 font-mono text-[11px] uppercase tracking-wide"
            style={{
              backgroundColor: TABSTRIP_BG,
              borderColor: RULE,
              color: EDITOR_DIM,
            }}
          >
            Chat
          </div>
          <div className="p-3 text-xs" style={{ color: "#ccc" }}>
            <div
              className="mb-2 rounded px-2 py-1.5"
              style={{ backgroundColor: "#2d2d30" }}
            >
              add validation so an unknown code doesn&apos;t crash
            </div>
            {/* Uncoloured on purpose: this is a proposal, not yet your code —
                which is the whole point the demo is about to make. */}
            <div
              className="rounded border p-2 font-mono leading-5"
              style={{ backgroundColor: EDITOR_BG, borderColor: "#3c3c3c" }}
            >
              {SUGGESTION.code.map((l) => (
                <div key={l}>{l}</div>
              ))}
              <div className="mt-2 flex gap-2">
                <button
                  className="rounded bg-ht-cyan-600 px-2 py-1 text-[11px] text-white disabled:opacity-40"
                  disabled={phase !== "initial"}
                  onClick={apply}
                  type="button"
                >
                  Apply
                </button>
                <button
                  className="rounded border px-2 py-1 text-[11px]"
                  onClick={reset}
                  style={{ borderColor: "#555", color: "#aaa" }}
                  type="button"
                >
                  Reset
                </button>
              </div>
            </div>
            <p className="mt-2 italic" style={{ color: EDITOR_DIM }}>
              It can&apos;t run it. It can&apos;t see the rest of your repo. You
              decide if it&apos;s right — and you move it.
            </p>
          </div>
        </div>
      </div>

      {phase === "applied" && (
        <div className="flex items-center justify-between gap-3 bg-amber-50 px-4 py-3 text-amber-900 text-sm dark:bg-amber-950/40 dark:text-amber-200">
          <span>
            Applied — but <code>{SUGGESTION.missingRef}</code> isn&apos;t
            imported in this file. It only saw the selection, not the system.
          </span>
          <button
            className="shrink-0 rounded-md bg-amber-600 px-3 py-1 text-white"
            onClick={fix}
            type="button"
          >
            Fix it yourself
          </button>
        </div>
      )}
      {phase === "resolved" && (
        <div className="bg-emerald-50 px-4 py-3 text-emerald-800 text-sm dark:bg-emerald-950/40 dark:text-emerald-200">
          You added the import. You were the integration layer — every accept,
          file by file.
        </div>
      )}
    </div>
  );
}
```

**Note what disappeared and why it is safe:** the component no longer holds a `file` state or calls `applySuggestion` / `resolveMismatch` at runtime — the phase *is* the state, and `FILE_TOKENS[phase]` is the same file those functions produce, verified by Task 1's fingerprint. `applySuggestion` and `resolveMismatch` remain exported and are still exercised by the generator and by `apply.test.ts`.

- [ ] **Step 2: Typecheck and run the suite**

Run: `cd apps/web && bun run typecheck` — expected clean.
Run: `cd apps/web && bun test` — expected **141 pass / 0 fail**, unchanged from Task 1. If `apply.test.ts` fails, something in `apply.ts` was changed — it must not be.

- [ ] **Step 3: Lint**

```bash
bunx biome check --write "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/index.tsx"
```
Expected: clean, or only the pre-existing `noJsxPropsBind` / array-index-key findings.

- [ ] **Step 4: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/index.tsx"
git commit -m "$(cat <<'EOF'
feat(masterclass): the companion's editor becomes an editor

It was a dark rectangle with a filename written on it, one scroll below a demo
that had just been given a tab strip, a gutter and syntax colour. Same
fictional file, two treatments, which reads as an unfinished redesign rather
than a deliberate contrast.

It now carries the same furniture. What it does not carry is the second window:
the paragraph above says the chat moved into the editor, so this demo is one
window with a docked panel and the one above is two windows with a gap. That
difference is the era's turn, and making both look alike would erase it.

The chat's suggestion stays uncoloured. Here that does more work than it did
next door — uncoloured reads as proposed rather than real, which is exactly the
point about a model that cannot run what it writes. Colour arrives when the
code lands in the file.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Walk both demos together

The point of this change is how the two Era II demos read *as a pair*, which no unit test can see. This produces a verification report, not a diff.

**Files:** none.

- [ ] **Step 1: Open the step**

Reuse the dev server on port 3001 — do **not** start one. Drive Playwright or Chrome DevTools MCP to `http://localhost:3001/learn/masterclass-28-07-2026?step=integration`. Never `curl`.

- [ ] **Step 2: Confirm the pair still contrasts**

Assert structurally that the **extraction** demo is two sibling cards with a gap, and the **companion** demo is one card containing a grid. Report both. If the companion has become two cards, the era has lost its turn and this is a failure.

- [ ] **Step 3: Walk the three phases**

`Apply` → `Fix it yourself` → `Reset`. At each phase record the gutter's row count and the code column's row count. Expected: **initial 5 rows** (4 file lines + the ghost), **applied 8**, **resolved 10**.

- [ ] **Step 4: Measure gutter-to-code alignment in the resolved phase**

This is the step most likely to catch a real defect, because `resolved` contains a genuinely empty line at index 1. Measure the vertical centre of each gutter digit and of its corresponding code row and report the offsets — all ten must match within a pixel. If the empty row collapsed, every row below it will be off by one line height.

Also confirm by eye that indentation survived: `  const rate` and `    logEvent(...)` must still be indented.

- [ ] **Step 5: Confirm colour lands where it should and not where it shouldn't**

In the `resolved` phase, collect the distinct computed colours of spans inside the editor's code column, and separately inside the chat panel's suggestion block. The editor must show **several**; the chat's suggestion must show **one**. Report both sets.

- [ ] **Step 6: Confirm the red line still marks the right row**

In the `applied` phase, find the row with a red background and report its text. It must be the line containing `logEvent`.

- [ ] **Step 7: Both themes, and a screenshot of the pair**

Set `localStorage.setItem('theme', 'dark' | 'light')` and reload for each. The editor and the chat panel must stay dark in both. Capture one screenshot per theme showing **both demos together**, and say plainly whether they read as a deliberate pair — two windows then one — or as an inconsistency.

- [ ] **Step 8: Report**

Write up what you saw with the measured values and screenshot paths. Do not claim it passed without performing every numbered step.

---

## Notes for the reviewer

**Test count trajectory:** 136 baseline → 141 (Task 1) → 141 (Task 2).

**The structural invariant** is that the companion stays one card. A reviewer seeing "two windows" in the sibling spec might reasonably expect this demo to match; it must not, and the plan says why in three places.

**Task 2 removes runtime state** (`file`) in favour of indexing precomputed tokens by phase. The equivalence is guaranteed by Task 1's fingerprint, which hashes the states those same functions produce.

**Deliberately not done:** no second window, no colour on the chat's suggestion, no phase-logic or copy changes, and the ghost suggestion keeps its dim italic styling.
