import { createId, database } from "@repo/database";
import { resend } from "@repo/email";
import { ConfirmSubscription } from "@repo/email/templates/confirm-subscription";
import { parseError } from "@repo/observability/error";
import { after, type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import { generateToken } from "@/lib/token";

const TOKEN_EXPIRY_MS = 1000 * 60 * 60 * 24;

export async function POST(request: NextRequest) {
  try {
    const res = await request.json();
    const email = res.email;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        {
          error: {
            message: "Invalid email address provided",
            name: "ValidationError",
          },
        },
        { status: 400 }
      );
    }

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
          role: "user",
          name: null,
          emailVerified: null,
          image: null,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    const { error } = await resend.emails.send({
      from: env.RESEND_FROM,
      to: [email],
      subject: "Important: Confirm your subscription",
      react: ConfirmSubscription({
        token,
        baseUrl: new URL(request.url).origin,
      }),
    });

    if (error) {
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

    return NextResponse.json({
      message: "Confirm your subscription.",
    });
  } catch (error) {
    after(() => parseError(error));
    return NextResponse.json(
      {
        error: { message: "An unexpected error occurred", name: "ServerError" },
      },
      { status: 500 }
    );
  }
}
