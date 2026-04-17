"use client";

import { Badge } from "@repo/design-system/components/ui/badge";
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
  essay: "Essay",
  sketch: "Sketch",
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
    <Container className="py-16 sm:py-20 md:py-24" id={id}>
      <div
        className={cn(
          "relative",
          dark &&
            "rounded-3xl bg-gray-950 px-6 py-16 sm:px-12 sm:py-20 md:px-16"
        )}
      >
        <div className="grid gap-x-12 gap-y-6 lg:grid-cols-[7rem_minmax(0,1fr)]">
          <div className="flex items-start justify-between gap-4 lg:block">
            <span
              className={cn(
                "font-mono text-4xl tabular-nums leading-none tracking-tight lg:text-right lg:text-5xl",
                dark ? "text-gray-600" : "text-muted-foreground/40"
              )}
            >
              {chapterNumber}
            </span>
            {statusLabel && (
              <Badge
                className={cn(
                  "font-mono font-normal text-[0.65rem] uppercase tracking-[0.2em] lg:mt-4",
                  dark
                    ? "border-ht-cyan-500/35 text-ht-cyan-300/85"
                    : "border-ht-cyan-700/25 text-ht-cyan-800/70 dark:border-ht-cyan-500/35 dark:text-ht-cyan-300/85"
                )}
                variant="outline"
              >
                {statusLabel}
              </Badge>
            )}
          </div>

          <div className="max-w-2xl">
            <p
              className={cn(
                "font-medium font-mono text-[0.7rem] uppercase tracking-[0.2em]",
                dark
                  ? "text-red-400/90"
                  : "text-red-600/80 dark:text-red-400/90"
              )}
            >
              Misconception
            </p>

            <Heading
              as="h3"
              className="mt-3 text-3xl/[1.1] sm:text-4xl/[1.1] md:text-5xl/[1.05]"
              dark={dark}
            >
              {hook}
            </Heading>

            {meta && (
              <MetaAside className="mt-5" dark={dark}>
                {meta}
              </MetaAside>
            )}

            <div className="mt-10">
              <p
                className={cn(
                  "mb-2 font-medium font-mono text-[0.7rem] uppercase tracking-[0.2em]",
                  dark
                    ? "text-ht-cyan-300/90"
                    : "text-ht-cyan-700 dark:text-ht-cyan-300/90"
                )}
              >
                Reality
              </p>
              <p
                className={cn(
                  "text-balance text-lg leading-8",
                  dark ? "text-gray-300" : "text-foreground/80"
                )}
              >
                {reality}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 lg:ml-12 lg:pl-[7rem]">{children}</div>
      </div>
    </Container>
  );
}
