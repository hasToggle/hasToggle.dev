import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import type { ReactNode } from "react";
import { keys } from "./keys";

interface AnalyticsProviderProps {
  readonly children: ReactNode;
}

const { NEXT_PUBLIC_GA_MEASUREMENT_ID, NEXT_PUBLIC_VERCEL_ANALYTICS } = keys();

/*
 * Vercel Analytics loads its script from /_vercel/insights/script.js, which
 * the platform serves only for projects with Web Analytics enabled. Being
 * deployed on Vercel is not enough — this project has never had it enabled, so
 * the tag rendered on every production page view, 404ed, and logged a console
 * error while collecting nothing. PostHog is already doing the analytics.
 *
 * Enabling Web Analytics is a dashboard toggle; set NEXT_PUBLIC_VERCEL_ANALYTICS
 * to "true" at the same time to turn the tag back on.
 */
const vercelAnalyticsEnabled = NEXT_PUBLIC_VERCEL_ANALYTICS === "true";

export const AnalyticsProvider = ({ children }: AnalyticsProviderProps) => (
  <>
    {children}
    {vercelAnalyticsEnabled ? <VercelAnalytics /> : null}
    {NEXT_PUBLIC_GA_MEASUREMENT_ID ? (
      <GoogleAnalytics gaId={NEXT_PUBLIC_GA_MEASUREMENT_ID} />
    ) : null}
  </>
);
