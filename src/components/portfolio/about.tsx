"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Sparkles } from "lucide-react";
import { profile, aboutParagraphs, philosophy, techMarquee } from "@/lib/portfolio-data";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { Reveal } from "@/components/portfolio/reveal";

export function About() {
  return (
    <section id="about" className="relative py-20 sm:py-28">
      {/* Ambient brand orb */}
      <div className="pointer-events-none absolute -left-32 top-24 -z-10 h-56 w-56 rounded-full bg-brand/8 blur-[100px] pulse-slow" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="About"
          counter={{ current: "01", total: "08" }}
          title={
            <>
              Full-stack, bilingual,{" "}
              <span className="text-brand">type-obsessed</span>.
            </>
          }
          description="From multi-tenant SaaS to landing-page studios — I build the whole stack and sweat the small UX details."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-12">
          {/* Bio + meta */}
          <div className="lg:col-span-2 space-y-6">
            {aboutParagraphs.map((p, i) => (
              <Reveal as="p" key={i} delay={i * 0.1} className="text-base leading-relaxed text-foreground/80 sm:text-lg">
                {p}
              </Reveal>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-wrap gap-3 pt-2"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-brand/40">
                <MapPin className="h-3.5 w-3.5 text-brand" />
                {profile.location}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-brand/40">
                <Clock className="h-3.5 w-3.5 text-brand" />
                {profile.timezone}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3 py-1.5 text-sm text-brand">
                <Sparkles className="h-3.5 w-3.5" />
                {profile.availability}
              </span>
            </motion.div>
          </div>

          {/* Philosophy card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-border/60 bg-card/50 p-6 card-hover"
          >
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Dev philosophy
            </h3>
            <ul className="mt-4 space-y-5">
              {philosophy.map((item) => (
                <li key={item.title} className="space-y-1 group">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground transition-colors group-hover:text-brand">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand transition-transform group-hover:scale-150" />
                    {item.title}
                  </div>
                  <p className="pl-3.5 text-sm text-muted-foreground">
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Tech marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 relative overflow-hidden"
        >
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-background to-transparent" />
          <div className="flex w-max marquee-track gap-3">
            {[...techMarquee, ...techMarquee].map((t, i) => (
              <span
                key={i}
                className="inline-flex items-center whitespace-nowrap rounded-full border border-border/50 bg-card/40 px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
