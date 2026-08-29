"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { SectionDivider } from "@/components/portfolio/reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  /** Optional numbered counter (e.g. "01 / 06") rendered before the eyebrow. */
  counter,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  counter?: { current: string; total: string };
}) {
  const isCenter = align === "center";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col gap-3 ${
        isCenter ? "items-center text-center" : "items-start text-left"
      }`}
    >
      <div
        className={`flex w-full items-center gap-3 ${
          isCenter ? "justify-center" : "justify-between"
        }`}
      >
        <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em]">
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "left" }}
            className="h-px w-6 bg-gradient-to-r from-brand to-brand-2"
          />
          <span className="brand-gradient-text font-semibold">{eyebrow}</span>
        </span>
        {counter && (
          <span className="section-counter" aria-hidden>
            <span className="text-brand">{counter.current}</span>
            <span className="text-muted-foreground/50">/ {counter.total}</span>
          </span>
        )}
      </div>
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
        {title}
      </h2>
      {description && (
        <p
          className={`max-w-2xl text-muted-foreground text-pretty ${
            isCenter ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      )}
      <SectionDivider className={`mt-2 ${isCenter ? "max-w-xs" : "max-w-md"}`} />
    </motion.div>
  );
}
