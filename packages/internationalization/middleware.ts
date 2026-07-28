import type { NextRequest } from "next/server";
import { createI18nMiddleware } from "next-international/middleware";
import languine from "./languine.json" with { type: "json" };
import { resolveLocale } from "./locale-negotiation";

const locales = [languine.locale.source, ...languine.locale.targets];

const I18nMiddleware = createI18nMiddleware({
  defaultLocale: "en",
  locales,
  resolveLocaleFromRequest: (request: NextRequest) =>
    resolveLocale(Object.fromEntries(request.headers.entries()), locales, "en"),
  urlMappingStrategy: "rewriteDefault",
});

export const internationalizationMiddleware = (request: NextRequest) =>
  I18nMiddleware(request);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

//https://nextjs.org/docs/app/building-your-application/routing/internationalization
//https://github.com/vercel/next.js/tree/canary/examples/i18n-routing
//https://github.com/QuiiBz/next-international
//https://next-international.vercel.app/docs/app-middleware-configuration
