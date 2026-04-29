"use client";

import { useCallback, useState } from "react";
import { Expandable } from "../../components/expandable";
import { DuckEssay } from "./duck-essay";
import { type Framing, INITIAL_FRAMING, swapFraming } from "./framing";
import { Prompt } from "./prompt";
import { Response } from "./response";

export function Mirror() {
  const [framing, setFraming] = useState<Framing>(INITIAL_FRAMING);
  const [seen, setSeen] = useState<ReadonlySet<Framing>>(
    () => new Set<Framing>([INITIAL_FRAMING])
  );
  const [flashKey, setFlashKey] = useState(0);

  const handleToggle = useCallback(() => {
    const next = swapFraming(framing);
    setFraming(next);
    setFlashKey((n) => n + 1);
    setSeen((prev) => {
      if (prev.has(next)) {
        return prev;
      }
      const updated = new Set(prev);
      updated.add(next);
      return updated;
    });
  }, [framing]);

  const showEmptyMirrorLine = seen.size === 2;

  return (
    <div className="space-y-4">
      <Prompt framing={framing} onToggle={handleToggle} />
      <Response flashKey={flashKey} framing={framing} />
      {showEmptyMirrorLine && (
        <p className="fade-in mt-3 animate-in pl-1 text-foreground/55 text-sm italic leading-6 duration-300">
          It agreed with both. What did its agreement tell you?
        </p>
      )}
      <Expandable label="Did you know? The duck was honest.">
        <DuckEssay />
      </Expandable>
    </div>
  );
}
