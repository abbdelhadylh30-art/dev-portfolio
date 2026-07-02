"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/portfolio-data";
import { useState } from "react";
import { SectionHeader } from "@/components/portfolio/about";

export function WorkPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav — simplified, links back to main portfolio */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <nav className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <span className="relative w-7 h-7 rounded-md overflow-hidden ring-1 ring-border">
              <svg viewBox="0 0 500 500" className="w-full h-full" aria-hidden="true">
                <rect width="500" height="500" fill="#08080c"/>
                <text x="250" y="250" textAnchor="middle" dominantBaseline="central" fontSize="260" fontWeight="700" fill="#faf8f4" fontFamily="sans-serif">AG</text>
                <circle cx="430" cy="430" r="28" fill="#10b981">
                  <animate attributeName="r" values="28;32;28" dur="2.2s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="1;0.5;1" dur="2.2s" repeatCount="indefinite"/>
                </circle>
              </svg>
            </span>
            <span className="hidden sm:inline text-xs text-muted-foreground font-mono group-hover:text-foreground transition-colors">
              full-stack dev
            </span>
          </a>
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
          >
            ← Back to portfolio
          </a>
        </nav>
      </header>

      {/* Work content */}
      <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeader
            index="01"
            eyebrow="Full-stack proof"
            title="Built end-to-end. Shipped."
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="mt-6 max-w-2xl text-base text-muted-foreground leading-relaxed"
          >
            Each project below is a real, deployable Next.js app — not a demo, not a tutorial.
            Frontend, backend, database, deployment, SEO, the export button. When you hire me for
            your industry, this is the depth that backs the promise.
          </motion.p>

          <div className="mt-16 flex flex-col gap-16 sm:gap-24">
            {projects.map((project, i) => (
              <CaseStudyCard key={project.index} project={project} flip={i % 2 === 1} />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-24 pt-12 border-t border-border text-center">
            <p className="text-base text-muted-foreground mb-6">
              Want to see what I can build for your industry?
            </p>
            <a
              href="/#industries"
              className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-medium hover:bg-primary/90 transition-all hover:gap-3"
            >
              Explore industries
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

// Reuse the CaseStudy component logic — import from work.tsx internals
import { CaseStudy as CaseStudyCard } from "@/components/portfolio/work";
