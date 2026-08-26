import "./styles.css";
import { AnalyticsProvider } from "@repo/analytics/provider";
import { DesignSystemProvider } from "@repo/design-system";
import { cn } from "@repo/design-system/lib/utils";
import { Toolbar } from "@repo/feature-flags/components/toolbar";
import type { ReactNode } from "react";
import { jetbrainsMono, switzer } from "@/app/fonts";

interface RootLayoutProperties {
  readonly children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProperties) => (
  // Switzer and JetBrains Mono are the marketing faces, so this app declares
  // them once at the root rather than layering them over the design system's
  // Geist. Loading both pairs meant preloading ~141 KB of Geist that the
  // marketing tree overrides on the very next element and never paints.
  <html
    className={cn(
      switzer.variable,
      jetbrainsMono.variable,
      "touch-manipulation scroll-smooth font-sans antialiased"
    )}
    // The attribute must accompany scroll-smooth: the router only suppresses
    // smooth scrolling during route-transition scroll resets when it sees it
    // (it won't pay getComputedStyle to find out). Without it, every page
    // navigation animates its scroll-to-top from the old position. Hash
    // scrolls are exempt from the suppression, so anchors keep the glide.
    data-scroll-behavior="smooth"
    lang="en"
    suppressHydrationWarning
  >
    <body>
      <AnalyticsProvider>
        <DesignSystemProvider>{children}</DesignSystemProvider>
      </AnalyticsProvider>
      <Toolbar />
    </body>
  </html>
);

export default RootLayout;
