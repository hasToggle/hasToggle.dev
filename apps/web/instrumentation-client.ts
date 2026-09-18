import { initializeAnalytics } from "@repo/analytics/instrumentation-client";

initializeAnalytics();

/*
 * This file runs before hydration, so everything it imports statically sits
 * on the path to first paint. Sentry's browser SDK (with Replay) is about
 * 300 KB of it, and this site has no DSN in production — the SDK downloaded,
 * parsed and ran only to do nothing.
 *
 * Next inlines `NEXT_PUBLIC_*` at build time, so with no DSN the condition is
 * the constant `undefined` and the import is dropped from the bundle. With a
 * DSN, Sentry arrives as its own chunk instead of blocking hydration; errors
 * thrown before it lands go uncaptured, which is the price of that.
 */
const sentry = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? import("@repo/observability/client").then((module) => {
      module.initializeSentry();
      return module;
    })
  : undefined;

export const onRouterTransitionStart = (
  href: string,
  navigationType: string
) => {
  sentry?.then((module) =>
    module.onRouterTransitionStart(href, navigationType)
  );
};
