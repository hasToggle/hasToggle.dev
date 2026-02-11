"use client";

import { Card } from "@repo/design-system/components/ui/card";
import { Label } from "@repo/design-system/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@repo/design-system/components/ui/radio-group";
import { cn } from "@repo/design-system/lib/utils";
import { useEffect, useState } from "react";
import Breadcrumb from "./breadcrumb";
import { curriculum } from "./curriculum";
import EmptyState from "./empty-state";
import IconRabbit from "./icon-rabbit";

const VISIBLE_SLOTS = 3;
const SHUFFLE_FACTOR = 0.5;
const DESKTOP_DELAY_RANGE_MS = 400;
const DESKTOP_DELAY_BASE_MS = 1300;
const DESKTOP_INDEX_STEP = 3;
const MOBILE_DELAY_RANGE_MS = 150;
const MOBILE_DELAY_BASE_MS = 200;
const MOBILE_INDEX_STEP = 7;
const MOBILE_ITERATIONS = 7;

export default function SneakPeek({
  onSelect,
}: {
  onSelect: (item: {
    eyebrow: string;
    title: string;
    description: string;
  }) => void;
}) {
  return (
    <>
      <div className="lg:hidden">
        <SneakPeekMobile onSelect={onSelect} />
      </div>
      <div className="hidden lg:block">
        <SneakPeekDesktop onSelect={onSelect} />
      </div>
    </>
  );
}

