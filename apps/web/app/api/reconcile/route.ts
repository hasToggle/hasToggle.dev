import { timingSafeEqual } from "node:crypto";
import { database } from "@repo/database";
import { resend } from "@repo/email";
import { parseError } from "@repo/observability/error";
import { after, type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import { removeSubscriber } from "@/lib/subscribers";

/**
 * The safety net under the webhook. Called on a schedule (an Atlas trigger),
 * it makes the two stores agree with the privacy policy again:
 *
 * - a contact Resend has flagged `unsubscribed` is deleted from both stores;
 * - a confirmed subscriber Resend no longer knows (deleted in the dashboard,
 *   webhook missed) is deleted here too;
 * - a signup that never confirmed is dropped once its link has been dead
 *   for a week — the address was collected for a confirmation that never
 *   came, so the purpose it was collected for has ended.
 */
const UNCONFIRMED_GRACE_MS = 1000 * 60 * 60 * 24 * 7;
const PAGE_SIZE = 100;

function authorized(request: NextRequest): boolean {
  const header = request.headers.get("authorization") ?? "";
  const presented = Buffer.from(header);
  const expected = Buffer.from(`Bearer ${env.RECONCILE_SECRET}`);
  return (
    presented.length === expected.length && timingSafeEqual(presented, expected)
  );
}

interface SegmentContact {
  email: string;
  id: string;
  unsubscribed: boolean;
}

// Cursor pagination is sequential by nature: each page's cursor is the
// last id of the page before it.
async function listSegmentContacts(
  cursor?: string,
  collected: SegmentContact[] = []
): Promise<SegmentContact[]> {
  const { data, error } = await resend.contacts.list({
    after: cursor,
    limit: PAGE_SIZE,
    segmentId: env.RESEND_SEGMENT_ID,
  });
  if (error) {
    throw new Error(`Listing contacts failed: ${error.message}`);
  }
  const contacts = [...collected, ...data.data];
  const last = data.data.at(-1);
  if (!(data.has_more && last)) {
    return contacts;
  }
  return listSegmentContacts(last.id, contacts);
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const contacts = await listSegmentContacts();
    const known = new Set(contacts.map((c) => c.email));
    const flagged = contacts.filter((c) => c.unsubscribed).map((c) => c.email);

    const confirmed = await database.subscriber
      .find({ emailVerified: { $ne: null } }, { projection: { email: 1 } })
      .toArray();
    const orphaned = confirmed
      .map((s) => s.email)
      .filter((email) => !known.has(email));

    const leaving = [...new Set([...flagged, ...orphaned])];
    await Promise.all(leaving.map(removeSubscriber));

    const { deletedCount: unconfirmed } = await database.subscriber.deleteMany({
      emailVerified: null,
      tokenExpiresAt: { $lt: new Date(Date.now() - UNCONFIRMED_GRACE_MS) },
    });

    return NextResponse.json({
      contacts: contacts.length,
      removed: {
        orphaned: orphaned.length,
        unconfirmed,
        unsubscribed: flagged.length,
      },
    });
  } catch (error) {
    after(() => parseError(error));
    return NextResponse.json(
      { error: "Reconciliation failed" },
      { status: 500 }
    );
  }
}
