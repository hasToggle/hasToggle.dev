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
 *
 * This function feeds two committed token files — `era1-playground/highlight/`
 * and `era2-companion/highlight/`. Changing it invalidates both, and Era I
 * reads the resulting `k` values to pick colours, so a change here can send
 * Era I's colours wrong with a fully green test suite. The same is true of
 * each generator's `THEME` constant. No test catches this drift — after
 * editing either, re-run every generator.
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
