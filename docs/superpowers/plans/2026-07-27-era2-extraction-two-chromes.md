# Era II Extraction as Two Windows Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Era II's extraction demo read as two separate applications — a browser and a code editor — instead of one card with a divider, and give the editor real editor furniture and syntax-coloured code.

**Architecture:** The single wrapper splits into two sibling cards with an empty gap. The editor gains a tab strip and a line-number gutter, and renders `THREAD_ANSWER` from tokens generated offline in a single dark theme. Era I's `Kind`, scope mapping and hash move up to a shared `demos/highlight/` so Era II can use them without depending on Era I's internals.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS 4, `shiki@4.3.1` (already a direct dependency of `apps/web`), Bun test runner, Biome/ultracite.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-07-27-era2-extraction-two-chromes-design.md`. Read it before Task 1.
- **Paths contain square brackets.** Demos live under `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/`. Always quote paths in shell commands.
- **Tests run from `apps/web`:** `cd apps/web && bun test`. Baseline at the start of this plan is **128 pass / 0 fail across 20 files**. `bun test <bare-filename>` filtering is unreliable because of the bracketed `[locale]` segment — pass the full quoted relative path from `apps/web`.
- **Typecheck:** `cd apps/web && bun run typecheck`. **Lint:** `bunx biome check --write <files>` from the repo root, quoted, only on files you touched.
- **Never lint any `*.generated.ts` file.** The root `biome.jsonc` now carries `"!**/*.generated.*"`; do not remove it and do not `--write` those paths.
- **The editor's colours are hardcoded VS Code Dark+ and stay dark in both page themes.** Do not add `dark:` variants to editor chrome.
- **The chat bubble's code stays uncoloured.** Only the editor gets syntax colour.
- **Named exports only**, `interface` over `type` for object shapes, object literal keys sorted alphabetically (Biome `useSortedKeys` auto-sorts on `--write`).
- **Do NOT start a dev server** — one runs on port 3001 and Next 16 refuses a second for the same project directory. **Never use `curl`** against this page; it 500s even when the browser renders fine. Drive the running server with Playwright or Chrome DevTools MCP at `http://localhost:3001/learn/masterclass-28-07-2026?step=integration`. The `/en/`-prefixed URL 500s in middleware, which is pre-existing.
- **Biome judgment-rule findings** (`noJsxPropsBind`, array-index keys) are pre-existing house style in this directory and are not regressions.
- **Commit style:** `feat(masterclass): <lowercase subject, no trailing period>` or `refactor(masterclass): …`, body explaining the *why*, ending with the trailer `Co-Authored-By: Claude <noreply@anthropic.com>`.

## Verified facts you can rely on

Probed against the installed `shiki@4.3.1`; do not re-derive.

- `codeToTokens(src, { lang, theme: "github-dark", includeExplanation: "scopeName" })` — note **`theme`, singular** — puts the colour on `token.color` as a hex string. (Era I uses `themes: {light, dark}` and gets `htmlStyle` instead; Era II does not.)
- `THREAD_ANSWER.join("\n")` tokenises to **6 lines, 34 tokens, reconstructing exactly**. Per-line token counts are `6,9,5,1,7,1` — **no line is empty**, so no zero-token line exists in the data today.
- Because Era II renders line-by-line for the gutter, it keeps Shiki's **2D shape** and needs no synthetic newline tokens. This is simpler than Era I, which flattens.
- Era I's committed `SOURCE_FINGERPRINT` is `0e891d67-6b0`. Task 1 must not change it.

---

### Task 1: Hoist the shared core

Move the three genuinely shared pieces up to `demos/highlight/` and leave Era I's public surface identical, so Era I's suite passing is the proof the move was invisible.

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/highlight/index.ts`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/highlight/index.test.ts`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/highlight/index.ts`
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/highlight/index.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces, for Task 2:
  - `type Kind = "comment" | "keyword" | "plain" | "punct" | "string"`
  - `kindFromScopes(scopes: string[]): Kind`
  - `fingerprintText(strings: readonly string[]): string`

- [ ] **Step 1: Write the shared module's test**

Create `demos/highlight/index.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import { fingerprintText, kindFromScopes } from "./index";

