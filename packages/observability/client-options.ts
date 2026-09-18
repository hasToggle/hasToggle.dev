/*
 * The browser options every client Sentry setup shares. Nothing here may
 * reference Session Replay: client-without-replay.ts builds on this module,
 * and whatever it reaches ends up in that bundle.
 */

// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import for proper initialization
import * as Sentry from "@sentry/nextjs";
import { CONSOLE_LOG_LEVELS, TRACES_SAMPLE_RATE } from "./sampling";

// Send console.error and console.warn calls as logs to Sentry
export const consoleLogging = (): ReturnType<
  typeof Sentry.consoleLoggingIntegration
> => Sentry.consoleLoggingIntegration({ levels: CONSOLE_LOG_LEVELS });

export const baseOptions = (): Sentry.BrowserOptions => ({
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Read directly rather than through `keys()`: Next inlines NEXT_PUBLIC_*
  // at build time, and `keys()` would bundle zod into the browser just to
  // re-check a constant. Apps validate it server-side via their env.ts.
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Enable logging
  enableLogs: true,

  integrations: [consoleLogging()],

  tracesSampleRate: TRACES_SAMPLE_RATE,
});
