import { initializeAnalytics } from "@repo/analytics/instrumentation-client";
import { initializeSentry } from "@repo/observability/client";
import { captureRouterTransitionStart } from "@sentry/nextjs";

initializeSentry();
initializeAnalytics();

export const onRouterTransitionStart = captureRouterTransitionStart;
