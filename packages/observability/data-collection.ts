/*
 * What error reports may carry, shared by the server, edge and browser
 * setups. v11 of the Sentry SDK collects cookies, request and response bodies
 * and user info unless told otherwise. The forms here carry email addresses
 * and messages, and the privacy policy promises a crash report, not those,
 * so this keeps v10's narrower set: the migration guide's baseline, plus
 * v10's 7 context lines.
 * https://github.com/getsentry/sentry-javascript/blob/develop/MIGRATION.md#if-you-want-to-keep-the-v10-default-behavior
 */

import type { BrowserOptions } from "@sentry/nextjs";

const SENSITIVE_KEYS = ["forwarded", "-ip", "remote-", "via", "-user"];

export const DATA_COLLECTION: BrowserOptions["dataCollection"] = {
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
