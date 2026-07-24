import { describe, expect, it } from "bun:test";
import { type StepKeyEvent, stepKeyDirection } from "./step-keys";

function keyEvent(overrides: Partial<StepKeyEvent>): StepKeyEvent {
  return {
    altKey: false,
    ctrlKey: false,
    defaultPrevented: false,
    key: "",
    metaKey: false,
    repeat: false,
    shiftKey: false,
    ...overrides,
  };
}

describe("stepKeyDirection", () => {
  it("maps ArrowLeft to prev and ArrowRight to next", () => {
    expect(stepKeyDirection(keyEvent({ key: "ArrowLeft" }))).toBe("prev");
    expect(stepKeyDirection(keyEvent({ key: "ArrowRight" }))).toBe("next");
  });

  it("ignores other keys", () => {
    expect(stepKeyDirection(keyEvent({ key: "ArrowUp" }))).toBeNull();
    expect(stepKeyDirection(keyEvent({ key: "Enter" }))).toBeNull();
    expect(stepKeyDirection(keyEvent({ key: "a" }))).toBeNull();
  });

  it("yields to browser and OS shortcuts (any modifier)", () => {
    expect(
      stepKeyDirection(keyEvent({ key: "ArrowLeft", metaKey: true }))
    ).toBeNull();
    expect(
      stepKeyDirection(keyEvent({ altKey: true, key: "ArrowLeft" }))
    ).toBeNull();
    expect(
      stepKeyDirection(keyEvent({ ctrlKey: true, key: "ArrowRight" }))
    ).toBeNull();
    expect(
      stepKeyDirection(keyEvent({ key: "ArrowRight", shiftKey: true }))
    ).toBeNull();
  });

  it("ignores held-down repeats — one press, one step", () => {
    expect(
      stepKeyDirection(keyEvent({ key: "ArrowRight", repeat: true }))
    ).toBeNull();
  });

  it("respects events something else already handled", () => {
    expect(
      stepKeyDirection(keyEvent({ defaultPrevented: true, key: "ArrowRight" }))
    ).toBeNull();
  });
});
