// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import for proper initialization
import * as Sentry from "@sentry/nextjs";
import { baseOptions } from "./client-options";

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

let initialized = false;

/**
 * Error reporting without Session Replay. Replay records the page (DOM,
 * clicks, scrolls) for a share of all visits and buffers every visit in case
 * of an error — about 100 KB of SDK and a recording no crash report needs.
 * Its own module rather than a flag or a second export of client.ts: a
 * dynamic `import()` keeps every export of the module it loads, so Replay
 * would ride along with any file that also defines it.
 *
 * Idempotent, so an error boundary can call it before the deferred start.
 */
export const initializeSentryWithoutReplay = (): void => {
  if (initialized) {
    return;
  }
  initialized = true;
  Sentry.init(baseOptions());
};

export const captureException = Sentry.captureException;
