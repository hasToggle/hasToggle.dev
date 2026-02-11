"use client";

import { useEffect, useState } from "react";
import Realistic from "react-canvas-confetti/dist/presets/realistic";

const CONFETTI_DURATION_MS = 3000;

export function Confetti() {
  const [isConfettiActive, setIsConfettiActive] = useState(false);

  useEffect(() => {
    let confettiTimeout: NodeJS.Timeout;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.shiftKey &&
        event.key.toLowerCase() === "h"
      ) {
        event.preventDefault();

        setIsConfettiActive(true);

        clearTimeout(confettiTimeout);

        confettiTimeout = setTimeout(
          () => setIsConfettiActive(false),
          CONFETTI_DURATION_MS
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(confettiTimeout);
    };
  }, []);

  return (
    <>
      {isConfettiActive && <Realistic autorun={{ speed: 1, duration: 500 }} />}
    </>
  );
}
