import { describe, expect, it } from "bun:test";
import {
  isPresenterToggle,
  isTextEntryTarget,
  type StepKeyEvent,
  stepKeyDirection,
} from "./step-keys";

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

describe("isPresenterToggle", () => {
  it("fires on Shift+P", () => {
    expect(isPresenterToggle(keyEvent({ key: "P", shiftKey: true }))).toBe(
      true
    );
    expect(isPresenterToggle(keyEvent({ key: "p", shiftKey: true }))).toBe(
      true
    );
  });

  it("does not fire without the shift", () => {
    expect(isPresenterToggle(keyEvent({ key: "p" }))).toBe(false);
  });

  it("yields to browser and OS shortcuts", () => {
    expect(
      isPresenterToggle(keyEvent({ key: "P", metaKey: true, shiftKey: true }))
    ).toBe(false);
    expect(
      isPresenterToggle(keyEvent({ ctrlKey: true, key: "P", shiftKey: true }))
    ).toBe(false);
    expect(
      isPresenterToggle(keyEvent({ altKey: true, key: "P", shiftKey: true }))
    ).toBe(false);
  });

  it("ignores held-down repeats and already-handled events", () => {
    expect(
      isPresenterToggle(keyEvent({ key: "P", repeat: true, shiftKey: true }))
    ).toBe(false);
    expect(
      isPresenterToggle(
        keyEvent({ defaultPrevented: true, key: "P", shiftKey: true })
      )
    ).toBe(false);
  });

  it("cannot collide with step navigation — the arrows never see a chord", () => {
    expect(stepKeyDirection(keyEvent({ key: "P", shiftKey: true }))).toBeNull();
  });

  it("treats a null target as safe to handle", () => {
    expect(isTextEntryTarget(null)).toBe(false);
  });
});
