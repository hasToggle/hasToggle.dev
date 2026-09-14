import { createId, database, type Subscriber } from "@repo/database";
import { resend } from "@repo/email";
import AlreadySubscribed from "@repo/email/templates/already-subscribed";
import ConfirmSubscription from "@repo/email/templates/confirm-subscription";
import { parseError } from "@repo/observability/error";
import { log } from "@repo/observability/log";
import { after, type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import {
  type ValidationFailureReason,
  validateEmail,
} from "@/lib/email-validation";
import { generateToken } from "@/lib/token";

const TOKEN_EXPIRY_MS = 1000 * 60 * 60 * 24;

// A resubmit inside this window sends nothing: it is a double click or
// someone hammering an address that is not theirs. After it, a resubmit
// means "the first mail never arrived" and a fresh one goes out.
const RESEND_COOLDOWN_MS = 1000 * 60 * 2;

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
const SUCCESS_MESSAGE = "Check your inbox. One click confirms it.";

function normalizeEmail(input: unknown): string {
  return typeof input === "string" ? input.trim().toLowerCase() : "";
}

// Issue time is not stored; the expiry is, and the lifetime is fixed.
function tokenIssuedAt(subscriber: Subscriber): number {
  return subscriber.tokenExpiresAt
    ? subscriber.tokenExpiresAt.getTime() - TOKEN_EXPIRY_MS
    : Number.NEGATIVE_INFINITY;
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

async function sendConfirmation(email: string, origin: string) {
  const { token, hash } = generateToken();

  await database.subscriber.updateOne(
    { email },
    {
      $set: {
        token: hash,
        tokenExpiresAt: new Date(Date.now() + TOKEN_EXPIRY_MS),
      },
      $setOnInsert: {
        _id: createId(),
        createdAt: new Date(),
        emailVerified: null,
        image: null,
        name: null,
        role: "user",
      },
    },
    { upsert: true }
  );

  const { error } = await resend.emails.send(
    {
      from: env.RESEND_FROM,
      react: ConfirmSubscription({ baseUrl: origin, token }),
      subject: "One click and you’re on the waitlist",
      to: [email],
    },
    // A retried request with the same token must not send twice.
    { idempotencyKey: `confirm-email/${hash}` }
  );

  return error;
}

async function sendAlreadySubscribed(
  subscriber: Subscriber,
  confirmedAt: Date
) {
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
        react: AlreadySubscribed({ confirmedAt }),
        subject: "You’re already on the waitlist",
        to: [subscriber.email],
      },
      // One reminder per address per day, however often the form is sent.
      {
        idempotencyKey: `already-subscribed/${subscriber._id}/${new Date().toISOString().slice(0, 10)}`,
      }
    ),
  ]);

  if (contact.error) {
    after(() => parseError(contact.error));
  }

  return mail.error;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body?.email);

    const validation = await validateEmail(email);

    if (!validation.valid) {
      return NextResponse.json(
        {
          error: {
            message: VALIDATION_MESSAGES[validation.reason],
            name: "ValidationError",
          },
        },
        { status: 400 }
      );
    }

    const existing = await database.subscriber.findOne({ email });

    if (existing?.emailVerified) {
      const error = await sendAlreadySubscribed(
        existing,
        existing.emailVerified
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

    const error = await sendConfirmation(email, new URL(request.url).origin);
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
    after(() => parseError(error));
    return NextResponse.json(
      {
        error: { message: "An unexpected error occurred", name: "ServerError" },
      },
      { status: 500 }
    );
  }
}
