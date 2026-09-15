import { database } from "@repo/database";
import { resend } from "@repo/email";
import { parseError } from "@repo/observability/error";
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

  if (contact.error && contact.error.name !== "not_found") {
    parseError(contact.error);
  }
}
