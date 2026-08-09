"use client";

import { startTransition, useActionState, useCallback } from "react";
import { MarketingButton } from "../../components/marketing-button";
import { formatClock } from "../format";
import { type RebakeResult, rebakeShell } from "./actions";

async function rebakeAction(
  _previous: RebakeResult | null
): Promise<RebakeResult> {
  return await rebakeShell();
}

/**
 * The button that invalidates a production cache. `useActionState` gives us
 * the pending flag and the action's return value; the stamp above updates on
 * its own because `updateTag` expires the entry and the page re-renders.
 */
export function RebakeButton() {
  const [result, action, pending] = useActionState(rebakeAction, null);
  const handleClick = useCallback(() => {
    startTransition(action);
  }, [action]);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <MarketingButton
          disabled={pending}
          onClick={handleClick}
          variant="outline"
        >
          {pending ? "Re-baking…" : "Re-bake this page"}
        </MarketingButton>
      </div>
      <p className="font-mono text-muted-foreground text-xs/5">
        {result
          ? `updateTag("landing-shell") ran at ${formatClock(new Date(result.rebakedAt))} — new bake above, for every visitor on Earth`
          : "expires the cache tag, re-renders the stamp — for everyone, not just you"}
      </p>
    </div>
  );
}
