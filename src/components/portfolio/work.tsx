"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { businessProjects, type BusinessProject } from "@/lib/portfolio-data";
import { SectionHeader } from "./about";

export function Work() {
  return (
    <section id="work" className="relative py-20 sm:py-28 scroll-mt-16 border-t border-border">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          index="02"
          eyebrow="Selected work"
          title="Real projects. Real outcomes."
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mt-6 max-w-2xl text-base text-muted-foreground leading-relaxed"
        >
          A bakery in Abu Dhabi. A marketing professional in Cairo. A developer tool
          used by small businesses. Each project below solved a real business problem —
          not a portfolio filler.
        </motion.p>

        {/* Card grid — no long scrolling case studies */}
        <div className="mt-12 grid sm:grid-cols-2 gap-5">
          {businessProjects.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: BusinessProject; index: number }) {
  const CardTag = project.link ? motion.a : motion.div;
  const cardProps = project.link
    ? {
        href: project.link,
        target: project.link.startsWith("http") ? "_blank" : undefined,
        rel: project.link.startsWith("http") ? "noopener noreferrer" : undefined,
      }
    : {};

  return (
    <CardTag
      {...cardProps}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="group rounded-2xl border border-border bg-card/40 backdrop-blur overflow-hidden hover:bg-card/70 hover:border-foreground/20 transition-all"
    >
      {/* Image (if available) */}
      {project.image && (
        <div className="relative h-40 overflow-hidden bg-secondary">
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        </div>
      )}

      <div className="p-6">
        {/* Tagline */}
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
          {project.tagline}
        </div>

        {/* Name */}
        <h3 className="text-lg font-bold tracking-tight mb-3 flex items-start justify-between gap-2">
          <span>{project.name}</span>
          {project.link && (
            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0 mt-1" />
          )}
        </h3>

        {/* Outcome — business language, no jargon */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
          {project.outcome}
        </p>

        {/* Metrics — 3 max, outcome-focused */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border">
          {project.metrics.map((m) => (
            <div key={m.label}>
              <div className="text-base font-bold tracking-tight tabular-nums">{m.value}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </CardTag>
  );
}
