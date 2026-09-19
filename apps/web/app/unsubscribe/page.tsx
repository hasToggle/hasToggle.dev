import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { env } from "@/env";
import { LEAVING_TICKET } from "@/lib/tickets";
import { verifyUnsubscribe } from "@/lib/unsubscribe-link";
import { LeaveForm } from "./leave-form";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Leave the waitlist — hasToggle",
};

/**
 * The page behind the unsubscribe link: one button, which is the only
 * thing that deletes anything. The link itself is a GET and does nothing,
 * so a mail scanner following it removes nobody. The signature is checked
 * here too, so a mistyped link is a 404 rather than a button that would
 * fail on press. Both arrive in the ticket /api/unsubscribe set, not in
 * this page's address; see lib/tickets.
 *
 * The page carries no header or footer — it is reached from a mail, not
 * from the site — so the prose says who is asking before it asks.
 */
async function Leave() {
  const ticket = (await cookies()).get(LEAVING_TICKET.cookie)?.value ?? "";
  const seam = ticket.lastIndexOf(".");
  const id = ticket.slice(0, seam);
  const sig = ticket.slice(seam + 1);
  if (!(seam > 0 && verifyUnsubscribe(id, sig, env.UNSUBSCRIBE_SECRET))) {
    notFound();
  }

  return (
    <>
      <h1 className="font-display font-medium text-4xl text-foreground tracking-tight sm:text-5xl">
        Leave the waitlist?
      </h1>
      <p className="mt-6 max-w-md text-balance text-foreground/75 text-lg leading-8">
        hasToggle is the unofficial live playground for Next.js and Vercel. The
        playground is free. This address is on the waitlist that hears when a
        new chapter lands, and when seats open in the cohort — small paid groups
        building production web apps with the same AI workflow that built the
        site.
      </p>
      <p className="mt-4 max-w-md text-balance text-foreground/75 text-lg leading-8">
        Press the button to remove this address. Nothing has happened yet.
      </p>
      <LeaveForm id={id} sig={sig} />
    </>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <Suspense fallback={null}>
        <Leave />
      </Suspense>
    </div>
  );
}
