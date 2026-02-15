import { database } from "@repo/database";
import { resend } from "@repo/email";
import { parseError } from "@repo/observability/error";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
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

    const subscriber = await database.subscriber.findFirst({
      where: {
        token: generateTokenHash(token),
        tokenExpiresAt: { gte: new Date() },
      },
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: "Invalid or expired confirmation link" },
        { status: 400 }
      );
    }

    if (!subscriber.emailVerified) {
      await database.subscriber.update({
        where: { id: subscriber.id },
        data: {
          emailVerified: new Date(),
          tokenExpiresAt: null,
        },
      });
    }

    const { error } = await resend.contacts.create({
      email: subscriber.email,
      unsubscribed: false,
      audienceId: env.RESEND_AUDIENCE_ID,
    });

    if (error) {
      parseError(error);
    }

    return new Response(null, {
      status: 303,
      headers: {
        Location: "/confirmed",
      },
    });
  } catch (error) {
    parseError(error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
