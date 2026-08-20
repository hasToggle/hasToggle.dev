"use client";

import { useCallback } from "react";
import { MarketingButton } from "./marketing-button";

/**
 * The cohort CTA. As a plain #digest link it went dead after one press —
 * same-hash navigations are no-ops — and a link can't hand the visitor a
 * caret. This keeps the href (new tabs and no-JS visitors get the plain
 * anchor) and upgrades the ordinary click: scroll to the digest, put the
 * caret in the email field, keep the URL honest. Works every press.
 */
export function SeatsCta({ children }: { children: React.ReactNode }) {
  const handleClick = useCallback((event: React.MouseEvent) => {
    // Modified clicks (new tab, new window) keep native link behavior.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    document.getElementById("digest")?.scrollIntoView();
    // preventScroll: the section scroll above is already in flight (smooth,
    // via the html element's scroll-smooth) — the focus shouldn't yank it.
    document.getElementById("digest-email")?.focus({ preventScroll: true });
    history.replaceState(null, "", "#digest");
  }, []);

  return (
    <MarketingButton href="#digest" onClick={handleClick}>
      {children}
    </MarketingButton>
  );
}
