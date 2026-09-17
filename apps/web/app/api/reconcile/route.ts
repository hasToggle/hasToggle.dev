import { timingSafeEqual } from "node:crypto";
import { database } from "@repo/database";
import { resend } from "@repo/email";
import { parseError } from "@repo/observability/error";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import { normalizeEmail } from "@/lib/email-validation";
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

/**
 * "Orphaned" means Resend no longer knows the address — but an empty or
 * truncated listing looks the same as a deliberate deletion. A wrong segment
 * id, an API that answers with no data and no error, or a partial page would
 * read as "everyone left" and empty the list. So a run that would orphan
 * more than this share of the confirmed subscribers is refused and reported,
 * and a listing that comes back empty while subscribers exist is never
 * trusted. Small lists get an absolute allowance so the first few departures
 * are still processed.
 */
const MAX_ORPHAN_SHARE = 0.5;
const MIN_ORPHAN_ALLOWANCE = 5;

export function orphansLookWrong(
  confirmed: number,
  known: number,
  orphaned: number
): boolean {
  if (confirmed === 0) {
    return false;
  }
  if (known === 0) {
    return true;
  }
  const allowance = Math.max(
    MIN_ORPHAN_ALLOWANCE,
    Math.floor(confirmed * MAX_ORPHAN_SHARE)
  );
  return orphaned > allowance;
}

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
    // Both stores are compared in the one normalized shape: a row written
    // before normalization began still carries its original casing, and
    // Resend keeps whatever casing it was given. Compared raw, the same
    // person would read as an orphan and be erased.
    const contacts = await listSegmentContacts();
    const known = new Set(contacts.map((c) => normalizeEmail(c.email)));
    const flagged = contacts
      .filter((c) => c.unsubscribed)
      .map((c) => normalizeEmail(c.email));

    const confirmed = await database.subscriber
      .find({ emailVerified: { $ne: null } }, { projection: { email: 1 } })
      .toArray();
    const orphaned = confirmed
      .map((s) => normalizeEmail(s.email))
      .filter((email) => !known.has(email));

    if (orphansLookWrong(confirmed.length, known.size, orphaned.length)) {
      parseError(
        new Error(
          `Reconciliation refused: ${orphaned.length} of ${confirmed.length} confirmed subscribers are missing from ${known.size} listed contacts`
        )
      );
      return NextResponse.json(
        { error: "Reconciliation refused: contact listing looks incomplete" },
        { status: 409 }
      );
    }

    // One at a time: each removal is a Resend call, and Resend's rate limit
    // is a couple of requests a second. The run is scheduled, so latency
    // is free; a burst of parallel deletes would be refused.
    const leaving = [...new Set([...flagged, ...orphaned])];
    for (const email of leaving) {
      // biome-ignore lint/performance/noAwaitInLoops: sequential on purpose, see above
      await removeSubscriber(email);
    }

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
    parseError(error);
    return NextResponse.json(
      { error: "Reconciliation failed" },
      { status: 500 }
    );
  }
}
