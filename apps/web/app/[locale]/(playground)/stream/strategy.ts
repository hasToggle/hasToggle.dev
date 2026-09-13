/**
 * The three arrangements the reader can choose between. Same three data
 * calls every time — what moves is the Suspense boundary around them, which
 * is the only thing this chapter is about.
 *
 * The value rides in `?mode=`, so choosing one is a real navigation and the
 * server genuinely re-renders in the new shape. Nothing here is a
 * client-side impression of a server that behaved differently.
 */
export type Strategy = "blocking" | "loading" | "parts";

/** Display order, left to right: least to most streaming. */
export const STRATEGY_ORDER: readonly Strategy[] = [
  "blocking",
  "loading",
  "parts",
];

/**
 * Where a visitor with no params starts: the arrangement the title
 * describes, so the first thing seen is the page not waiting. The other two
 * are the comparison.
 */
export const DEFAULT_STRATEGY: Strategy = "parts";

function isStrategy(raw: string): raw is Strategy {
  return (STRATEGY_ORDER as readonly string[]).includes(raw);
}

/**
 * `?mode=` is visitor input, so it gets the visitor-input treatment:
 * anything that isn't one of the three arrangements falls back to the default.
 */
export function parseStrategy(raw: string | undefined): Strategy {
  if (raw && isStrategy(raw)) {
    return raw;
  }
  return DEFAULT_STRATEGY;
}
