"use client";

import { useCallback, useState } from "react";

interface JoinFormProps {
  readonly token: string;
}

/**
 * The button that confirms the address, and the only thing on this page
 * that does. A native POST for the reasons /unsubscribe's LeaveForm gives:
 * it works with JavaScript off, and the pending label comes from the submit
 * event because `useFormStatus` does not see a browser navigation.
 */
export function JoinForm({ token }: JoinFormProps) {
  const [pending, setPending] = useState(false);
  const start = useCallback(() => setPending(true), []);

  return (
    <form
      action="/api/confirmed"
      className="mt-10"
      method="post"
      onSubmit={start}
    >
      <input name="token" type="hidden" value={token} />
      <button
        className="inline-flex h-11 items-center rounded-md bg-foreground px-6 font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-70"
        disabled={pending}
        type="submit"
      >
        {pending ? "Adding…" : "Add this address"}
      </button>
    </form>
  );
}
