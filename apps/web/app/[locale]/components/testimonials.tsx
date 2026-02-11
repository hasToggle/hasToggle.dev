"use client";

import { cn } from "@repo/design-system/lib/utils";
import {
  type HTMLMotionProps,
  type MotionValue,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import NextLink from "next/link";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import useMeasure, { type RectReadOnly } from "react-use-measure";
import { Container } from "./container";
import { Heading, Subheading } from "./text";

const MIN_CARD_OPACITY = 0.5;
const SPRING_STIFFNESS = 154;
const SPRING_DAMPING = 23;

const testimonials = [
  {
    img: "/testimonials/beaver_sleeping.png",
    name: "We make progress, not playlists.",
    title: "Your time matters. Skip the fluff.",
    quote: "You would rather watch 40 hours of video content.",
  },
  {
    img: "/testimonials/morgan_freeman.png",
    name: "Freeman was busy, but coding is timeless.",
    title: "Your inner voice works just as well.",
    quote:
      "You need tutorials narrated by Morgan Freeman, or you won't pay attention.",
  },
  {
    img: "/testimonials/fox_Conny.png",
    name: "Code doesn't care about gender.",
    title: "We do have great taste in broccoli, though.",
    quote: "You prefer a female coach.",
  },
  {
    img: "/testimonials/fishing_emails.png",
    name: "We're not fishing for emails.",
    title: "We just love teaching web development.",
    quote:
      "You don't trust web platforms without pop-ups offering free ebooks.",
  },
  {
    img: "/testimonials/broccoli.png",
    name: "Robots won't explain scope like broccoli does.",
    title: "Veggies are underrated problem-solvers.",
    quote: "You refuse to learn from vegetables; where are the robots?",
  },
  {
    img: "/testimonials/cat_happy.png",
    name: "Well ... you might just miss out on building",
    title: "a fictional cat food shop then.",
    quote: "You don't see the point of learning web development.",
  },
];

function TestimonialCard({
  name,
  title,
  img,
  children,
  bounds,
  scrollX,
  ...props
}: {
  img: string;
  name: string;
  title: string;
  children: React.ReactNode;
  bounds: RectReadOnly;
  scrollX: MotionValue<number>;
} & HTMLMotionProps<"div">) {
  const ref = useRef<HTMLDivElement | null>(null);

  const computeOpacity = useCallback(() => {
    const element = ref.current;
    if (!element || bounds.width === 0) {
      return 1;
    }

    const rect = element.getBoundingClientRect();

    if (rect.left < bounds.left) {
      const diff = bounds.left - rect.left;
      const percent = diff / rect.width;
      return Math.max(MIN_CARD_OPACITY, 1 - percent);
    }
    if (rect.right > bounds.right) {
      const diff = rect.right - bounds.right;
      const percent = diff / rect.width;
      return Math.max(MIN_CARD_OPACITY, 1 - percent);
    }
    return 1;
  }, [bounds.width, bounds.left, bounds.right]);

  const opacity = useSpring(computeOpacity(), {
    stiffness: SPRING_STIFFNESS,
    damping: SPRING_DAMPING,
  });

  useLayoutEffect(() => {
    opacity.set(computeOpacity());
  }, [computeOpacity, opacity]);

  useMotionValueEvent(scrollX, "change", () => {
    opacity.set(computeOpacity());
  });

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      {...props}
      className="relative flex aspect-9/16 w-72 shrink-0 snap-start scroll-ml-(--scroll-padding) flex-col justify-end overflow-hidden rounded-3xl sm:aspect-3/4 sm:w-96"
    >
      <Image
        alt=""
        className="absolute inset-x-0 top-0 aspect-square w-full object-cover"
        height={384}
        src={img}
        width={384}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 inset-ring inset-ring-gray-950/10 rounded-3xl bg-linear-to-t from-[calc(7/16*100%)] from-black sm:from-25%"
      />
      <figure className="relative p-10">
        <blockquote>
          <p className="relative text-white text-xl/7">{children}</p>
        </blockquote>
        <figcaption className="mt-6 border-white/20 border-t pt-6">
          <p className="font-medium text-sm/6 text-white">{name}</p>
          <p className="font-medium text-sm/6">
            <span className="bg-linear-to-r from-28% from-[#bef4ff] via-70% via-[#eecf87] to-[#c2e240] bg-clip-text text-transparent">
              {title}
            </span>
          </p>
        </figcaption>
      </figure>
    </motion.div>
  );
}

function CallToAction() {
  return (
    <div>
      <p className="max-w-sm text-gray-600 text-sm/6">
        Join the best place to learn how to toggle.
      </p>
      <div className="mt-2">
        <NextLink
          className="inline-flex items-center gap-2 font-medium text-cyan-600 text-sm/6"
          href="#"
        >
          Get started
          <ArrowRight className="size-5" />
        </NextLink>
      </div>
    </div>
  );
}

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { scrollX } = useScroll({ container: scrollRef });
  const [setReferenceWindowRef, bounds] = useMeasure();
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollX, "change", (x) => {
    // biome-ignore lint/style/noNonNullAssertion: ref is always set when scroll events fire
    setActiveIndex(Math.floor(x / scrollRef.current!.children[0].clientWidth));
  });

  function scrollTo(index: number) {
    const gap = 32;
    // biome-ignore lint/style/noNonNullAssertion: ref is always set when scrollTo is called
    const width = (scrollRef.current!.children[0] as HTMLElement).offsetWidth;
    // biome-ignore lint/style/noNonNullAssertion: ref is always set when scrollTo is called
    scrollRef.current!.scrollTo({ left: (width + gap) * index });
  }

  return (
    <div className="overflow-hidden bg-white py-32">
      <Container>
        <div ref={setReferenceWindowRef}>
          <Subheading>What to expect</Subheading>
          <Heading as="h3" className="mt-2">
            You will{" "}
            <span className="-rotate-1 inline-block bg-ht-cyan-400/50 py-3 pr-2 pl-1 text-zinc-900">
              not enjoy
            </span>{" "}
            hasToggle if ...
          </Heading>
        </div>
      </Container>
      <div
        className={cn([
          "mt-16 flex gap-8 px-(--scroll-padding)",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth",
          "[--scroll-padding:max(1.5rem,calc((100vw-42rem)/2))] lg:[--scroll-padding:max(2rem,calc((100vw-80rem)/2))]",
        ])}
        ref={scrollRef}
      >
        {testimonials.map(({ img, name, title, quote }, testimonialIndex) => (
          <TestimonialCard
            bounds={bounds}
            img={img}
            key={name}
            name={name}
            onClick={() => scrollTo(testimonialIndex)}
            scrollX={scrollX}
            title={title}
          >
            {quote}
          </TestimonialCard>
        ))}
        <div className="w-2xl shrink-0 sm:w-216" />
      </div>
      <Container className="mt-16">
        <div className="flex justify-between">
          <CallToAction />
          <div className="hidden sm:flex sm:gap-2">
            {testimonials.map(({ name }, testimonialIndex) => (
              <button
                aria-label={`Scroll to testimonial from ${name}`}
                className={cn(
                  "size-2.5 rounded-full border border-transparent bg-gray-300 transition",
                  "hover:bg-gray-400 data-active:bg-gray-400",
                  "forced-colors:data-active:bg-[Highlight] forced-colors:focus:outline-offset-4"
                )}
                data-active={
                  activeIndex === testimonialIndex ? true : undefined
                }
                key={name}
                onClick={() => scrollTo(testimonialIndex)}
                type="button"
              />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
