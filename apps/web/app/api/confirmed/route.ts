import { database } from "@repo/database";
import { parseError } from "@repo/observability/error";
import { type NextRequest, NextResponse } from "next/server";
import { addSubscriberContact } from "@/lib/subscribers";
import {
  CONFIRMED_TICKET,
  CONFIRMING_TICKET,
  ticketRedirect,
} from "@/lib/tickets";
import { generateTokenHash } from "@/lib/token";

/**
 * The link in the confirmation mail lands here. A GET is a browser — or a
 * mail scanner following every link before its reader does — so it goes on
 * to the page with the button and confirms nobody: an opt-in a scanner can
 * complete is no record of consent. The button's POST is what confirms.
 * /api/unsubscribe splits the same way, for the same reason.
 */
function refused() {
  return NextResponse.json(
    { error: "Invalid or expired confirmation link" },
    { status: 400 }
  );
}

async function confirmable(token: unknown) {
  if (typeof token !== "string" || !token) {
    return null;
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
  return subscriber && live ? subscriber : null;
}

function failed(error: unknown) {
  parseError(error);
  return NextResponse.json(
    { error: "An unexpected error occurred" },
    { status: 500 }
  );
}

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    const subscriber = await confirmable(token);
    if (!(subscriber && token)) {
      return refused();
    }

    // A used link is only a way back to the confirmed page.
    if (subscriber.emailVerified) {
      // The redirect carries the ticket the proxy checks; see lib/tickets.
      return ticketRedirect(CONFIRMED_TICKET, request);
    }

    // The token rides in the ticket, not in the page's address: a query
    // string reaches every analytics script on the page, the Referer header
    // and the browser's history.
    return ticketRedirect(CONFIRMING_TICKET, request, token);
  } catch (error) {
    return failed(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData().catch(() => null);
    const subscriber = await confirmable(form?.get("token"));
    if (!subscriber) {
      return refused();
    }

    // A second press writes nothing and never re-creates the contact, so a
    // form that lingers in a tab cannot undo a later unsubscribe.
    if (subscriber.emailVerified) {
      return ticketRedirect(CONFIRMED_TICKET, request);
    }

    // The contact is what broadcasts send to. Resend's unsubscribe link
    // flips its `unsubscribed` flag; /api/webhooks/resend turns that flag
    // into the deletion the privacy policy promises.
    const { error } = await addSubscriberContact(subscriber.email);

    // A refusal does not cost the visitor their confirmation. The null is
    // the debt: /api/reconcile creates the contact on its next run, and
    // until it has, never reads the missing contact as a departure.
    await database.subscriber.updateOne(
      { _id: subscriber._id },
      {
        $set: {
          contactCreatedAt: error ? null : new Date(),
          emailVerified: new Date(),
          tokenExpiresAt: null,
        },
      }
    );

    if (error) {
      parseError(error);
    }

    return ticketRedirect(CONFIRMED_TICKET, request);
  } catch (error) {
    return failed(error);
  }
}
