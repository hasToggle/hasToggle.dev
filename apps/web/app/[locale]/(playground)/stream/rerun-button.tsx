"use client";

import { parseAsInteger, useQueryState } from "nuqs";
import { useCallback, useTransition } from "react";
import { MarketingButton } from "../../components/marketing-button";
import { MAX_RUN_ID } from "./parse-run-id";

/**
 * Bumps `?stream=` in the URL with `shallow: false`, so the request actually
 * reaches the server and the freshly-keyed Suspense boundaries stream again.
 * The URL is the re-run mechanism — copy it and your tab's run number
 * travels with it. Reading the URL is runtime data, which is why this
 * control lives inside the demo's Suspense boundary.
 */
export function RerunButton() {
  const [isPending, startTransition] = useTransition();
  const [run, setRun] = useQueryState(
    "stream",
    parseAsInteger.withDefault(0).withOptions({
      history: "replace",
      scroll: false,
      shallow: false,
      startTransition,
    })
  );
  const handleClick = useCallback(() => {
    setRun((current) => ((current ?? 0) % MAX_RUN_ID) + 1);
  }, [setRun]);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <MarketingButton
        disabled={isPending}
        onClick={handleClick}
        variant="outline"
      >
        {isPending ? "Streaming…" : "Run it again"}
      </MarketingButton>
      <p className="font-mono text-muted-foreground text-xs">
        run #{run} · via ?stream= in the URL
      </p>
    </div>
  );
}

/** Same footprint as the live control, shown while the boundary resolves. */
export function RerunButtonFallback() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <MarketingButton disabled variant="outline">
        Run it again
      </MarketingButton>
      <p className="font-mono text-muted-foreground/60 text-xs">
        run #0 · via ?stream= in the URL
      </p>
    </div>
  );
}
