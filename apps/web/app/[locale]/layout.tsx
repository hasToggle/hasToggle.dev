import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";

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
