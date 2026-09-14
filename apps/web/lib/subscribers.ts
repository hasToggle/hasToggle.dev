import { database } from "@repo/database";
import { resend } from "@repo/email";
import { parseError } from "@repo/observability/error";

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
export async function removeSubscriber(email: string): Promise<void> {
  const [, contact] = await Promise.all([
    database.subscriber.deleteOne({ email }),
    resend.contacts.remove({ email }),
  ]);

  if (contact.error && contact.error.name !== "not_found") {
    parseError(contact.error);
  }
}
