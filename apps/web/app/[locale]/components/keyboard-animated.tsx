"use client";

import { motion } from "motion/react";
import { Keyboard } from "./keyboard";

export function KeyboardAnimated() {
  return (
    <div className="@container relative min-h-84 w-full grow max-lg:mx-auto max-lg:max-w-md">
      <motion.div
        className="flex size-full items-end py-10 pl-8 sm:pl-0 lg:pl-10"
        initial="idle"
        whileHover="active"
      >
        <Keyboard highlighted={["LeftCommand", "LeftShift", "H"]} />
      </motion.div>
    </div>
  );
}
