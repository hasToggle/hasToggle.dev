import { describe, expect, test } from "bun:test";
import { resolveLocale } from "./locale-negotiation";

const LOCALES = ["en", "de", "es", "fr", "pt", "zh"];

describe("resolveLocale", () => {
  test("falls back to the default when no Accept-Language is sent", () => {
    // Negotiator reports ["*"] here, which is not a valid language tag.
    expect(resolveLocale({}, LOCALES, "en")).toBe("en");
  });

  test("falls back to the default on an explicit wildcard", () => {
    expect(resolveLocale({ "accept-language": "*" }, LOCALES, "en")).toBe("en");
  });

  test("falls back to the default on a malformed tag", () => {
    expect(resolveLocale({ "accept-language": "en_US" }, LOCALES, "en")).toBe(
      "en"
    );
  });

  test("keeps a valid tag that follows a malformed one", () => {
    expect(
      resolveLocale({ "accept-language": "en_US, de-DE" }, LOCALES, "en")
    ).toBe("de");
  });

  test("falls back to the default on an empty header", () => {
    expect(resolveLocale({ "accept-language": "" }, LOCALES, "en")).toBe("en");
  });

  test("resolves a supported locale from a regional tag", () => {
    expect(
      resolveLocale({ "accept-language": "de-DE,de;q=0.9" }, LOCALES, "en")
    ).toBe("de");
  });

  test("falls back to the default for an unsupported language", () => {
    expect(resolveLocale({ "accept-language": "ja-JP" }, LOCALES, "en")).toBe(
      "en"
    );
  });

  test("honours quality-ordered preferences", () => {
    expect(
      resolveLocale(
        { "accept-language": "fr-FR;q=0.9,de-DE;q=1.0" },
        LOCALES,
        "en"
      )
    ).toBe("de");
  });
});
