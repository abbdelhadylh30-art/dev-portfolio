"use client";

import { motion } from "framer-motion";
import { skillCategories } from "@/lib/portfolio-data";
import { SectionHeader } from "./about";

export function Capabilities() {
  return (
    <section
      id="capabilities"
      className="relative py-24 sm:py-32 scroll-mt-16 border-t border-border"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          index="03"
          eyebrow="Capabilities"
          title="What I reach for, daily."
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mt-6 max-w-2xl text-base text-muted-foreground leading-relaxed"
        >
          Not a checklist — the actual stack behind every project on this page. Levels are
          honestly self-assessed against what I&apos;ve shipped, not what I&apos;ve read about.
        </motion.p>

        <div className="mt-16 grid lg:grid-cols-2 gap-6">
          {skillCategories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
              className="rounded-2xl border border-border bg-card/40 backdrop-blur p-6 sm:p-8 hover:bg-card/70 transition-colors"
            >
              <div className="flex items-baseline justify-between gap-4 mb-2">
                <h3 className="text-lg font-semibold tracking-tight">{cat.title}</h3>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground tabular-nums">
                  {String(i + 1).padStart(2, "0")} / {String(skillCategories.length).padStart(2, "0")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {cat.description}
              </p>

              <ul className="space-y-4">
                {cat.skills.map((skill, j) => (
                  <li key={skill.name}>
                    <div className="flex items-baseline justify-between gap-3 mb-1.5">
                      <div className="flex items-baseline gap-2 min-w-0">
                        <span className="text-sm font-medium text-foreground truncate">
                          {skill.name}
                        </span>
                        {skill.note && (
                          <span className="text-[11px] text-muted-foreground font-mono truncate hidden sm:inline">
                            — {skill.note}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[11px] text-muted-foreground tabular-nums flex-shrink-0">
                        {skill.level}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.8, delay: 0.2 + j * 0.04, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full bg-gradient-to-r from-foreground/60 to-foreground rounded-full"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Marquee ticker — tech I touch but didn't list above */}
        <div className="mt-16 relative overflow-hidden border-y border-border py-5 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={i}
                className="font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground/70"
              >
                {item}
                <span className="text-border ml-12">/</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const marqueeItems = [
  "React Server Components",
  "Streaming SSR",
  "Edge runtime",
  "Web Vitals",
  "Service Workers",
  "WebSocket / Socket.io",
  "TanStack Table",
  "recharts",
  "MDX",
  "Tailwind variants",
  "PostCSS",
  "Bun runtime",
  "Prisma Studio",
  "Vercel previews",
  "GitHub Actions",
  "Sharp image pipeline",
];
