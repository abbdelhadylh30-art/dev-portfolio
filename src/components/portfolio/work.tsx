"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { projects, type Project } from "@/lib/portfolio-data";
import { SectionHeader } from "./about";

export function Work() {
  return (
    <section id="work" className="relative py-24 sm:py-32 scroll-mt-16 border-t border-border">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          index="02"
          eyebrow="Selected work"
          title="Four tools. One studio."
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mt-6 max-w-2xl text-base text-muted-foreground leading-relaxed"
        >
          Each project below is a real, deployable Next.js app — not a demo, not a tutorial. They share
          a stack, share patterns, and in the case of Forge Studio, share a single binary. Click any
          project to drill into the case study.
        </motion.p>

        <div className="mt-16 flex flex-col gap-16 sm:gap-24">
          {projects.map((project, i) => (
            <CaseStudy key={project.index} project={project} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseStudy({ project, flip }: { project: Project; flip: boolean }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const hasShots = project.screenshots.length > 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="grid lg:grid-cols-12 gap-8 lg:gap-12"
    >
      {/* Left column — index, name, summary */}
      <div className={`lg:col-span-5 ${flip ? "lg:order-2" : ""}`}>
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {project.index}
          </span>
          <span className="h-px w-6 bg-border" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {project.category}
          </span>
        </div>

        <h3 className="font-bold tracking-[-0.02em] text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.05]">
          {project.name}
        </h3>

        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <span>{project.year}</span>
          <span className="text-border">·</span>
          <StatusBadge status={project.status} />
        </div>

        <p className="mt-6 text-base text-muted-foreground leading-relaxed">
          {project.summary}
        </p>

        {/* Metrics row */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {project.metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-lg border border-border bg-card/40 px-3 py-3"
            >
              <div className="text-xl font-bold tracking-tight tabular-nums">{m.value}</div>
              <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Stack */}
        <div className="mt-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Stack
          </div>
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-border bg-secondary/50 px-2.5 py-1 text-xs font-medium text-foreground/90"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right column — screenshots + narrative */}
      <div className={`lg:col-span-7 ${flip ? "lg:order-1" : ""}`}>
        {/* Screenshots */}
        {hasShots ? (
          <div className="space-y-3">
            {/* Featured shot */}
            <button
              onClick={() => setLightbox(0)}
              className="group relative block w-full overflow-hidden rounded-xl border border-border bg-card aspect-[16/10]"
            >
              <img
                src={project.screenshots[0].src}
                alt={`${project.name} — ${project.screenshots[0].caption}`}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                <p className="text-xs text-foreground/90 font-medium">
                  {project.screenshots[0].caption}
                </p>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-background/80 backdrop-blur px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity">
                <Sparkles className="w-3 h-3" /> expand
              </div>
            </button>

            {/* Thumbnail strip */}
            {project.screenshots.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {project.screenshots.slice(1, 4).map((shot, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLightbox(idx + 1)}
                    className="group relative block aspect-[4/3] overflow-hidden rounded-lg border border-border bg-card"
                  >
                    <img
                      src={shot.src}
                      alt={`${project.name} — ${shot.caption}`}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.05]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Stylized fallback for projects without screenshots
          <div className="rounded-xl border border-border bg-card aspect-[16/10] flex items-center justify-center relative overflow-hidden">
            <div
              aria-hidden
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(250,248,244,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(250,248,244,0.05) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="relative text-center px-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
                Single-page workflow
              </div>
              <div className="text-2xl font-bold tracking-tight">{project.name}</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Paste URL · drop images · run pipeline · paste opener
              </div>
            </div>
          </div>
        )}

        {/* Narrative accordion */}
        <div className="mt-6 rounded-xl border border-border bg-card/40 divide-y divide-border overflow-hidden">
          <NarrativeRow label="Problem" body={project.problem} defaultOpen />
          <NarrativeRow label="Approach" body={project.approach} />
          <NarrativeRow label="Outcome" body={project.outcome} />
        </div>

        {/* Feature chips */}
        <div className="mt-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Features
          </div>
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
            {project.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 inline-block w-1 h-1 rounded-full bg-foreground/60 flex-shrink-0" />
                <span className="leading-snug">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && hasShots && (
          <Lightbox
            screenshots={project.screenshots}
            index={lightbox}
            projectName={project.name}
            onClose={() => setLightbox(null)}
            onIndex={setLightbox}
          />
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function NarrativeRow({
  label,
  body,
  defaultOpen = false,
}: {
  label: string;
  body: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-accent/40 transition-colors"
        aria-expanded={open}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </span>
        <span className={`text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`}>
          <ChevronRight className="w-4 h-4" />
        </span>
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <p className="px-5 pb-5 text-sm text-foreground/90 leading-relaxed">{body}</p>
        </motion.div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Project["status"] }) {
  const map = {
    flagship: { label: "Flagship", className: "text-amber-300" },
    live: { label: "Live", className: "text-emerald-400" },
    shipped: { label: "Shipped", className: "text-sky-300" },
  } as const;
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 ${s.className}`}>
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}

function Lightbox({
  screenshots,
  index,
  projectName,
  onClose,
  onIndex,
}: {
  screenshots: Project["screenshots"];
  index: number;
  projectName: string;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const shot = screenshots[index];
  const total = screenshots.length;

  const go = (dir: 1 | -1) => {
    const next = (index + dir + total) % total;
    onIndex(next);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-mono uppercase tracking-wider hover:bg-accent transition-colors"
      >
        Close <span className="opacity-60">esc</span>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          go(-1);
        }}
        disabled={total <= 1}
        className="absolute left-4 sm:left-8 p-3 rounded-full border border-border bg-card hover:bg-accent transition-colors disabled:opacity-30"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-5xl w-full"
      >
        <div className="rounded-xl overflow-hidden border border-border bg-card">
          <img
            src={shot.src}
            alt={`${projectName} — ${shot.caption}`}
            className="w-full h-auto max-h-[75vh] object-contain bg-background"
          />
        </div>
        <div className="mt-4 flex items-center justify-between text-xs">
          <p className="text-muted-foreground">{shot.caption}</p>
          <span className="font-mono text-muted-foreground tabular-nums">
            {index + 1} / {total}
          </span>
        </div>
      </motion.div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          go(1);
        }}
        disabled={total <= 1}
        className="absolute right-4 sm:right-8 p-3 rounded-full border border-border bg-card hover:bg-accent transition-colors disabled:opacity-30"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </motion.div>
  );
}
