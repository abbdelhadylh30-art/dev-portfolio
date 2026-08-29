"use client";

import { motion } from "framer-motion";
import {
  GitBranch,
  Globe,
  Globe2,
  Code2,
  Star,
  Calendar,
  Languages,
} from "lucide-react";
import { highlights, type Highlight } from "@/lib/portfolio-data";

const ICONS: Record<Highlight["icon"], React.ComponentType<{ className?: string }>> = {
  git: GitBranch,
  globe: Globe,
  globe2: Globe2,
  code: Code2,
  star: Star,
  calendar: Calendar,
  rtl: Languages,
};

function HighlightCard({ h }: { h: Highlight }) {
  const Icon = ICONS[h.icon] ?? GitBranch;
  return (
    <div className="highlight-card group mx-2 flex w-[320px] shrink-0 snap-start flex-col gap-1 rounded-2xl border border-border/60 bg-card/50 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand/15 text-brand transition-colors group-hover:bg-brand/25">
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground/70">
          proof
        </span>
      </div>
      <p className="mt-1 text-sm font-semibold leading-tight text-foreground">
        {h.text}
      </p>
      <p className="font-mono text-[11px] text-muted-foreground">{h.context}</p>
    </div>
  );
}

export function HighlightsStrip() {
  // Duplicate the array so the marquee can loop seamlessly.
  const loop = [...highlights, ...highlights];

  return (
    <section
      aria-label="Highlights"
      className="relative border-y border-border/40 bg-card/20 py-8"
    >
      {/* Fades on the edges */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />

      <div className="mx-auto mb-3 max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <span className="h-px flex-1 section-edge-fade" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/80">
            by the numbers
          </span>
          <span className="h-px flex-1 section-edge-fade" />
        </motion.div>
      </div>

      {/* Marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative overflow-hidden"
      >
        <div className="flex w-max marquee-track">
          {loop.map((h, i) => (
            <HighlightCard key={i} h={h} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
