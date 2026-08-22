import { STREAM_ROWS } from "./rows";

/**
 * The stream chapter's reading on the contents page: the three honest
 * price tags, derived from the same config the exhibit runs.
 */
export function StreamIndexValue() {
  return (
    <span>{STREAM_ROWS.map((row) => `${row.delayMs}ms`).join(" · ")}</span>
  );
}
