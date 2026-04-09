"use client";

import { motion } from "framer-motion";

export const MockGenAnimation = () => {
  return (
    <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
      <motion.div
        initial={{ top: "-10%" }}
        animate={{ top: "110%" }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute left-0 right-0 h-2 bg-gradient-to-r from-transparent via-violet-400 to-transparent shadow-[0_0_30px_rgba(139,92,246,0.8)]"
      />
      <div className="absolute inset-0 bg-violet-600/10 backdrop-blur-[1px]" />
    </div>
  );
};
