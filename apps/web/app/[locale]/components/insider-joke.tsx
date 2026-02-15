"use client";

import { Toggle } from "@repo/design-system/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/design-system/components/ui/tooltip";
import { cn } from "@repo/design-system/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import useMeasure from "react-use-measure";

const MAX_INITIAL_REACTIONS = 100;
const VIEW_TRANSITION_DURATION = 0.27;
const VIEW_TRANSITION_EASE = [0.25, 1, 0.5, 1] as const;

type Emoji = "\u{1F923}" | "\u{1F644}" | "\u{1F648}";

const reactions: { emoji: Emoji; label: string }[] = [
  { emoji: "\u{1F923}", label: "Hilarious" },
  { emoji: "\u{1F644}", label: "Roll eyes" },
  { emoji: "\u{1F648}", label: "I did not see that" },
];

const views = [
  {
    name: "The components of humor",
    description:
      "Web development may be technical, but humor is a universal language. Let\u2019s break down what a web page looks like under the hood.",
    component: DefaultView,
    icon: DefaultViewIcon,
  },
  {
    name: "What it\u2019s made of",
    description:
      "Everything on the web is made of HTML documents. HTML is like the skeleton of a web page.",
    component: HtmlView,
    icon: DeveloperViewIcon,
  },
  {
    name: "The definition of the perfect <body>",
    description:
      "HTML would look rather bland if it weren\u2019t for CSS. With CSS, you can style your HTML documents to look exactly how you want.",
    component: CssView,
    icon: CssIcon,
  },
];

function DefaultViewIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg aria-hidden="true" {...props} viewBox="0 0 24 24">
      <circle cx="12" cy="12" fill="#4CAF50" r="10" />
    </svg>
  );
}

function DeveloperViewIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg aria-hidden="true" {...props} viewBox="0 0 24 24">
      <rect fill="#2196F3" height="16" width="16" x="4" y="4" />
    </svg>
  );
}

function CssIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg aria-hidden="true" {...props} viewBox="0 0 24 24">
      <polygon fill="#FFC107" points="12,2 2,7 2,17 12,22 22,17 22,7" />
    </svg>
  );
}

