import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import type { ReactNode } from "react";
import { keys } from "./keys";

interface AnalyticsProviderProps {
  readonly children: ReactNode;
}

const { NEXT_PUBLIC_GA_MEASUREMENT_ID } = keys();

/*
 * Vercel Analytics loads its script from /_vercel/insights/script.js, a path
 * only the Vercel edge serves. Anywhere else — a local production build, a
 * container, any self-hosted deploy — the tag renders, 404s, and logs a
 * console error while collecting nothing.
 *
 * This briefly sat behind an explicit NEXT_PUBLIC_VERCEL_ANALYTICS flag,
 * because the path also 404s on Vercel until Web Analytics is enabled for the
 * project, and nothing at runtime can tell you whether it has been. Web
 * Analytics is now enabled, which makes the flag a second switch that has to
 * agree with the dashboard — and when the two disagree the tag fails silently,
 * collecting nothing while looking fine. A 404 at least announces itself.
 * One switch is better: enable it in the dashboard and it works.
 */
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
