"use server";

import { resend } from "@repo/email";
import ContactTemplate from "@repo/email/templates/contact";
import { parseError } from "@repo/observability/error";
import { headers } from "next/headers";
import { env } from "@/env";
import { looksAutomated } from "@/lib/bot-check";
import { clientIp, rateLimiter } from "@/lib/rate-limit";
import { parseContact } from "./schema";

interface ContactState {
  error?: string;
  success?: boolean;
}

// A person writes once, maybe twice with a correction. Three an hour per
// caller leaves room for that and not for a loop.
const PER_CALLER = { limit: 3, ms: 1000 * 60 * 60 };

const MESSAGES = {
  invalid: "Check the three fields: a name, an address that works, a message.",
  limited:
    "That inbox has heard from you a few times already. Try again in an hour.",
  sendFailed:
    "The message didn’t go out. Try again, or write to the address in the footer.",
};

export const contact = async (
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> => {
  const input = parseContact(formData);
  if (!input) {
    return { error: MESSAGES.invalid };
  }

  // The same line a failed send gets: it tells a person wrongly refused
  // where else to write, and tells a script nothing.
  if (await looksAutomated()) {
    return { error: MESSAGES.sendFailed };
  }

  try {
    const ip = clientIp(await headers());
    if (ip) {
      const limiter = await rateLimiter("contact", PER_CALLER);
      const { success } = await limiter.limit(ip);
      if (!success) {
        return { error: MESSAGES.limited };
      }
    }

    const { error } = await resend.emails.send({
      from: env.RESEND_FROM,
      react: (
        <ContactTemplate
          email={input.email}
          message={input.message}
          name={input.name}
          sentAt={new Date()}
        />
      ),
      replyTo: input.email,
      subject: `Contact form: ${input.name}`,
      to: env.RESEND_FROM,
    });

    if (error) {
      // Logged and reported with the provider's wording; the visitor gets
      // a fixed line rather than an API message.
      parseError(error);
      return { error: MESSAGES.sendFailed };
    }

    return { success: true };
  } catch (error) {
    parseError(error);
    return { error: MESSAGES.sendFailed };
  }
};
