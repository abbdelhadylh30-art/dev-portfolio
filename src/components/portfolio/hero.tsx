"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { profile } from "@/lib/portfolio-data";

export function Hero() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 grain">
      {/* Background gradient — subtle top glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(900px 600px at 70% -10%, rgba(250, 248, 244, 0.06), transparent 60%), radial-gradient(600px 400px at 0% 80%, rgba(92, 141, 239, 0.05), transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-6xl w-full px-5 sm:px-8">
        {/* Status pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-3 py-1.5 mb-8"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-soft-pulse" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            {profile.availability}
          </span>
          <span className="text-border">·</span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" /> {profile.location}
          </span>
        </motion.div>

        {/* Role label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: "easeOut" }}
          className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5"
        >
          {profile.role}
        </motion.p>

        {/* Big name */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-bold tracking-[-0.04em] text-[clamp(2.75rem,9vw,7rem)] leading-[0.95]"
        >
          {profile.name.split(" ").map((word, i) => (
            <span key={i} className="block sm:inline">
              {word}
              {i < profile.name.split(" ").length - 1 ? (
                <span className="hidden sm:inline text-muted-foreground"> </span>
              ) : (
                <span className="text-muted-foreground">.</span>
              )}
            </span>
          ))}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
          className="mt-8 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed"
        >
          {profile.tagline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <button
            onClick={() => scrollTo("#industries")}
            className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-medium hover:bg-primary/90 transition-all hover:gap-3"
          >
            What I build for you
            <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
          </button>
          <a
            href="/work"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/40 backdrop-blur px-5 py-3 text-sm font-medium text-foreground hover:bg-accent transition-all"
          >
            See my work
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <button
            onClick={() => scrollTo("#contact")}
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/40 backdrop-blur px-5 py-3 text-sm font-medium text-foreground hover:bg-accent transition-all"
          >
            Get in touch
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </motion.div>

        {/* Stats strip — at-a-glance credibility */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: "easeOut" }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px bg-border/60 border border-border rounded-2xl overflow-hidden"
        >
          {[
            { label: "Shipped projects", value: "3" },
            { label: "Audit checks", value: "30+" },
            { label: "Quick-fixes", value: "38" },
            { label: "Section types", value: "12" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card/40 backdrop-blur px-5 py-5">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight tabular-nums">
                {stat.value}
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground font-mono">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-mono">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-border to-transparent" />
      </motion.div>
    </section>
  );
}
