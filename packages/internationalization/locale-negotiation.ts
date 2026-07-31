import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

/**
 * Negotiator yields the wildcard `"*"` when a client sends no
 * `Accept-Language` at all (curl, uptime monitors, link unfurlers), and passes
 * malformed tags such as `en_US` through verbatim. `matchLocale` validates via
 * `Intl.getCanonicalLocales` and throws `RangeError` on both, which surfaces as
 * a 500 on every route through the proxy. Keeping only canonicalizable tags
 * preserves any real preference in the header while dropping the rest.
 */
const canonicalizableTags = (tags: string[]) =>
  tags.filter((tag) => {
    try {
      Intl.getCanonicalLocales(tag);
      return true;
    } catch {
      return false;
    }
  });

export const resolveLocale = (
  headers: Record<string, string>,
  locales: string[],
  defaultLocale: string
) => {
  const accepted = new Negotiator({ headers }).languages();
  return matchLocale(canonicalizableTags(accepted), locales, defaultLocale);
};
