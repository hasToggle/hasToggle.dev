import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    runtimeEnv: {
      RESEND_FROM: process.env.RESEND_FROM,
      RESEND_SEGMENT_ID: process.env.RESEND_SEGMENT_ID,
      RESEND_TOKEN: process.env.RESEND_TOKEN,
      RESEND_WEBHOOK_SECRET: process.env.RESEND_WEBHOOK_SECRET,
    },
    server: {
      RESEND_FROM: z.string().email(),
      // The waitlist segment. Resend renamed audiences to segments; an
      // existing audience id is valid here unchanged.
      RESEND_SEGMENT_ID: z.string().min(1),
      RESEND_TOKEN: z.string().startsWith("re_"),
      // Signing secret of the webhook that reports unsubscribes, bounces and
      // complaints back to /api/webhooks/resend.
      RESEND_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
    },
  });
