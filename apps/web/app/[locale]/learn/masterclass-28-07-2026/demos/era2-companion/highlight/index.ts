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
