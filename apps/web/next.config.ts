import { withToolbar } from "@repo/feature-flags/lib/toolbar";
import { config, withAnalyzer } from "@repo/next-config";
import { withLogging, withSentry } from "@repo/observability/next-config";
import type { NextConfig } from "next";
import { env } from "@/env";

export default async (): Promise<NextConfig> => {
  let nextConfig: NextConfig = await withToolbar(withLogging(config));

  nextConfig.reactCompiler = true;

  // The landing page demos Cache Components on itself (static shell, `use
  // cache`, streamed Suspense holes) — the flag is load-bearing content.
  nextConfig.cacheComponents = true;

  // Tailwind's output for this site is small and render-blocking, and first
  // paint was waiting on a whole round trip for it. Inlining trades a bigger
  // HTML document for one less blocking request, which is the trade the docs
  // recommend for atomic CSS.
  nextConfig.experimental = { ...nextConfig.experimental, inlineCss: true };

  nextConfig.images?.remotePatterns?.push({
    hostname: "picsum.photos",
    protocol: "https",
  });

  const redirects: NextConfig["redirects"] = async () => [
    {
      destination: "/legal/privacy",
      source: "/legal",
      statusCode: 301,
    },
    // Short, sayable URL for the live masterclass. Temporary on purpose: a 301
    // would be cached in every attendee's browser and break the next talk.
    {
      destination: "/learn/masterclass-28-07-2026",
      permanent: false,
      source: "/live",
    },
  ];

  nextConfig.redirects = redirects;

  if (env.VERCEL) {
    nextConfig = withSentry(nextConfig);
  }

  if (env.ANALYZE === "true") {
    nextConfig = withAnalyzer(nextConfig);
  }

  return nextConfig;
};
