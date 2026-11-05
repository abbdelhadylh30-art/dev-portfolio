"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ReactNode } from "react";

/**
 * ── Signature motion constants ────────────────────────────────────────
 * One easing + one duration own every first-paint and scroll reveal on
 * the site, so Business and Developer views share the same physical
 * "weight" when things appear. The long tail of cubic-bezier(.16,1,.3,1)
 * gives entrances an expo-like settle; blur + micro-scale add depth so
 * panels arrive from slightly "behind" the page instead of sliding up
 * flat.
 */
export const ENTRY_EASE = [0.16, 1, 0.3, 1] as const;
export const ENTRY_DURATION = 0.78;

/** Reduced-motion twin: same choreography, near-instant and blur-free. */
export const ENTRY_DURATION_SAFE = 0.24;

/**
 * Shared Framer Motion variants so all sections animate with the
 * same easing + stagger cadence (one source of truth for the page).
 */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 27, scale: 0.987, filter: "blur(5px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: ENTRY_DURATION, ease: ENTRY_EASE },
  },
};

/** Safe (reduced-motion) twin of `revealVariants`. */
export const revealVariantsSafe: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: ENTRY_DURATION_SAFE, ease: "easeOut" },
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
 * Single-element scroll-reveal with the signature settle: fade-up +
 * micro-scale + defocus. Wraps any block; defaults to `once: true` so
 * it doesn't re-trigger on scroll-up. Falls back to a plain crossfade
 * when the visitor prefers reduced motion.
 */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
  once = true,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];
  return (
    <MotionTag
      initial={
        reduce
          ? { opacity: 0 }
          : { opacity: 0, y, scale: 0.985, filter: "blur(4px)" }
      }
      whileInView={
        reduce
          ? { opacity: 1 }
          : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
      }
      viewport={{ once, margin: "-80px" }}
      transition={{
        duration: reduce ? ENTRY_DURATION_SAFE : 0.66,
        delay,
        ease: reduce ? "easeOut" : ENTRY_EASE,
      }}
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
