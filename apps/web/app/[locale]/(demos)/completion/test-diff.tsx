"use client";

import { cn } from "@repo/design-system/lib/utils";
import { useState } from "react";

interface TestDiffProps {
  onOpened: () => void;
}

export function TestDiff({ onOpened }: TestDiffProps) {
  const [open, setOpen] = useState(false);

  function handleToggle() {
    setOpen((prev) => {
      if (!prev) {
        onOpened();
      }
      return !prev;
    });
  }

  return (
    <div className="mt-6">
      <button
        aria-expanded={open}
        className="group flex items-center gap-2 font-medium text-foreground text-sm hover:text-muted-foreground"
        onClick={handleToggle}
        type="button"
      >
        <span
          aria-hidden="true"
          className={cn(
            "inline-block transition-transform duration-200",
            open && "rotate-90"
          )}
        >
          &#9656;
        </span>
        What the agent did when the test failed
      </button>
      {open && (
        <div className="mt-4 space-y-3">
          <p className="font-mono text-foreground/55 text-sm">
            What the agent changed when the reorder test failed.
          </p>
          <pre className="overflow-x-auto rounded-md border border-border bg-foreground/[0.02] p-4 font-mono text-sm/6 dark:bg-foreground/[0.04]">
            <code>
              <span className="block text-foreground/60">
                {"// reorder.test.ts"}
              </span>
              <span className="block text-red-600 dark:text-red-400">
                {
                  "- expect(reordered).toEqual(['Wire up persistence', 'Write tests', /* … */]);"
                }
              </span>
              <span className="block text-emerald-700 dark:text-emerald-400">
                {"+ expect(reordered).toEqual(reordered);"}
              </span>
            </code>
          </pre>
        </div>
      )}
    </div>
  );
}