export function SneakPeekDesktop({
  onSelect,
}: {
  onSelect: (item: {
    eyebrow: string;
    title: string;
    description: string;
  }) => void;
}) {
  const [list, setList] = useState<typeof curriculum>(
    new Array(VISIBLE_SLOTS).fill(null)
  );
  const [shuffledCurriculum, setShuffledCurriculum] = useState<number[]>([]);
  const [atIndex, setAtIndex] = useState(0);
  const [workingIndex, setWorkingIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [buttonState, setButtonState] = useState<
    "idle" | "mapping" | "paused" | "done"
  >("idle");

  const handleReset = () => {
    setList(new Array(VISIBLE_SLOTS).fill(null));
    setWorkingIndex(0);
    setSelectedIndex(null);
    setButtonState("mapping");
  };

  useEffect(() => {
    const shuffled = new Array(curriculum.length)
      .fill(null)
      .map((_, i) => i)
      .sort(() => Math.random() - SHUFFLE_FACTOR);
    setShuffledCurriculum(shuffled);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;

    if (buttonState === "mapping") {
      const organicDelay =
        Math.floor(Math.random() * DESKTOP_DELAY_RANGE_MS) +
        DESKTOP_DELAY_BASE_MS;
      timeout = setTimeout(() => {
        setList(
          list.map((_, i) =>
            i === workingIndex ? curriculum[shuffledCurriculum[atIndex]] : _
          )
        );
        setWorkingIndex(workingIndex + 1);
        setAtIndex((atIndex + DESKTOP_INDEX_STEP) % shuffledCurriculum.length);
      }, organicDelay);
    }
    if (workingIndex === VISIBLE_SLOTS) {
      if (timeout) {
        clearTimeout(timeout);
      }
      setButtonState("done");
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [buttonState, workingIndex, list, shuffledCurriculum, atIndex]);

  return (
    <div className="ml-10 w-full max-w-4xl space-y-5 rounded-b-2xl bg-gray-700/20 px-4 py-5 pr-14 shadow-sm ring-1 ring-white/10">
      <h2 className="max-w-xl text-gray-400 text-sm">
        Ready to dive into the digital rabbit hole? Hit that button and watch as
        we conjure up three mind-bending lessons that&apos;ll make your keyboard
        do backflips!
      </h2>

      <RadioGroup
        className="grid auto-rows-[140px] grid-cols-3 gap-2 overflow-x-auto lg:gap-4"
        defaultValue="0"
        name="curriculum"
      >
        {list.map((item, idx) =>
          item ? (
            <Card
              className={cn(
                "relative inset-ring inset-ring-white/10 min-w-[180px] overflow-hidden rounded-xl border-none bg-gray-700/20 p-4 shadow-sm transition-colors hover:bg-gray-700/40",
                selectedIndex === idx && "inset-ring-white/50"
              )}
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed-size positional slots where index is the identity
              key={idx}
              onClick={() => {
                setSelectedIndex(idx);
                onSelect({
                  eyebrow: item.eyebrow,
                  title: item.title,
                  description: item.description,
                });
              }}
            >
              <RadioGroupItem
                className="peer sr-only"
                id={String(idx)}
                value={String(idx)}
              />
              <Label className="cursor-pointer" htmlFor={String(idx)}>
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm/relaxed text-white">
                    {item.funnyTitle}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {item.funnyDescription}
                  </p>
                </div>
              </Label>
            </Card>
          ) : (
            <EmptyState
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed-size positional slots where index is the identity
              key={idx}
              title={
                list[idx]?.funnyTitle || (
                  <span className="flex items-center gap-2 text-base">
                    <IconRabbit /> {idx + 1} ...
                  </span>
                )
              }
            />
          )
        )}
      </RadioGroup>

      <div className="-ml-4 w-full border-white/10 border-t" />

      <div className="flex items-center gap-2">
        <Breadcrumb
          buttonState={buttonState}
          current={[
            curriculum[shuffledCurriculum[atIndex]]?.eyebrow,
            curriculum[shuffledCurriculum[atIndex]]?.title,
          ]}
          onReset={handleReset}
          setButtonState={setButtonState}
        />
      </div>
    </div>
  );
}

export function SneakPeekMobile({
  onSelect,
}: {
  onSelect: (item: {
    eyebrow: string;
    title: string;
    description: string;
  }) => void;
}) {
  const [lesson, setLesson] = useState<(typeof curriculum)[0]>();
  const [shuffledCurriculum, setShuffledCurriculum] = useState<number[]>([]);
  const [atIndex, setAtIndex] = useState(0);
  const [workingIndex, setWorkingIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [buttonState, setButtonState] = useState<
    "idle" | "mapping" | "paused" | "done"
  >("idle");

  const handleReset = () => {
    setLesson(undefined);
    setWorkingIndex(0);
    setSelectedIndex(null);
    setButtonState("mapping");
  };

  useEffect(() => {
    const shuffled = new Array(curriculum.length)
      .fill(null)
      .map((_, i) => i)
      .sort(() => Math.random() - SHUFFLE_FACTOR);
    setShuffledCurriculum(shuffled);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;

    if (buttonState === "mapping") {
      const organicDelay =
        Math.floor(Math.random() * MOBILE_DELAY_RANGE_MS) +
        MOBILE_DELAY_BASE_MS;
      timeout = setTimeout(() => {
        setWorkingIndex(workingIndex + 1);
        setAtIndex((atIndex + MOBILE_INDEX_STEP) % shuffledCurriculum.length);
      }, organicDelay);
    }
    if (workingIndex === MOBILE_ITERATIONS) {
      if (timeout) {
        setLesson(curriculum[shuffledCurriculum[atIndex]]);
        clearTimeout(timeout);
      }
      setButtonState("done");
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [buttonState, workingIndex, shuffledCurriculum, atIndex]);

  return (
    <div className="ml-10 w-full max-w-4xl space-y-5 rounded-b-2xl bg-gray-700/20 px-4 py-5 pr-14 shadow-sm ring-1 ring-white/10">
      <h2 className="max-w-xl text-gray-400 text-sm">
        Ready to dive into the digital rabbit hole? Hit that button and watch as
        we conjure up three mind-bending lessons that&apos;ll make your keyboard
        do backflips!
      </h2>

      <RadioGroup
        className="min-h-32 overflow-x-auto"
        defaultValue="0"
        name="curriculum"
      >
        {lesson ? (
          <Card
            className={cn(
              "relative inset-ring inset-ring-white/10 min-w-[180px] overflow-hidden rounded-xl border-none bg-gray-700/20 p-4 shadow-sm transition-colors hover:bg-gray-700/40",
              selectedIndex === 0 && "ring-white/50"
            )}
            onClick={() => {
              setSelectedIndex(0);
              onSelect({
                eyebrow: lesson.eyebrow,
                title: lesson.title,
                description: lesson.description,
              });
            }}
          >
            <RadioGroupItem
              className="peer sr-only"
              id={String(0)}
              value={String(0)}
            />
            <Label className="cursor-pointer" htmlFor={String(0)}>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm/relaxed text-white">
                  {lesson.funnyTitle}
                </h3>
                <p className="text-gray-400 text-sm">
                  {lesson.funnyDescription}
                </p>
              </div>
            </Label>
          </Card>
        ) : (
          <EmptyState
            title={
              <span className="flex items-center justify-center gap-2 text-base">
                <IconRabbit /> pulling ...
              </span>
            }
          />
        )}
      </RadioGroup>

      <div className="-ml-4 w-full border-white/10 border-t" />

      <div className="flex items-center gap-2">
        <Breadcrumb
          buttonState={buttonState}
          current={[
            "how about ...",
            curriculum[shuffledCurriculum[atIndex]]?.title,
          ]}
          onReset={handleReset}
          setButtonState={setButtonState}
        />
      </div>
    </div>
  );
}
