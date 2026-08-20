import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import type { ReactNode } from "react";
import { keys } from "./keys";

interface AnalyticsProviderProps {
  readonly children: ReactNode;
}

const { NEXT_PUBLIC_GA_MEASUREMENT_ID } = keys();

// Vercel Analytics fetches its script from /_vercel/insights/script.js, a path
// only the Vercel edge serves. Anywhere else — a local production build, a
// container, any self-hosted deploy — the tag renders, 404s, and logs a console
// error while collecting nothing. Render it only where it can actually work.
const isOnVercel = Boolean(process.env.VERCEL);

export const AnalyticsProvider = ({ children }: AnalyticsProviderProps) => (
  <>
    {children}
    {isOnVercel ? <VercelAnalytics /> : null}
    {NEXT_PUBLIC_GA_MEASUREMENT_ID ? (
      <GoogleAnalytics gaId={NEXT_PUBLIC_GA_MEASUREMENT_ID} />
    ) : null}
  </>
);
