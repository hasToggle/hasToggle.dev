import { FASTEST_MS, SLOWEST_MS } from "./rows";

/**
 * The stream chapter's reading on the contents page: the price of the work,
 * and the price of the first row — the two numbers the chapter spends its
 * whole run pulling apart.
 */
export function StreamIndexValue() {
  return (
    <span>{`${SLOWEST_MS} ms of work · ${FASTEST_MS} ms to the first row`}</span>
  );
}
