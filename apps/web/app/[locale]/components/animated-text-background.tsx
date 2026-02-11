"use client";

import { motion } from "framer-motion";

export function AnimatedEmojiTextBackground() {
  return (
    <span className="relative ml-2 inline-flex">
      <span className="-rotate-1 relative py-3 lg:py-6">
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
        <span className="-rotate-12 absolute right-0">
          <motion.span
            animate={{ scale: 1 }}
            className="-right-3 -top-7 md:-right-5 md:-top-10 lg:-right-6 lg:-top-14 absolute text-4xl md:text-6xl"
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
