/*
 * Defaults v11 of the Sentry SDK changed without a type error, pinned back
 * to what v10 did. Every Sentry.init here spreads these in.
 * https://github.com/getsentry/sentry-javascript/blob/develop/MIGRATION.md#upgrading-from-10x-to-11x
 *
 * What stays on the v11 default, and why, is in the commit that added this
 * file.
 */

import type * as Sentry from "@sentry/nextjs";

type Options = Pick<Sentry.BrowserOptions, "dataCollection" | "environment">;

const SENSITIVE_KEYS = ["forwarded", "-ip", "remote-", "via", "-user"];

/*
 * v11 collects cookies, request and response bodies and user info unless told
 * otherwise. The forms here carry email addresses and messages, and the
 * privacy policy promises a crash report, not those, so this keeps v10's
 * narrower set: the migration guide's baseline, plus v10's 7 context lines.
 */
const dataCollection: Sentry.BrowserOptions["dataCollection"] = {
  cookies: false,
  databaseQueryData: false,
  frameContextLines: 7,
  genAI: { inputs: false, outputs: false },
  graphQL: { document: false, variables: false },
  httpBodies: [],
  httpHeaders: {
    request: { deny: SENSITIVE_KEYS },
    response: { deny: SENSITIVE_KEYS },
  },
  queues: false,
  urlQueryParams: { deny: SENSITIVE_KEYS },
  userInfo: false,
};

/*
 * v10 named Vercel environments `vercel-production` and `vercel-preview`; v11
 * drops the prefix. Events already in Sentry carry the old names, so keep
 * them. SENTRY_ENVIRONMENT still wins, and off Vercel this stays undefined
 * and the SDK falls back to NODE_ENV as before.
 */
const environment = (vercelEnv: string | undefined): string | undefined =>
  process.env.SENTRY_ENVIRONMENT ||
  (vercelEnv ? `vercel-${vercelEnv}` : undefined);

// Server and edge read the runtime variable.
export const serverDefaults = (): Options => ({
  dataCollection,
  environment: environment(process.env.VERCEL_ENV),
});

// The browser reads the copy Next inlines at build time, spelled out in full
// so the inlining finds it.
export const clientDefaults = (): Options => ({
  dataCollection,
  environment: environment(process.env.NEXT_PUBLIC_VERCEL_ENV),
});
