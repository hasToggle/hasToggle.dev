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
