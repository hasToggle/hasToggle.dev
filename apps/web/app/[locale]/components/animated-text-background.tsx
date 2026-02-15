"use client";

import { motion } from "motion/react";

export function AnimatedEmojiTextBackground() {
  return (
    <span className="relative ml-2 inline-flex">
      <span className="relative -rotate-1 py-3 lg:py-6">
        <motion.span
          animate={{ width: "100%" }}
          className="absolute inset-0 flex h-full bg-ht-cyan-200/90"
          initial={{ width: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
        <span className="relative p-1 text-white">switch.</span>
        <motion.span
          animate={{ width: "100%" }}
          className="absolute left-0 h-full overflow-hidden"
          initial={{ width: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <span className="relative p-1 text-slate-800">switch.</span>
        </motion.span>
        <span className="absolute right-0 -rotate-12">
          <motion.span
            animate={{ scale: 1 }}
            className="absolute -top-7 -right-3 text-4xl md:-top-10 md:-right-5 md:text-6xl lg:-top-14 lg:-right-6"
            initial={{ scale: 0 }}
            transition={{
              delay: 0.9,
              type: "spring",
              stiffness: 500,
              damping: 20,
            }}
          >
            😍
          </motion.span>
        </span>
      </span>
    </span>
  );
}
