"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { cn } from "@repo/design-system/lib/utils";
import { ChevronRight } from "lucide-react";
import IconRocket from "./icon-rocket";

const buttonText = {
  idle: "Start the journey",
  paused: "Continue exploring",
  mapping: "Unlocking your path ...",
  done: "Discover more",
} as const;

export default function Breadcrumb({
  buttonState,
  setButtonState,
  onReset,
  current,
}: {
  buttonState: "idle" | "mapping" | "paused" | "done";
  setButtonState: (state: "idle" | "mapping" | "paused" | "done") => void;
  onReset: () => void;
  current: string[];
}) {
  return (
    <div className="flex">
      <Button
        className={cn(
          "h-10 w-56 rounded-md rounded-tl-sm rounded-bl-xl bg-gray-950/20 px-12 py-2 font-semibold text-base text-sky-400 leading-6 ring-1 ring-zinc-200/20 transition duration-150 ease-in-out enabled:hover:bg-sky-400/10 enabled:hover:text-sky-300 enabled:hover:shadow-[0_0_0.5em_0em_rgba(56,189,248,0.4)] disabled:cursor-not-allowed disabled:opacity-70",
          {
            "bg-emerald-950/30 text-emerald-400 enabled:hover:bg-emerald-400/10 enabled:hover:text-emerald-300 enabled:hover:shadow-[0_0_0.5em_0em_rgba(52,211,153,0.4)]":
              buttonState === "mapping",
            "bg-amber-950/30 text-amber-400 enabled:hover:bg-amber-400/10 enabled:hover:text-amber-300 enabled:hover:shadow-[0_0_0.5em_0em_rgba(251,191,36,0.4)]":
              buttonState === "paused",
          }
        )}
        onClick={
          buttonState === "done"
            ? () => onReset()
            : () =>
                setButtonState(buttonState === "mapping" ? "paused" : "mapping")
        }
      >
        {buttonText[buttonState]}
        {buttonState === "idle" && (
          <span className="ml-1 text-sm">{"\u{1FA84}\u2728"}</span>
        )}
        {buttonState === "done" && <IconRocket />}
      </Button>

      <ol className="ml-4 hidden items-center space-x-4 sm:flex">
        {buttonState !== "done" &&
          buttonState !== "idle" &&
          current.map((name, idx) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: positional breadcrumb steps where index is the identity
            <li key={idx}>
              <div className="flex items-center">
                <ChevronRight
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-gray-400"
                />
                <span className="ml-4 font-medium text-gray-200 text-sm hover:text-gray-200">
                  {name}
                </span>
              </div>
            </li>
          ))}
      </ol>
    </div>
  );
}
