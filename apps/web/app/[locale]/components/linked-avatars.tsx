"use client";

import { cn } from "@repo/design-system/lib/utils";
import { Code2Icon } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

const RING_COUNT = 42;
const RING_RADIUS_STEP = 14;
const RING_RADIUS_BASE = 4;
const RING_STAGGER_DELAY = 0.02;
const RING_SCALE_KEYFRAMES = [1, 1.12, 1.05, 1.15, 1];
const RING_OPACITY_KEYFRAMES = [0.15, 0.4, 0.25, 0.4, 0.15];
const RING_ANIMATION_TIMES = [0, 0.2, 0.35, 0.5, 1];
const HEART_ACTIVE_SCALE = 1.15;

const transition = {
  duration: 0.75,
  repeat: Number.POSITIVE_INFINITY,
  repeatDelay: 1.25,
};

function Rings() {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "col-start-1 row-start-1 size-full",
        "mask-intersect mask-[linear-gradient(to_bottom,black_90%,transparent),radial-gradient(circle,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_100%)]"
      )}
      fill="none"
      viewBox="0 0 500 500"
    >
      {Array.from(new Array(RING_COUNT).keys()).map((n) => (
        <motion.circle
          className="stroke-white"
          cx="250"
          cy="250"
          key={n}
          r={n * RING_RADIUS_STEP + RING_RADIUS_BASE}
          variants={{
            idle: {
              scale: 1,
              strokeOpacity: 0.15,
            },
            active: {
              scale: RING_SCALE_KEYFRAMES,
              strokeOpacity: RING_OPACITY_KEYFRAMES,
              transition: {
                ...transition,
                delay: n * RING_STAGGER_DELAY,
                times: RING_ANIMATION_TIMES,
              },
            },
          }}
        />
      ))}
    </svg>
  );
}

function Heart() {
  return (
    <div className="z-10 col-start-1 row-start-1 flex items-center justify-center">
      <motion.div
        className="flex size-6 items-center justify-center rounded-full bg-linear-to-t from-cyan-300 to-teal-400 shadow"
        variants={{
          idle: { scale: 0.97 },
          active: {
            scale: [1, HEART_ACTIVE_SCALE, 1],
            transition: { ...transition, duration: 0.75 },
          },
        }}
      >
        <Code2Icon className="size-4" />
      </motion.div>
    </div>
  );
}

function Photos() {
  return (
    <div className="z-10 col-start-1 row-start-1">
      <div className="mx-auto flex size-full max-w-md items-center justify-around">
        <Image
          alt="Female developer"
          className="size-20 scale-125 rounded-full bg-white/15 ring-4 ring-white/10"
          height={80}
          src="/female_developer.png"
          width={80}
        />
        <Image
          alt="Male developer"
          className="size-20 scale-125 rounded-full bg-white/15 ring-4 ring-white/10"
          height={80}
          src="/male_developer.png"
          width={80}
        />
      </div>
    </div>
  );
}

export function LinkedAvatars() {
  return (
    <div aria-hidden="true" className="isolate mx-auto grid h-full grid-cols-1">
      <Rings />
      <Photos />
      <Heart />
    </div>
  );
}
