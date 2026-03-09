import { mock } from "bun:test";

mock.module("server-only", () => ({}));

mock.module("@/env", () => ({
  env: {
    ABSTRACT_API_KEY: "",
    RESEND_FROM: "test@example.com",
    NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    NEXT_PUBLIC_WEB_URL: "http://localhost:3001",
  },
}));

mock.module("@repo/database", () => ({
  database: { subscriber: { updateOne: async () => ({}) } },
  createId: () => "test-id",
}));

mock.module("@repo/email", () => ({
  resend: { emails: { send: async () => ({ error: null }) } },
}));

mock.module("@repo/email/templates/confirm-subscription", () => ({
  ConfirmSubscription: () => null,
}));

mock.module("@repo/observability/error", () => ({
  parseError: () => undefined,
}));
