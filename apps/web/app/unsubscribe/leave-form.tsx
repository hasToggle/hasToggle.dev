"use client";

import { useCallback, useState } from "react";

interface LeaveFormProps {
  readonly id: string;
  readonly sig: string;
}

/**
 * The button that removes the address, and the only thing on this page that
 * does. It stays a native POST to the route rather than a server action:
 * the same route answers a mail client's one-click request (RFC 8058), and
 * the browser's own submit is what keeps the page working with JavaScript
 * off. That rules out `useFormStatus`, which tracks React's form actions
 * and not a browser navigation, so the pending label comes from the submit
 * event. Deletion, the redirect and the ticket all still happen server-side.
 */
export function LeaveForm({ id, sig }: LeaveFormProps) {
  const [pending, setPending] = useState(false);
  const start = useCallback(() => setPending(true), []);

  return (
    <form
      action="/api/unsubscribe"
      className="mt-10"
      method="post"
      onSubmit={start}
    >
      <input name="id" type="hidden" value={id} />
      <input name="sig" type="hidden" value={sig} />
      <button
        className="inline-flex h-11 items-center rounded-md bg-foreground px-6 font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-70"
        disabled={pending}
        type="submit"
      >
        {pending ? "Removing…" : "Remove this address"}
      </button>
    </form>
  );
}
