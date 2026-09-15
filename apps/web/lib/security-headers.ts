import { keys as analytics } from "@repo/analytics/keys";
import {
  type NoseconeOptions,
  nosecone,
  withVercelToolbar,
} from "@repo/security/middleware";

const isDevelopment = process.env.NODE_ENV === "development";

/**
 * PostHog talks to its API host directly (the `/ingest` rewrite in
 * next-config points at the US region and is not what the SDK is configured
 * with) and pulls its remote config and lazy modules from the matching
 * assets host — `eu.i.posthog.com` pairs with `eu-assets.i.posthog.com`,
 * the same substitution the SDK makes itself.
 */
type HttpsOrigin = `https://${string}.${string}`;

const isHttpsOrigin = (value: string): value is HttpsOrigin =>
  /^https:\/\/[^/]+\.[^/]+$/.test(value);

export function posthogOrigins(apiHost: string): HttpsOrigin[] {
  const { origin, hostname } = new URL(apiHost);
  const assets = origin.replace(
    hostname,
    hostname.replace(".i.", "-assets.i.")
  );
  const origins = assets === origin ? [origin] : [origin, assets];
  return origins.filter(isHttpsOrigin);
}

const posthog = posthogOrigins(analytics().NEXT_PUBLIC_POSTHOG_HOST);

/**
 * The site's Content Security Policy, written out in full rather than
 * derived from nosecone's Next.js defaults. Those defaults mint a nonce per
 * request, and a nonce only reaches scripts on dynamically rendered pages —
 * this site prerenders its shells with Cache Components, so a nonce would
 * leave every inline bootstrap script blocked. `'unsafe-inline'` is the
 * price of a static shell; the policy still pins script origins, forbids
 * framing and plugins, and keeps forms and `<base>` on this origin.
 *
 * Third parties that need an allowance:
 * - Google Analytics via `@next/third-parties` (script, beacon, pixel).
 * - PostHog's API and assets hosts, derived from the configured host.
 * - `picsum.photos`, the one remote image host in next.config.
 * Sentry goes through the `/monitoring` tunnel and Vercel Analytics through
 * `/_vercel`, so both are same-origin. The Vercel toolbar (preview and local
 * only) is widened in by `withVercelToolbar` where it renders.
 */
const directives: Extract<
  NoseconeOptions["contentSecurityPolicy"],
  object
>["directives"] = {
  baseUri: ["'none'"],
  childSrc: ["'none'"],
  connectSrc: [
    "'self'",
    ...posthog,
    "https://*.google-analytics.com",
    "https://*.analytics.google.com",
    "https://*.googletagmanager.com",
  ] as const,
  defaultSrc: ["'self'"],
  fontSrc: ["'self'"],
  formAction: ["'self'"],
  frameAncestors: ["'none'"],
  frameSrc: ["'none'"],
  imgSrc: [
    "'self'",
    "blob:",
    "data:",
    "https://picsum.photos",
    "https://*.google-analytics.com",
    "https://*.googletagmanager.com",
  ],
  manifestSrc: ["'self'"],
  mediaSrc: ["'self'"],
  objectSrc: ["'none'"],
  scriptSrc: [
    "'self'",
    "'unsafe-inline'",
    ...posthog,
    "https://*.googletagmanager.com",
    // Turbopack's dev runtime evaluates source maps and HMR updates.
    ...(isDevelopment ? ["'unsafe-eval'" as const] : []),
  ] as const,
  styleSrc: ["'self'", "'unsafe-inline'"],
  workerSrc: ["'self'", "blob:"],
};

export const securityOptions: NoseconeOptions = {
  contentSecurityPolicy: { directives },
  // `require-corp` would refuse the analytics script and any remote image
  // that does not send Cross-Origin-Resource-Policy; nothing here needs
  // the cross-origin isolation it buys.
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "same-origin" },
  originAgentCluster: true,
  // Outbound links (GitHub, the Next.js docs) get the origin, never the path.
  referrerPolicy: { policy: ["strict-origin-when-cross-origin"] },
  strictTransportSecurity: {
    includeSubDomains: true,
    maxAge: 63_072_000,
    preload: false,
  },
  xContentTypeOptions: true,
  xDnsPrefetchControl: { allow: false },
  xDownloadOptions: true,
  xFrameOptions: { action: "deny" },
  xPermittedCrossDomainPolicies: { permittedPolicies: "none" },
  xXssProtection: true,
};

export const securityOptionsWithToolbar: NoseconeOptions =
  withVercelToolbar(securityOptions);

/**
 * Copies every security header onto `response`, whatever produced it. The
 * proxy chain (i18n rewrite, Arcjet) always returns a response of its own,
 * so the headers have to be merged in rather than returned as an alternative.
 */
export function withSecurityHeaders<T extends Response>(
  response: T,
  headers: Headers
): T {
  headers.forEach((value, key) => {
    response.headers.set(key, value);
  });
  return response;
}

export const securityHeaders = (options: NoseconeOptions): Headers =>
  nosecone(options);
