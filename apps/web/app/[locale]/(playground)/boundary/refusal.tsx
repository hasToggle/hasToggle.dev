import { REFUSAL_FILE } from "./copy";

/**
 * A compiler refusal on the bench: the exact text, the file line, the
 * red, and nothing else. Both stops in the sequence use it — the useState
 * error and the "use cache" error — each quoted verbatim from next-swc
 * (see copy.ts). A component that throws never reaches a visitor, so the
 * refusal itself is what there is to show.
 */
export function Refusal({ error }: { error: string }) {
  return (
    <div className="rounded-lg border border-red-600/40 bg-red-500/5 px-3.5 py-3">
      <p className="font-mono text-red-700/80 text-xs dark:text-red-300/70">
        {REFUSAL_FILE}
      </p>
      <p className="mt-1.5 whitespace-pre-line font-mono text-red-700 text-sm/6 dark:text-red-300">
        <span aria-hidden="true" className="select-none">
          ⨯{" "}
        </span>
        <span className="font-semibold">Error:</span> {error}
      </p>
    </div>
  );
}
