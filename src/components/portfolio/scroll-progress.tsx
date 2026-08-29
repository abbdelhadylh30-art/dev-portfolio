"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin emerald progress bar pinned to the very top of the viewport,
 * reflecting page scroll depth. Sits above the navbar (z-60).
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 inset-x-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-brand/40 via-brand to-brand/60"
      aria-hidden="true"
    />
  );
}
