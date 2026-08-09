export interface StreamRowConfig {
  delayMs: number;
  label: string;
}

/**
 * Three pieces of "work" with honest price tags. The delays are artificial;
 * the streaming is not — each row is a Server Component that genuinely
 * finishes on the server after this many milliseconds and streams into the
 * page whenever it's ready.
 */
export const STREAM_ROWS: readonly StreamRowConfig[] = [
  { delayMs: 400, label: "a quick database query" },
  { delayMs: 1100, label: "a third-party API with opinions" },
  { delayMs: 1900, label: "the legacy service nobody dares rewrite" },
];
