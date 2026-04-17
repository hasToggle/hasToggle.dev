"use client";

import { cn } from "@repo/design-system/lib/utils";
import { Container } from "../components/container";
import { MetaAside } from "../components/meta-aside";
import { Heading } from "../components/text";

interface MisconceptionWrapperProps {
  children: React.ReactNode;
  dark?: boolean;
  hook: string;
  meta?: string;
  reality: string;
}

export function MisconceptionWrapper({
  hook,
  meta,
  reality,
  dark = false,
  children,
}: MisconceptionWrapperProps) {
  return (
    <Container className="py-24">
      <div className="mb-12 max-w-2xl">
        <p className="font-semibold text-red-500 text-sm uppercase tracking-wider">
          Misconception
        </p>
        <Heading as="h3" className="mt-2" dark={dark}>
          &ldquo;{hook}&rdquo;
        </Heading>
        {meta && (
          <MetaAside className={cn("mt-3", dark && "text-gray-500")}>
            {meta}
          </MetaAside>
        )}
        <p
          className={cn(
            "mt-4 text-lg",
            dark ? "text-gray-400" : "text-gray-600 dark:text-gray-400"
          )}
        >
          {reality}
        </p>
      </div>
      {children}
    </Container>
  );
}