export function InsiderJokeDesktop() {
  const [reactionCounts, setReactionCounts] = useState<Record<Emoji, number>>({
    "\u{1F923}": 0,
    "\u{1F644}": 0,
    "\u{1F648}": 0,
  });
  const [userReaction, setUserReaction] = useState<Emoji | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [elementRef, bounds] = useMeasure();

  useEffect(() => {
    const initialCounts = {
      "\u{1F923}": Math.floor(Math.random() * MAX_INITIAL_REACTIONS),
      "\u{1F644}": Math.floor(Math.random() * MAX_INITIAL_REACTIONS),
      "\u{1F648}": Math.floor(Math.random() * MAX_INITIAL_REACTIONS),
    };
    setReactionCounts(initialCounts);
  }, []);

  const handleReaction = (emoji: Emoji) => {
    setReactionCounts((prev) => {
      const newCounts = { ...prev };

      if (userReaction) {
        newCounts[userReaction] -= 1;
      }

      if (userReaction === emoji) {
        setUserReaction(null);
        return newCounts;
      }

      newCounts[emoji] += 1;
      setUserReaction(emoji);
      return newCounts;
    });
  };

  const ActiveView = views[selectedIndex].component;

  return (
    <section
      aria-label="Features for investing all your money"
      className="bg-gray-900 py-20 sm:py-32"
      id="features"
    >
      <div className="flex flex-col items-center justify-center p-4">
        <div className="grid grid-cols-12 items-center gap-8 lg:gap-16 xl:gap-24">
          <div className="relative z-10 order-last col-span-6 space-y-6">
            {views.map((view, index) => (
              <button
                className={cn(
                  "relative w-full rounded-2xl text-left transition-colors hover:bg-gray-800/30 focus:outline-none",
                  selectedIndex === index
                    ? "bg-gray-800/70 shadow"
                    : "text-blue-700 hover:bg-white/12 hover:text-blue-800"
                )}
                key={view.name}
                onClick={() => setSelectedIndex(index)}
                type="button"
              >
                {index === selectedIndex && (
                  <motion.div
                    className="absolute inset-0 bg-gray-800"
                    initial={{ borderRadius: 16 }}
                    layoutId="activeBackground"
                  />
                )}
                <div className="relative z-10 p-8">
                  <view.icon className="h-8 w-8" />
                  <h3 className="mt-6 font-semibold text-lg text-white">
                    <div className="text-left">
                      <span className="absolute inset-0 rounded-2xl" />
                      {view.name}
                    </div>
                  </h3>
                  <p className="mt-2 text-left text-gray-300 text-sm">
                    {view.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
          <div className="relative col-span-6 mx-auto mb-4 w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">
            <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 to-purple-600 opacity-30 blur" />
            <div className="relative rounded-3xl bg-gray-100 py-8 text-center shadow-2xl ring-1 ring-gray-800">
              <motion.div
                animate={{
                  height: bounds.height,
                  transition: {
                    duration: VIEW_TRANSITION_DURATION,
                    ease: VIEW_TRANSITION_EASE,
                  },
                }}
              >
                <div className="px-6 pt-2.5 pb-6 antialiased" ref={elementRef}>
                  <AnimatePresence initial={false} mode="wait">
                    <ActiveView
                      key={selectedIndex}
                      onReaction={handleReaction}
                      reactionCounts={reactionCounts}
                      userReaction={userReaction}
                    />
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Individual View Components

function DefaultView({
  onReaction,
  reactionCounts,
  userReaction,
}: {
  onReaction: (emoji: Emoji) => void;
  reactionCounts: Record<string, number>;
  userReaction: Emoji | null;
}) {
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      initial={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.27 }}
    >
      <H2>Developer Joke</H2>

      <Paragraph>
        Why did the developer quit his job? Because he didn't get{" "}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="underline decoration-gray-400 decoration-dotted">
              arrays
            </TooltipTrigger>
            <TooltipContent className="border-gray-200 bg-gray-100 text-gray-800">
              <div>
                Arrays are the most common data structure in, like, all of
                computer science!
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        !
      </Paragraph>

      <Div className="mr-2 justify-end space-x-3 sm:mr-7">
        {reactions.map(({ emoji, label }) => (
          <div className="group flex flex-col items-center" key={emoji}>
            <motion.button
              aria-label={label}
              className={cn(
                "relative rounded-full px-3 py-2 transition-all duration-200",
                "hover:bg-gray-100",
                "focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2",
                userReaction === emoji
                  ? ["bg-blue-50", "shadow-sm", "ring-2 ring-blue-500"]
                  : ["bg-gray-50", "shadow-sm", "ring-1 ring-gray-200"]
              )}
              onClick={() => onReaction(emoji)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span
                className={cn(
                  "block text-2xl transition-all duration-200",
                  userReaction === emoji ? "scale-110" : "scale-100",
                  userReaction !== emoji && "group-hover:scale-105"
                )}
              >
                {emoji}
              </span>
            </motion.button>
            <div className="mt-1.5 flex flex-col items-center">
              <span
                className={cn(
                  "font-medium text-sm transition-colors",
                  userReaction === emoji ? "text-blue-600" : "text-gray-600"
                )}
              >
                {reactionCounts[emoji]}
              </span>
              <div className="relative h-4">
                {userReaction === emoji && (
                  <span className="absolute top-0 left-1/2 w-20 -translate-x-1/2 whitespace-nowrap text-blue-500 text-xs">
                    {label}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </Div>
    </motion.div>
  );
}

function HtmlView({
  onReaction,
  reactionCounts,
}: {
  onReaction: (emoji: Emoji) => void;
  reactionCounts: Record<string, number>;
}) {
  return (
    <>
      <HTMLViewWrapper label="<h2>">
        <H2>Developer Joke</H2>
      </HTMLViewWrapper>
      <HTMLViewWrapper label="<p>">
        <Paragraph>
          Why did the developer quit his job? Because he didn't get{" "}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="underline decoration-gray-400 decoration-dotted">
                arrays
              </TooltipTrigger>
              <TooltipContent className="border-gray-200 bg-gray-100 text-gray-800">
                <span className="flex items-center">
                  <span className="mr-1 text-2xl">{"\u{1F9A6}"}</span> This is
                  an {"<Otter />"}, eh, tooltip.
                </span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          !
        </Paragraph>
      </HTMLViewWrapper>
      <HTMLViewWrapper label="<div> (Emoji Reactions)">
        <Div className="flex-wrap justify-center space-x-2">
          {reactions.map(({ emoji }) => (
            <HTMLViewWrapper key={emoji} label="<button>">
              <button
                className="cursor-pointer text-2xl focus:outline-none"
                onClick={() => onReaction(emoji)}
                type="button"
              >
                {emoji}
              </button>

              <span className="mt-1 text-gray-600 text-sm">
                {reactionCounts[emoji]}
              </span>
            </HTMLViewWrapper>
          ))}
        </Div>
      </HTMLViewWrapper>
    </>
  );
}

function CssView({
  onReaction,
  reactionCounts,
}: {
  onReaction: (emoji: Emoji) => void;
  reactionCounts: Record<string, number>;
}) {
  return (
    <div className="mt-7 space-y-1">
      <CSSViewWrapper>
        <Headline>Developer Joke</Headline>
      </CSSViewWrapper>
      <CSSViewWrapper>
        <ParagraphElement>
          Why did the developer quit his job? Because he didn't get{" "}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="underline decoration-gray-400 decoration-dotted">
                arrays
              </TooltipTrigger>
              <TooltipContent className="border-sky-300 bg-sky-100 text-sky-800">
                <span className="flex items-center">
                  <span className="text-2xl">
                    <StylishOtter />
                  </span>{" "}
                  This is a styled {"<Ottertip />"}
                </span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          !
        </ParagraphElement>
      </CSSViewWrapper>
      <CSSViewWrapper>
        <DivElement>
          {reactions.map(({ emoji }) => (
            <CSSViewWrapper key={emoji}>
              <button
                className="cursor-pointer text-2xl focus:outline-none"
                onClick={() => onReaction(emoji)}
                type="button"
              >
                {emoji}
              </button>

              <span className="mt-1 text-gray-600 text-sm">
                {reactionCounts[emoji]}
              </span>
            </CSSViewWrapper>
          ))}
        </DivElement>
      </CSSViewWrapper>
    </div>
  );
}

// Icon

function StylishOtter() {
  return (
    <svg
      aria-hidden="true"
      className="mr-2"
      height="32"
      viewBox="0 0 128 128"
      width="32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M80.07 76.12s3.94-3.19 4.13-4.11s-1.69-3.94-.7-10s7.18-12.25 10-10.28s2.53 3.24 2.53 3.24l2.82-.28l2.11 1.55l.56 3.1l3.38 1.55l3.38 4.08l-2.39 8.66l-10.7 4.43l-15.06 5.42z"
        fill="#6E4D44"
      />
      <path
        d="M89.4 52.52s3.03-1.14 4.5.63c1.06 1.27.28 2.96-.56 4.15c-.84 1.2-1.96 2.72-2.75 4.08c-.77 1.34-1.62 3.24-1.2 3.66c.68.68 2.25-1.27 3.17-2.6c1.6-2.34 2.99-4.09 3.59-4.79c.84-.99 2.12-1.7 3.59-.49c1.55 1.27-.14 3.66-.63 4.22s-2.53 3.03-3.24 4.01c-.7.99-1.55 2.46-1.06 2.96c.42.42 1.83-.84 2.6-1.62c.77-.77 2.66-2.85 3.19-3.38c1.13-1.13 2.29-2.36 4.06-.92c1.55 1.27-4.29 10-4.29 10l4.01-2.46s5-7.46 1.67-10.23c-1.95-1.62-4.13-.05-4.13-.05s1.55-2.67-.77-4.72c-2.1-1.84-4.43-.63-4.43-.63s.07-1.97-1.9-3.03c-1.97-1.04-4.85.65-5.42 1.21"
        fill="#50362D"
      />
      <radialGradient
        cx="68.416"
        cy="81.529"
        gradientTransform="matrix(-.3544 .9351 -1.016 -.3851 175.5 48.952)"
        gradientUnits="userSpaceOnUse"
        id="notoOtter0"
        r="37.449"
      >
        <stop offset=".26" stopColor="#B68D76" />
        <stop offset=".41" stopColor="#A87F6A" />
        <stop offset=".679" stopColor="#875B4E" />
      </radialGradient>
      <path
        d="M46.82 49.07L16.55 64.42s1.12 11.29 4.36 19.15c4.65 11.26 14.06 23.46 30.41 29.56c12.81 4.79 26.14 6.29 38.22 1.97c9.02-3.22 12.74-7.32 18.3-12.6c5.45-5.18 11.33-16.12 11.33-16.12s6.34-10.63 4.79-25.06c-1.53-14.24-11.47-26.68-22.31-29.21c-9.44-2.21-9.52.28-5.56 5.42c3.8 4.93 7.88 9.15 9.57 14.36s3.38 15.77-6.34 20.13s-20.84 3.8-28.72-1.41s-13.37-11.4-15.91-15.2s-3.94-8.31-3.94-8.31z"
        fill="url(#notoOtter0)"
      />
      <path
        d="M53.15 104.99c-.42 0-.83-.22-1.05-.61l-2.06-3.66c-.33-.58-.12-1.31.46-1.63c.58-.33 1.31-.12 1.63.46l2.06 3.66c.33.58.12 1.31-.46 1.63c-.17.1-.38.15-.58.15m9.58 3.99c-.47 0-.91-.27-1.1-.73l-1.6-3.75a1.201 1.201 0 0 1 2.21-.94l1.6 3.75c.26.61-.03 1.31-.64 1.57c-.16.07-.32.1-.47.1m5.96-6.57c-.37 0-.73-.17-.96-.48l-2.07-2.77c-.4-.53-.29-1.28.24-1.68s1.28-.29 1.68.24l2.07 2.77a1.198 1.198 0 0 1-.96 1.92m9.71 7.88c-.42 0-.83-.22-1.05-.61l-1.69-3c-.33-.58-.12-1.31.46-1.63c.58-.33 1.31-.12 1.63.46l1.69 3a1.194 1.194 0 0 1-1.04 1.78"
        fill="#52322A"
      />
      <radialGradient
        cx="29.675"
        cy="46.815"
        gradientTransform="matrix(-.8885 .4589 -.3302 -.6394 71.499 63.129)"
        gradientUnits="userSpaceOnUse"
        id="notoOtter1"
        r="24.012"
      >
        <stop offset=".271" stopColor="#FBE5CB" />
        <stop offset=".363" stopColor="#EFD7BE" />
        <stop offset=".538" stopColor="#CFB09B" />
        <stop offset=".776" stopColor="#9C7464" />
        <stop offset=".865" stopColor="#875B4E" />
      </radialGradient>
      <path
        d="M11.69 63.29c2.87 3.56 10.1 9.39 28.06-1.27c16.49-9.78 12.32-20.14 10.61-23.46c-1.6-3.1-3.54-4.31-3.54-4.31s1.71-3.72-1.48-5.6c-3.62-2.13-5.53 1.3-5.53 1.3s-7.69-3.37-17.7 1.09C9.25 36.78 8.69 46.72 8.69 46.72s-3.85-.07-4.32 4.32c-.56 5.24 4.69 6.01 4.69 6.01s.28 3.32 2.63 6.24"
        fill="url(#notoOtter1)"
      />
      <path
        d="M44.43 68.5c2.32-1.48 2.46-5.33 2.53-7.81c.07-2.46-.92-4.25-2.75-4.01c-2.18.28-2.11 2.67-2.11 2.67s-1.41-2.89-3.8-1.83c-2.51 1.11-1.06 4.43-1.06 4.43s-2.98-2.18-4.08.92c-.56 1.58 1.27 4.29 4.01 5.84c2.75 1.55 7.26-.21 7.26-.21"
        fill="#E0DFE2"
      />
      <path
        d="M39.11 59.21c-.54.24-.63 1.41.28 3.17c.81 1.55 1.79 1.9 2.32 1.55s.04-1.72-.49-2.75c-.35-.68-1.16-2.4-2.11-1.97m4.12 1.44c.03.81.11 2.39 1.09 2.43c.99.04.88-1.97.88-2.46s-.04-1.94-.92-2.01s-1.09 1.05-1.05 2.04m-7.89 3.84c.87.97 1.72 2.04 2.5 1.48s-.53-1.97-.92-2.5s-1.34-1.48-1.94-1.06c-.59.42-.23 1.41.36 2.08"
        fill="#FEFCFE"
      />
      <path
        d="M52.03 59.91s3.76-7.01 12.11-1.2c8.87 6.17 1.97 13.3-2.67 13.23s-7.95.42-10.56-.42s-5-3.38-5-3.38l-2.46 1.69s.49 4.79-1.2 6.83c-1.7 2.05 1.75 11.55-.85 14.08s-6.97 4.29-9.71 3.03c-2.75-1.27-5.7-5.84-6.26-9.92s1.41-13.59 5.28-13.87s4.36.07 4.36.07s1.27-4.5 4.65-4.08s4.79 1.97 4.79 1.97l.92-.77s-1.2-1.9 1.27-4.15c2.46-2.25 5.28-.35 5.28-.35s.05-2.13.05-2.76"
        fill="#875B4E"
      />
      <path
        d="M26.45 81.97c.43.9 1.36-.05 1.27-2.82s.52-5.58 2.53-7.23c2.02-1.64 4.13-.28 4.13-.28s-.42 1.27.05 2.86s1.41 2.16 1.17.42c-.23-1.74 0-8.73 4.46-8.02c4.46.7 3.53 6.44 1.69 8.96c-1.27 1.74-3.38 1.45-3.38 1.74c0 .28 1.69 5.58 1.88 8.31c.19 2.72-.05 6.34-3.05 6.76s-7.04-.94-6.8 0c.23.94 5.82 4.41 10.51 1.88c4.98-2.69 3.57-9.39 3.38-10.65c-.19-1.27-1.17-4.55-1.22-5.21c-.01-.09 1.97-1.81 2.44-4.04c.66-3.1.09-4.6.09-4.6s1.83 2.3 4.46 3.05s5.77-.05 5.77-.05s5.4 1.74 9.24-.84c3.85-2.58 3.93-5.77 3.71-6.52c-.61-2.06-.98.24-1.55 1.22c-.84 1.45-2.86 3.38-6.19 3.89c-3.33.52-4.74-.7-5.26-.66s-3.28 1.55-6.19-.47c-3.68-2.55-2.7-5.88-.84-6.38c1.55-.42 4.3.47 5.4 2.06c1.03 1.5 1.88 3.85 2.21 3.33s.05-2.82-1.08-4.32s-2.39-1.97-2.44-2.58c-.09-1.17.38-2.21 1.17-3.1s2.77-1.41 2.02-1.97s-3.28-.19-4.41 1.55s-.56 3.14-.56 3.14s-3.43-1.45-5.73 1.22c-1.82 2.12-1.08 4.5-1.08 4.5s-1.83-2.86-5.02-2.25s-4.32 3.99-4.32 3.99s-3-1.27-5.73.56s-3.61 5.77-3.52 7.88c.09 2.13.37 3.77.79 4.67"
        fill="#6A493B"
      />
      <path
        d="M19.01 47.06c-2.46.43-2.39 2.67-2.36 3.45c.04.77.81 2.15 2.71 2.01c2.05-.15 2.71-2.08 2.57-3.31s-1.51-2.39-2.92-2.15M36.4 38.9c-1.21 1.01-1.09 2.89.14 3.98c1.17 1.03 3.31 1.05 4.19-.53c.85-1.52.28-2.78-.67-3.55s-2.78-.64-3.66.1m-8.09 2.96c-2.33 1.12-1.6 3.43-1.79 5.21c-.22 1.97-1.52 2.39-1.52 4.08c0 1.37 2.11.97 4.08 1.06c1.65.07 3.21 1.83 2.22 3.1c-.63.81-1.74.55-2.36-.04c-.63-.6-1.16-.6-1.44-.14s.46 2.91 3.34 2.67c2.57-.21 3.2-3.1 3.2-3.1s2.33.97 4.05-.18c1.9-1.27 1.44-3.77.67-4.5s-1.38-.25-1.41.04c-.07.63.35.81.42 1.34s-.14 1.3-.77 1.65c-.55.3-1.34-.11-1.65-.6c-.32-.49-.35-1.45-.28-1.97c.21-1.55 3.83-3.7 2.96-5.17c-.81-1.37-1.72.25-4.33-1.48c-1.07-.71-2.47-3.38-5.39-1.97"
        fill="#27282D"
      />
      <path
        d="M20.42 67.59c-.04 0-.09 0-.14-.01a.736.736 0 0 1-.6-.87c0-.03.46-2.52.88-5.19c.42-2.72.98-4.81 1-4.9a.75.75 0 1 1 1.45.39c-.01.02-.56 2.11-.97 4.74c-.42 2.69-.88 5.2-.88 5.23a.75.75 0 0 1-.74.61m4.55.68s-.03 1.07-.84 1c-.86-.07-.66-1.11-.66-1.11s.25-3.51.35-5.44c.11-1.94.35-5.09.35-5.09s.06-.84.82-.79s.68.9.68.9s-.25 3.12-.35 5.05c-.1 1.95-.35 5.48-.35 5.48m2.63-1.2c-.4 0-.73-.32-.75-.72c0 0-.1-2.51-.17-3.39c-.07-.9-.07-4.62-.07-4.78c0-.41.34-.75.75-.75s.75.34.75.75c0 1.32.01 3.98.07 4.66c.07.88.17 3.34.18 3.44c.02.41-.3.76-.72.78c-.02.01-.03.01-.04.01m21.01-12.85c-.12 0-.25-.03-.37-.1c-.02-.01-2.4-1.34-3.98-2.13c-1.56-.78-3.9-1.61-3.93-1.62a.754.754 0 0 1-.46-.96c.14-.39.57-.59.96-.46c.1.04 2.46.87 4.1 1.69c1.62.81 3.94 2.11 4.04 2.16c.36.2.49.66.29 1.02c-.13.26-.38.4-.65.4m1.48-3.06c-.12 0-.25-.03-.36-.09c-.02-.01-2.34-1.29-4.17-2c-1.8-.7-4.5-1.12-4.52-1.12a.747.747 0 0 1-.63-.85c.06-.41.44-.69.85-.63c.12.02 2.89.44 4.84 1.2c1.92.75 4.25 2.03 4.35 2.08c.36.2.49.66.29 1.02c-.13.25-.39.39-.65.39m-.38-4.79c-.04 0-.07 0-.11-.01c-.03 0-2.57-.39-4.12-.56c-1.51-.17-4.19-.07-4.22-.07c-.41.03-.76-.31-.78-.72s.31-.76.72-.78c.11 0 2.82-.11 4.44.07c1.58.18 4.08.55 4.18.57c.41.06.69.44.63.85a.76.76 0 0 1-.74.65"
        fill="#E2E2E4"
      />
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="notoOtter2"
        x1="88.858"
        x2="111.349"
        y1="107.701"
        y2="87.218"
      >
        <stop offset=".208" stopColor="#875B4E" />
        <stop offset=".579" stopColor="#765247" />
        <stop offset=".888" stopColor="#6E4D44" />
      </linearGradient>
      <path
        d="M82.93 106.72c-.14-3.17.42-6.26.84-7.81c1.12-4.12 2.11-6.62 4.36-7.95c5.96-3.54 9.95-3.11 12.11-4.65c2.46-1.76 7.34-9.46 10.91-8.05c2.5.99 2.39 5.3 2.39 5.3s3.87.07 4.5 2.39s-.84 4.72-.84 4.72s2.96 1.46 3.19 3.45c.23 2.06-.66 4.27-5.44 5.82s-10.98 1.64-10.98 1.64s-1.4 8.34-11.05 10.84c-6.26 1.62-9.78-.91-9.99-5.7"
        fill="url(#notoOtter2)"
      />
      <path
        d="M83.23 103.27c-.42.19-2.34-9.08 3.61-13.19c4.83-3.33 9.71-2.58 12.44-4.74c2.72-2.16 9.24-11.47 13.89-7.51c2.53 2.16 1.22 4.79 1.22 4.79s2.97-.64 4.69 2.3c1.74 2.96-.75 5.63-.75 5.63s2.96.99 3 3.28c.05 2.3-.89 4.65-3.47 5.82c-2.99 1.36-7.46 2.53-10 2.67c-2.53.14-5.44-.61-3.28-.94s10.14-2.86 11.87-3.38c2.96-.89 2.91-3.1 2.11-3.94c-1.16-1.23-2.25-.94-5.73.09c-2.92.87-6.57 2.58-6.71 1.5s3.33-2.25 5.68-3.57c2.35-1.31 6.24-2.72 5.21-5.11s-3.28-1.92-5.82-.38c-2.53 1.55-6.83 4.79-7.04 3.52c-.09-.56 4.13-3.99 5.35-4.83s3.75-2.67 2.02-4.69s-4.08.28-5.82 1.88s-3.85 4.65-6.19 5.63c-3.53 1.48-8.56 1.95-10.93 3.75c-5.06 3.87-4.52 11.05-5.35 11.42"
        fill="#50362D"
      />
    </svg>
  );
}

// CSS View Components

function Headline({ children }: { children: React.ReactNode }) {
  const [pressed, setPressed] = useState(false);
  return (
    <H2
      className={cn(
        "relative border border-ht-red-500 bg-ht-red-400 text-center",
        {
          "font-normal": pressed,
        }
      )}
    >
      {children}
      <Toggle
        className="absolute -top-[1.44rem] -right-px h-5 rounded-none border border-transparent bg-red-800 py-2.5 font-semibold text-white text-xs hover:bg-red-700 hover:text-white disabled:opacity-90 data-[state=on]:bg-red-100 data-[state=on]:text-accent-foreground"
        onPressedChange={setPressed}
        pressed={pressed}
        variant="outline"
      >
        font-weight: 700
      </Toggle>
    </H2>
  );
}

function ParagraphElement({ children }: { children: React.ReactNode }) {
  const [pressed, setPressed] = useState(false);

  return (
    <Paragraph
      className={cn("relative mt-8 border border-ht-blue-500 bg-ht-blue-400", {
        "text-left": pressed,
      })}
    >
      {children}
      <Toggle
        className="absolute -top-[1.44rem] -right-px h-5 rounded-none border border-transparent bg-blue-800 py-2.5 font-semibold text-white text-xs hover:bg-blue-700 hover:text-white disabled:opacity-90 data-[state=on]:bg-blue-100 data-[state=on]:text-accent-foreground"
        onPressedChange={setPressed}
        pressed={pressed}
        variant="outline"
      >
        text-align: center
      </Toggle>
    </Paragraph>
  );
}

function DivElement({ children }: { children: React.ReactNode }) {
  const [pressed, setPressed] = useState(false);

  return (
    <Div
      className={cn(
        "relative mt-8 flex justify-end space-x-2 border border-ht-green-400 bg-ht-green-300",
        {
          "justify-normal": pressed,
        }
      )}
    >
      {children}
      <Toggle
        className="absolute -top-[1.44rem] -right-px h-5 rounded-none border border-transparent bg-green-800 py-2.5 font-semibold text-white text-xs hover:bg-green-700 hover:text-white disabled:opacity-90 data-[state=on]:bg-green-100 data-[state=on]:text-accent-foreground"
        onPressedChange={setPressed}
        pressed={pressed}
        variant="outline"
      >
        justify-content: flex-end
      </Toggle>
    </Div>
  );
}

// Helper Components

const HTMLViewWrapper = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="my-2 rounded border-2 border-purple-400 border-dashed p-2">
    <Box>{label}</Box>
    {children}
  </div>
);

const CSSViewWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => <div className={cn("my-2 rounded p-2", className)}>{children}</div>;

const Box = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <motion.div
    animate={{ opacity: 1, scale: 1 }}
    className={cn(
      "mb-2 rounded bg-purple-100 p-1 font-mono text-purple-800 text-xs",
      className
    )}
    exit={{ opacity: 0, scale: 0.7 }}
    initial={{ opacity: 0, scale: 0.76 }}
    transition={{ duration: 0.67 }}
  >
    {children}
  </motion.div>
);

const H2 = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <motion.h2 className={cn("mb-4 font-bold text-2xl text-gray-800", className)}>
    {children}
  </motion.h2>
);

const Paragraph = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <motion.div className={cn("mb-6 text-gray-700 text-lg", className)}>
    {children}
  </motion.div>
);

const Div = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => <motion.div className={cn("flex", className)}>{children}</motion.div>;

export function InsiderJokeMobile() {
  const [reactionCounts, setReactionCounts] = useState<Record<Emoji, number>>({
    "\u{1F923}": 0,
    "\u{1F644}": 0,
    "\u{1F648}": 0,
  });
  const [userReaction, setUserReaction] = useState<Emoji | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const slideContainerRef = useRef<React.ElementRef<"div">>(null);
  const slideRefs = useRef<React.ElementRef<"div">[]>([]);

  const handleReaction = (emoji: Emoji) => {
    setReactionCounts((prev) => {
      const newCounts = { ...prev };

      if (userReaction) {
        newCounts[userReaction] -= 1;
      }

      if (userReaction === emoji) {
        setUserReaction(null);
        return newCounts;
      }

      newCounts[emoji] += 1;
      setUserReaction(emoji);
      return newCounts;
    });
  };

  useEffect(() => {
    const initialCounts = {
      "\u{1F923}": Math.floor(Math.random() * MAX_INITIAL_REACTIONS),
      "\u{1F644}": Math.floor(Math.random() * MAX_INITIAL_REACTIONS),
      "\u{1F648}": Math.floor(Math.random() * MAX_INITIAL_REACTIONS),
    };
    setReactionCounts(initialCounts);
  }, []);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target instanceof HTMLDivElement) {
            setActiveIndex(slideRefs.current.indexOf(entry.target));
            break;
          }
        }
      },
      {
        root: slideContainerRef.current,
        threshold: 0.6,
      }
    );

    for (const slide of slideRefs.current) {
      if (slide) {
        observer.observe(slide);
      }
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="w-full bg-gray-900">
      <div
        className="-mb-4 flex snap-x snap-mandatory -space-x-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-4 [scrollbar-width:none] sm:-space-x-6 [&::-webkit-scrollbar]:hidden"
        ref={slideContainerRef}
      >
        {views.map((view, viewIndex) => (
          <div
            className="w-full flex-none snap-center px-4 sm:px-6"
            key={view.name}
            ref={(ref) => {
              if (ref) {
                slideRefs.current[viewIndex] = ref;
              }
            }}
          >
            <div className="relative z-10 p-8">
              <view.icon className="h-8 w-8" />
              <h3 className="mt-6 font-semibold text-lg text-white">
                <div className="text-left">
                  <span className="absolute inset-0 rounded-2xl" />
                  {view.name}
                </div>
              </h3>
              <p className="mt-2 text-left text-gray-300 text-sm">
                {view.description}
              </p>
            </div>
            <div className="relative col-span-6 mx-auto mb-4 w-full max-w-md rounded-3xl bg-white p-4 text-center shadow-lg">
              <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 to-purple-600 opacity-30 blur" />
              <div className="relative rounded-3xl bg-gray-100 px-6 py-8 text-center shadow-2xl ring-1 ring-gray-800">
                {view.component({
                  onReaction: handleReaction,
                  reactionCounts,
                  userReaction,
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center gap-3">
        {views.map((view, viewIndex) => (
          <button
            aria-label={`Go to slide ${viewIndex + 1}`}
            className={cn(
              "relative h-0.5 w-4 rounded-full",
              viewIndex === activeIndex ? "bg-gray-300" : "bg-gray-500"
            )}
            key={view.name}
            onClick={() => {
              slideRefs.current[viewIndex].scrollIntoView({
                block: "nearest",
                inline: "nearest",
              });
            }}
            type="button"
          >
            <span className="absolute -inset-x-1.5 -inset-y-3" />
          </button>
        ))}
      </div>
    </div>
  );
}
