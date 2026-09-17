import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { env } from "@/env";
import { verifyUnsubscribe } from "@/lib/unsubscribe-link";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Leave the waitlist — hasToggle",
};

interface PageProps {
  searchParams: Promise<{ id?: string; sig?: string }>;
}

/**
 * The page behind the unsubscribe link: one button, which is the only
 * thing that deletes anything. The link itself is a GET and does nothing,
 * so a mail scanner following it removes nobody. The signature is checked
 * here too, so a mistyped link is a 404 rather than a button that would
 * fail on press.
 */
async function LeaveForm({ searchParams }: PageProps) {
  const { id, sig } = await searchParams;
  if (!(id && sig && verifyUnsubscribe(id, sig, env.UNSUBSCRIBE_SECRET))) {
    notFound();
  }

  return (
    <form
      action="/api/unsubscribe"
      className="flex flex-col items-center"
      method="post"
    >
      <input name="id" type="hidden" value={id} />
      <input name="sig" type="hidden" value={sig} />
      <h1 className="font-display font-medium text-4xl text-foreground tracking-tight sm:text-5xl">
        Leave the waitlist?
      </h1>
      <p className="mt-6 max-w-md text-balance text-foreground/75 text-lg leading-8">
        One press removes this address from the list and from the mail service.
        Nothing is kept. Until you press, nothing happens.
      </p>
      <p className="mt-10">
        <button
          className="inline-flex h-11 items-center rounded-md bg-foreground px-6 font-medium text-background transition-colors hover:bg-foreground/90"
          type="submit"
        >
          Remove this address
        </button>
      </p>
    </form>
  );
}

export default function UnsubscribePage(props: PageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <Suspense fallback={null}>
        <LeaveForm {...props} />
      </Suspense>
    </div>
  );
}
