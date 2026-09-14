import { describe, expect, test } from "bun:test";
import { render } from "@react-email/render";
import { PUBLIC_ORIGIN } from "../assets";
import ConfirmSubscription from "./confirm-subscription";

const srcs = (html: string) =>
  [...html.matchAll(/<img[^>]*src="([^"]+)"/g)].map((m) => m[1]);

describe("ConfirmSubscription", () => {
  test("loads the logos from the public site, not from the request origin", async () => {
    // A signup from localhost or a protected preview deployment must still
    // send images an inbox can fetch.
    const html = await render(
      ConfirmSubscription({ baseUrl: "http://localhost:3001", token: "t" })
    );
    const images = srcs(html);
    expect(images.length).toBeGreaterThan(0);
    for (const src of images) {
      expect(src.startsWith(`${PUBLIC_ORIGIN}/`)).toBe(true);
    }
  });

  test("points the confirm link at the origin that received the signup", async () => {
    const html = await render(
      ConfirmSubscription({ baseUrl: "http://localhost:3001", token: "abc" })
    );
    expect(html).toContain(
      'href="http://localhost:3001/api/confirmed?token=abc"'
    );
  });

  test("uses assets that exist under apps/web/public", async () => {
    const html = await render(
      ConfirmSubscription({ baseUrl: "https://www.hastoggle.dev", token: "t" })
    );
    const { existsSync } = await import("node:fs");
    const { join } = await import("node:path");
    for (const src of srcs(html)) {
      const file = src.slice(PUBLIC_ORIGIN.length + 1);
      expect(
        existsSync(join(import.meta.dir, "../../../apps/web/public", file))
      ).toBe(true);
    }
  });
});
