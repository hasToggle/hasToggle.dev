import { captureRequestError } from "@sentry/nextjs";

export const initializeSentry = async () => {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initializeSentry: initServer } = await import("./server");
    initServer();
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    const { initializeSentry: initEdge } = await import("./edge");
    initEdge();
  }
};

/*
 * Next hands every error its server catches — a Server Component render, a
 * route handler, a Server Action, the proxy — to the `onRequestError` an
 * app's instrumentation.ts exports. Without it only errors the code caught
 * itself (parseError) and the browser's own reach Sentry.
 */
export const onRequestError = captureRequestError;
