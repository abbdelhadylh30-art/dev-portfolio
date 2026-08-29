"use client";

import { motion } from "framer-motion";
import { FileText, Rocket, Wrench, ArrowRight } from "lucide-react";
import { processSteps, type ProcessStep } from "@/lib/portfolio-data";
import { Reveal } from "@/components/portfolio/reveal";
import { SectionDivider } from "@/components/portfolio/reveal";

const ICONS: Record<
  ProcessStep["icon"],
  React.ComponentType<{ className?: string }>
> = {
  spec: FileText,
  ship: Rocket,
  sharpen: Wrench,
};

export function ProcessStrip() {
  return (
    <section
      id="process"
      aria-label="Process"
      className="relative py-16 sm:py-20 border-t border-border/40 bg-card/15"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Heading row */}
        <Reveal className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-brand">
              <span className="h-px w-6 bg-brand/60" />
              Process
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl text-balance">
              Spec <span className="text-muted-foreground/40">→</span> Ship{" "}
              <span className="text-muted-foreground/40">→</span>{" "}
              <span className="text-brand">Sharpen</span>.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground text-pretty">
            Three steps I repeat on every project. Small enough to actually
            finish, honest enough to keep improving.
          </p>
        </Reveal>

        <SectionDivider tone="muted" className="mb-10 max-w-full" />

        {/* 3 cards */}
        <div className="grid gap-5 md:grid-cols-3">
          {processSteps.map((step, i) => {
            const Icon = ICONS[step.icon];
            const isLast = i === processSteps.length - 1;
            return (
              <motion.article
                key={step.num}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative flex flex-col rounded-2xl border border-border/60 bg-card/50 p-6 card-hover"
              >
                {/* Top row: number + icon */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-bold text-muted-foreground/15 transition-colors group-hover:text-brand/40">
                    {step.num}
                  </span>
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/15 text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-brand">
                  {step.title}
                </h3>

                {/* Body */}
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground text-pretty">
                  {step.body}
                </p>

                {/* Outcome (proof) */}
                <div className="mt-5 flex items-start gap-2 rounded-lg border border-border/50 bg-background/40 p-3">
                  <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                  <span className="font-mono text-[11px] leading-relaxed text-foreground/80">
                    {step.outcome}
                  </span>
                </div>

                {/* Connector arrow (desktop only, between cards) */}
                {!isLast && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-3 top-1/2 hidden -translate-y-1/2 md:block"
                  >
                    <ArrowRight className="h-4 w-4 text-muted-foreground/40" />
                  </span>
                )}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
