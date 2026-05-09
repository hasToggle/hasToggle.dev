export type Framing = "ship-first" | "tests-first";

export const INITIAL_FRAMING: Framing = "ship-first";

export function swapFraming(framing: Framing): Framing {
  return framing === "ship-first" ? "tests-first" : "ship-first";
}

export const FRAMING_LABELS: Record<Framing, string> = {
  "ship-first": "ship the feature first and write tests if something breaks",
  "tests-first": "write the tests first and build the feature against them",
};
