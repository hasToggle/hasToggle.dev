export const DEFAULT_OG_TITLE =
  "The unofficial live playground for Next.js & Vercel";
export const MAX_TITLE_LENGTH = 70;

/**
 * The `?title=` query param goes straight into a rendered image, so it gets
 * trimmed, stripped of control characters, and clamped to a length that
 * still fits at 1200x630. Empty or absent input falls back to the site line
 * rather than an empty card.
 */
export function clampTitle(raw: string | null | undefined): string {
  if (!raw) {
    return DEFAULT_OG_TITLE;
  }
  const cleaned = raw.replaceAll(/[\p{Cc}\p{Cf}]/gu, "").trim();
  if (!cleaned) {
    return DEFAULT_OG_TITLE;
  }
  if (cleaned.length <= MAX_TITLE_LENGTH) {
    return cleaned;
  }
  return `${cleaned.slice(0, MAX_TITLE_LENGTH - 1).trimEnd()}…`;
}
