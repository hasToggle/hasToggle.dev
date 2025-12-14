"use client";

import { use, useEffect, useState } from "react";
import type { createHighlighter } from "shiki";
import { CodeSkeleton } from "./skeleton";

type CounterCodeProps = {
  code: Array<{ id: number; code: string }>;
  pendingHighlighter: ReturnType<typeof createHighlighter>;
  onAnimationComplete: () => void;
};

/**
 * Animation constants
 */
const LINE_ANIMATION_INTERVAL_MS = 300;

export function CounterCode({
  code,
  pendingHighlighter,
  onAnimationComplete,
}: CounterCodeProps) {
  const highlighter = use(pendingHighlighter);
  const [highlightedCode, setHighlightedCode] = useState<string>("");
  const [currentLine, setCurrentLine] = useState<number>(0);
  const codeline = code[currentLine];

  useEffect(() => {
    const highlighted = highlighter.codeToHtml(codeline.code, {
      lang: "jsx",
      theme: "ayu-dark",
    });

    const lines = highlighted.split("\n");
    const highlightedLines = lines
      .map((line: string, index: number) => {
        if (index !== 0 && index === currentLine) {
          return `<span class="highlighted-line">${line}</span>`;
        }
        return line;
      })
      .join("\n");

    setHighlightedCode(highlightedLines);
  }, [highlighter, codeline, currentLine]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    const totalLines = codeline.code.split("\n").length - 1;
    if (currentLine < totalLines) {
      interval = setInterval(() => {
        setCurrentLine((prevLine) => prevLine + 1);
      }, LINE_ANIMATION_INTERVAL_MS);
    } else {
      onAnimationComplete();
    }
    return () => clearInterval(interval);
  }, [codeline, currentLine, onAnimationComplete]);

  if (!highlightedCode) {
    return <CodeSkeleton isLoading />;
  }

  return (
    <div className="my-auto h-60 rounded-md bg-gray-950 p-5 sm:h-72 lg:h-80">
      <div
        className="overflow-scroll whitespace-pre-wrap text-sm sm:overflow-hidden sm:text-base"
        /* biome-ignore lint/security/noDangerouslySetInnerHtml: <client-side only> */
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </div>
  );
}
