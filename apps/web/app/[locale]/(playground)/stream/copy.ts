/**
 * Every string the stream instrument shows, in the instrument register:
 * lowercase, middot-separated, real identifiers, no adjectives. The seams
 * are built from the same config the exhibit runs on, so a delay that
 * changes cannot leave a sentence behind claiming the old number.
 *
 * Prose strings carry typographic marks directly (voice.md §8); anything
 * quoting real code keeps straight quotes.
 */

import { FASTEST_MS, IDLE_MS, STREAM_ROWS } from "./rows";
import type { Strategy } from "./strategy";

/**
 * The seam under the specimen — the one fact each arrangement proves, in
 * three slots that stay in the same order across all three: the boundary,
 * the arrivals, what that bought.
 */
export const SEAMS: Record<Strategy, string> = {
  blocking: `one boundary, no fallback · three rows, one arrival · the ${FASTEST_MS} ms row idles ${IDLE_MS} ms`,
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
 * Deck step one: the arrangement the title describes. It carries no detail
 * line — the belief is its own explanation, and the seam under the specimen
 * already names the await.
 */
export const STEP_ONE_LABEL = "Fetch it all first";

/** Deck step two: the fallback everybody reaches for, under its real name. */
export const STEP_TWO_LABEL = "Add a fallback";
export const STEP_TWO_DETAIL = "= loading.tsx";

/** Deck step three: the boundary moved down to the slow parts. */
export const STEP_THREE_LABEL = "Wrap each part";
export const STEP_THREE_DETAIL = "<Suspense> per row";

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
