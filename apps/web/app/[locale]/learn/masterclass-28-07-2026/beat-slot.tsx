"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

/**
 * Renders its children once their beat is reached, and pulls them into view the
 * first time. Without the scroll, every reveal that lands below the fold is a
 * fumble on stage.
 */
export function BeatSlot({
  children,
  show,
}: {
  children: ReactNode;
  show: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const focused = useRef(false);

  useEffect(() => {
    if (!show || focused.current || !ref.current) {
      return;
    }
    focused.current = true;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    ref.current.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "center",
    });
  }, [show]);

  if (!show) {
    return null;
  }
  return <div ref={ref}>{children}</div>;
}
