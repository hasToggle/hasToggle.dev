import { locales } from "@repo/internationalization";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";

// With Cache Components, `params.locale` counts as runtime data unless the
// build knows the possible values. Listing them keeps every locale variant
// prerenderable instead of forcing pages behind Suspense. The site is
// English only for now (one locale in @repo/internationalization); the
// proxy's locale rewrite files any other first segment under /en, where
// it is a 404 rather than an English page under a foreign path.
export const generateStaticParams = (): { locale: string }[] =>
  locales.map((locale) => ({ locale }));

interface LocaleLayoutProperties {
  readonly children: ReactNode;
}

const LocaleLayout = ({ children }: LocaleLayoutProperties) => (
  <div className="font-switzer selection:bg-ht-cyan-400/30">
    <NuqsAdapter>{children}</NuqsAdapter>
  </div>
);

export default LocaleLayout;
