import { describe, expect, test } from "bun:test";
import { render } from "@react-email/render";
import { PUBLIC_ORIGIN } from "../assets";
import AlreadySubscribed from "./already-subscribed";

const srcs = (html: string) =>
  [...html.matchAll(/<img[^>]*src="([^"]+)"/g)].map((m) => m[1]);

describe("AlreadySubscribed", () => {
  test("names the day the address confirmed", async () => {
    const html = await render(
      AlreadySubscribed({ confirmedAt: new Date("2026-09-03T10:00:00Z") })
    );
    expect(html).toContain("3 September 2026");
  });

  test("carries no confirmation link", async () => {
    const html = await render(
      AlreadySubscribed({ confirmedAt: new Date("2026-09-03T10:00:00Z") })
    );
    expect(html).not.toContain("/api/confirmed");
  });

  test("loads the logos from the public site", async () => {
    const html = await render(
      AlreadySubscribed({ confirmedAt: new Date("2026-09-03T10:00:00Z") })
    );
    const images = srcs(html);
    expect(images.length).toBeGreaterThan(0);
    for (const src of images) {
      expect(src.startsWith(`${PUBLIC_ORIGIN}/`)).toBe(true);
    }
  });
});
