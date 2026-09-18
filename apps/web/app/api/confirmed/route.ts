import { database } from "@repo/database";
import { parseError } from "@repo/observability/error";
import { after, type NextRequest, NextResponse } from "next/server";
import { addSubscriberContact } from "@/lib/subscribers";
import { CONFIRMED_TICKET, ticketRedirect } from "@/lib/tickets";
import { generateTokenHash } from "@/lib/token";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "A valid confirmation link is required" },
        { status: 400 }
      );
    }

    const subscriber = await database.subscriber.findOne({
      token: generateTokenHash(token),
    });

    // A confirmed subscriber keeps the token hash with no expiry, so a
    // second click of the same link lands on the confirmed page instead of
    // an error. An unconfirmed one is only good until the expiry.
    const live =
      subscriber?.emailVerified ||
      (subscriber?.tokenExpiresAt && subscriber.tokenExpiresAt >= new Date());

    if (!(subscriber && live)) {
      return NextResponse.json(
        { error: "Invalid or expired confirmation link" },
        { status: 400 }
      );
    }

    // A used link is only a way back to the confirmed page. It writes
    // nothing and never re-creates the contact, so a link that lingers in
    // an inbox or a request log cannot undo a later unsubscribe.
    if (subscriber.emailVerified) {
      // The redirect carries the ticket the proxy checks; see lib/tickets.
      return ticketRedirect(CONFIRMED_TICKET, request);
    }

    // The contact is what broadcasts send to. Resend's unsubscribe link
    // flips its `unsubscribed` flag; /api/webhooks/resend turns that flag
    // into the deletion the privacy policy promises.
    const [, { error }] = await Promise.all([
      database.subscriber.updateOne(
        { _id: subscriber._id },
        {
          $set: {
            emailVerified: new Date(),
            tokenExpiresAt: null,
          },
        }
      ),
      addSubscriberContact(subscriber.email),
    ]);

    if (error) {
      after(() => parseError(error));
    }

    return ticketRedirect(CONFIRMED_TICKET, request);
  } catch (error) {
    after(() => parseError(error));
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
