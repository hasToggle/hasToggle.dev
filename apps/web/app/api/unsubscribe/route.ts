import { database } from "@repo/database";
import { resend } from "@repo/email";
import { parseError } from "@repo/observability/error";
import { after, type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";

/**
 * The one-click unsubscribe the privacy policy promises. The token is the
 * durable per-subscriber capability minted at confirmation; acting on it
 * deletes the subscriber document — a deletion, not a flag — and removes
 * the contact from the Resend audience, so neither store keeps the
 * address. Digest broadcasts must link this endpoint rather than Resend's
 * hosted unsubscribe, which only marks the contact suppressed and would
 * leave our database holding an address the policy says is gone.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "A valid unsubscribe link is required" },
        { status: 400 }
      );
    }

    const subscriber = await database.subscriber.findOne({
      unsubscribeToken: token,
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: "Invalid unsubscribe link" },
        { status: 400 }
      );
    }

    // The audience removal is tolerated failing (the contact may already be
    // gone); the database deletion is not — it is the promise.
    const removeContact = resend.contacts
      .remove({ audienceId: env.RESEND_AUDIENCE_ID, email: subscriber.email })
      .then(({ error }) => {
        if (error) {
          after(() => parseError(error));
        }
      });

    await Promise.all([
      database.subscriber.deleteOne({ _id: subscriber._id }),
      removeContact,
    ]);

    return new Response(null, {
      headers: {
        Location: "/unsubscribed",
      },
      status: 303,
    });
  } catch (error) {
    after(() => parseError(error));
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
