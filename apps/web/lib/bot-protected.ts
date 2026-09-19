/**
 * What BotID guards, read by both halves of it. The browser half
 * (instrumentation-client.ts) attaches a solved challenge to requests for
 * these routes; the server half (lib/bot-check.ts) verifies it. A route the
 * browser was not told about arrives without the challenge and fails the
 * check for everyone, so this list is the single place a route is added.
 *
 * Only requests this site's own pages make with `fetch` — a server action
 * is one, to the page's own path. A native form POST carries no challenge,
 * and neither does a mail client or a webhook, so /api/confirmed,
 * /api/unsubscribe, /api/webhooks/* and /api/reconcile must never be here.
 *
 * This file is imported before hydration. Keep it free of imports.
 */

/**
 * Pinned on both sides, because a mismatch fails the check. "basic" is free
 * and validates the challenge; "deepAnalysis" is Kasada's model, billed per
 * check, and loads a second script this site's CSP has not been tried with.
 */
export const BOT_CHECK_LEVEL = "basic" as const;

export const PROTECTED_ROUTES = [
  // The waitlist form.
  { method: "POST", path: "/api/confirm" },
  // The contact form's server action, which posts to its page.
  { method: "POST", path: "/contact" },
].map((route) => ({
  ...route,
  advancedOptions: { checkLevel: BOT_CHECK_LEVEL },
}));
