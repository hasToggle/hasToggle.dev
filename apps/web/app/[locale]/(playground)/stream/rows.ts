export interface StreamRowConfig {
  delayMs: number;
  label: string;
  /** The label the response view's axis column wears — it has 7rem to work in. */
  short: string;
}

/**
 * Three pieces of "work" with honest price tags. The delays are artificial;
 * the streaming is not — each row is a Server Component that genuinely
 * finishes on the server after this many milliseconds and reaches the
 * browser whenever the boundary above it lets it through.
 */
export const STREAM_ROWS: readonly StreamRowConfig[] = [
  { delayMs: 400, label: "a quick database query", short: "database" },
  {
    delayMs: 1100,
    label: "a third-party API with opinions",
    short: "third-party api",
  },
  {
    delayMs: 1900,
    label: "the legacy service nobody dares rewrite",
    short: "legacy service",
  },
];

/** The cheapest row — the one the belief makes wait for everybody else. */
export const FASTEST_MS = Math.min(...STREAM_ROWS.map((row) => row.delayMs));

/** The slowest row — the price no arrangement can talk down. */
export const SLOWEST_MS = Math.max(...STREAM_ROWS.map((row) => row.delayMs));

/** What the fastest row spends waiting when one boundary holds all three. */
export const IDLE_MS = SLOWEST_MS - FASTEST_MS;

const AXIS_STEP_MS = 1000;

/**
 * The response view's axis top, rounded up to a whole second so the ticks
 * are numbers a reader can hold: 0 · 1s · 2s. Everything on the timeline is
 * measured against this, so it lives with the config it derives from.
 */
export const TIMELINE_MAX_MS =
  Math.ceil(SLOWEST_MS / AXIS_STEP_MS) * AXIS_STEP_MS;

/** Every whole second the axis has room for, the zero included. */
export const TIMELINE_TICKS_MS: readonly number[] = Array.from(
  { length: TIMELINE_MAX_MS / AXIS_STEP_MS + 1 },
  (_, index) => index * AXIS_STEP_MS
);

/** Where a millisecond reading sits on the track, as a percentage of it. */
export function trackPercent(ms: number): number {
  const clamped = Math.min(Math.max(ms, 0), TIMELINE_MAX_MS);
  return (clamped / TIMELINE_MAX_MS) * 100;
}
