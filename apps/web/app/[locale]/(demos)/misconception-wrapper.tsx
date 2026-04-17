"use client";

import { cn } from "@repo/design-system/lib/utils";
import { Container } from "../components/container";
import { MetaAside } from "../components/meta-aside";
import { Heading } from "../components/text";

type DemoStatus = "essay" | "sketch";

interface MisconceptionWrapperProps {
  children: React.ReactNode;
  dark?: boolean;
  hook: string;
  id?: string;
  meta?: string;
  number: number;
  reality: string;
  status?: DemoStatus;
}

const STATUS_LABELS: Record<DemoStatus, string> = {
  essay: "STATUS — ESSAY",
  sketch: "STATUS — SKETCH",
};

export function MisconceptionWrapper({
  children,
  dark = false,
  hook,
  id,
  meta,
  number,
  reality,
  status,
}: MisconceptionWrapperProps) {
  const chapterNumber = String(number).padStart(2, "0");
  const statusLabel = status ? STATUS_LABELS[status] : null;

  return (
    <Container className="py-12 sm:py-16" id={id}>
      <div
        className={cn(
          "relative",
          dark &&
            "rounded-4xl bg-gray-900 px-6 py-16 sm:px-12 sm:py-20 lg:px-16"
        )}
      >
        <div className="mb-8 flex items-start justify-between gap-4">
          <div
            className={cn(
              "font-medium font-mono text-5xl tabular-nums leading-none tracking-tight sm:text-6xl",
              dark ? "text-gray-700" : "text-gray-300"
            )}
          >
            №&nbsp;{chapterNumber}
          </div>
          {statusLabel && (
            <span
              className={cn(
                "mt-3 inline-block whitespace-nowrap rounded-full border px-3 py-1 font-mono text-[0.7rem] uppercase tracking-widest",
                dark
                  ? "border-ht-cyan-500/40 text-ht-cyan-300/80"
                  : "border-ht-cyan-700/30 text-ht-cyan-800/80"
              )}
            >
              {statusLabel}
            </span>
          )}
        </div>

        <div className="mb-12 max-w-2xl">
          <p className="font-mono font-semibold text-red-500 text-sm uppercase tracking-widest">
            Misconception
          </p>

          <div className="relative mt-3">
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute -top-8 -left-3 select-none font-display font-medium text-7xl leading-none sm:-top-12 sm:-left-6 sm:text-9xl",
                dark ? "text-red-900/25" : "text-red-200/80"
              )}
            >
              &ldquo;
            </span>
            <Heading as="h3" className="relative" dark={dark}>
              {hook}
            </Heading>
          </div>

          {meta && (
            <MetaAside className="mt-4" dark={dark}>
              {meta}
            </MetaAside>
          )}

          <div className="mt-8">
            <p
              className={cn(
                "mb-2 font-mono font-semibold text-[0.7rem] uppercase tracking-widest",
                dark ? "text-ht-cyan-400/80" : "text-ht-cyan-700"
              )}
            >
              Reality →
            </p>
            <p
              className={cn(
                "text-lg",
                dark ? "text-gray-300" : "text-foreground/80"
              )}
            >
              {reality}
            </p>
          </div>
        </div>
        {children}
      </div>
    </Container>
  );
}
