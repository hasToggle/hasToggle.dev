/**
 * Runs a task once the page has loaded and the main thread goes idle — the
 * same schedule PostHog starts on (packages/analytics). For work that should
 * never compete with first paint or hydration for bandwidth or CPU.
 */
export const afterLoad = (task: () => void) => {
  // The timeout stops the callback being starved on a page that never goes
  // quiet. Idle if the browser offers it, next tick otherwise.
  const whenIdle = () => {
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(task, { timeout: 3000 });
      return;
    }
    window.setTimeout(task, 1);
  };

  if (document.readyState === "complete") {
    whenIdle();
    return;
  }

  window.addEventListener("load", whenIdle, { once: true });
};
