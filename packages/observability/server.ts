/*
 * This file configures the initialization of Sentry on the server.
 * The config you add here will be used whenever the server handles a request.
 * https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import for proper initialization
import * as Sentry from "@sentry/nextjs";
import { keys } from "./keys";
import { CONSOLE_LOG_LEVELS, TRACES_SAMPLE_RATE } from "./sampling";
import { serverDefaults } from "./v10-defaults";

export const initializeSentry = (): ReturnType<typeof Sentry.init> =>
  Sentry.init({
    ...serverDefaults(),

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
    dsn: keys().NEXT_PUBLIC_SENTRY_DSN,

    // The console integration is what turns logging on; there is no flag.
    integrations: [
      // Send console.error and console.warn calls as logs to Sentry
      Sentry.consoleLoggingIntegration({ levels: CONSOLE_LOG_LEVELS }),
    ],

    tracesSampleRate: TRACES_SAMPLE_RATE,
  });
