import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CONFIRMING_TICKET } from "@/lib/tickets";
import { JoinForm } from "./join-form";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Join the waitlist — hasToggle",
};

/**
 * The page behind the confirmation link: one button, which is the only
 * thing that confirms anyone. The link itself is a GET and writes nothing,
 * so a mail scanner following it opts nobody in. /api/confirmed checked the
 * token before it sent the visitor here and handed it over in the ticket;
 * the proxy has already turned a visit without one into a 404.
 *
 * Like /unsubscribe, the page carries no header or footer — it is reached
 * from a mail, not from the site.
 */
async function Join() {
  const token = (await cookies()).get(CONFIRMING_TICKET.cookie)?.value;
  if (!token) {
    notFound();
  }

  return (
    <>
      <h1 className="font-display font-medium text-4xl text-foreground tracking-tight sm:text-5xl">
        Join the waitlist?
      </h1>
      <p className="mt-6 max-w-md text-balance text-foreground/75 text-lg leading-8">
        You&rsquo;re first to hear when cohort seats open, and when a chapter
        ships that the cohort will build on.
      </p>
      <JoinForm token={token} />
    </>
  );
}

export default function ConfirmPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <Suspense fallback={null}>
        <Join />
      </Suspense>
    </div>
  );
}
