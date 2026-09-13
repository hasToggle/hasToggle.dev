/**
 * Every string the stream instrument shows, in the instrument register:
 * lowercase, middot-separated, real identifiers. The seams quote no
 * measurement: every number is already on the rows, twice each, and a seam
 * that repeated one would go stale the day a delay changed.
 *
 * Prose strings carry typographic marks directly (voice.md §8); anything
 * quoting real code keeps straight quotes.
 */

import { STREAM_ROWS } from "./rows";
import type { Strategy } from "./strategy";

/**
 * The seam under the specimen — the one fact each arrangement proves, in
 * three slots that stay in the same order across all three: the boundary,
 * the arrivals, what that bought.
 */
export const SEAMS: Record<Strategy, string> = {
  blocking:
    "one boundary, no fallback · three rows, one arrival · the fastest has to wait for the slowest",
  loading:
    "one boundary, one fallback · three rows, one arrival · a placeholder from +0 instead of a blank",
  parts: "a boundary per row · three arrivals · each row waits only for itself",
};

/** What the first chunk carried — the response view's opening bar. */
export const SHELL_CHUNK: Record<Strategy, string> = {
  blocking: "nothing to show",
  loading: "1 placeholder",
  parts: `${STREAM_ROWS.length} placeholders`,
};

/**
 * The three arrangements, as the developer's own acts of placing the
 * boundary. Peers on a segmented control, any order — the seam under the
 * specimen names what each one costs or buys.
 */
export const ARRANGEMENT_LABELS: Record<Strategy, string> = {
  blocking: "Await everything",
  loading: "Add a fallback",
  parts: "Wrap each part",
};

/** The detail under two of them: the real name of the thing. */
export const ARRANGEMENT_DETAILS: Partial<Record<Strategy, string>> = {
  loading: "= loading.tsx",
  parts: "<Suspense> per row",
};

/** The deck's one action: the same arrangement, streamed again. */
export const RUN_AGAIN_LABEL = "Run again";

/** Chrome, top-right: the cause view — the same run, as the server sent it. */
export const VIEW_LABEL = "response";

/** The response view's first row: the chunk that arrived before any work. */
export const SHELL_ROW_LABEL = "shell";

/** A row that has landed: the price it quoted, and when it reached you. */
export function rowLanded(delayMs: number, landedMs: number): string {
  return `takes ${delayMs} ms · landed +${landedMs} ms`;
}

/** A row still behind its boundary: the price is known, the arrival isn't. */
export function rowPending(delayMs: number): string {
  return `takes ${delayMs} ms · in flight`;
}

/** The group fallback, which stands in for all three at once. */
export const GROUP_PENDING = `all ${STREAM_ROWS.length} · in flight`;

/** The bar's own reading in the response view. */
export function barLanded(landedMs: number): string {
  return `+${landedMs} ms`;
}

/** The pending bar's reading — a track that can't measure yet. */
export const BAR_PENDING = "in flight";

/** The group fallback's bar label: one boundary standing in for all of them. */
export const GROUP_BAR_LABEL = `all ${STREAM_ROWS.length} rows`;
