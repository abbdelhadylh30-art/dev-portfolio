"use client";

import { motion } from "framer-motion";
import { skillGroups } from "@/lib/portfolio-data";
import { SectionHeading } from "@/components/portfolio/section-heading";

function SkillBar({
  name,
  level,
  note,
  index,
}: {
  name: string;
  level: number;
  note: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group/skill space-y-1.5"
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-foreground transition-colors group-hover/skill:text-brand">
          {name}
        </span>
        <span className="font-mono text-[11px] text-muted-foreground transition-colors group-hover/skill:text-brand">
          {level}%
        </span>
      </div>
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.1, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="bar-grow h-full rounded-full bg-gradient-to-r from-brand/70 to-brand"
        />
      </div>
      <p className="text-[11px] text-muted-foreground/70">{note}</p>
    </motion.div>
  );
}

export function Skills() {
  return (
    <section
      id="skills"
      className="relative py-20 sm:py-28 border-t border-border/40 overflow-hidden"
    >
      {/* Ambient orb */}
      <div className="pointer-events-none absolute -right-32 top-32 -z-10 h-64 w-64 rounded-full bg-brand/8 blur-[110px] pulse-slow" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Capabilities"
          counter={{ current: "04", total: "08" }}
          title={
            <>
              The stack I <span className="text-brand">reach for</span>.
            </>
          }
          description="Grouped by where I spend most of my time, with honest proficiency levels — no inflated 100%s."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: gi * 0.08 }}
              className="rounded-2xl border border-border/60 bg-card/40 p-6 card-hover"
            >
              <div className="mb-2 flex items-baseline justify-between gap-2 border-b border-border/50 pb-3">
                <h3 className="text-base font-semibold text-foreground">
                  {group.title}
                </h3>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {group.blurb}
                </span>
              </div>
              <div className="mt-5 space-y-4">
                {group.skills.map((s, si) => (
                  <SkillBar
                    key={s.name}
                    name={s.name}
                    level={s.level}
                    note={s.note}
                    index={si}
                  />
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-3 text-[11px] font-mono text-muted-foreground/60">
                <span>{group.skills.length} skills tracked</span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand/70" />
                  live level
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
