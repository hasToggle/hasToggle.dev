import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { render } from "@react-email/render";
import { PUBLIC_ORIGIN } from "../assets";
import DigestEmail from "./digest";

const IMG_SRC = /<img[^>]*src="([^"]+)"/;
const PUBLIC_DIR = join(import.meta.dir, "../../../apps/web/public");

describe("DigestEmail", () => {
  test("loads its logo from an asset that exists on the public site", async () => {
    const html = await render(DigestEmail(DigestEmail.PreviewProps));
    const [, src = ""] = html.match(IMG_SRC) ?? [];
    expect(src.startsWith(`${PUBLIC_ORIGIN}/`)).toBe(true);
    expect(
      existsSync(join(PUBLIC_DIR, src.slice(PUBLIC_ORIGIN.length + 1)))
    ).toBe(true);
  });
});
