import { withCMS } from "@repo/cms/next-config";
import { withToolbar } from "@repo/feature-flags/lib/toolbar";
import { config, withAnalyzer } from "@repo/next-config";
import { withLogging, withSentry } from "@repo/observability/next-config";
import type { NextConfig } from "next";
import { env } from "@/env";

let nextConfig: NextConfig = withToolbar(withLogging(config));

nextConfig.reactCompiler = true;
nextConfig.reactStrictMode = false; // TODO: Re-enable strict mode

nextConfig.images?.remotePatterns?.push(
  {
    protocol: "https",
    hostname: "assets.basehub.com",
  },
  {
    protocol: "https",
    hostname: "picsum.photos",
  }
);

if (process.env.NODE_ENV === "production") {
  const redirects: NextConfig["redirects"] = async () => [
    {
      source: "/legal",
      destination: "/legal/privacy",
      statusCode: 301,
    },
  ];

  nextConfig.redirects = redirects;
}

if (env.VERCEL) {
  nextConfig = withSentry(nextConfig);
}

if (env.ANALYZE === "true") {
  nextConfig = withAnalyzer(nextConfig);
}

const finalConfig: NextConfig = withCMS(nextConfig);
export default finalConfig;
