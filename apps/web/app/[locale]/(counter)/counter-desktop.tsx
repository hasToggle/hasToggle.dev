"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { cn } from "@repo/design-system/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import type { Dispatch } from "react";
import { Suspense, useCallback, useReducer, useState } from "react";
import { Boundary } from "@/components/ui/boundary";
import { Ping } from "@/components/ui/ping";
import { initHighlighter } from "@/lib/highlighter";
import { CodeDisplay } from "./code";
import { getCodeSnippets } from "./code-snippets";
import {
  type DesktopAction,
  type DesktopState,
  desktopCounterReducer,
  initialDesktopState,
} from "./counter-state";
import { SkeletonCode } from "./skeleton";

const flipVariants = {
  initial: { rotateY: 90, opacity: 0 },
  animate: { rotateY: 0, opacity: 1 },
  exit: { rotateY: -90, opacity: 0 },
};

export function CounterDesktop() {
  const [state, dispatch] = useReducer(
    desktopCounterReducer,
    initialDesktopState
  );
  const [componentToShow, setComponentToShow] = useState<
    "codeDisplay" | "buttonDisplay"
  >("buttonDisplay");

  const pendingHighlighter = initHighlighter();

  const handleAnimationComplete = useCallback(() => {
    setComponentToShow("buttonDisplay");
  }, []);

  const codeSnippets = getCodeSnippets(state.internalCount);

  return (
    <div className="h-full rounded-[var(--radius)] bg-zinc-50 px-4 py-6 shadow-2xl ring-1 ring-black/10 sm:px-6">
      <Boundary
        animateRerendering={false}
        color="default"
        labels={[state.label]}
        size="default"
      >
        {/* Header section */}
        <div
          className={cn(
            "mt-6 mb-7 rounded-md border border-transparent bg-zinc-100 px-4 py-5 sm:px-6",
            { "border-zinc-300 bg-zinc-200": !state.disabled }
          )}
        >
          <div className="-ml-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="mt-2 ml-4">
              <h3 className="font-semibold text-base text-gray-900">
                {state.title}
              </h3>
              <p className="text-gray-700 text-sm">{state.aside}</p>
            </div>
            <div className="mt-2 ml-4 shrink-0">
              <span className="relative inline-flex">
                <Button
                  className="rounded-md bg-zinc-800 px-12 py-2 font-semibold text-base text-orange-500 leading-6 ring-1 ring-zinc-200/20 transition duration-150 ease-in-out enabled:hover:text-orange-400 enabled:hover:shadow-[0_0_0.5em_0em_rgba(236,159,72,0.6)] disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={state.disabled}
                  onClick={() => {
                    dispatch({ type: "updated" });
                    setComponentToShow("codeDisplay");
                  }}
                >
                  <span>
                    {state.disabled
                      ? "idle \u{1F43F}\u{FE0F}"
                      : `Increase to ${state.internalCount} \u{1F330}`}
                  </span>
                  {!state.disabled && <Ping />}
                </Button>
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto my-10 max-w-sm border-zinc-200 border-b" />

        {/* Main section */}
        <Boundary
          animateRerendering={state.animateRerendering}
          color="default"
          key={state.count}
          labels={["Counter Component"]}
          size="default"
        >
          <div className="flex h-[320px] w-full items-center sm:h-[354px]">
            {componentToShow === "codeDisplay" && (
              <motion.div
                animate="animate"
                className="w-full"
                exit="exit"
                initial="initial"
                key="codeDisplay"
                transition={{ duration: 0.5 }}
                variants={flipVariants}
              >
                <Suspense fallback={<SkeletonCode />}>
                  <CodeDisplay
                    code={codeSnippets}
                    onAnimationComplete={handleAnimationComplete}
                    pendingHighlighter={pendingHighlighter}
                  />
                </Suspense>
              </motion.div>
            )}

            {componentToShow === "buttonDisplay" && (
              <motion.div
                animate="animate"
                className="flex w-full justify-between gap-x-8"
                exit="exit"
                initial="initial"
                key="buttonDisplay"
                transition={{ duration: 0.3 }}
                variants={flipVariants}
              >
                <CounterContent dispatch={dispatch} state={state} />
              </motion.div>
            )}
          </div>
        </Boundary>
      </Boundary>
    </div>
  );
}

type CounterContentProps = {
  state: DesktopState;
  dispatch: Dispatch<DesktopAction>;
};

function CounterContent({ state, dispatch }: CounterContentProps) {
  return (
    <>
      <div className="flex h-full w-[600px] flex-col items-center justify-center gap-y-6 self-center p-4 font-medium text-black">
        <div>
          You collected{" "}
          <span
            className={cn(
              "inset-ring inset-ring-zinc-300 mx-1 rounded-md px-3.5 py-1.5 font-semibold text-gray-900 text-lg shadow-sm",
              {
                "animate-[highlight_1s_ease-in-out_1]": state.disabled,
                "bg-zinc-100": !state.disabled,
              }
            )}
          >
            {state.count}
          </span>{" "}
          {state.count === 1 ? "hazelnut" : "hazelnuts"} {"\u{1F330}"}!
        </div>
        <Button
          className="rounded-md bg-zinc-800 px-12 py-2 font-semibold text-base text-orange-200 leading-6 ring-1 ring-zinc-200/20 transition duration-150 ease-in-out hover:bg-zinc-800/90 enabled:hover:text-orange-100 enabled:hover:shadow-[0_0_0.5em_0em_rgba(161,161,170,0.6)] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={!state.disabled}
          onClick={() => {
            dispatch({ type: "updating" });
          }}
        >
          +1 {"\u{1F330}"}
        </Button>
        <div className="min-h-[3rem] text-balance text-center font-light text-base italic">
          {state.info}
        </div>
      </div>

      <div className="xl:-mt-3 relative my-auto flex aspect-square w-72 shrink-0 flex-col justify-end overflow-hidden rounded-2xl ring-1 ring-black/10 sm:w-96">
        <Image
          alt="squirrel waiting"
          className="absolute inset-x-0 top-0 aspect-square w-full object-cover"
          height={384}
          src={state.image}
          width={384}
        />
      </div>
    </>
  );
}
