"use client";

import { motion, type Variants } from "framer-motion";
import { ReactNode } from "react";

/**
 * Shared Framer Motion variants so all sections animate with the
 * same easing + stagger cadence (one source of truth for the page).
 */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
  as?: "div" | "section" | "li" | "ul" | "span" | "p";
};

/**
 * Single-element scroll-reveal. Wraps any block with a subtle fade-up.
 * Defaults to `once: true` so it doesn't re-trigger on scroll-up.
 */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  once = true,
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Animated horizontal divider that grows from left to right when scrolled
 * into view. Used under section headings as a subtle "rule" line.
 */
export function SectionDivider({
  className = "",
  tone = "brand",
}: {
  className?: string;
  tone?: "brand" | "muted";
}) {
  const gradient =
    tone === "brand"
      ? "linear-gradient(90deg, color-mix(in oklch, var(--brand) 70%, transparent) 0%, transparent 100%)"
      : "linear-gradient(90deg, color-mix(in oklch, var(--muted-foreground) 35%, transparent) 0%, transparent 100%)";
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: "left", backgroundImage: gradient }}
      className={`h-px w-full ${className}`}
      aria-hidden
    />
  );
}
