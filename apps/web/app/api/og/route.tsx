import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { clampTitle, DEFAULT_OG_TITLE } from "./title";

const CARD = {
  accent: "#53c9e8",
  accentSoft: "rgba(83, 201, 232, 0.4)",
  background: "#071e26",
  line: "rgba(244, 250, 252, 0.12)",
  muted: "#7a97a3",
  panel: "rgba(3, 13, 18, 0.45)",
  text: "#f4fafc",
};

// The brand mono, vendored under assets/ (OFL licensed, license alongside).
// Read once per instance; `process.cwd()` is the Next.js project directory.
let fontsPromise: Promise<{ bold: Buffer; regular: Buffer }> | null = null;

function loadFonts() {
  fontsPromise ??= Promise.all([
    readFile(join(process.cwd(), "assets/JetBrainsMono-Regular.ttf")),
    readFile(join(process.cwd(), "assets/JetBrainsMono-Bold.ttf")),
  ]).then(([regular, bold]) => ({ bold, regular }));
  return fontsPromise;
}

// The site's dot texture as a Satori-friendly tile: no filters or blend
// modes in this renderer, but a repeated inline-SVG background works.
const DOT_TILE = encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><rect x='10' y='10' width='3' height='3' fill='rgb(244,250,252)' fill-opacity='0.14'/></svg>"
);

const SHORT_TITLE = 24;
const MEDIUM_TITLE = 46;

function titleSize(title: string): number {
  if (title.length <= SHORT_TITLE) {
    return 88;
  }
  if (title.length <= MEDIUM_TITLE) {
    return 72;
  }
  return 58;
}

/**
 * A PNG that doesn't exist until you ask for it. `ImageResponse` renders JSX
 * (flexbox only — Satori, not a browser) into an image at request time. The
 * card is drawn as a miniature of the site's live panels, in the site's own
 * mono. This same endpoint renders the page's real Open Graph image.
 */
export async function GET(request: Request): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const title = clampTitle(searchParams.get("title"));
  const fonts = await loadFonts();

  // The site's own card already says the tagline up top — don't say it twice.
  const footer =
    title === DEFAULT_OG_TITLE
      ? "press the demos · read the source · new exhibit every Monday"
      : "the playground for Next.js & Vercel — new exhibit every Monday";

  return new ImageResponse(
    <div
      style={{
        backgroundColor: CARD.background,
        backgroundImage:
          "radial-gradient(1100px 700px at 10% -10%, rgba(83, 201, 232, 0.16), transparent 60%)",
        display: "flex",
        height: "100%",
        padding: 44,
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          backgroundImage: `url("data:image/svg+xml,${DOT_TILE}")`,
          backgroundRepeat: "repeat",
          backgroundSize: "24px 24px",
          bottom: 0,
          display: "flex",
          left: 0,
          position: "absolute",
          right: 0,
          top: 0,
        }}
      />
      <div
        style={{
          backgroundColor: CARD.panel,
          border: `2px solid ${CARD.line}`,
          borderRadius: 28,
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            borderBottom: `2px solid ${CARD.line}`,
            display: "flex",
            justifyContent: "space-between",
            padding: "26px 40px",
          }}
        >
          <div style={{ alignItems: "center", display: "flex", gap: 16 }}>
            <div
              style={{
                backgroundColor: CARD.accent,
                borderRadius: 999,
                boxShadow: "0 0 22px rgba(83, 201, 232, 0.9)",
                display: "flex",
                height: 14,
                width: 14,
              }}
            />
            <div
              style={{
                color: CARD.muted,
                display: "flex",
                fontSize: 22,
                letterSpacing: 6,
              }}
            >
              LIVE
            </div>
          </div>
          <div style={{ color: CARD.muted, display: "flex", fontSize: 22 }}>
            hastoggle.dev
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            padding: "40px 56px",
          }}
        >
          <div
            style={{
              alignSelf: "center",
              color: CARD.text,
              display: "flex",
              fontSize: titleSize(title),
              fontWeight: 700,
              letterSpacing: -1,
              lineHeight: 1.15,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            borderTop: `2px solid ${CARD.line}`,
            display: "flex",
            justifyContent: "space-between",
            padding: "24px 40px",
          }}
        >
          <div style={{ color: CARD.muted, display: "flex", fontSize: 22 }}>
            {footer}
          </div>
          <div
            style={{
              color: CARD.accentSoft,
              display: "flex",
              fontSize: 30,
              gap: 18,
            }}
          >
            <div style={{ display: "flex" }}>+</div>
            <div style={{ display: "flex" }}>+</div>
            <div style={{ display: "flex" }}>+</div>
          </div>
        </div>
      </div>
    </div>,
    {
      fonts: [
        {
          data: fonts.regular,
          name: "JetBrains Mono",
          style: "normal",
          weight: 400,
        },
        {
          data: fonts.bold,
          name: "JetBrains Mono",
          style: "normal",
          weight: 700,
        },
      ],
      height: 630,
      width: 1200,
    }
  );
}
