import { describe, expect, test } from "bun:test";
import { render } from "@react-email/render";
import { PUBLIC_ORIGIN } from "../assets";
import AlreadySubscribed from "./already-subscribed";

const srcs = (html: string) =>
  [...html.matchAll(/<img[^>]*src="([^"]+)"/g)].map((m) => m[1]);

const UNSUBSCRIBE = "https://example.com/api/unsubscribe?id=abc&sig=def";

const mail = () =>
  render(
    AlreadySubscribed({
      confirmedAt: new Date("2026-09-03T10:00:00Z"),
      unsubscribeUrl: UNSUBSCRIBE,
    })
  );

describe("AlreadySubscribed", () => {
  test("names the day the address confirmed", async () => {
    expect(await mail()).toContain("3 September 2026");
  });

  test("carries no confirmation link", async () => {
    expect(await mail()).not.toContain("/api/confirmed");
  });

  test("carries the unsubscribe link it was given", async () => {
    expect(await mail()).toContain(
      `href="${UNSUBSCRIBE.replaceAll("&", "&amp;")}"`
    );
  });

  test("loads the logos from the public site", async () => {
    const html = await mail();
    const images = srcs(html);
    expect(images.length).toBeGreaterThan(0);
    for (const src of images) {
      expect(src.startsWith(`${PUBLIC_ORIGIN}/`)).toBe(true);
    }
  });
});
