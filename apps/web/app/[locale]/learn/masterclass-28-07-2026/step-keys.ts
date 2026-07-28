/**
 * Pure predicates for the exhibit's global key bindings — arrow-key step
 * navigation and the presenter-mode toggle — kept independent of the DOM's
 * `KeyboardEvent` so they're testable without one.
 */

/**
 * Arrow keys must never steal from controls that use them: sliders,
 * tabs, text inputs, selects. The selector names every arrow-consuming
 * surface in the exhibit; matches (or their descendants) win.
 */
const ARROW_CONSUMING_SELECTOR = [
  "input",
  "textarea",
  "select",
  "[contenteditable='true']",
  "[contenteditable='']",
  "[role='slider']",
  "[role='tab']",
  "[role='radio']",
  "[role='spinbutton']",
  "[role='combobox']",
  "[role='listbox']",
  "[role='menu']",
].join(", ");

export interface StepKeyEvent {
  altKey: boolean;
  ctrlKey: boolean;
  defaultPrevented: boolean;
  key: string;
  metaKey: boolean;
  repeat: boolean;
  shiftKey: boolean;
}

export function stepKeyDirection(event: StepKeyEvent): "prev" | "next" | null {
  const modified =
    event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
  if (event.defaultPrevented || event.repeat || modified) {
    return null;
  }
  if (event.key === "ArrowLeft") {
    return "prev";
  }
  if (event.key === "ArrowRight") {
    return "next";
  }
  return null;
}

export function isArrowConsumingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest(ARROW_CONSUMING_SELECTOR) !== null
  );
}

/**
 * `P` consumes nothing, so the presenter chord only has to yield to genuine
 * text entry — not to the sliders and tabs the arrows must respect.
 */
const TEXT_ENTRY_SELECTOR = [
  "input",
  "textarea",
  "[contenteditable='true']",
  "[contenteditable='']",
].join(", ");

export function isTextEntryTarget(target: EventTarget | null): boolean {
  return (
    typeof Element !== "undefined" &&
    target instanceof Element &&
    target.closest(TEXT_ENTRY_SELECTOR) !== null
  );
}

export function isPresenterToggle(event: StepKeyEvent): boolean {
  if (event.defaultPrevented || event.repeat) {
    return false;
  }
  if (event.altKey || event.ctrlKey || event.metaKey) {
    return false;
  }
  return event.shiftKey && event.key.toLowerCase() === "p";
}
