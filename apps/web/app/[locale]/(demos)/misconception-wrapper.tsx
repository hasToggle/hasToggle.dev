"use client";

import { Container } from "../components/container";
import { Heading } from "../components/text";

interface MisconceptionWrapperProps {
  children: React.ReactNode;
  hook: string;
  reality: string;
}

export function MisconceptionWrapper({
  hook,
  reality,
  children,
}: MisconceptionWrapperProps) {
  return (
    <Container className="py-24">
      <div className="mb-12 max-w-2xl">
        <p className="font-semibold text-red-500 text-sm uppercase tracking-wider">
          Misconception
        </p>
        <Heading as="h3" className="mt-2">
          &ldquo;{hook}&rdquo;
        </Heading>
        <p className="mt-4 text-gray-600 text-lg dark:text-gray-400">
          {reality}
        </p>
      </div>
      {children}
    </Container>
  );
}
