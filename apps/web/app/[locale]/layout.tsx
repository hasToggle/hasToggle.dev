import { locales } from "@repo/internationalization";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";

// With Cache Components, `params.locale` counts as runtime data unless the
// build knows the possible values. Listing them keeps every locale variant
// prerenderable instead of forcing pages behind Suspense.
export const generateStaticParams = (): { locale: string }[] =>
  locales.map((locale) => ({ locale }));

interface LocaleLayoutProperties {
  readonly children: ReactNode;
  readonly params: Promise<{
    locale: string;
  }>;
}

const LocaleLayout = ({ children }: LocaleLayoutProperties) => (
  <div className="font-switzer selection:bg-ht-cyan-400/30">
    <link
      href="https://api.fontshare.com/css?f%5B%5D=switzer@400,500,600,700&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
    <NuqsAdapter>{children}</NuqsAdapter>
  </div>
);

export default LocaleLayout;
