import { createId, database, type Subscriber } from "@repo/database";
import { resend } from "@repo/email";
import AlreadySubscribed from "@repo/email/templates/already-subscribed";
import ConfirmSubscription from "@repo/email/templates/confirm-subscription";
import { parseError } from "@repo/observability/error";
import { log } from "@repo/observability/log";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import { confirmationOrigin } from "@/lib/confirmation-origin";
import {
  checkEmailDeliverability,
  EMAIL_COLLATION,
  normalizeEmail,
  type ValidationFailureReason,
  validateEmailFormat,
} from "@/lib/email-validation";
import { clientIp, rateLimiter } from "@/lib/rate-limit";
import { generateToken } from "@/lib/token";
import { unsubscribeHeaders, unsubscribeUrl } from "@/lib/unsubscribe-link";

const TOKEN_EXPIRY_MS = 1000 * 60 * 60 * 24;

// A resubmit inside this window sends nothing: it is a double click or
// someone hammering an address that is not theirs. After it, a resubmit
// means "the first mail never arrived" and a fresh one goes out.
const RESEND_COOLDOWN_MS = 1000 * 60 * 2;

// Every request past the format check costs a deliverability lookup, a
// database write and a mail, so callers are capped before that point: a
// burst per address, and a burst per caller across addresses. A real person
// retrying a typo fits inside both.
const PER_ADDRESS = { limit: 3, ms: 1000 * 60 * 60 };
const PER_CALLER = { limit: 10, ms: 1000 * 60 * 10 };

const LIMIT_MESSAGE =
  "That’s a lot of attempts in a short time. Try again in a little while.";

// Vague messaging for disposable/undeliverable to avoid revealing rejection reason
const VALIDATION_MESSAGES: Record<ValidationFailureReason, string> = {
  disposable:
    "This email address doesn't look quite right. Mind trying another one?",
  invalid_format: "Invalid email address provided",
  undeliverable:
    "This email address doesn't look quite right. Mind trying another one?",
};

// The same reply for every outcome, so the form cannot be used to test
// whether an address is on the list. What differs is the mail that arrives.
const SUCCESS_MESSAGE = "Confirmation email sent. Check your inbox.";

const DUPLICATE_KEY = 11_000;

function isDuplicateKey(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === DUPLICATE_KEY
  );
}

// Issue time is not stored; the expiry is, and the lifetime is fixed.
function tokenIssuedAt(subscriber: Subscriber): number {
  return subscriber.tokenExpiresAt
    ? subscriber.tokenExpiresAt.getTime() - TOKEN_EXPIRY_MS
    : Number.NEGATIVE_INFINITY;
}

async function overLimit(request: NextRequest, email: string) {
  const [byAddress, byCaller] = await Promise.all([
    rateLimiter("confirm:address", PER_ADDRESS),
    rateLimiter("confirm:caller", PER_CALLER),
  ]);
  const ip = clientIp(request.headers);
  const [address, caller] = await Promise.all([
    byAddress.limit(email),
    ip ? byCaller.limit(ip) : Promise.resolve({ success: true }),
  ]);
  return !(address.success && caller.success);
}

function validationError(reason: ValidationFailureReason) {
  return NextResponse.json(
    {
      error: { message: VALIDATION_MESSAGES[reason], name: "ValidationError" },
    },
    { status: 400 }
  );
}

function emailError() {
  return NextResponse.json(
    {
      error: {
        message: "Failed to send confirmation email",
        name: "EmailError",
      },
    },
    { status: 500 }
  );
}

/**
 * Writes the token onto the subscriber's row, creating it if there is none,
 * and answers with the row's id, which the mail's unsubscribe link is
 * signed over. The address arrives normalized, so the plain upsert matches
 * every row written since normalization began. A row stored in another
 * casing before that is invisible to the plain lookup, and the attempted
 * insert trips the case-insensitive unique index (E11000). That is the
 * signal to look again with the index's collation, which finds the legacy
 * row and updates it in place. A retry that matches nothing means the
 * token would be mailed for a row nobody holds, so it is an error rather
 * than a silent success.
 */
async function storeConfirmationToken(
  email: string,
  hash: string,
  existing: Subscriber | null
): Promise<string> {
  const update = {
    $set: {
      token: hash,
      tokenExpiresAt: new Date(Date.now() + TOKEN_EXPIRY_MS),
    },
  };
  const insertId = createId();

  try {
    await database.subscriber.updateOne(
      { email },
      {
        ...update,
        $setOnInsert: {
          _id: insertId,
          createdAt: new Date(),
          emailVerified: null,
          image: null,
          name: null,
          role: "user",
        },
      },
      { upsert: true }
    );
    // The upsert matched the row we looked up, or inserted the one we named.
    return existing?._id ?? insertId;
  } catch (error) {
    if (!isDuplicateKey(error)) {
      throw error;
    }
    const retry = await database.subscriber.updateOne({ email }, update, {
      collation: EMAIL_COLLATION,
    });
    if (retry.matchedCount === 0) {
      throw new Error(
        "Duplicate key on upsert, but no row matched the address under the index collation",
        { cause: error }
      );
    }
    // The legacy row is the one we looked up, unless it appeared between
    // the lookup and the upsert — then it has to be read to be named.
    const row =
      existing ??
      (await database.subscriber.findOne(
        { email },
        { collation: EMAIL_COLLATION }
      ));
    if (!row) {
      throw new Error(
        "Legacy row matched the update but could not be read back",
        { cause: error }
      );
    }
    return row._id;
  }
}

