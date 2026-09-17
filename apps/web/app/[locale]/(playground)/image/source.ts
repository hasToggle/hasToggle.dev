export const OG_SOURCE = `
// app/api/og/route.tsx — the Route Handler that draws the card
import { ImageResponse } from "next/og";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // one of the site's own page titles, or the site line
  const title = resolveTitle(searchParams.get("title"));
  const fonts = await loadFonts(); // real .ttf files, read once

  return new ImageResponse(
    <div style={{ display: "flex", backgroundColor: "#071e26" }}>
      {title}
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "JetBrains Mono", data: fonts.bold, weight: 700 }],
    }
  );
}
`;
