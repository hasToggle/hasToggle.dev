"use client";

import { useActionState } from "react";
import { MarketingButton } from "../../components/marketing-button";
import { pressTheButton } from "./actions";

/**
 * A form whose `action` is a server function. With JavaScript enabled,
 * `useActionState` upgrades it with a pending flag and skips the full reload.
 * With JavaScript disabled it still works — plain HTML form post, server
 * runs the action, page comes back re-rendered. Progressive enhancement
 * isn't retro; it's the default here.
 */
export function PressForm() {
  const [, formAction, pending] = useActionState(pressTheButton, null);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div>
        <MarketingButton disabled={pending} type="submit">
          {pending ? "Asking the server…" : "Press the button"}
        </MarketingButton>
      </div>
      <p className="font-mono text-muted-foreground text-xs/5">
        works with JavaScript switched off — try it, we&apos;ll wait
      </p>
    </form>
  );
}