describe("kindFromScopes", () => {
  test("a comment wins over the punctuation scope it also carries", () => {
    // Shiki hands back one token for `// a comment` whose LAST scope is
    // punctuation.definition.comment.js. Scanning only the last scope would
    // render every comment as punctuation.
    expect(
      kindFromScopes([
        "source.js",
        "comment.line.double-slash.js",
        "punctuation.definition.comment.js",
      ])
    ).toBe("comment");
  });

  test("strings, keywords and punctuation each find their kind", () => {
    expect(kindFromScopes(["string.quoted.single.js"])).toBe("string");
    expect(kindFromScopes(["meta.var.expr.js", "storage.type.js"])).toBe(
      "keyword"
    );
    expect(kindFromScopes(["keyword.operator.assignment.js"])).toBe("keyword");
    expect(kindFromScopes(["punctuation.terminator.statement.js"])).toBe(
      "punct"
    );
  });

  test("anything unrecognised is plain, never undefined", () => {
    expect(kindFromScopes(["source.js"])).toBe("plain");
    expect(kindFromScopes([])).toBe("plain");
  });
});

describe("fingerprintText", () => {
  test("the same strings always hash the same", () => {
    expect(fingerprintText(["a", "b"])).toBe(fingerprintText(["a", "b"]));
  });

  test("one changed character changes the hash", () => {
    expect(fingerprintText(["hello"])).not.toBe(fingerprintText(["hellp"]));
  });

  test("the length suffix makes same-length collisions harder to hit", () => {
    expect(fingerprintText(["abc"]).endsWith("-3")).toBe(true);
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `cd apps/web && bun test "./app/[locale]/learn/masterclass-28-07-2026/demos/highlight/index.test.ts"`
Expected: FAIL — `Cannot find module './index'`.

- [ ] **Step 3: Write the shared module**

Create `demos/highlight/index.ts`:

```ts
/**
 * What the exhibit's demos share about syntax highlighting: the vocabulary of
 * token kinds, the rule for deriving one from Shiki's scopes, and the hash that
 * tells a demo its committed tokens have gone stale.
 *
 * Deliberately *not* here: token shapes and colour classes. Era I's prefix token
 * carries a light/dark pair because its window follows the page theme; Era II's
 * editor token carries one hex because the editor is a dark slab in both. A
 * shared shape would make one of them carry a field it never reads.
 *
 * Shiki must never be imported here: this module reaches the browser.
 */

export type Kind = "comment" | "keyword" | "plain" | "punct" | "string";

/**
 * Priority order matters. Shiki returns `// a comment` as a single token whose
 * scope list ends in `punctuation.definition.comment.js`, so a last-scope-wins
 * rule would style every comment as punctuation.
 */
export function kindFromScopes(scopes: string[]): Kind {
  const joined = scopes.join(" ");
  if (joined.includes("comment")) {
    return "comment";
  }
  if (joined.includes("string")) {
    return "string";
  }
  if (joined.includes("storage.type") || joined.includes("keyword")) {
    return "keyword";
  }
  if (joined.includes("punctuation")) {
    return "punct";
  }
  return "plain";
}

/**
 * A cheap stand-in for regenerating. Token data cannot drift unless one of the
 * source strings changes, so hashing the sources catches the real hazard — copy
 * edited without re-running a generator — without loading Shiki grammars into a
 * suite that otherwise finishes in milliseconds.
 *
 * It cannot catch a `shiki` version bump changing grammars or themes underneath
 * committed tokens. Each generator says so in its own doc comment.
 */
export function fingerprintText(strings: readonly string[]): string {
  const joined = strings.join("");
  let h1 = 0x81_1c_9d_c5;
  for (let i = 0; i < joined.length; i += 1) {
    // biome-ignore lint/suspicious/noBitwiseOperators: FNV-1a hash requires XOR and unsigned-shift
    h1 ^= joined.charCodeAt(i);
    // biome-ignore lint/suspicious/noBitwiseOperators: FNV-1a hash requires XOR and unsigned-shift
    h1 = Math.imul(h1, 0x01_00_01_93) >>> 0;
  }
  return `${h1.toString(16).padStart(8, "0")}-${joined.length.toString(16)}`;
}
```

- [ ] **Step 4: Run the shared test to verify it passes**

Run: `cd apps/web && bun test "./app/[locale]/learn/masterclass-28-07-2026/demos/highlight/index.test.ts"`
Expected: PASS, 6 tests.

- [ ] **Step 5: Rewire Era I to the shared core**

In `era1-playground/highlight/index.ts`:

Replace the `Kind` type declaration and the whole `kindFromScopes` function with re-exports, and import `fingerprintText`. The file's top becomes:

```ts
import { fingerprintText, type Kind } from "../../highlight";
import type { PromptSeed } from "../selector";

export { kindFromScopes } from "../../highlight";
export type { Kind } from "../../highlight";
```

Then replace the body of `fingerprintSources` so it defers to the shared hash — keeping the *same* flattening order, because Era I's committed `SOURCE_FINGERPRINT` must not change:

```ts
export function fingerprintSources(prompts: readonly PromptSeed[]): string {
  const parts: string[] = [];
  for (const p of [...prompts].sort((a, b) => a.id.localeCompare(b.id))) {
    parts.push(p.id, p.prefix);
    for (const band of ["high", "low", "mid"] as const) {
      parts.push(p.continuations[band], p.instructAnswers[band]);
    }
  }
  return fingerprintText(parts);
}
```

Everything else in the file — `PrefixToken`, `CompletionToken`, `COMPLETION_CLASS`, `completionClass`, `prefixIsComment`, `visibleTokens` — stays exactly as it is.

**Do not touch `era1-playground/highlight/generate.ts` or `index.tsx`.** They import from `./index`, which still exports the same names.

- [ ] **Step 6: Remove the duplicated tests from Era I**

In `era1-playground/highlight/index.test.ts`, delete the entire `describe("kindFromScopes", …)` block — all three of its tests now live in the shared module's test file. Remove `kindFromScopes` from that file's import list. Leave the `completionClass` and `visibleTokens` blocks untouched.

- [ ] **Step 7: Prove the move was invisible**

Run: `cd apps/web && bun test`
Expected: **131 pass / 0 fail across 21 files.** (128 − 3 moved out of Era I + 6 added in the shared file.)

The load-bearing assertion is that `era1-playground/highlight/fingerprint.test.ts` still passes **without regenerating anything.** That test compares `fingerprintSources(PROMPTS)` against the committed `SOURCE_FINGERPRINT` of `0e891d67-6b0`. If it fails, the flattening order changed and the refactor is wrong — fix the order, do not regenerate the tokens.

Run: `cd apps/web && bun run typecheck` — expected clean.

- [ ] **Step 8: Lint and commit**

```bash
bunx biome check --write "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/highlight/index.ts" "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/highlight/index.test.ts" "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/highlight/index.ts" "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/highlight/index.test.ts"
```

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/"
git commit -m "$(cat <<'EOF'
refactor(masterclass): the highlight vocabulary belongs to the exhibit

Era II needs the token kinds, the scope rule and the staleness hash, and none
of Era I's cyan classes, streaming slicer or dual-theme token shape. Sharing
through era1-playground would have inverted the dependency; sharing the whole
module would have forced one era to carry fields it never reads.

So only the vocabulary moves up. Token shapes stay era-local on purpose: Era I's
prefix carries a light/dark pair because its window follows the page theme,
Era II's editor carries one hex because it is a dark slab in both.

Era I re-exports what moved, so its own imports and tests are unchanged — and
its fingerprint still matches the committed tokens without regenerating, which
is what proves the flattening order survived the refactor.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Era II's editor tokens

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/highlight/index.ts`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/highlight/generate.ts`
- Create (by running it): `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/highlight/tokens.generated.ts`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/highlight/fingerprint.test.ts`
- Modify: `apps/web/package.json`

**Interfaces:**
- Consumes: `Kind`, `kindFromScopes`, `fingerprintText` from `../../highlight` (Task 1); `THREAD_ANSWER` from `../extraction`.
- Produces, for Task 3:
  - `interface EditorToken { c: string; k: Kind; t: string }` — `c` is a single hex.
  - `EDITOR_TOKENS: EditorToken[][]` — **lines × tokens**, one array per source line.
  - `SOURCE_FINGERPRINT: string`

- [ ] **Step 1: Write the token type module**

Create `era2-companion/highlight/index.ts`:

```ts
/**
 * The editor renders line by line so its gutter can number them, so tokens keep
 * Shiki's two-dimensional shape — one array per line — rather than being
 * flattened with synthetic newlines the way Era I's streaming window needs.
 *
 * One hex per token, not a light/dark pair: the editor is a dark slab in both
 * page themes, because a light-mode editor reads as a document rather than a
 * workbench and loses the cue that this is a different application from the
 * browser above it.
 */
import type { Kind } from "../../highlight";

export interface EditorToken {
  /** Single theme hex — github-dark. */
  c: string;
  k: Kind;
  t: string;
}
```

- [ ] **Step 2: Write the generator**

Create `era2-companion/highlight/generate.ts`:

```ts
/**
 * Tokenises the answer the presenter carries from the browser into the editor,
 * and writes it to `tokens.generated.ts`. Run with
 * `bun run gen:era2-highlight` from `apps/web`.
 *
 * Imports Shiki and is never bundled — nothing in the client tree imports it.
 *
 * The fingerprint below only catches THREAD_ANSWER changing. It cannot catch a
 * `shiki` version bump changing grammars or themes underneath the committed
 * tokens — no test can detect that drift, so re-run this by hand after any
 * `shiki` upgrade.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { createHighlighter } from "shiki";
import { fingerprintText, kindFromScopes } from "../../highlight";
import { THREAD_ANSWER } from "../extraction";
import type { EditorToken } from "./index";

const THEME = "github-dark";

const highlighter = await createHighlighter({
  langs: ["javascript"],
  themes: [THEME],
});

const source = THREAD_ANSWER.join("\n");

const lines: EditorToken[][] = highlighter
  .codeToTokens(source, {
    includeExplanation: "scopeName",
    lang: "javascript",
    theme: THEME,
  })
  .tokens.map((line) =>
    line.map((t) => ({
      c: t.color ?? "#D4D4D4",
      k: kindFromScopes(t.explanation?.[0]?.scopes.map((s) => s.scopeName) ?? []),
      t: t.content,
    }))
  );

const body = `// GENERATED by highlight/generate.ts — do not edit by hand.
// Regenerate with: bun run gen:era2-highlight
import type { EditorToken } from "./index";

export const SOURCE_FINGERPRINT = ${JSON.stringify(fingerprintText([...THREAD_ANSWER]))};

export const EDITOR_TOKENS: EditorToken[][] = ${JSON.stringify(lines, null, 2)};
`;

writeFileSync(join(import.meta.dir, "tokens.generated.ts"), body);
process.stdout.write(`wrote ${lines.length} lines\n`);
```

- [ ] **Step 3: Add the script**

In `apps/web/package.json`, add to `"scripts"`:

```json
"gen:era2-highlight": "bun run \"./app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/highlight/generate.ts\""
```

- [ ] **Step 4: Run the generator**

Run: `cd apps/web && bun run gen:era2-highlight`
Expected: `wrote 6 lines`, and `tokens.generated.ts` now exists.

- [ ] **Step 5: Write the fingerprint and reconstruction test**

Create `era2-companion/highlight/fingerprint.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import { fingerprintText } from "../../highlight";
import { THREAD_ANSWER } from "../extraction";
import { EDITOR_TOKENS, SOURCE_FINGERPRINT } from "./tokens.generated";

describe("era2 editor tokens", () => {
  test("the committed tokens were generated from the current answer", () => {
    // If this fails, THREAD_ANSWER changed and the tokens are stale.
    // Fix: cd apps/web && bun run gen:era2-highlight
    expect(fingerprintText([...THREAD_ANSWER])).toBe(SOURCE_FINGERPRINT);
  });

  test("there is one token line per source line", () => {
    expect(EDITOR_TOKENS.length).toBe(THREAD_ANSWER.length);
  });

  test("each line's tokens reconstruct that line exactly", () => {
    // The gutter numbers lines and the code column renders them, so a token
    // list that does not rebuild its own line would silently misalign the two.
    EDITOR_TOKENS.forEach((line, index) => {
      expect(line.map((t) => t.t).join("")).toBe(THREAD_ANSWER[index]);
    });
  });

  test("every token carries a colour", () => {
    for (const line of EDITOR_TOKENS) {
      for (const token of line) {
        expect(token.c).toMatch(/^#[0-9A-Fa-f]{6}$/);
      }
    }
  });

  test("no line is empty — the gutter's row heights depend on it", () => {
    for (const line of EDITOR_TOKENS) {
      expect(line.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 6: Run the tests**

Run: `cd apps/web && bun test`
Expected: PASS, **136 pass / 0 fail** (131 from Task 1, +5 here).

- [ ] **Step 7: Prove the fingerprint catches drift**

Temporarily change one character inside any string in `THREAD_ANSWER` in `era2-companion/extraction.ts`, then:

Run: `cd apps/web && bun test "./app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/highlight/fingerprint.test.ts"`
Expected: **FAIL** on the fingerprint test (and on the reconstruction test).

Revert with `git checkout -- "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/extraction.ts"`, re-run, and confirm it passes. A guard nobody has watched fail is not a guard.

- [ ] **Step 8: Typecheck, lint, commit**

Run: `cd apps/web && bun run typecheck` — expected clean.

```bash
bunx biome check --write "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/highlight/index.ts" "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/highlight/generate.ts" "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/highlight/fingerprint.test.ts" "apps/web/package.json"
```

**Do not lint `tokens.generated.ts`.**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/highlight/" "apps/web/package.json"
git commit -m "$(cat <<'EOF'
feat(masterclass): tokenise the answer that gets carried across

The six lines the presenter copies out of the browser are static, so they are
tokenised at author time and committed. One hex per token rather than a
light/dark pair, because the editor stays a dark slab in both page themes.

Tokens keep Shiki's per-line shape instead of being flattened: the gutter
numbers lines, so the code column has to render them as lines, and a token list
that failed to rebuild its own line would misalign the two silently. There is a
test for exactly that.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Two windows

**Files:**
- Rewrite: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/extraction-demo.tsx`

**Interfaces:**
- Consumes: `EDITOR_TOKENS` from `./highlight/tokens.generated` (Task 2); `ClipPhase`, `clipTransition`, `THREAD_ANSWER`, `THREAD_QUESTION` from `./extraction` (unchanged).
- Produces: nothing.

- [ ] **Step 1: Rewrite the component**

Replace the whole file:

```tsx
"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import {
  type ClipPhase,
  clipTransition,
  THREAD_ANSWER,
  THREAD_QUESTION,
} from "./extraction";
import { EDITOR_TOKENS } from "./highlight/tokens.generated";

/** VS Code Dark+, held deliberately outside the page's theme. */
const EDITOR_BG = "#1e1e1e";
const TABSTRIP_BG = "#252526";
const EDITOR_FG = "#d4d4d4";
const EDITOR_DIM = "#858585";
const GUTTER_FG = "#6e7681";
const RULE = "#2b2b2b";

const PLACEHOLDER: Record<"copied" | "idle", string> = {
  copied: "// the answer is on your clipboard. Bring it over yourself.",
  idle: "// empty. The knowledge lives in another window.",
};

export function Era2Extraction() {
  const [phase, setPhase] = useState<ClipPhase>("idle");
  const pasted = phase === "pasted";
  const lineCount = pasted ? EDITOR_TOKENS.length : 1;

  return (
    <div className="mb-6 space-y-5">
      {/* The browser, where the answer lives. */}
      <div className="overflow-hidden rounded-xl border border-foreground/10 bg-muted/40">
        <div className="flex items-center gap-2 border-foreground/10 border-b px-3 py-2">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          </span>
          <span className="rounded bg-background px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
            chat.openai.com · 2022
          </span>
        </div>
        <div className="space-y-3 p-4 text-xs">
          <div className="ml-auto w-fit max-w-[80%] rounded-lg bg-ht-cyan-600/10 px-3 py-2">
            {THREAD_QUESTION}
          </div>
          <div className="w-fit max-w-[80%] rounded-lg border border-foreground/10 bg-background p-3">
            {/* Uncoloured on purpose: a transcript, not a workbench. */}
            <pre className="font-mono leading-5">
              {THREAD_ANSWER.join("\n")}
            </pre>
            <button
              className="mt-2 rounded border border-foreground/15 px-2 py-1 font-mono text-[11px] text-muted-foreground hover:text-foreground disabled:opacity-40"
              disabled={phase !== "idle"}
              onClick={() => setPhase((p) => clipTransition(p, "copy"))}
              type="button"
            >
              {phase === "idle" ? "Copy" : "Copied ✓"}
            </button>
          </div>
        </div>
      </div>

      {/* Your editor, a world away. The gap between the two is the point. */}
      <div
        className="overflow-hidden rounded-xl border border-foreground/10"
        style={{ backgroundColor: EDITOR_BG }}
      >
        <div
          className="flex items-stretch justify-between font-mono text-[11px]"
          style={{ backgroundColor: TABSTRIP_BG }}
        >
          {/* The active tab carries the editor's own fill, so it merges with
              the code below it — the same grammar Era I's prompt tabs speak. */}
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
          <span
            className="flex items-center gap-3 px-3"
            style={{ color: EDITOR_DIM }}
          >
            your editor
            <button
              className="rounded border px-2 py-0.5 disabled:opacity-40"
              disabled={phase !== "copied"}
              onClick={() => setPhase((p) => clipTransition(p, "paste"))}
              style={{ borderColor: RULE }}
              type="button"
            >
              Paste
            </button>
          </span>
        </div>

        <div className="flex font-mono text-[13px] leading-6">
          <div
            aria-hidden="true"
            className="select-none border-r px-3 py-3 text-right"
            style={{ borderColor: RULE, color: GUTTER_FG }}
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={`ln${i + 1}`}>{i + 1}</div>
            ))}
          </div>
          {/* `whitespace-pre` is load-bearing twice over: these are divs, not a
              <pre>, so without it HTML collapses the leading indentation off
              every nested line, and long lines wrap and desync the gutter from
              the code beside it. With it, overflow-x scrolls — like an editor. */}
          <div
            className="flex-1 overflow-x-auto whitespace-pre px-3 py-3"
            style={{ color: EDITOR_FG }}
          >
            {pasted ? (
              EDITOR_TOKENS.map((line, lineIndex) => (
                <div key={`l${lineIndex}`}>
                  {line.map((token, tokenIndex) => (
                    <span
                      key={`t${tokenIndex}`}
                      style={{ color: token.c } as CSSProperties}
                    >
                      {token.t}
                    </span>
                  ))}
                </div>
              ))
            ) : (
              <div className="italic" style={{ color: GUTTER_FG }}>
                {phase === "copied" ? PLACEHOLDER.copied : PLACEHOLDER.idle}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Outside both fictions: the verdict, and the only control neither
          application would have. */}
      <div className="flex items-start gap-4">
        {pasted ? (
          <p className="max-w-2xl text-foreground/55 text-sm italic">
            You were the clipboard. Every answer crossed between those two
            worlds by hand.
          </p>
        ) : null}
        <button
          className="ml-auto shrink-0 font-mono text-muted-foreground text-xs hover:text-foreground"
          onClick={() => setPhase("idle")}
          type="button"
        >
          ↺ reset
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck and run the suite**

Run: `cd apps/web && bun run typecheck` — expected clean.
Run: `cd apps/web && bun test` — expected **136 pass / 0 fail**, unchanged from Task 2.

- [ ] **Step 3: Lint**

```bash
bunx biome check --write "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/extraction-demo.tsx"
```
Expected: clean, or only the pre-existing `noJsxPropsBind` / array-index-key findings.

- [ ] **Step 4: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era2-companion/extraction-demo.tsx"
git commit -m "$(cat <<'EOF'
feat(masterclass): the ferrying years get two windows

The era says it twice — "a world away from your code", and "you were the
clipboard" — while the demo drew both halves inside one bordered card with a
divider, which reads as one window with two panes.

Two cards now, with an empty gap. The gap stays empty: the distance is the
joke, and an arrow across it would explain the joke.

The lower half finally looks like an editor rather than a dark rectangle with a
filename on it — a tab strip whose active tab carries the code area's own fill
and merges with it, and a line-number gutter. On a dark projector both windows
are dark, so separation has to come from vocabulary rather than tone: traffic
lights and a URL pill say browser, a tab and a gutter say editor.

Reset leaves the fiction and sits beside the verdict. Neither application would
have one, and leaving it inside the editor's furniture undercut the illusion
that furniture exists to build.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Look at it

Unit tests cannot see whether two things read as two applications. This produces a verification report, not a diff.

**Files:** none.

- [ ] **Step 1: Open the demo**

Reuse the dev server on port 3001 — do **not** start one. Drive Playwright or Chrome DevTools MCP to `http://localhost:3001/learn/masterclass-28-07-2026?step=integration`. Never `curl`.

- [ ] **Step 2: Confirm two cards, not one**

Assert in the DOM that the browser window and the editor window are **siblings**, each with its own border, and measure the vertical gap between them. Report the measured gap in pixels. Confirm neither is nested inside the other.

- [ ] **Step 3: Walk the beat**

`Copy` → `Paste` → observe → `↺ reset`. At each phase, record: the editor's placeholder or code, the gutter's line count, and whether `Paste` is enabled. Confirm the gutter shows **1** line before paste and **6** after.

- [ ] **Step 3a: Confirm the gutter and the code actually line up**

Measure the vertical centre of each gutter digit and of its corresponding code line, and report the offsets. They must match within a pixel for all six rows.

This is the step most likely to catch a real defect. The code column renders `<div>`s rather than a `<pre>`, so it depends on `whitespace-pre` to keep leading indentation and to stop long lines wrapping. If that class is missing or overridden, indentation silently vanishes and any wrapped line pushes the code out of step with its number — which looks like an editor with the wrong line numbers, on a projector. Also confirm by eye that `  if (…)` and `    return …` are still indented.

- [ ] **Step 4: Confirm the editor's code is coloured and the chat's is not**

After pasting, collect the distinct computed colours of the spans inside the editor's code column, and separately the computed colour of the chat bubble's `<pre>`. The editor must show **several** distinct colours; the chat must show **one**. Report both sets.

- [ ] **Step 5: Both themes**

Set `localStorage.setItem('theme', 'dark' | 'light')` and reload for each. Confirm the editor stays dark in both — its background must be `#1e1e1e` either way — and screenshot each. The point to judge by eye: do these read as two different applications, in both themes?

- [ ] **Step 6: Report**

Write up what you saw with the measured values and screenshot paths. Name anything that still reads as one window. Do not claim it passed without performing every numbered step.

---

## Notes for the reviewer

**Test count trajectory:** 128 baseline → 131 (Task 1: −3 moved out of Era I, +6 shared) → 136 (Task 2) → 136 (Task 3).

**Task 1's real acceptance test** is that `era1-playground/highlight/fingerprint.test.ts` passes unchanged, against the committed `SOURCE_FINGERPRINT` of `0e891d67-6b0`, with nothing regenerated. That proves the hoist preserved the flattening order and Era I's data is still valid.

**Deliberately not done:** no status bar, minimap, activity bar or breadcrumbs; no change to the second Era II demo; the chat's `Copy` button remains a prop rather than touching the real clipboard.
