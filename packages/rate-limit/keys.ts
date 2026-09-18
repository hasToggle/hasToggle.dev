import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    // The Upstash integration on the Vercel Marketplace writes the KV_*
    // names; a store created in the Upstash console writes the UPSTASH_*
    // ones. `Redis.fromEnv()` accepts both, and so does this.
    runtimeEnv: {
      UPSTASH_REDIS_REST_TOKEN:
        process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN,
      UPSTASH_REDIS_REST_URL:
        process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL,
    },
    server: {
      UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
      UPSTASH_REDIS_REST_URL: z.url().optional(),
    },
  });
