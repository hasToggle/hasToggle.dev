import { keys as database } from "@repo/database/keys";
import { keys as email } from "@repo/email/keys";
import { keys as flags } from "@repo/feature-flags/keys";
import { keys as core } from "@repo/next-config/keys";
import { keys as observability } from "@repo/observability/keys";
import { keys as rateLimit } from "@repo/rate-limit/keys";
import { keys as security } from "@repo/security/keys";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  extends: [
    core(),
    database(),
    email(),
    observability(),
    flags(),
    security(),
    rateLimit(),
  ],
  server: {
    ABSTRACT_API_KEY: z.string().optional().default(""),
  },
  client: {},
  runtimeEnv: {
    ABSTRACT_API_KEY: process.env.ABSTRACT_API_KEY,
  },
});
