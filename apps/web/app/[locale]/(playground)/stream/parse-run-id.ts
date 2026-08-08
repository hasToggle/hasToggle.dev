export const MAX_RUN_ID = 999;

/**
 * The `?stream=` search param is visitor input, so it gets the visitor-input
 * treatment: anything that isn't a whole number between 0 and MAX_RUN_ID
 * becomes 0. The run id only exists to give the Suspense boundaries a fresh
 * React key per run — its value never reaches anything sensitive.
 */
const RUN_ID_PATTERN = /^\d{1,3}$/;

export function parseRunId(raw: string | undefined): number {
  if (!raw) {
    return 0;
  }
  if (!RUN_ID_PATTERN.test(raw)) {
    return 0;
  }
  const parsed = Number.parseInt(raw, 10);
  return Math.min(parsed, MAX_RUN_ID);
}
