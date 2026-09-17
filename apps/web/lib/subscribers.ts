import { database } from "@repo/database";
import { resend } from "@repo/email";
import { EMAIL_COLLATION, normalizeEmail } from "./email-validation";

/**
 * The privacy policy's promise: an unsubscribed address is deleted, not
 * parked. Resend's own unsubscribe only flips `unsubscribed` on the
 * contact, so every exit — the broadcast link, a bounce, a complaint, a
 * dashboard deletion — funnels through here and empties both stores.
 *
 * Idempotent on purpose: the webhook that reports Resend's flag and the
 * reconciliation pass that sweeps for it will both call this for the same
 * address. A contact that is already gone is not an error.
 */
export async function removeSubscriber(rawEmail: string): Promise<void> {
  const email = normalizeEmail(rawEmail);

  // An erasure takes every row the address can be holding: the normalized
  // one and any legacy casing, which only the index's collation can see.
  const [, contact] = await Promise.all([
    database.subscriber.deleteMany({ email }, { collation: EMAIL_COLLATION }),
    resend.contacts.remove({ email }),
  ]);

  // Any other refusal — a rate limit, an outage — must surface as a failure:
  // the webhook answers 500 so Resend retries, and the reconciliation run
  // reports what it could not finish instead of counting it as done.
  if (contact.error && contact.error.name !== "not_found") {
    throw new Error(`Removing the contact failed: ${contact.error.message}`, {
      cause: contact.error,
    });
  }
}
