"use client";

import { cn } from "@repo/design-system/lib/utils";
import type { Framing } from "./framing";
import { RESPONSES } from "./responses";

interface ResponseProps {
  flashKey: number;
  framing: Framing;
}

export function Response({ framing, flashKey }: ResponseProps) {
  const content = RESPONSES[framing];
  const flashClass = flashKey >= 1 ? "mirror-flash" : "";

  return (
    <div className="rounded-2xl border border-border bg-card/40 p-5 text-foreground/85 leading-7 shadow-sm sm:p-6">
      <p className="mb-3 font-medium font-mono text-[0.7rem] text-foreground/55 uppercase tracking-[0.2em]">
        Agent
      </p>
      <p>
        Yes — for a small, low-stakes feature,{" "}
        <span className={cn(flashClass)} key={`position-${flashKey}`}>
          {content.position}
        </span>
        .{" "}
        <span className={cn(flashClass)} key={`reason-${flashKey}`}>
          {content.reason}
        </span>
      </p>
      <p className="mt-3">
        <span className={cn(flashClass)} key={`intro-${flashKey}`}>
          {content.codeIntro}
        </span>
      </p>
      <div className={cn("mt-3", flashClass)} key={`code-${flashKey}`}>
        {content.code}
      </div>
      <p className="mt-3">
        <span className={cn(flashClass)} key={`closing-${flashKey}`}>
          {content.closing}
        </span>
      </p>
    </div>
  );
}
