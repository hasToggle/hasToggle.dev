import { describe, expect, test } from "bun:test";
import { dispositionFor } from "./disposition";
import { PHASES } from "./phases";

describe("era1 disposition", () => {
  test("without presenter mode everything is on screen and there is no footer", () => {
    for (const phase of PHASES) {
      const d = dispositionFor({ furthest: phase.id, presenter: false });
      expect(d).toEqual({
        showDial: true,
        showFooter: false,
        showPostTrainedCell: true,
        showSecondPrompt: true,
      });
    }
  });

  test("presenter mode opens at beat one with an almost empty machine", () => {
    const d = dispositionFor({ furthest: "autocomplete", presenter: true });
    expect(d).toEqual({
      showDial: false,
      showFooter: true,
      showPostTrainedCell: false,
      showSecondPrompt: false,
    });
  });

  test("the second prompt arrives at beat two", () => {
    expect(
      dispositionFor({ furthest: "unanswered", presenter: true })
        .showSecondPrompt
    ).toBe(true);
    expect(
      dispositionFor({ furthest: "unanswered", presenter: true }).showDial
    ).toBe(false);
  });

  test("the dial arrives at beat three, the switch's second cell at beat four", () => {
    const dial = dispositionFor({ furthest: "dial", presenter: true });
    expect(dial.showDial).toBe(true);
    expect(dial.showPostTrainedCell).toBe(false);

    const taught = dispositionFor({ furthest: "taught", presenter: true });
    expect(taught.showPostTrainedCell).toBe(true);
  });

  test("gates never close — the furthest beat reached opens everything", () => {
    const d = dispositionFor({ furthest: "taught", presenter: true });
    expect(d).toEqual({
      showDial: true,
      showFooter: true,
      showPostTrainedCell: true,
      showSecondPrompt: true,
    });
  });
});
