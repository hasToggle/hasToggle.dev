# Era I Completion Window Highlighting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the Era I console's output window syntax structure without spending the cyan that tells the room where the presenter's prompt ends and the machine's continuation begins.

**Architecture:** The prompt prefix renders in full theme colour; the machine's completion renders in one hue with structure carried by weight, opacity and italics. All fourteen renderable strings are tokenised offline by a Shiki script and committed as data, so nothing flickers mid-stream and no Shiki reaches the browser.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS 4, `shiki@4.3.1` (already a direct dependency of `apps/web`), Bun test runner, Biome/ultracite.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-07-27-era1-completion-window-highlighting-design.md`. Read it before Task 1.
- **Paths contain square brackets.** The demo lives in `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/`. Always quote paths in shell commands.
- **Tests run from `apps/web`:** `cd apps/web && bun test`. Baseline at the start of this plan is **113 pass / 0 fail across 18 files**. `bun test <bare-filename>` filtering is unreliable because of the bracketed `[locale]` segment — pass the full quoted relative path from `apps/web`.
- **Typecheck:** `cd apps/web && bun run typecheck`. **Lint:** `bunx biome check --write <files>` from the repo root, only on files you touched.
- **Cyan is reserved for machine output and active-state marks.** Completion tokens are cyan at varying weight/opacity and **never** another hue. No cyan prose anywhere.
- **Theme pair is `github-light` / `github-dark`.** Exact strings.
- **Named exports only**, `interface` over `type` for object shapes, object literal keys sorted alphabetically (Biome `useSortedKeys` auto-sorts on `--write`).
- **Do NOT start a dev server** — one runs on port 3001 and Next 16 refuses a second for the same project directory. **Never use `curl`** against this page; it 500s even when the browser renders fine. Drive the running server with Playwright or Chrome DevTools MCP at `http://localhost:3001/learn/masterclass-28-07-2026?step=completion`. The `/en/`-prefixed URL 500s in middleware, which is pre-existing.
- **Biome judgment-rule findings** (`noJsxPropsBind`, `noExportedImports`, array-index keys) are pre-existing house style in this directory and are not regressions. Mechanical findings are.
- **Commit style:** `feat(masterclass): <lowercase subject, no trailing period>`, body explaining the *why*, ending with the trailer `Co-Authored-By: Claude <noreply@anthropic.com>`.

## Verified facts you can rely on

These were probed against the installed `shiki@4.3.1`; do not re-derive them.

- `codeToTokens(code, { lang, themes: { light, dark }, includeExplanation: "scopeName" })` returns `{ tokens }` as a **2D array** — lines × tokens — with newlines *implicit between lines*.
- Joining `tokens.map(l => l.map(t => t.content).join("")).join("\n")` reproduces the input **exactly**, including the `🦆` sample (109 chars in, 109 out). This is what makes a character budget safe.
- With dual themes each token carries `htmlStyle: { color: "<light hex>", "--shiki-dark": "<dark hex>" }`.
- Scopes live at `token.explanation[0].scopes[].scopeName`. **A `//` comment is one token whose *last* scope is `punctuation.definition.comment.js`** — so kind detection must scan the whole scope list in priority order, never just the last entry.
- The generator's newline handling in Task 2 was run against the real `PROMPTS`: **14 strings, 0 mismatches, 215 tokens total.** The whole dataset is a few kilobytes.
- `style={{ "--x": value } as React.CSSProperties}` typechecks clean in this repo and is already house style — see `packages/design-system/components/ui/toggle-group.tsx:37`.

---

### Task 1: The pure highlight module

Types, the kind mapping, the class maps, and the streaming slicer. No Shiki here — this module is imported by the client and must stay free of it.

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/highlight/index.ts`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/highlight/index.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces, for Tasks 2–4:
  - `type Kind = "comment" | "keyword" | "plain" | "punct" | "string"`
  - `interface PrefixToken { d: string; k: Kind; l: string; t: string }` — `l`/`d` are light/dark hex, `t` is the text.
  - `interface CompletionToken { k: Kind; t: string }`
  - `kindFromScopes(scopes: string[]): Kind`
  - `completionClass(kind: Kind): string`
  - `prefixIsComment(kind: Kind): boolean`
  - `visibleTokens(tokens: CompletionToken[], charCount: number): CompletionToken[]`

- [ ] **Step 1: Write the failing test**

Create `highlight/index.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import {
  type CompletionToken,
  completionClass,
  kindFromScopes,
  visibleTokens,
} from "./index";

