/*
 * This file configures the initialization of Sentry on the client.
 * The config you add here will be used whenever a users loads a page in their browser.
 * https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import for proper initialization
import * as Sentry from "@sentry/nextjs";
import { baseOptions, consoleLogging } from "./client-options";

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

export const initializeSentry = (): ReturnType<typeof Sentry.init> =>
  Sentry.init({
    ...baseOptions(),

    // You can remove this option if you're not planning to use the Sentry Session Replay feature:
    integrations: [
      Sentry.replayIntegration({
        blockAllMedia: true,
        // Additional Replay configuration goes in here, for example:
        maskAllText: true,
      }),
      consoleLogging(),
    ],

    replaysOnErrorSampleRate: 1,

    /*
     * This sets the sample rate to be 10%. You may want this to be 100% while
     * in development and sample at a lower rate in production
     */
    replaysSessionSampleRate: 0.1,
  });
