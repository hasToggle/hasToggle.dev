import { CROSSED_ERROR } from "./copy";

/**
 * The crossed beat at diagnostic scale: the file the directive just
 * claimed, with the line that cannot follow squiggled the way an editor
 * squiggles it, and the compiler's first sentence as the note. The same
 * refusal as a crash screen would show — the register changed, not the
 * truth (design.md §4, 2026-08-27). The second sentence's suggestion
 * lives in the fact rows, where step three picks it up.
 */
const NOTE = CROSSED_ERROR.split("\n")[0];

export function CrossedFile() {
  return (
    <div className="flex flex-col font-mono text-muted-foreground text-xs/6">
      <p>{'import { cacheLife } from "next/cache";'}</p>
      <p>{'import { useState } from "react";'}</p>
      <p aria-hidden="true">&nbsp;</p>
      <p>{"async function getLatestCommit() {"}</p>
      <p className="pl-5">
        <span className="text-red-700 underline decoration-red-600/70 decoration-wavy underline-offset-4 dark:text-red-300">
          &quot;use cache&quot;;
        </span>
      </p>
      <p className="pl-5">{'cacheLife("hours");'}</p>
      <p className="pl-5 opacity-60">…</p>
      <p>{"}"}</p>
      <p className="mt-2 text-red-700 text-xs/5 dark:text-red-300">
        <span aria-hidden="true" className="select-none">
          ⨯{" "}
        </span>
        {NOTE}
      </p>
    </div>
  );
}
