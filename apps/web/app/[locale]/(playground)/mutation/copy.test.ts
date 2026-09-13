import { describe, expect, test } from "bun:test";
import {
  COUNT_NOTE,
  PAGE_SEAM,
  REQUEST_EMPTY,
  REQUEST_SEAM,
  SUBMIT_LABEL,
  VIEW_LABEL,
} from "./copy";

describe("the mutation instrument's strings", () => {
  test("the seams state the round trip in three facts each", () => {
    expect(REQUEST_SEAM.split(" · ")).toHaveLength(3);
    expect(PAGE_SEAM.split(" · ")).toHaveLength(3);
    expect(PAGE_SEAM).toContain("without JavaScript");
    expect(REQUEST_SEAM).toContain("POST");
    expect(REQUEST_SEAM).toContain("header");
  });

  test("the view switch wears the docs word, lowercase", () => {
    expect(VIEW_LABEL).toBe("request");
  });

  test("the form's action names what happens to the count", () => {
    expect(SUBMIT_LABEL).toBe("Add one");
  });

  test("prose apostrophes are typographic (voice.md §8)", () => {
    for (const line of [COUNT_NOTE, PAGE_SEAM, REQUEST_EMPTY, REQUEST_SEAM]) {
      expect(line).not.toContain("'");
    }
  });
});