async function sendConfirmation(
  email: string,
  origin: string,
  existing: Subscriber | null
) {
  const { token, hash } = generateToken();

  const id = await storeConfirmationToken(email, hash, existing);
  const leave = unsubscribeUrl(origin, id, env.UNSUBSCRIBE_SECRET);

  const { error } = await resend.emails.send(
    {
      from: env.RESEND_FROM,
      headers: unsubscribeHeaders(leave),
      react: ConfirmSubscription({
        baseUrl: origin,
        token,
        unsubscribeUrl: leave,
      }),
      subject: "One click and you’re on the waitlist",
      to: [email],
    },
    // A retried request with the same token must not send twice.
    { idempotencyKey: `confirm-email/${hash}` }
  );

  return error;
}

/**
 * Resend's answer when a key has already sent something else. A key lives
 * 24 hours and replays only an identical payload, so a reminder refused
 * this way is one whose twin went out today under different content — a
 * deploy changed the copy, or a second deployment signed a different
 * unsubscribe URL into it. The cap has done its work either way, and
 * reporting it as a failure would answer a registered address with a 500
 * where an unknown one gets a 200.
 */
const ALREADY_REMINDED: ReadonlySet<string> = new Set([
  "invalid_idempotent_request",
  "concurrent_idempotent_requests",
]);

async function sendAlreadySubscribed(
  subscriber: Subscriber,
  confirmedAt: Date,
  origin: string
) {
  const leave = unsubscribeUrl(origin, subscriber._id, env.UNSUBSCRIBE_SECRET);
  // Contact creation at confirm time swallows its error, so a confirmed
  // subscriber can be missing from the segment. Re-creating is idempotent.
  const [contact, mail] = await Promise.all([
    resend.contacts.create({
      email: subscriber.email,
      segments: [{ id: env.RESEND_SEGMENT_ID }],
      unsubscribed: false,
    }),
    resend.emails.send(
      {
        from: env.RESEND_FROM,
        headers: unsubscribeHeaders(leave),
        react: AlreadySubscribed({ confirmedAt, unsubscribeUrl: leave }),
        subject: "You’re already on the waitlist",
        to: [subscriber.email],
      },
      // One reminder per address per day, however often the form is sent.
      // The host is part of the key because every deployment sends through
      // the same Resend account: preview and production write different
      // unsubscribe URLs into the same mail, and a shared key would let a
      // test on one refuse the other's reminder for the rest of the day.
      {
        idempotencyKey: `already-subscribed/${new URL(origin).host}/${subscriber._id}/${new Date().toISOString().slice(0, 10)}`,
      }
    ),
  ]);

  if (contact.error) {
    parseError(contact.error);
  }

  return mail.error && ALREADY_REMINDED.has(mail.error.name)
    ? null
    : mail.error;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body?.email);

    // Junk fails the cheap checks without touching a window; anything
    // shaped like an address is counted before the costly steps run.
    const format = validateEmailFormat(email);
    if (!format.valid) {
      return validationError(format.reason);
    }

    if (await overLimit(request, email)) {
      return NextResponse.json(
        { error: { message: LIMIT_MESSAGE, name: "RateLimitError" } },
        { status: 429 }
      );
    }

    // Collation-aware, so a row stored in another casing still counts as
    // the same person here and gets the reminder rather than a new token.
    const existing = await database.subscriber.findOne(
      { email },
      { collation: EMAIL_COLLATION }
    );

    const origin = confirmationOrigin(request.url, env.NEXT_PUBLIC_WEB_URL);

    if (existing?.emailVerified) {
      const error = await sendAlreadySubscribed(
        existing,
        existing.emailVerified,
        origin
      );
      if (error) {
        log.error(`Failed to send reminder email: ${JSON.stringify(error)}`);
        return emailError();
      }
      return NextResponse.json({ message: SUCCESS_MESSAGE });
    }

    if (existing && Date.now() - tokenIssuedAt(existing) < RESEND_COOLDOWN_MS) {
      return NextResponse.json({ message: SUCCESS_MESSAGE });
    }

    // The paid lookup runs once per address: a row on file already passed
    // it when the row was written.
    if (!existing) {
      const deliverability = await checkEmailDeliverability(email);
      if (!deliverability.valid) {
        return validationError(deliverability.reason);
      }
    }

    const error = await sendConfirmation(email, origin, existing);
    if (error) {
      log.error(`Failed to send confirmation email: ${JSON.stringify(error)}`);
      return emailError();
    }

    return NextResponse.json({ message: SUCCESS_MESSAGE });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: { message: "Invalid request body", name: "ValidationError" },
        },
        { status: 400 }
      );
    }
    parseError(error);
    return NextResponse.json(
      {
        error: { message: "An unexpected error occurred", name: "ServerError" },
      },
      { status: 500 }
    );
  }
}
