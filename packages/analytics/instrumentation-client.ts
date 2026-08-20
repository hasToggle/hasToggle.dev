import { keys } from "./keys";

/*
 * PostHog used to be a static import in this file. Next.js bundles
 * instrumentation-client into a chunk it runs *before* hydration, so that put
 * roughly 315 KB of analytics on the critical path: the browser downloaded,
 * parsed and executed the whole SDK — which then fetched surveys, web-vitals
 * and dead-click autocapture from PostHog's CDN — before the page could paint
 * its main content or respond to input.
 *
 * Nothing in the SDK needs to run that early. A `$pageview` is captured
 * relative to `init`, not to navigation start, so deferring init past the
 * `load` event keeps the same events while taking the bytes out of the path
 * that first paint and interactivity share. The only thing lost is a visit
 * that ends before `load` fires, which would not have reached the network
 * either way.
 */

const startPostHog = async () => {
  const { default: posthog } = await import("posthog-js");

  posthog.init(keys().NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: keys().NEXT_PUBLIC_POSTHOG_HOST,
    defaults: "2025-05-24",
  });
};

// Idle if the browser offers it, next tick otherwise. The timeout stops the
// callback being starved indefinitely on a page that never goes quiet.
const whenIdle = (task: () => void) => {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(task, { timeout: 3000 });
    return;
  }
  window.setTimeout(task, 1);
};

export const initializeAnalytics = () => {
  if (typeof window === "undefined") {
    return;
  }

  if (document.readyState === "complete") {
    whenIdle(startPostHog);
    return;
  }

  window.addEventListener("load", () => whenIdle(startPostHog), { once: true });
};
