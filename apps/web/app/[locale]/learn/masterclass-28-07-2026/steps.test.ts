import { describe, expect, test } from "bun:test";
import { getAdjacentStep, getStepIndex, isStepId, STEPS } from "./steps";

describe("masterclass steps", () => {
	test("has six ordered steps starting at intro, ending at synthesis", () => {
		expect(STEPS.map((s) => s.id)).toEqual([
			"intro",
			"era-1",
			"era-2",
			"era-3",
			"era-4",
			"synthesis",
		]);
	});

	test("the four eras carry their verbatim vibe words", () => {
		const vibes = STEPS.filter((s) => s.vibe).map((s) => s.vibe);
		expect(vibes).toEqual([
			"skepticism",
			"guarded fascination",
			"the trust pivot",
			"architectural liberation",
		]);
	});

	test("getStepIndex returns position", () => {
		expect(getStepIndex("intro")).toBe(0);
		expect(getStepIndex("era-3")).toBe(3);
	});

	test("getAdjacentStep walks forward and back, clamping at ends", () => {
		expect(getAdjacentStep("intro", "prev")).toBeNull();
		expect(getAdjacentStep("intro", "next")).toBe("era-1");
		expect(getAdjacentStep("era-4", "next")).toBe("synthesis");
		expect(getAdjacentStep("synthesis", "next")).toBeNull();
	});

	test("isStepId narrows valid ids only", () => {
		expect(isStepId("era-2")).toBe(true);
		expect(isStepId("nope")).toBe(false);
	});
});
