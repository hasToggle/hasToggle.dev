// Bun test preload: mock the server-only sentinel package (which throws outside
// a server component context) and stub external service dependencies (database,
// email, observability) to avoid real network/DB calls in tests.
// ABSTRACT_API_KEY is intentionally empty so the deliverability API layer is
// bypassed in all tests (fail-open behavior).
import { mock } from "bun:test";

// Set process.env fallbacks for required env vars. Bun's mock.module does not
// reliably intercept dynamic imports using path aliases (@/env), so when the
// real env.ts loads transitively it needs valid values to pass t3-env validation.
process.env.MONGODB_URI ??= "mongodb://localhost:27017/test";
process.env.RESEND_FROM ??= "test@example.com";
process.env.RESEND_TOKEN ??= "re_test_token";
process.env.RESEND_SEGMENT_ID ??= "test-segment-id";
process.env.RESEND_WEBHOOK_SECRET ??= "whsec_dGVzdC1zZWNyZXQ=";
process.env.RECONCILE_SECRET ??= "test-reconcile-secret-that-is-long-enough";
process.env.NEXT_PUBLIC_APP_URL ??= "http://localhost:3000";
process.env.NEXT_PUBLIC_WEB_URL ??= "http://localhost:3001";
process.env.NEXT_PUBLIC_POSTHOG_HOST ??= "https://eu.i.posthog.com";
process.env.NEXT_PUBLIC_POSTHOG_KEY ??= "phc_test";

mock.module("server-only", () => ({}));

// Never a Redis limiter under test: Vercel injects the Upstash keys at
// build time, and the test task runs there before the build. Without this
// every test past a rate-limit check would call a real store.
mock.module("@repo/rate-limit/keys", () => ({
  keys: () => ({}),
}));

mock.module("@/env", () => ({
  env: {
    ABSTRACT_API_KEY: "",
    NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    NEXT_PUBLIC_WEB_URL: "http://localhost:3001",
    RECONCILE_SECRET: "test-reconcile-secret-that-is-long-enough",
    RESEND_FROM: "test@example.com",
    RESEND_SEGMENT_ID: "test-segment-id",
  },
}));

mock.module("@repo/database", () => ({
  createId: () => "test-id",
  database: {
    subscriber: {
      deleteMany: async () => ({ deletedCount: 0 }),
      deleteOne: async () => ({ deletedCount: 0 }),
      find: () => ({ toArray: async () => [] }),
      findOne: async () => null,
      updateOne: async () => ({}),
    },
  },
}));

mock.module("@repo/email", () => ({
  resend: {
    contacts: {
      create: async () => ({ data: { id: "contact-id" }, error: null }),
      list: async () => ({
        data: { data: [], has_more: false, object: "list" },
        error: null,
      }),
      remove: async () => ({ error: null }),
    },
    emails: { send: async () => ({ error: null }) },
    webhooks: {
      verify: () => {
        throw new Error("No signature");
      },
    },
  },
}));

mock.module("@repo/email/keys", () => ({
  keys: () => ({ RESEND_WEBHOOK_SECRET: "whsec_dGVzdC1zZWNyZXQ=" }),
}));

// Returns its props so a test can read what the mail was built from.
mock.module("@repo/email/templates/confirm-subscription", () => ({
  default: (props: Record<string, unknown>) => ({ props }),
}));

mock.module("@repo/email/templates/already-subscribed", () => ({
  default: () => null,
}));

mock.module("@repo/observability/error", () => ({
  parseError: () => undefined,
}));

mock.module("@repo/observability/log", () => ({
  log: { error: () => undefined, info: () => undefined, warn: () => undefined },
}));
