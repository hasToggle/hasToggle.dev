import { OWNED_ANSWER } from "./paragraph-data";

interface DiagnosisChunk {
  id: string;
  kind: "code" | "text";
  text: string;
}

const DIAGNOSIS_CHUNKS: DiagnosisChunk[] = OWNED_ANSWER.diagnosis
  .split(/(`[^`]+`)/g)
  .filter((chunk) => chunk.length > 0)
  .map((chunk, index) => {
    const isCode = chunk.startsWith("`") && chunk.endsWith("`");
    return {
      id: `dx-${index}`,
      kind: isCode ? "code" : "text",
      text: isCode ? chunk.slice(1, -1) : chunk,
    };
  });

interface BeatLabelProps {
  children: React.ReactNode;
}

function BeatLabel({ children }: BeatLabelProps) {
  return (
    <p className="mb-2.5 font-medium font-mono text-[0.7rem] text-foreground/40 uppercase tracking-[0.2em]">
      <span aria-hidden="true" className="mr-2 select-none opacity-60">
        {"//"}
      </span>
      {children}
    </p>
  );
}

export function OwnedAnswer() {
  return (
    <div className="space-y-8">
      <div>
        <BeatLabel>from the grounded answer</BeatLabel>
        <blockquote className="font-display text-base text-foreground/55 italic leading-7">
          {OWNED_ANSWER.quotedFromGrounded.text}
          <span className="line-through decoration-2 decoration-red-500/70">
            <span className="sr-only">struck through: </span>
            {OWNED_ANSWER.quotedFromGrounded.strikeThroughClause}
          </span>
        </blockquote>
      </div>

      <div>
        <BeatLabel>the turn</BeatLabel>
        <p className="font-display font-semibold text-foreground text-xl leading-8">
          {OWNED_ANSWER.callout}
        </p>
      </div>

      <div>
        <BeatLabel>the fix</BeatLabel>
        <p className="font-display text-foreground/85 text-lg leading-8">
          {DIAGNOSIS_CHUNKS.map((chunk) =>
            chunk.kind === "code" ? (
              <code
                className="rounded bg-foreground/[0.06] px-1 py-0.5 font-mono text-[0.95em] text-foreground/90"
                key={chunk.id}
              >
                {chunk.text}
              </code>
            ) : (
              <span key={chunk.id}>{chunk.text}</span>
            )
          )}
        </p>

        <pre className="mt-5 overflow-x-auto rounded-md border border-border/60 bg-foreground/[0.03] p-4 font-mono text-sm leading-6">
          <code>
            {OWNED_ANSWER.diff.removed.map((line) => (
              <div
                className="text-red-600/85 dark:text-red-400/90"
                key={`r-${line}`}
              >
                <span aria-hidden="true" className="select-none">
                  {"- "}
                </span>
                {line}
              </div>
            ))}
            {OWNED_ANSWER.diff.added.map((line) => (
              <div
                className="text-emerald-700/90 dark:text-emerald-400/95"
                key={`a-${line}`}
              >
                <span aria-hidden="true" className="select-none">
                  {"+ "}
                </span>
                {line}
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
