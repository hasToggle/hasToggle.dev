"use client";

import { useCallback, useState } from "react";
import { InlineCode } from "../inline-code";

/**
 * The hydrated beat's body: the same card after the directive claimed it.
 * The counter is real client state — no server is consulted — and the
 * first line reports what moving here cost: the Node globals are gone.
 */
export function ClientCard() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => {
    setCount((current) => current + 1);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <p className="font-display font-medium text-2xl text-foreground tracking-tight">
        Rendered in{" "}
        <span className="text-ht-orange-800 dark:text-ht-orange-300">
          your browser
        </span>
      </p>
      <p className="text-foreground/75 text-sm/6">
        <InlineCode>process</InlineCode>&#32;is not defined here — the Node
        version, the timestamp and the cache left with it.
      </p>
      <div className="flex items-center gap-4 pt-1">
        <button
          className="inline-flex items-center justify-center rounded-full border border-transparent bg-primary px-4 py-[calc(0.5rem-1px)] font-medium text-base text-primary-foreground shadow-md hover:bg-primary/90"
          onClick={handleClick}
          type="button"
        >
          Click me
        </button>
        <p className="font-display font-medium text-2xl text-foreground tabular-nums tracking-tight">
          {count}
        </p>
      </div>
    </div>
  );
}
