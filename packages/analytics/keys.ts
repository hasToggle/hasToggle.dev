import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    client: {
      NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().startsWith("G-").optional(),
      NEXT_PUBLIC_POSTHOG_HOST: z.url(),
      NEXT_PUBLIC_POSTHOG_KEY: z.string().startsWith("phc_"),
      /*
       * Set to "true" only once Web Analytics is enabled for the project in
       * the Vercel dashboard. The script lives at /_vercel/insights/script.js,
       * a path the platform serves only for provisioned projects, so rendering
       * the tag without it is a guaranteed 404.
       */
      NEXT_PUBLIC_VERCEL_ANALYTICS: z.literal("true").optional(),
    },
    runtimeEnv: {
      NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
      NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
      NEXT_PUBLIC_VERCEL_ANALYTICS: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS,
    },
  });
