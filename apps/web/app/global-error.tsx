"use client";

import "./styles.css";
import { cn } from "@repo/design-system/lib/utils";
import { useEffect } from "react";
import { jetbrainsMono, switzer } from "@/app/fonts";
import { reportRenderError } from "@/lib/report-render-error";

interface GlobalErrorProperties {
  readonly error: Error & { digest?: string };
  readonly retry: () => void;
}

/**
 * Replaces the root layout when the layout itself throws, so it carries its
 * own document, stylesheet and fonts. It lives at the app root on purpose:
 * Next only mounts a global error file from there, even with the locale
 * segment in between.
 */
const GlobalError = ({ error, retry }: GlobalErrorProperties) => {
  useEffect(() => {
    reportRenderError(error);
  }, [error]);

  return (
    <html
      className={cn(
        switzer.variable,
        jetbrainsMono.variable,
        "touch-manipulation font-sans antialiased"
      )}
      lang="en"
    >
      <body className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
        <h1 className="font-medium text-4xl text-foreground tracking-tight sm:text-5xl">
          Something broke on our side.
        </h1>
        <p className="mt-6 max-w-md text-balance text-foreground/75 text-lg leading-8">
          The page hit an error while rendering, and the error has been
          reported. Trying again usually works.
        </p>
        <p className="mt-10">
          <button
            className="rounded-full bg-foreground px-5 py-2.5 font-medium text-background text-sm"
            onClick={retry}
            type="button"
          >
            Try again
          </button>
        </p>
      </body>
    </html>
  );
};

export default GlobalError;
