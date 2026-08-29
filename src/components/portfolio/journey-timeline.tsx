"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, GitBranch } from "lucide-react";
import { journey, type JourneyEntry } from "@/lib/portfolio-data";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { useUIStore } from "@/lib/ui-store";
import { trackEvent } from "@/lib/analytics";

const CATEGORY_LABELS: Record<JourneyEntry["category"], string> = {
  SaaS: "Multi-tenant SaaS",
  Web: "Web build",
  Portfolio: "Portfolio",
  Tools: "Tooling",
};

export function JourneyTimeline() {
  const openModal = useUIStore((s) => s.openModal);
  const total = journey.length;

  return (
    <section
      id="journey"
      className="relative py-20 sm:py-28 border-t border-border/40 overflow-hidden"
    >
      {/* Ambient orb */}
      <div className="pointer-events-none absolute -left-32 top-1/3 -z-10 h-64 w-64 rounded-full bg-brand/8 blur-[110px] pulse-slow" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Journey"
          counter={{ current: "05", total: "08" }}
          title={
            <>
              The build <span className="text-brand">chronology</span>.
            </>
          }
          description="A vertical timeline of every public repo — oldest at the top, newest at the bottom. Click any card to open its full project brief."
        />

        <div className="mt-12 relative pl-2 sm:pl-3">
          {/* Vertical rail */}
          <span aria-hidden className="timeline-rail" />

          <ul className="space-y-4">
            {journey.map((entry, i) => (
              <motion.li
                key={entry.slug}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.4,
                  delay: Math.min(i * 0.04, 0.32),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="timeline-card group relative flex items-start gap-4 pl-1"
              >
                {/* Dot */}
                <span aria-hidden className="timeline-dot mt-1" />

                {/* Card */}
                <button
                  type="button"
                  onClick={() => {
                    trackEvent("project_card_click", {
                      slug: entry.slug,
                      label: entry.project,
                    });
                    trackEvent("project_modal_open", {
                      slug: entry.slug,
                      label: entry.project,
                    });
                    openModal(entry.slug);
                  }}
                  className="flex-1 text-left rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-5 card-hover focus-ring"
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-brand">
                      {entry.label}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground/60">
                      {CATEGORY_LABELS[entry.category]}
                    </span>
                    <span className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground/60">
                      <GitBranch className="h-3 w-3" />
                      {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between gap-3">
                    <h3 className="text-sm font-semibold text-foreground transition-colors group-hover:text-brand sm:text-base">
                      {entry.project}
                    </h3>
                    <ArrowRight className="chevron-rotate h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-brand" />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {entry.takeaway}
                  </p>
                </button>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
