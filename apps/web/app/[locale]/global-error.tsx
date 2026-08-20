"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { cn } from "@repo/design-system/lib/utils";
import { captureException } from "@sentry/nextjs";
import type NextError from "next/error";
import { useEffect } from "react";
import { jetbrainsMono, switzer } from "@/app/fonts";

interface GlobalErrorProperties {
  readonly error: NextError & { digest?: string };
  readonly reset: () => void;
}

const GlobalError = ({ error, reset }: GlobalErrorProperties) => {
  useEffect(() => {
    captureException(error);
  }, [error]);

  // Same faces as the root layout. Importing the design system's Geist helper
  // here registered those fonts for the whole route tree, so every page
  // preloaded them even though only this error screen would ever use them —
  // and this screen renders on approximately no page views.
  return (
    <html
      className={cn(
        switzer.variable,
        jetbrainsMono.variable,
        "touch-manipulation font-sans antialiased"
      )}
      lang="en"
    >
      <body>
        <h1>Oops, something went wrong</h1>
        <Button onClick={reset}>Try again</Button>
      </body>
    </html>
  );
};

export default GlobalError;
