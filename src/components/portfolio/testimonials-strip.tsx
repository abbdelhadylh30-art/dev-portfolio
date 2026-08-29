"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Code2, Layers, Globe, Shield, Quote, ArrowUpRight } from "lucide-react";
import { testimonials, type Testimonial } from "@/lib/portfolio-data";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { useUIStore } from "@/lib/ui-store";
import { trackEvent } from "@/lib/analytics";

const ICONS: Record<Testimonial["icon"], typeof Code2> = {
  code: Code2,
  stack: Layers,
  globe: Globe,
  shield: Shield,
};

export function TestimonialsStrip() {
  const openModal = useUIStore((s) => s.openModal);

  const handleOpen = (slug: string, project: string) => {
    trackEvent("project_card_click", { slug, label: project });
    trackEvent("project_modal_open", { slug, label: project });
    openModal(slug);
  };

  return (
    <section
      id="testimonials"
      className="relative py-20 sm:py-28 border-t border-border/40 overflow-hidden"
    >
      {/* Ambient orb */}
      <div className="pointer-events-none absolute right-1/4 top-1/4 -z-10 h-64 w-64 rounded-full bg-brand/8 blur-[110px] pulse-slow" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="What the code says"
          title={
            <>
              Not testimonials — <span className="text-brand">receipts</span>.
            </>
          }
          description="Each card surfaces a real metric from the GitHub sync. No vague praise — just numbers that frame the work."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => {
            const Icon = ICONS[t.icon] ?? Code2;
            return (
              <motion.button
                key={t.slug}
                type="button"
                onClick={() => handleOpen(t.slug, t.source)}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.07, 0.28) }}
                className="testimonial-card group relative flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/40 p-5 sm:p-6 text-left card-hover focus-ring"
              >
                {/* Quote mark + icon */}
                <div className="flex items-start justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand/15 text-brand">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <Quote
                    className="h-5 w-5 text-muted-foreground/30 transition-colors group-hover:text-brand/60"
                    aria-hidden
                  />
                </div>

                {/* Quote body */}
                <p className="text-sm leading-relaxed text-foreground/85 text-balance">
                  {t.quote}
                </p>

                {/* Attribution + metric */}
                <div className="mt-auto pt-2">
                  <div className="font-mono text-[11px] text-muted-foreground/70">
                    {t.source}
                  </div>
                  <div className="mt-1.5 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center rounded-full bg-brand/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-brand">
                      {t.metric}
                    </span>
                    <ArrowUpRight className="chevron-rotate h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-brand" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-6 flex items-center justify-center gap-2 font-mono text-[11px] text-muted-foreground/70"
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-brand" />
            click any card to open the project brief
          </span>
        </motion.div>
      </div>
    </section>
  );
}
