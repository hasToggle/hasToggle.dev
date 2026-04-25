"use client";

import { cn } from "@repo/design-system/lib/utils";
import { useEffect, useState } from "react";
import { GROUNDING_AMENDMENT, PROMPT, RETRIEVED_DOCS } from "./paragraph-data";

interface PromptInputProps {
  amended: boolean;
  reducedMotion: boolean;
}

export function PromptInput({ amended, reducedMotion }: PromptInputProps) {
  return (
    <div className="space-y-2 rounded-lg border border-border/60 bg-background/40 px-4 py-3 font-mono text-sm sm:px-5 sm:py-4 sm:text-base">
      <p className="text-foreground/85">
        <span
          aria-hidden="true"
          className="mr-2 select-none text-foreground/40"
        >
          {">"}
        </span>
        {PROMPT}
      </p>

      {amended && (
        <>
          <p
            className={cn(
              "overflow-hidden whitespace-nowrap text-ht-cyan-700 dark:text-ht-cyan-300",
              !reducedMotion &&
                "w-0 animate-[ht-typewriter_1200ms_steps(60,end)_forwards]"
            )}
          >
            <span aria-hidden="true" className="mr-2 select-none">
              {"↳"}
            </span>
            {GROUNDING_AMENDMENT}
          </p>
          <RetrievalStatus reducedMotion={reducedMotion} />
        </>
      )}

      <style>{`
        @keyframes ht-typewriter {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes ht-doc-flash {
          0% { opacity: 0; transform: translateY(2px); }
          15% { opacity: 1; transform: translateY(0); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes ht-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const RETRIEVAL_START_MS = 1300;
const RETRIEVAL_DOC_STAGGER_MS = 250;
const RETRIEVAL_HOLD_MS = 800;
const COLLAPSE_AT_MS =
  RETRIEVAL_START_MS +
  RETRIEVED_DOCS.length * RETRIEVAL_DOC_STAGGER_MS +
  RETRIEVAL_HOLD_MS;

function RetrievalStatus({ reducedMotion }: { reducedMotion: boolean }) {
  const [collapsed, setCollapsed] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }
    const id = window.setTimeout(() => setCollapsed(true), COLLAPSE_AT_MS);
    return () => window.clearTimeout(id);
  }, [reducedMotion]);

  if (collapsed) {
    return (
      <p
        aria-live="polite"
        className={cn(
          "text-foreground/65 text-xs sm:text-sm",
          !reducedMotion && "animate-[ht-fade-in_300ms_ease-out]"
        )}
      >
        <span className="sr-only">
          Grounded in {RETRIEVED_DOCS.length} documents.
        </span>
        <span aria-hidden="true">
          <span className="mr-2 select-none">{"↳"}</span>
          grounded in {RETRIEVED_DOCS.length} docs.
        </span>
      </p>
    );
  }

  return (
    <ul
      aria-hidden="true"
      className="space-y-0.5 text-foreground/65 text-xs sm:text-sm"
    >
      {RETRIEVED_DOCS.map((doc, index) => (
        <li
          className="opacity-0"
          key={doc}
          style={{
            animation: `ht-doc-flash 600ms ease-out ${
              RETRIEVAL_START_MS + index * RETRIEVAL_DOC_STAGGER_MS
            }ms forwards`,
          }}
        >
          <span className="mr-2 select-none text-foreground/40">·</span>
          <span className="font-mono">{doc}</span>
        </li>
      ))}
    </ul>
  );
}
