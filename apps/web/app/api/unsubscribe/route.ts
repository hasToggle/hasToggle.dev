import { database } from "@repo/database";
import { parseError } from "@repo/observability/error";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import { removeSubscriber } from "@/lib/subscribers";
import { ticketRedirect, UNSUBSCRIBED_TICKET } from "@/lib/tickets";
import { verifyUnsubscribe } from "@/lib/unsubscribe-link";

/**
 * The link in a transactional mail lands here. A GET is a browser, so it
 * goes on to the page with the button; nothing is deleted on a GET, or
 * every link scanner would unsubscribe the people it scans for. A POST is
 * either that button or a mail client's one-click request (RFC 8058), and
 * that is what removes the address from both stores.
 */
function credentials(request: NextRequest, form?: FormData) {
  const id = request.nextUrl.searchParams.get("id") ?? form?.get("id");
  const sig = request.nextUrl.searchParams.get("sig") ?? form?.get("sig");
  if (typeof id !== "string" || typeof sig !== "string") {
    return null;
  }
  return verifyUnsubscribe(id, sig, env.UNSUBSCRIBE_SECRET) ? id : null;
}

function refused() {
  return NextResponse.json(
    { error: "This unsubscribe link is not valid" },
    { status: 400 }
  );
}

export function GET(request: NextRequest) {
  if (!credentials(request)) {
    return refused();
  }
  const page = new URL("/unsubscribe", request.url);
  page.search = request.nextUrl.search;
  return NextResponse.redirect(page, 303);
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";
  const form = contentType.includes("form")
    ? await request.formData()
    : undefined;
  const id = credentials(request, form);
  if (!id) {
    return refused();
  }

  try {
    // Idempotent: a link pressed twice, or after a reconcile run already
    // took the address, finds nothing and is still a success.
    const subscriber = await database.subscriber.findOne({ _id: id });
    if (subscriber) {
      await removeSubscriber(subscriber.email);
    }
  } catch (error) {
    parseError(error);
    return NextResponse.json(
      { error: "Leaving the list failed. Try again in a moment." },
      { status: 500 }
    );
  }

  if (form?.get("List-Unsubscribe") === "One-Click") {
    return new Response(null, { status: 200 });
  }
  return ticketRedirect(UNSUBSCRIBED_TICKET, request);
}
