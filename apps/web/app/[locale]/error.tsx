"use client";

import { captureException } from "@sentry/nextjs";
import { useEffect } from "react";
import { Container } from "./components/container";
import { MarketingButton } from "./components/marketing-button";
import { Navbar } from "./components/navbar";
import { Heading, Subheading } from "./components/text";

interface ErrorProperties {
  readonly error: Error & { digest?: string };
  readonly retry: () => void;
}

/**
 * The boundary under the locale layout: a page or a demo that throws while
 * rendering lands here with the site chrome intact, instead of escalating to
 * the bare document-level error screen.
 */
export default function ErrorPage({ error, retry }: ErrorProperties) {
  useEffect(() => {
    captureException(error);
  }, [error]);

  return (
    <div className="overflow-x-clip">
      <Container>
        <Navbar variant="light" />
      </Container>
      <main>
        <Container className="pt-16 pb-20 sm:pt-24 sm:pb-24">
          <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[7rem_minmax(0,1fr)]">
            <div aria-hidden="true" />
            <div>
              <Subheading as="div">Error</Subheading>
              <Heading
                as="h1"
                className="mt-3 text-balance text-4xl sm:text-5xl md:text-6xl"
              >
                Something broke on our side.
              </Heading>
              <p className="mt-6 max-w-2xl text-foreground/75 text-lg leading-8">
                The page hit an error while rendering, and the error has been
                reported. Trying again usually works; if it doesn&rsquo;t, the
                contact form reaches a person.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <MarketingButton onClick={retry} type="button">
                  Try again
                </MarketingButton>
                <MarketingButton href="/contact" variant="outline">
                  Write to Eric
                </MarketingButton>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
