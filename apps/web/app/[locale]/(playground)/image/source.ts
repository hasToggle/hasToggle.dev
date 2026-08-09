export const OG_SOURCE = `
// app/api/og/route.tsx — a PNG factory disguised as a route
import { ImageResponse } from "next/og";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = clampTitle(searchParams.get("title"));
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