const toks = (...pairs: [string, string][]): CompletionToken[] =>
  pairs.map(([t, k]) => ({ k: k as CompletionToken["k"], t }));

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

describe("completionClass", () => {
  test("every kind is cyan and only cyan", () => {
    for (const k of ["comment", "keyword", "plain", "punct", "string"] as const) {
      expect(completionClass(k)).toContain("ht-cyan");
    }
  });

  test("comments are dimmed and italic, keywords carry weight", () => {
    expect(completionClass("comment")).toContain("italic");
    expect(completionClass("keyword")).toContain("font-medium");
    expect(completionClass("keyword")).not.toContain("italic");
  });
});

describe("visibleTokens", () => {
  const three = toks(["const", "keyword"], [" x", "plain"], [";", "punct"]);

  test("nothing revealed yet", () => {
    expect(visibleTokens(three, 0)).toEqual([]);
  });

  test("a budget inside the first token slices it", () => {
    expect(visibleTokens(three, 2)).toEqual(toks(["co", "keyword"]));
  });

  test("a budget on an exact boundary keeps whole tokens and adds nothing", () => {
    expect(visibleTokens(three, 5)).toEqual(toks(["const", "keyword"]));
  });

  test("a budget spanning tokens slices only the last", () => {
    expect(visibleTokens(three, 6)).toEqual(
      toks(["const", "keyword"], [" ", "plain"])
    );
  });

  test("the full budget returns every token intact", () => {
    expect(visibleTokens(three, 8)).toEqual(three);
  });

  test("an over-budget never invents characters", () => {
    expect(visibleTokens(three, 999)).toEqual(three);
    expect(visibleTokens(three, 999).map((t) => t.t).join("")).toBe("const x;");
  });

  test("the revealed text always equals a prefix of the whole", () => {
    // The property that matters: the console must never show a character the
    // machine has not produced, and never drop its last one.
    const whole = three.map((t) => t.t).join("");
    for (let i = 0; i <= whole.length; i += 1) {
      expect(visibleTokens(three, i).map((t) => t.t).join("")).toBe(
        whole.slice(0, i)
      );
    }
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `cd apps/web && bun test "./app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/highlight/index.test.ts"`
Expected: FAIL — `Cannot find module './index'`.

- [ ] **Step 3: Write `highlight/index.ts`**

```ts
/**
 * The console's two registers. The prefix — what the presenter typed — renders
 * in full theme colour. The completion — what the machine wrote — renders in
 * one hue, with structure carried by weight, opacity and italics, so that
 * "everything cyan is the machine" stays literally true and the boundary
 * between prompt and continuation survives.
 *
 * Shiki must never be imported here: this module reaches the browser.
 */

export type Kind = "comment" | "keyword" | "plain" | "punct" | "string";

export interface PrefixToken {
  /** Dark-theme hex. */
  d: string;
  k: Kind;
  /** Light-theme hex. */
  l: string;
  t: string;
}

export interface CompletionToken {
  k: Kind;
  t: string;
}

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

const COMPLETION_CLASS: Record<Kind, string> = {
  comment: "text-ht-cyan-700/55 italic dark:text-ht-cyan-300/55",
  keyword: "font-medium text-ht-cyan-700 dark:text-ht-cyan-300",
  plain: "text-ht-cyan-700 dark:text-ht-cyan-300",
  punct: "text-ht-cyan-700/70 dark:text-ht-cyan-300/70",
  string: "text-ht-cyan-700 dark:text-ht-cyan-300",
};

export function completionClass(kind: Kind): string {
  return COMPLETION_CLASS[kind];
}

/**
 * Comments in the prefix are the one place the theme's own colour is refused.
 * GitHub's comment grey (#6e7781 / #8b949e) is mid-contrast by design, and the
 * question prompt — `// how do I reverse a list in JavaScript?` — is the single
 * line the room has to read off a projector. Italics carry "comment" on their
 * own; the hue does not have to whisper to say it.
 */
export function prefixIsComment(kind: Kind): boolean {
  return kind === "comment";
}

/**
 * Reveals `charCount` characters of a precomputed token list, slicing the token
 * the budget lands inside. The returned text is always exactly the first
 * `charCount` characters of the whole — an off-by-one here would silently drop
 * the machine's last character on every run.
 */
export function visibleTokens(
  tokens: CompletionToken[],
  charCount: number
): CompletionToken[] {
  const out: CompletionToken[] = [];
  let remaining = charCount;
  for (const token of tokens) {
    if (remaining <= 0) {
      break;
    }
    if (token.t.length <= remaining) {
      out.push(token);
      remaining -= token.t.length;
    } else {
      out.push({ k: token.k, t: token.t.slice(0, remaining) });
      remaining = 0;
    }
  }
  return out;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd apps/web && bun test "./app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/highlight/index.test.ts"`
Expected: PASS, 11 tests.

- [ ] **Step 5: Confirm Shiki did not leak into the client module**

Run from the repo root:
```bash
grep -c "shiki" "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/highlight/index.ts"
```
Expected: `0`.

- [ ] **Step 6: Typecheck, lint, commit**

Run: `cd apps/web && bun run typecheck` — expected clean.

```bash
bunx biome check --write "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/highlight/index.ts" "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/highlight/index.test.ts"
```

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/highlight/"
git commit -m "$(cat <<'EOF'
feat(masterclass): two registers for the console window

The prefix will render in full theme colour and the completion in one hue, so
"everything cyan is the machine" stays literally true and the boundary between
what the presenter typed and what the model continued survives being made
readable.

Kind detection scans the whole scope list rather than the last entry, because
Shiki returns a `//` comment as one token whose final scope is punctuation — a
last-scope-wins rule styles every comment in the demo wrongly.

visibleTokens is tested against the property that actually matters: the
revealed text equals a prefix of the whole at every budget, so the stream can
neither invent a character nor drop the machine's last one.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: The generator and the committed tokens

A Node-only script that tokenises all fourteen strings and writes a data module, plus the fingerprint that makes drift loud.

**Files:**
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/highlight/generate.ts`
- Create (by running it): `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/highlight/tokens.generated.ts`
- Create: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/highlight/fingerprint.test.ts`
- Modify: `apps/web/package.json` (add the `gen:era1-highlight` script)

**Interfaces:**
- Consumes: `Kind`, `PrefixToken`, `CompletionToken`, `kindFromScopes` from `./index` (Task 1); `PROMPTS` from `../selector`.
- Produces, for Tasks 3–4:
  - `PREFIX_TOKENS: Record<string, PrefixToken[]>` keyed by prompt id.
  - `COMPLETION_TOKENS: Record<string, CompletionToken[]>` keyed by `` `${promptId}:${mode}:${band}` ``.
  - `SOURCE_FINGERPRINT: string`
  - `fingerprintSources(): string` exported from `generate.ts` **and re-exported from `index.ts`** so the test can call it without loading Shiki.

- [ ] **Step 1: Add the fingerprint helper to `highlight/index.ts`**

Append to `highlight/index.ts` (it must live here, not in `generate.ts`, so the test can call it without pulling in Shiki). Add the type import at the top of the file — it is type-only, so it costs the bundle nothing:

```ts
import type { PromptSeed } from "../selector";
```

**Do not type the parameter as `Record<string, string>`.** `PromptSeed.continuations` is `Record<Band, string>`, which has no index signature and is therefore not assignable to `Record<string, string>` — that spelling fails typecheck.

```ts
/**
 * A cheap stand-in for regenerating. Token data cannot drift unless one of the
 * source strings changes, so hashing the sources catches the real hazard — a
 * completion edited without re-running the generator — without loading Shiki
 * grammars into a suite that otherwise finishes in milliseconds.
 */
export function fingerprintSources(prompts: readonly PromptSeed[]): string {
  const parts: string[] = [];
  for (const p of [...prompts].sort((a, b) => a.id.localeCompare(b.id))) {
    parts.push(p.id, p.prefix);
    for (const band of ["high", "low", "mid"] as const) {
      parts.push(p.continuations[band], p.instructAnswers[band]);
    }
  }
  const joined = parts.join("");
  let h1 = 0x811c9dc5;
  for (let i = 0; i < joined.length; i += 1) {
    h1 ^= joined.charCodeAt(i);
    h1 = Math.imul(h1, 0x01000193) >>> 0;
  }
  return `${h1.toString(16).padStart(8, "0")}-${joined.length.toString(16)}`;
}
```

- [ ] **Step 2: Write the generator**

Create `highlight/generate.ts`:

```ts
/**
 * Tokenises every string the Era I output window can render and writes them to
 * `tokens.generated.ts`. Run with `bun run gen:era1-highlight` from `apps/web`.
 *
 * This file imports Shiki and is never bundled — nothing in the client tree
 * imports it. The output is committed so the browser gets tokens, not a
 * highlighter, and so a stream cannot flicker: colours computed from finished
 * text stay put as the text is revealed.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { createHighlighter } from "shiki";
import { PROMPTS } from "../selector";
import {
  type CompletionToken,
  fingerprintSources,
  kindFromScopes,
  type PrefixToken,
} from "./index";

const THEMES = { dark: "github-dark", light: "github-light" } as const;
const BANDS = ["low", "mid", "high"] as const;

const highlighter = await createHighlighter({
  langs: ["javascript"],
  themes: [THEMES.light, THEMES.dark],
});

function tokenise(code: string) {
  return highlighter
    .codeToTokens(code, {
      includeExplanation: "scopeName",
      lang: "javascript",
      themes: THEMES,
    })
    .tokens.flatMap((line, index) => {
      const withNewline = index === 0 ? line : [{ content: "\n" }, ...line];
      return withNewline as { content: string; explanation?: { scopes: { scopeName: string }[] }[]; htmlStyle?: Record<string, string> }[];
    });
}

function prefixTokens(code: string): PrefixToken[] {
  return tokenise(code).map((t) => {
    const scopes = t.explanation?.[0]?.scopes.map((s) => s.scopeName) ?? [];
    return {
      d: t.htmlStyle?.["--shiki-dark"] ?? "#E1E4E8",
      k: kindFromScopes(scopes),
      l: t.htmlStyle?.color ?? "#24292E",
      t: t.content,
    };
  });
}

function completionTokens(code: string): CompletionToken[] {
  return tokenise(code).map((t) => ({
    k: kindFromScopes(t.explanation?.[0]?.scopes.map((s) => s.scopeName) ?? []),
    t: t.content,
  }));
}

const prefixes: Record<string, PrefixToken[]> = {};
const completions: Record<string, CompletionToken[]> = {};

for (const prompt of PROMPTS) {
  prefixes[prompt.id] = prefixTokens(prompt.prefix);
  for (const band of BANDS) {
    completions[`${prompt.id}:base:${band}`] = completionTokens(
      prompt.continuations[band]
    );
    completions[`${prompt.id}:instruct:${band}`] = completionTokens(
      prompt.instructAnswers[band]
    );
  }
}

const body = `// GENERATED by highlight/generate.ts — do not edit by hand.
// Regenerate with: bun run gen:era1-highlight
import type { CompletionToken, PrefixToken } from "./index";

export const SOURCE_FINGERPRINT = ${JSON.stringify(fingerprintSources(PROMPTS))};

export const PREFIX_TOKENS: Record<string, PrefixToken[]> = ${JSON.stringify(prefixes, null, 2)};

export const COMPLETION_TOKENS: Record<string, CompletionToken[]> = ${JSON.stringify(completions, null, 2)};
`;

writeFileSync(join(import.meta.dir, "tokens.generated.ts"), body);
process.stdout.write(
  `wrote ${Object.keys(prefixes).length} prefixes, ${Object.keys(completions).length} completions\n`
);
```

- [ ] **Step 3: Add the script**

In `apps/web/package.json`, add to `"scripts"`:

```json
"gen:era1-highlight": "bun run \"./app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/highlight/generate.ts\""
```

- [ ] **Step 4: Run the generator**

Run: `cd apps/web && bun run gen:era1-highlight`
Expected: `wrote 2 prefixes, 12 completions`, and `tokens.generated.ts` now exists.

- [ ] **Step 5: Verify the generated tokens reconstruct their sources exactly**

This is the load-bearing property — the character budget in `visibleTokens` is only safe if token text concatenates back to the original string. Run from `apps/web`:

```bash
bun -e '
const { COMPLETION_TOKENS, PREFIX_TOKENS } = await import("./app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/highlight/tokens.generated.ts");
const { PROMPTS } = await import("./app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/selector.ts");
let bad = 0;
for (const p of PROMPTS) {
  if (PREFIX_TOKENS[p.id].map(t=>t.t).join("") !== p.prefix) { bad++; console.log("PREFIX MISMATCH", p.id); }
  for (const b of ["low","mid","high"]) {
    if (COMPLETION_TOKENS[`${p.id}:base:${b}`].map(t=>t.t).join("") !== p.continuations[b]) { bad++; console.log("BASE MISMATCH", p.id, b); }
    if (COMPLETION_TOKENS[`${p.id}:instruct:${b}`].map(t=>t.t).join("") !== p.instructAnswers[b]) { bad++; console.log("INSTRUCT MISMATCH", p.id, b); }
  }
}
console.log(bad === 0 ? "all 14 strings reconstruct exactly" : `${bad} MISMATCHES`);
'
```
Expected: `all 14 strings reconstruct exactly`.

If any mismatch appears, the newline handling in `tokenise` is wrong — Shiki's `tokens` is a 2D array with newlines implicit between lines, and the generator reinserts them as their own tokens.

- [ ] **Step 6: Write the fingerprint test**

Create `highlight/fingerprint.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import { PROMPTS } from "../selector";
import { fingerprintSources } from "./index";
import {
  COMPLETION_TOKENS,
  PREFIX_TOKENS,
  SOURCE_FINGERPRINT,
} from "./tokens.generated";

describe("generated highlight tokens", () => {
  test("the committed tokens were generated from the current copy", () => {
    // If this fails, a prompt or completion changed and the tokens are stale.
    // Fix: cd apps/web && bun run gen:era1-highlight
    expect(fingerprintSources(PROMPTS)).toBe(SOURCE_FINGERPRINT);
  });

  test("every string the window can render has tokens", () => {
    for (const prompt of PROMPTS) {
      expect(PREFIX_TOKENS[prompt.id]).toBeDefined();
      for (const band of ["low", "mid", "high"]) {
        expect(COMPLETION_TOKENS[`${prompt.id}:base:${band}`]).toBeDefined();
        expect(COMPLETION_TOKENS[`${prompt.id}:instruct:${band}`]).toBeDefined();
      }
    }
  });

  test("tokens reconstruct their source exactly — the character budget depends on it", () => {
    for (const prompt of PROMPTS) {
      expect(PREFIX_TOKENS[prompt.id].map((t) => t.t).join("")).toBe(
        prompt.prefix
      );
      for (const band of ["low", "mid", "high"] as const) {
        expect(
          COMPLETION_TOKENS[`${prompt.id}:base:${band}`]
            .map((t) => t.t)
            .join("")
        ).toBe(prompt.continuations[band]);
        expect(
          COMPLETION_TOKENS[`${prompt.id}:instruct:${band}`]
            .map((t) => t.t)
            .join("")
        ).toBe(prompt.instructAnswers[band]);
      }
    }
  });
});
```

- [ ] **Step 7: Run the tests**

Run: `cd apps/web && bun test`
Expected: PASS. Count rises from 113 to **127** (11 from Task 1, 3 here).

- [ ] **Step 8: Prove the fingerprint actually catches drift**

Temporarily edit one character of any `instructAnswers.mid` string in `completions.ts`, then:

Run: `cd apps/web && bun test "./app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/highlight/fingerprint.test.ts"`
Expected: **FAIL** on "the committed tokens were generated from the current copy".

Revert the edit with `git checkout -- "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/completions.ts"` and re-run to confirm it passes again. A staleness guard that has never been seen to fail is not a guard.

- [ ] **Step 9: Typecheck, lint, commit**

Run: `cd apps/web && bun run typecheck` — expected clean.

```bash
bunx biome check --write "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/highlight/generate.ts" "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/highlight/fingerprint.test.ts" "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/highlight/index.ts" "apps/web/package.json"
```

**Do not lint `tokens.generated.ts`** — it is generated, and reformatting it would put the committed file out of step with what the generator writes.

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/highlight/" "apps/web/package.json"
git commit -m "$(cat <<'EOF'
feat(masterclass): tokenise the window's fourteen strings offline

Everything the output window can render is static and known: two prefixes and
twelve completions. Tokenising them at author time keeps Shiki out of the
browser, but the reason is correctness — highlighting a stream retokenises
incomplete code every frame, so colours would churn for 250 frames and settle
only at the end.

The generated file carries a fingerprint of its source strings. Regenerating
under test would cost 1-2s of grammar loading against a suite that runs in
milliseconds, and this repository has no CI to move that to, so the cheap check
guards the real hazard: copy edited without regenerating.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Render the two registers

Swap the console's two flat spans for two token lists.

**Files:**
- Modify: `apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/index.tsx`

**Interfaces:**
- Consumes: `completionClass`, `prefixIsComment`, `visibleTokens`, `PrefixToken`, `CompletionToken` from `./highlight` (Task 1); `COMPLETION_TOKENS`, `PREFIX_TOKENS` from `./highlight/tokens.generated` (Task 2).
- Produces: nothing new.

- [ ] **Step 1: Add the imports**

At the top of `index.tsx`, alongside the existing imports:

```tsx
import type { CSSProperties } from "react";
import {
  completionClass,
  prefixIsComment,
  visibleTokens,
} from "./highlight";
import { COMPLETION_TOKENS, PREFIX_TOKENS } from "./highlight/tokens.generated";
```

- [ ] **Step 2: Derive the token lists**

In the component body, immediately after the existing `const line = snap.verdict ?? "";`:

```tsx
  // Tokens are precomputed from the *finished* text and revealed by character
  // count, so the colours a token gets never change as it streams.
  //
  // The band comes from `lastRun`, never from the dial's current position.
  // Dragging the dial deliberately does not clear the output — the verdict
  // describes the run, not the slider — so after running at 1.5 and dragging
  // back to 0.7, `snap.output` still holds the high-band text. Keying off
  // `snap.temp` there would slice a *different* completion's tokens and render
  // text the machine never produced.
  const prefixTokens = PREFIX_TOKENS[prompt.id] ?? [];
  const runBand = snap.lastRun?.band ?? bandFor(snap.temp);
  const completionKey = `${snap.promptId}:${snap.mode}:${runBand}`;
  const shownTokens = visibleTokens(
    COMPLETION_TOKENS[completionKey] ?? [],
    snap.output.length
  );
```

`bandFor` is already imported in this file; it is only the fallback for when nothing has run yet, in which case `snap.output` is empty and the token list is unused.

`snap.promptId` and `snap.mode` are safe to read directly — changing either clears the output, so they cannot disagree with what was streamed. Only the dial can.

- [ ] **Step 3: Replace the two spans**

Find this block (currently at roughly `index.tsx:240`):

```tsx
              <span className="text-foreground">{prompt.prefix}</span>
              <span className="text-ht-cyan-700 dark:text-ht-cyan-300">
                {snap.output}
              </span>
```

Replace it with:

```tsx
              {prefixTokens.map((token, index) => (
                <span
                  className={
                    prefixIsComment(token.k)
                      ? "text-foreground/85 italic"
                      : "text-[var(--tl)] dark:text-[var(--td)]"
                  }
                  key={`p${index}`}
                  style={
                    { "--td": token.d, "--tl": token.l } as CSSProperties
                  }
                >
                  {token.t}
                </span>
              ))}
              {shownTokens.map((token, index) => (
                <span className={completionClass(token.k)} key={`c${index}`}>
                  {token.t}
                </span>
              ))}
```

Array-index keys are correct here: these lists are positional, never reordered, and the completion list only ever grows from the front.

- [ ] **Step 4: Typecheck and run the suite**

Run: `cd apps/web && bun run typecheck` — expected clean.
Run: `cd apps/web && bun test` — expected 127 pass / 0 fail, unchanged from Task 2.

- [ ] **Step 5: Lint**

```bash
bunx biome check --write "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/index.tsx"
```
Expected: clean, or only the pre-existing judgment-rule findings.

- [ ] **Step 6: Commit**

```bash
git add "apps/web/app/[locale]/learn/masterclass-28-07-2026/demos/era1-playground/index.tsx"
git commit -m "$(cat <<'EOF'
feat(masterclass): the window renders in two registers

The prefix now carries real theme colour and the completion carries one hue
with structure in weight, opacity and italics. The boundary the era depends on
is unchanged: everything cyan is still exactly what the machine wrote.

Comments in the prefix refuse the theme's grey. GitHub's #6e7781 is
mid-contrast by design and the question prompt is the one line the room reads
off a projector; italics say "comment" without the hue having to whisper.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Verify it on the wall

Unit tests cannot see colour, contrast, or whether the boundary still reads. This task produces a verification report, not a diff.

**Files:** none.

- [ ] **Step 1: Open the demo**

Reuse the dev server already running on port 3001 — do **not** start one. Drive Playwright or Chrome DevTools MCP to `http://localhost:3001/learn/masterclass-28-07-2026?step=completion`. Never `curl`.

- [ ] **Step 2: Confirm the boundary still reads**

Select `a half-written function`, press `Run`, and after the stream settles, sample the computed colour of every span inside the `<pre>`. Confirm:

1. Prefix spans carry **varied** colours (more than one distinct value).
2. Completion spans resolve to **one hue** — every one of them a cyan, differing only in alpha and font-weight.
3. There is a visible colour discontinuity at the join.

Capture the distinct colour sets for both halves and put the actual values in the report.

- [ ] **Step 3: Confirm nothing flickers**

Press `Run` again and sample the *class list* of the first three completion spans every 100ms during the stream. Each span's class must be stable from the moment it appears — a token that changes kind mid-stream is the flicker this design exists to prevent.

- [ ] **Step 4: Confirm the geometry did not move**

The `<pre>` has a fixed height and the `Run` button must not move. Sample the Run button's bounding box every 60ms through a full run and report the set of distinct positions. It must contain exactly one entry.

Also confirm the output panel's height still equals its pre-change value and that no completion now wraps to more lines than before — splitting text into spans can change wrapping if any span introduces whitespace it should not.

- [ ] **Step 5: Read the question prompt on both themes**

Switch to `a question`. Confirm the prefix comment renders legibly — not the theme's mid-grey — in **both** light and dark. Set the theme with `localStorage.setItem('theme', 'dark' | 'light')` and reload. Report the computed colour in each.

- [ ] **Step 6: Walk the beats that change the completion**

In presenter mode (`?presenter=1`), confirm highlighting survives every completion the window can show: beat ③ at both dial extremes, and beat ④ in post-trained. Four runs, each producing correctly-coloured output with the boundary intact.

- [ ] **Step 7: Prove the dial cannot desynchronise the tokens from the text**

The trap this design has to survive: dragging the dial does not clear the output, so the tokens must follow the *run*, not the slider.

At beat ③, set the dial to its maximum, `Run`, and let it settle. Then drag the dial back to `0.7` **without running again**. Confirm:

1. The visible text is unchanged — still the high-band completion.
2. The concatenated text of the completion spans still equals `snap.output` exactly. Compare the joined `textContent` of the completion spans against the high-band string from `completions.ts`.

If the text changes or the spans no longer reconstruct it, the key is being derived from `snap.temp` instead of `snap.lastRun.band`.

- [ ] **Step 8: Report**

Write up what you saw with the measured values. Name anything that flickered, moved, or lost the boundary. Do not claim the walk passed without performing every numbered step.

---

## Notes for the reviewer

**Test count trajectory:** 113 baseline → 124 (Task 1) → 127 (Task 2) → 127 (Task 3).

**The one property everything rests on:** token text must concatenate back to the exact source string. Task 2 Step 5 checks it by script and the fingerprint suite checks it as a test, because `visibleTokens` slices by character count and any drift silently corrupts every stream.

**Deliberately not done:** no line numbers, no copy button, no second language, and the instruct prose is tokenised as JavaScript on purpose — English lands as `plain`, and the embedded code line gets keyword treatment.
