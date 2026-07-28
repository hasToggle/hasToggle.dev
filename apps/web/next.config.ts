import { withToolbar } from "@repo/feature-flags/lib/toolbar";
import { config, withAnalyzer } from "@repo/next-config";
import { withLogging, withSentry } from "@repo/observability/next-config";
import type { NextConfig } from "next";
import { env } from "@/env";

export default async (): Promise<NextConfig> => {
  let nextConfig: NextConfig = await withToolbar(withLogging(config));

  nextConfig.reactCompiler = true;

  nextConfig.images?.remotePatterns?.push({
    protocol: "https",
    hostname: "picsum.photos",
  });

  const redirects: NextConfig["redirects"] = async () => [
    {
      source: "/legal",
      destination: "/legal/privacy",
      statusCode: 301,
    },
    // Short, sayable URL for the live masterclass. Temporary on purpose: a 301
    // would be cached in every attendee's browser and break the next talk.
    {
      source: "/live",
      destination: "/learn/masterclass-28-07-2026",
      permanent: false,
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
