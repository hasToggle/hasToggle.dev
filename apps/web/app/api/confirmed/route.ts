import { database } from "@repo/database";
import { resend } from "@repo/email";
import { type NextRequest, NextResponse } from "next/server";
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
      audienceId: "6f1b2f2c-6db5-40fe-8bbc-dc55487c9aca",
    });

    if (error) {
      console.error("Failed to add contact to Resend audience:", error);
    }

    return new Response(null, {
      status: 303,
      headers: {
        Location: "/confirmed",
      },
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
