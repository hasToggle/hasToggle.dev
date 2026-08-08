export const COUNT_COOKIE = "playground-presses";
export const MAX_COUNT = 9999;

/**
 * A cookie is visitor-editable storage, so the value is parsed like it was
 * typed by a stranger — because it was. Anything that isn't a whole number
 * in range collapses to 0.
 */
const COUNT_PATTERN = /^\d{1,4}$/;

export function parseCount(raw: string | undefined): number {
  if (!(raw && COUNT_PATTERN.test(raw))) {
    return 0;
  }
  const parsed = Number.parseInt(raw, 10);
  return Math.min(parsed, MAX_COUNT);
}
