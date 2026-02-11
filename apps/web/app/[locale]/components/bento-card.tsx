"use client";

import { cn } from "@repo/design-system/lib/utils";
import { motion } from "framer-motion";
import { Subheading } from "./text";

export function BentoCard({
  dark = false,
  className = "",
  eyebrow,
  title,
  description,
  graphic,
  fade = [],
}: {
  dark?: boolean;
  className?: string;
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  graphic: React.ReactNode;
  fade?: ("top" | "bottom")[];
}) {
  return (
    <motion.div
      className={cn(
        className,
        "group relative flex flex-col overflow-hidden rounded-lg",
        "bg-white shadow-sm ring-1 ring-black/5",
        "data-[dark]:bg-gray-800 data-[dark]:ring-white/15"
      )}
      data-dark={dark ? "true" : undefined}
      initial="idle"
      variants={{ idle: {}, active: {} }}
      whileHover="active"
    >
      <div className="relative h-80 shrink-0">
        {graphic}
        {fade.includes("top") && (
          <div className="absolute inset-0 bg-gradient-to-b from-white to-50% group-data-[dark]:from-[-25%] group-data-[dark]:from-gray-800" />
        )}
        {fade.includes("bottom") && (
          <div className="absolute inset-0 bg-gradient-to-t from-white to-50% group-data-[dark]:from-[-25%] group-data-[dark]:from-gray-800" />
        )}
      </div>
      <div className="relative p-10">
        <Subheading as="h3" dark={dark}>
          {eyebrow}
        </Subheading>
        <p className="mt-1 font-medium text-2xl/8 text-gray-950 tracking-tight group-data-[dark]:text-white">
          {title}
        </p>
        <p className="mt-2 max-w-[600px] text-gray-600 text-sm/6 group-data-[dark]:text-gray-400">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
