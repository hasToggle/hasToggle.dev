import { describe, expect, test } from "bun:test";
import { render } from "@react-email/render";
import { PUBLIC_ORIGIN } from "../assets";
import ContactTemplate from "./contact";

const BR_BETWEEN_LINES = /First line\.<br\s*\/?>Second line\./;
const PREVIEW_DIV = /<div[^>]*display:none[^>]*>([^<]*)/;

const srcs = (html: string) =>
  [...html.matchAll(/<img[^>]*src="([^"]+)"/g)].map((m) => m[1]);

const props = {
  email: "jane.smith@example.com",
  message: "First line.\nSecond line.",
  name: "Jane Smith",
  sentAt: new Date("2026-09-16T14:52:00Z"),
};

describe("ContactTemplate", () => {
  test("names the sender and makes the address a reply link", async () => {
    const html = await render(ContactTemplate(props));
    expect(html).toContain("Jane Smith wrote in.");
    expect(html).toContain('href="mailto:jane.smith@example.com"');
  });

  test("places the submission in Berlin time", async () => {
    const html = await render(ContactTemplate(props));
    expect(html).toContain("16 September 2026");
    expect(html).toContain("16:52");
  });

  test("keeps the visitor's line breaks", async () => {
    const html = await render(ContactTemplate(props));
    expect(html).toMatch(BR_BETWEEN_LINES);
  });

  test("escapes markup typed into the form", async () => {
    const html = await render(
      ContactTemplate({ ...props, message: "<script>alert(1)</script>" })
    );
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  test("previews the message on one line, cut to inbox length", async () => {
    const long = "word ".repeat(60).trim();
    const html = await render(ContactTemplate({ ...props, message: long }));
    const preview = html.match(PREVIEW_DIV)?.[1];
    expect(preview).toBeDefined();
    expect(preview?.startsWith("Jane Smith: word word")).toBe(true);
    expect(preview?.endsWith("…")).toBe(true);
    expect(preview?.length).toBeLessThanOrEqual(160);
  });

  test("loads the logos from the public site", async () => {
    const html = await render(ContactTemplate(props));
    const images = srcs(html);
    expect(images.length).toBeGreaterThan(0);
    for (const src of images) {
      expect(src.startsWith(`${PUBLIC_ORIGIN}/`)).toBe(true);
    }
  });
});
