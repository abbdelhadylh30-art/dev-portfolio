"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Stethoscope, UtensilsCrossed, Building2, Heart } from "lucide-react";
import { industries } from "@/lib/industries-data";
import { SectionHeader } from "./about";

const iconMap: Record<string, typeof Stethoscope> = {
  dental: Heart,
  medical: Stethoscope,
  restaurants: UtensilsCrossed,
  "real-estate": Building2,
};

export function Industries() {
  return (
    <section
      id="industries"
      className="relative py-24 sm:py-32 scroll-mt-16 border-t border-border"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          index="03"
          eyebrow="Industries I serve"
          title="Built for your industry."
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 max-w-2xl text-base text-muted-foreground leading-relaxed"
        >
          A generic portfolio doesn&apos;t speak to a dentist or a restaurant owner. These pages do.
          Each one is tailored to the pain points and features that matter in that industry —
          so you know I understand your business before we talk.
        </motion.p>

        <div className="mt-16 grid sm:grid-cols-2 gap-4">
          {industries.map((industry, i) => {
            const Icon = iconMap[industry.slug] || Stethoscope;
            return (
              <motion.a
                key={industry.slug}
                href={`/${industry.slug}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative rounded-2xl border border-border bg-card/40 backdrop-blur p-8 hover:bg-card/70 hover:border-foreground/20 transition-all overflow-hidden"
              >
                {/* Subtle accent glow on hover */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    background: `radial-gradient(400px 200px at 50% 0%, rgba(250, 248, 244, 0.04), transparent 70%)`,
                  }}
                />

                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center ${industry.accent}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                        {industry.tagline}
                      </div>
                      <h3 className="text-xl font-bold tracking-tight">{industry.name}</h3>
                    </div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
                </div>

                <p className="relative mt-5 text-sm text-muted-foreground leading-relaxed">
                  {industry.heroTitle}
                </p>

                {/* Feature pills */}
                <div className="relative mt-5 flex flex-wrap gap-1.5">
                  {industry.features.slice(0, 3).map((f) => (
                    <span
                      key={f.title}
                      className="rounded-md border border-border bg-secondary/30 px-2 py-1 text-[11px] font-medium text-foreground/70"
                    >
                      {f.title}
                    </span>
                  ))}
                  <span className="rounded-md border border-border bg-secondary/30 px-2 py-1 text-[11px] font-medium text-muted-foreground">
                    + {industry.features.length - 3} more
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-sm text-muted-foreground font-mono"
        >
          Don&apos;t see your industry? <a href="#contact" className="text-foreground underline underline-offset-4 hover:text-primary transition-colors">Ask me about it.</a>
        </motion.p>
      </div>
    </section>
  );
}
