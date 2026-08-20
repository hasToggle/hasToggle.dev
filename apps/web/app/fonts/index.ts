import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

/* The marketing faces, self-hosted.
 *
 * These used to arrive as two `<link rel="stylesheet">` tags pointing at
 * api.fontshare.com and fonts.googleapis.com. Both were render-blocking and
 * cross-origin, so first paint waited on two DNS + TLS handshakes before it
 * could wait on the font files themselves — about a second of nothing, and the
 * hero footnote (the LCP element) is set in the mono face, so it paid the full
 * bill. Serving both faces from our own origin removes the handshakes, lets
 * Next.js emit preload hints, and keeps the bytes on the same connection as the
 * document.
 *
 * Switzer is vendored as woff2 under this directory; Fontshare has no npm
 * package and the ITF Free Font License permits self-hosting. JetBrains Mono
 * comes through next/font/google, which downloads and fingerprints it at build
 * time rather than at request time.
 */

export const switzer = localFont({
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  src: [
    { path: "./Switzer-Regular.woff2", style: "normal", weight: "400" },
    { path: "./Switzer-Medium.woff2", style: "normal", weight: "500" },
    { path: "./Switzer-Semibold.woff2", style: "normal", weight: "600" },
    { path: "./Switzer-Bold.woff2", style: "normal", weight: "700" },
  ],
  variable: "--font-switzer-sans",
});

export const jetbrainsMono = JetBrains_Mono({
  display: "swap",
  fallback: [
    "ui-monospace",
    "SFMono-Regular",
    "Menlo",
    "Monaco",
    "Consolas",
    "monospace",
  ],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600"],
});
