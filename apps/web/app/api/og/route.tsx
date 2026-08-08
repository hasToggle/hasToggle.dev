import { ImageResponse } from "next/og";
import { clampTitle } from "./title";

const CARD = {
  accent: "#53c9e8",
  background: "#071e26",
  muted: "#7a97a3",
  text: "#f4fafc",
};

/**
 * A PNG that doesn't exist until you ask for it. `ImageResponse` renders JSX
 * (flexbox only — Satori, not a browser) into an image at request time. The
 * landing page uses this same endpoint for its real Open Graph card.
 */
export function GET(request: Request): ImageResponse {
  const { searchParams } = new URL(request.url);
  const title = clampTitle(searchParams.get("title"));

  return new ImageResponse(
    <div
      style={{
        backgroundColor: CARD.background,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: 64,
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "baseline",
          display: "flex",
          gap: 16,
        }}
      >
        <div
          style={{
            color: CARD.text,
            display: "flex",
            fontSize: 34,
            fontWeight: 700,
          }}
        >
          hasToggle
        </div>
        <div style={{ color: CARD.muted, display: "flex", fontSize: 24 }}>
          / live playground
        </div>
      </div>
      <div
        style={{
          color: CARD.text,
          display: "flex",
          fontSize: 76,
          fontWeight: 700,
          letterSpacing: -2,
          lineHeight: 1.05,
          maxWidth: 1000,
        }}
      >
        {title}
      </div>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ color: CARD.muted, display: "flex", fontSize: 24 }}>
          hastoggle.dev — real demos, running in production
        </div>
        <div
          style={{
            backgroundColor: CARD.accent,
            display: "flex",
            height: 10,
            width: 160,
          }}
        />
      </div>
    </div>,
    {
      height: 630,
      width: 1200,
    }
  );
}
