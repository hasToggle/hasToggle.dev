import { isToolbarEnabled } from "@repo/feature-flags/lib/toolbar-enabled";
import { internationalizationMiddleware } from "@repo/internationalization/middleware";
import { parseError } from "@repo/observability/error";
import { secure } from "@repo/security";
import { createNEMO } from "@zanreal/nemo";
import {
  type NextFetchEvent,
  type NextProxy,
  type NextRequest,
  NextResponse,
} from "next/server";
import { env } from "@/env";
import {
  securityHeaders,
  securityOptions,
  securityOptionsWithToolbar,
  withSecurityHeaders,
} from "@/lib/security-headers";

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|ingest|monitoring|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

// Only widen the CSP where the toolbar actually renders. Keying this on
// FLAGS_SECRET alone meant production carried vercel.live allowances for a
// toolbar it no longer loads.
const headerOptions = isToolbarEnabled()
  ? securityOptionsWithToolbar
  : securityOptions;

// Custom middleware for Arcjet security checks
const arcjetMiddleware = async (request: NextRequest) => {
  if (!env.ARCJET_KEY) {
    return;
  }

  try {
    await secure(
      [
        // See https://docs.arcjet.com/bot-protection/identifying-bots
        "CATEGORY:SEARCH_ENGINE", // Allow search engines
        "CATEGORY:PREVIEW", // Allow preview links to show OG images
        "CATEGORY:MONITOR", // Allow uptime monitoring services
      ],
      request
    );
  } catch (error) {
    // The reason goes to Sentry; the visitor gets the same line either way.
    parseError(error);
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }
};

// Skip i18n rewriting for routes outside [locale] (i18n middleware's own
// matcher excludes these, but proxy.ts runs it for all matched routes via
// createNEMO, causing rewrites to /en/... paths that don't exist)
const i18nWithExclusions = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/confirmed") ||
    pathname.startsWith("/.well-known")
  ) {
    return;
  }
  return internationalizationMiddleware(request);
};

// Compose the app's own middleware (i18n + arcjet) with Nemo
const composedMiddleware = createNEMO(
  {},
  {
    // biome-ignore lint/suspicious/noExplicitAny: Type cast needed due to Next.js type duplication in monorepo
    before: [i18nWithExclusions as any, arcjetMiddleware],
  }
);

// The chain always answers with a response of its own — a locale rewrite, a
// redirect, an Arcjet refusal, or NEMO's plain `next()` — so the security
// headers are merged onto whatever comes back rather than offered as a
// fallback that never gets used.
export const proxy: NextProxy = async (
  request: NextRequest,
  event: NextFetchEvent
) => {
  const response =
    (await composedMiddleware(request, event)) ?? NextResponse.next();
  return withSecurityHeaders(response, securityHeaders(headerOptions));
};
