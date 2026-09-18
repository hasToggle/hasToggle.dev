/**
 * Hands a caught render error to Sentry, loading the SDK only when there is a
 * DSN to report to. The error boundaries are part of every page's initial
 * bundle, so a static `@sentry/nextjs` import there shipped the SDK's core to
 * every visitor even with Sentry switched off. Next inlines `NEXT_PUBLIC_*` at
 * build time, which turns the check into a constant and drops the import.
 */
export const reportRenderError = (error: Error) => {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return;
  }

  import("@sentry/nextjs").then(({ captureException }) =>
    captureException(error)
  );
};
