/**
 * Hands a caught render error to Sentry, loading the SDK only when there is a
 * DSN to report to. The error boundaries are part of every page's initial
 * bundle, so a static `@sentry/nextjs` import there shipped the SDK's core to
 * every visitor even with Sentry switched off. Next inlines `NEXT_PUBLIC_*` at
 * build time, which turns the check into a constant and drops the import.
 *
 * It goes through the same module instrumentation-client loads, so the SDK
 * is fetched once and Replay stays out; initializing is idempotent, which
 * covers an error thrown before the deferred start.
 */
export const reportRenderError = (error: Error) => {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return;
  }

  import("@repo/observability/client-without-replay").then((sentry) => {
    sentry.initializeSentryWithoutReplay();
    sentry.captureException(error);
  });
};
