"use client";

import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import { Textarea } from "@repo/design-system/components/ui/textarea";
import { useActionState } from "react";
import { MarketingButton } from "../../components/marketing-button";
import { contact } from "../actions/contact";

/**
 * The house version of the contact form: three fields, one Server Action,
 * no fetch. Success swaps the form's status line rather than the page —
 * the reply address is the useful fact, so it is the confirmation.
 */
export function ContactForm() {
  const [state, formAction, isPending] = useActionState(contact, {});

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid gap-2">
        <Label className="font-medium text-sm" htmlFor="name">
          Name
        </Label>
        <Input autoComplete="name" id="name" name="name" required type="text" />
      </div>
      <div className="grid gap-2">
        <Label className="font-medium text-sm" htmlFor="email">
          Email
        </Label>
        <Input
          autoComplete="email"
          id="email"
          name="email"
          placeholder="you@work.dev"
          required
          type="email"
        />
      </div>
      <div className="grid gap-2">
        <Label className="font-medium text-sm" htmlFor="message">
          Message
        </Label>
        <Textarea id="message" name="message" required rows={6} />
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <MarketingButton disabled={isPending} type="submit">
          {isPending ? "Sending…" : "Send it"}
        </MarketingButton>
        {state.success ? (
          <p
            aria-live="polite"
            className="font-mono text-ht-cyan-800 text-xs dark:text-ht-cyan-300"
          >
            sent · replies come from eric@hastoggle.dev
          </p>
        ) : null}
        {state.error ? (
          <p aria-live="polite" className="font-mono text-destructive text-xs">
            {state.error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
