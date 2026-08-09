"use client";

import { useCallback, useState } from "react";
import { BoundaryCard } from "./card";

/**
 * A Client Component. The `"use client"` directive at the top of this file is
 * the entire boundary — everything imported below it ships to the browser and
 * hydrates. That's what buys you the click handler.
 */
export function ClientCard() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => {
    setCount((current) => current + 1);
  }, []);

  return (
    <BoundaryCard
      facts={[
        "can use state, effects, onClick",
        "ships JavaScript (that's the deal)",
        "cannot read secrets — it lives in your tab",
      ]}
      side="client"
      title="client-card.tsx"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
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
        <p className="text-foreground/75 text-sm/6">
          {count === 0
            ? "This button works because this component hydrated in your browser."
            : "No server was consulted. This state lives — and dies — in your tab."}
        </p>
      </div>
    </BoundaryCard>
  );
}
