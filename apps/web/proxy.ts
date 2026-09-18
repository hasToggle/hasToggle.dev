import { isToolbarEnabled } from "@repo/feature-flags/lib/toolbar-enabled";
import { internationalizationMiddleware } from "@repo/internationalization/middleware";
import { parseError } from "@repo/observability/error";
import { secure } from "@repo/security";
import { type NextProxy, type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import {
  securityHeaders,
  securityOptions,
  securityOptionsWithToolbar,
  withSecurityHeaders,
} from "@/lib/security-headers";
import { TICKETS } from "@/lib/tickets";

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|monitoring|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/api/:path*",
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
// createNEMO, causing rewrites to /en/... paths that don't exist). The two
// metadata files live at the app root, where Next serves them from.
const UNLOCALIZED = new Set(["/robots.txt", "/sitemap.xml"]);

// The pages after the waitlist link and the unsubscribe button are only
// for the visitor who just came from them: without the ticket their
// redirect set, the address is a 404.
const ticketed = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const ticket = TICKETS.find((t) => t.path === pathname);
  if (ticket && !request.cookies.has(ticket.cookie)) {
    return NextResponse.rewrite(
      new URL(`${ticket.path}/not-found`, request.url),
      { status: 404 }
    );
  }
};

const i18nWithExclusions = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  if (
    UNLOCALIZED.has(pathname) ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/confirmed") ||
    pathname.startsWith("/unsubscribe") ||
    pathname.startsWith("/.well-known")
  ) {
    return;
  }
  return internationalizationMiddleware(request);
};

// The chain: Arcjet first, so a refusal ends the request before any
// rewrite; then the locale rewrite; then a plain `next()`. Whichever
// response comes back, the security headers are merged onto it rather than
// offered as a fallback that never gets used.
export const proxy: NextProxy = async (request: NextRequest) => {
  const response =
    (await arcjetMiddleware(request)) ??
    ticketed(request) ??
    (await i18nWithExclusions(request)) ??
    NextResponse.next();
  return withSecurityHeaders(response, securityHeaders(headerOptions));
};
