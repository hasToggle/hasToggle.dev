import { resend, type WebhookEventPayload } from "@repo/email";
import { keys } from "@repo/email/keys";
import { parseError } from "@repo/observability/error";
import { type NextRequest, NextResponse } from "next/server";
import { removeSubscriber } from "@/lib/subscribers";

/**
 * Resend reports list exits here. Broadcasts carry Resend's own unsubscribe
 * link, which marks the contact `unsubscribed` rather than deleting it —
 * this route turns that flag into the deletion the privacy policy promises.
 * Hard bounces and spam complaints leave the list the same way: Resend
 * suppresses them on its side, and the address must not linger on ours.
 *
 * Resend retries undelivered webhooks for about a day; the reconciliation
 * endpoint covers anything that slips past that.
 */
function emailsLeaving(event: WebhookEventPayload): string[] {
  switch (event.type) {
    case "contact.updated":
      return event.data.unsubscribed ? [event.data.email] : [];
    case "contact.deleted":
      return [event.data.email];
    case "email.bounced":
      return event.data.bounce.type === "Permanent" ? event.data.to : [];
    case "email.complained":
      return event.data.to;
    default:
      return [];
  }
}

export async function POST(request: NextRequest) {
  const payload = await request.text();

  let event: WebhookEventPayload;
  try {
    event = resend.webhooks.verify({
      headers: {
        id: request.headers.get("svix-id") ?? "",
        signature: request.headers.get("svix-signature") ?? "",
        timestamp: request.headers.get("svix-timestamp") ?? "",
      },
      payload,
      webhookSecret: keys().RESEND_WEBHOOK_SECRET,
    });
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    await Promise.all(emailsLeaving(event).map(removeSubscriber));
  } catch (error) {
    // A 500 makes Resend retry, which is what a failed deletion needs.
    parseError(error);
    return NextResponse.json({ error: "Removal failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
