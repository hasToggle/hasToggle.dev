/**
 * Where email images are loaded from.
 *
 * An inbox fetches images on its own, long after the request that sent the
 * mail. That request's origin is only reachable from an inbox in production:
 * localhost is not, and preview deployments sit behind Vercel Authentication
 * (every host except the custom domains). The apex domain also 308s to www,
 * which not every client follows. So images always come from the canonical
 * public origin, whatever origin the signup arrived on.
 */
export const PUBLIC_ORIGIN = "https://www.hastoggle.dev";

export const assetUrl = (path: string) => `${PUBLIC_ORIGIN}/${path}`;
