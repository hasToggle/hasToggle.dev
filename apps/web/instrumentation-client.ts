import { initializeAnalytics } from "@repo/analytics/instrumentation-client";
import { initBotId } from "botid/client/core";
import { afterLoad } from "@/lib/after-load";
import { PROTECTED_ROUTES } from "@/lib/bot-protected";

initializeAnalytics();

/*
 * BotID is the exception to the rule below, and a cheap one: about 6 KB that
 * wraps `fetch` so a request to a protected route carries a solved
 * challenge. It has to be in place before the first such request, and it
 * fetches nothing until then: the challenge script loads when a visitor
 * submits one of the two forms, not when the page does.
 */
initBotId({ protect: PROTECTED_ROUTES });

/*
 * This file runs before hydration, so everything it imports statically sits
 * on the path to first paint. Sentry arrives as its own chunk instead, and
 * only once the page has loaded and gone idle: with it, about 100 KB of SDK
 * stopped competing with the page for the network and the main thread.
 * Errors thrown before then go unreported; that is the price of it.
 *
 * Without Session Replay: error reports carry the stack, the URL and the
 * breadcrumbs (clicks, navigations, fetches, console) leading up to them,
 * which is all these pages need, and the privacy policy promises a report
 * when something crashes, not a recording of the visit.
 *
 * Next inlines `NEXT_PUBLIC_*` at build time, so with no DSN the condition is
 * the constant `undefined` and none of this reaches the bundle.
 */
let sentry:
  | Promise<typeof import("@repo/observability/client-without-replay")>
  | undefined;

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  afterLoad(() => {
    sentry = import("@repo/observability/client-without-replay").then(
      (module) => {
        module.initializeSentryWithoutReplay();
        return module;
      }
    );
  });
}

export const onRouterTransitionStart = (
  href: string,
  navigationType: string
) => {
  sentry?.then((module) =>
    module.onRouterTransitionStart(href, navigationType)
  );
};
