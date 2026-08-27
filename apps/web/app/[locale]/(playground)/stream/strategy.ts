/**
 * The three arrangements the deck walks. Same three data calls every time —
 * what moves is the Suspense boundary around them, which is the only thing
 * this chapter is about.
 *
 * The value rides in `?mode=`, so pressing a step is a real navigation and
 * the server genuinely re-renders in the new shape. Nothing here is a
 * client-side impression of a server that behaved differently.
 */
export type Strategy = "blocking" | "loading" | "parts";

/** Execution order, which is also deck order, left to right. */
export const STRATEGY_ORDER: readonly Strategy[] = [
  "blocking",
  "loading",
  "parts",
];

/** The belief's arrangement — where a visitor with no params starts. */
export const DEFAULT_STRATEGY: Strategy = "blocking";

function isStrategy(raw: string): raw is Strategy {
  return (STRATEGY_ORDER as readonly string[]).includes(raw);
}

/**
 * `?mode=` is visitor input, so it gets the visitor-input treatment:
 * anything that isn't one of the three arrangements starts at the belief.
 */
export function parseStrategy(raw: string | undefined): Strategy {
  if (raw && isStrategy(raw)) {
    return raw;
  }
  return DEFAULT_STRATEGY;
}

/** Each arrangement's one legal successor — the walk is a sequence. */
export function nextStrategy(current: Strategy): Strategy | undefined {
  return STRATEGY_ORDER[STRATEGY_ORDER.indexOf(current) + 1];
}

/** Whether `candidate` comes before `current` in the walk. */
export function isSpent(candidate: Strategy, current: Strategy): boolean {
  return STRATEGY_ORDER.indexOf(candidate) < STRATEGY_ORDER.indexOf(current);
}
