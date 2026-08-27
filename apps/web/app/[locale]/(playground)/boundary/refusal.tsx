import { REFUSAL_ERROR, REFUSAL_FILE } from "./copy";

/**
 * The refused beat's body: the compiler's answer to step one, quoted
 * verbatim from next-swc (see copy.ts). A component that throws never
 * reaches a visitor, so the bench shows the refusal itself — the exact
 * text, the file line, the red — and nothing else.
 */
export function Refusal() {
  return (
    <div className="rounded-lg border border-red-600/40 bg-red-500/5 px-3.5 py-3">
      <p className="font-mono text-red-700/80 text-xs dark:text-red-300/70">
        {REFUSAL_FILE}
      </p>
      <p className="mt-1.5 font-mono text-red-700 text-sm/6 dark:text-red-300">
        <span aria-hidden="true" className="select-none">
          ⨯{" "}
        </span>
        <span className="font-semibold">Error:</span> {REFUSAL_ERROR}
      </p>
    </div>
  );
}
