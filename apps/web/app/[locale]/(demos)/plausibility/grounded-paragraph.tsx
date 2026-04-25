import { cn } from "@repo/design-system/lib/utils";
import { API_TOOLTIPS, GROUNDED_PARAGRAPH } from "./paragraph-data";

export function GroundedParagraph() {
  return (
    <p className="font-display text-foreground/85 text-lg leading-8">
      {GROUNDED_PARAGRAPH.segments.map((segment, index) => {
        const key = `${index}-${segment.kind}`;
        if (segment.kind === "text") {
          return <span key={key}>{segment.text}</span>;
        }
        if (segment.kind === "api") {
          return (
            <code
              className={cn(
                "rounded bg-foreground/[0.06] px-1 py-0.5 font-mono text-[0.95em] text-foreground/90",
                "underline decoration-2 decoration-emerald-500/70 underline-offset-4",
                "cursor-help"
              )}
              key={key}
              title={API_TOOLTIPS[segment.api]}
            >
              {segment.text}
            </code>
          );
        }
        if (segment.kind === "profiling") {
          return (
            <span data-profiling-sentence="true" key={key}>
              {segment.text}
            </span>
          );
        }
        return <span key={key}>{segment.text}</span>;
      })}
    </p>
  );
}
