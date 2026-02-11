"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  type Dispatch,
  Suspense,
  useCallback,
  useReducer,
  useState,
} from "react";
import { Boundary } from "@/components/ui/boundary";
import { initHighlighter } from "@/lib/highlighter";
import { CodeDisplay } from "./code";
import { getCodeSnippets } from "./code-snippets";
import {
  initialMobileState,
  type MobileAction,
  type MobileState,
  mobileCounterReducer,
} from "./counter-state";
import { SkeletonCode } from "./skeleton";

const flipVariants = {
  initial: { rotateY: 90, opacity: 0 },
  animate: { rotateY: 0, opacity: 1 },
  exit: { rotateY: -90, opacity: 0 },
};

export function CounterMobile() {
  const [state, dispatch] = useReducer(
    mobileCounterReducer,
    initialMobileState
  );
  const [componentToShow, setComponentToShow] = useState<
    "codeDisplay" | "buttonDisplay"
  >("buttonDisplay");

  const pendingHighlighter = initHighlighter();

  const handleAnimationComplete = useCallback(() => {
    setComponentToShow("buttonDisplay");
  }, []);

  const handleButtonClick = () => {
    setComponentToShow("codeDisplay");
  };

  const codeSnippets = getCodeSnippets(state.count);

  return (
    <div className="mx-auto h-full max-w-2xl rounded-[var(--radius)] bg-zinc-50 px-4 py-6 shadow-2xl ring-1 ring-black/10 sm:px-6">
      <Boundary
        animateRerendering={false}
        color="default"
        labels={[state.label]}
        size="medium"
      >
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
            exit="exit"
            initial="initial"
            key="buttonDisplay"
            transition={{ duration: 0.3 }}
            variants={flipVariants}
          >
            <CounterContent
              dispatch={dispatch}
              onButtonClick={handleButtonClick}
              state={state}
            />
          </motion.div>
        )}
      </Boundary>
    </div>
  );
}

type CounterContentProps = {
  state: MobileState;
  dispatch: Dispatch<MobileAction>;
  onButtonClick: () => void;
};

function CounterContent({
  state,
  dispatch,
  onButtonClick,
}: CounterContentProps) {
  return (
    <div className="flex w-full flex-col gap-y-6">
      <div className="flex justify-between self-center sm:self-auto">
        <div className="hidden max-w-64 space-y-2 text-balance sm:block">
          <h3 className="mt-5 font-semibold text-gray-900 text-xl">
            {state.title}
          </h3>
          <p className="text-gray-700 text-sm">{state.paragraph}</p>
          <p className="text-gray-700 text-sm">{state.cta}</p>
        </div>

        <div className="relative aspect-square w-56 overflow-hidden rounded-2xl ring-1 ring-black/10">
          <Image
            alt="squirrel"
            className="absolute inset-x-0 top-0 aspect-square w-full object-cover"
            height={240}
            priority
            src={state.image}
            width={240}
          />
        </div>
      </div>

      <div className="flex justify-between gap-3">
        <Button
          className="hidden w-full rounded-md bg-zinc-800 px-12 py-2 font-semibold text-base text-orange-200 leading-6 ring-1 ring-zinc-200/20 transition duration-150 ease-in-out hover:bg-zinc-800/90 enabled:hover:text-orange-100 enabled:hover:shadow-[0_0_0.5em_0em_rgba(161,161,170,0.6)] disabled:cursor-not-allowed disabled:opacity-70 sm:block"
          disabled={state.decrementDisabled}
          onClick={() => {
            dispatch({ type: "decrement" });
            onButtonClick();
          }}
        >
          take one
        </Button>
        <div className="inset-ring inset-ring-zinc-300 flex w-20 items-baseline justify-center rounded-md px-3.5 py-1.5 font-semibold text-gray-800 text-lg shadow-sm">
          {state.count} <span className="ml-1 text-sm">{"\u{1F330}"}</span>
        </div>
        <Button
          className="w-full rounded-md bg-zinc-800 font-semibold text-base text-orange-200 leading-6 ring-1 ring-zinc-200/20 transition duration-150 ease-in-out hover:bg-zinc-800/90 enabled:hover:text-orange-100 enabled:hover:shadow-[0_0_0.5em_0em_rgba(161,161,170,0.6)] disabled:cursor-not-allowed disabled:opacity-70 sm:px-12 sm:py-2"
          disabled={state.incrementDisabled}
          onClick={() => {
            dispatch({ type: "increment" });
            onButtonClick();
          }}
        >
          give one
        </Button>
      </div>
    </div>
  );
}
