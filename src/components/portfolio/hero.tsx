"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, Command, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { profile, stats } from "@/lib/portfolio-data";
import { AnimatedCounter } from "@/components/portfolio/animated-counter";
import { RoleRotator } from "@/components/portfolio/role-rotator";
import { useUIStore } from "@/lib/ui-store";
import { LiveStats } from "@/components/portfolio/live-stats";
import { trackEvent } from "@/lib/analytics";
import { ENTRY_EASE } from "@/components/portfolio/reveal";
import { entrySequenceDone } from "@/components/portfolio/entry-curtain";

/**
 * Signature hero entry — fade-up + micro-scale + defocus with the site's
 * 0.78s expo settle. On the very first load the base delay lets the hero
 * emerge from beneath the EntryCurtain's exit; afterwards (page navigations)
 * the sequence starts immediately. Reduced motion collapses to a crossfade.
 */
function useHeroEntry() {
  const reduce = useReducedMotion();
  const base = reduce ? 0 : entrySequenceDone ? 0 : 0.5;
  return {
    hidden: { opacity: 0, y: 27, scale: 0.987, filter: "blur(5px)" },
    show: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: reduce ? 0.24 : 0.78,
        delay: base + i * (reduce ? 0.03 : 0.085),
        ease: reduce ? ("easeOut" as const) : ENTRY_EASE,
      },
    }),
  };
}

/** Moonrise arc + starfield coordinates for the Developer-view ambience. */
const HERO_STARS: ReadonlyArray<readonly [number, number, number]> = [
  [16, 18, 0], [58, 10, 0.6], [76, 26, 1.1], [34, 6, 0.3], [90, 14, 0.85], [47, 20, 1.4],
];

export function Hero() {
  const fadeUp = useHeroEntry();
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28"
    >
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid bg-grid-fade" />
      {/* Aurora background — richer animated tri-hue gradient mesh */}
      <div className="aurora-bg pointer-events-none absolute inset-0 -z-10 opacity-60" />
      {/* Moonrise arc — silver-indigo ambience for the Developer night sky */}
      <div aria-hidden className="moon-arc pointer-events-none absolute -top-28 right-[6%] -z-10 h-64 w-64" />
      {/* Starfield accents — twinkling in the hero's upper field */}
      {HERO_STARS.map(([left, top, delay], i) => (
        <span
          key={i}
          aria-hidden
          className="hero-star pointer-events-none -z-10"
          style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${delay}s` }}
        />
      ))}
      {/* Brand glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-brand/15 blur-[100px] pulse-slow" />
      {/* Secondary ambient orb */}
      <div
        aria-hidden
        className="float-b pointer-events-none absolute top-32 -right-24 -z-10 h-48 w-48 rounded-full bg-brand/10 blur-[80px]"
      />
      {/* Decorative floating orbs — tri-hue ambient accents */}
      <div
        aria-hidden
        className="float-a pulse-slow pointer-events-none absolute top-24 -left-20 -z-10 h-24 w-24 rounded-full bg-brand/10 blur-2xl"
      />
      <div
        aria-hidden
        className="float-b pointer-events-none absolute bottom-20 left-[10%] -z-10 h-16 w-16 rounded-full bg-brand-2/15 blur-xl"
      />
      <div
        aria-hidden
        className="float-c pulse-slow pointer-events-none absolute bottom-28 -right-14 -z-10 h-28 w-28 rounded-full bg-brand-3/10 blur-2xl"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="status-pulse absolute inline-flex h-2 w-2 rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            {profile.availability}
          </span>
        </motion.div>

        {/* Avatar — gentle floating motion + rotating ring */}
        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          className="mt-6 flex justify-center"
        >
          <div className="relative">
            {/* Rotating gradient ring */}
            <div
              className="absolute -inset-1.5 rounded-full opacity-60"
              style={{
                background:
                  "conic-gradient(from 0deg, color-mix(in oklch, var(--brand) 60%, transparent), transparent 35%, transparent 65%, color-mix(in oklch, var(--brand) 50%, transparent))",
                animation: "spin 14s linear infinite",
                maskImage:
                  "radial-gradient(circle, transparent 56%, black 57%, black 100%)",
                WebkitMaskImage:
                  "radial-gradient(circle, transparent 56%, black 57%, black 100%)",
              }}
              aria-hidden
            />
            <Avatar className="relative h-24 w-24 sm:h-28 sm:w-28 border-2 border-brand/40 shadow-lg float-y">
              <AvatarImage src={profile.avatarUrl} alt={profile.name} />
              <AvatarFallback className="bg-brand text-brand-foreground font-bold text-2xl">
                AG
              </AvatarFallback>
            </Avatar>
          </div>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="show"
          className="mt-6 text-center text-4xl font-bold tracking-tight sm:text-6xl"
        >
          <span className="brand-gradient-text">{profile.firstName}</span>{" "}
          <span className="text-foreground">{profile.lastName}</span>
        </motion.h1>

        <motion.div
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="show"
          className="mt-3 flex justify-center"
        >
          <span className="text-center font-mono text-sm uppercase tracking-[0.2em] text-brand min-h-[1.25rem]">
            <RoleRotator roles={profile.roleVariations} />
          </span>
        </motion.div>

        <motion.p
          variants={fadeUp}
          custom={4}
          initial="hidden"
          animate="show"
          className="mx-auto mt-6 max-w-2xl text-center text-base text-muted-foreground sm:text-lg"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          variants={fadeUp}
          custom={5}
          initial="hidden"
          animate="show"
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button
            asChild
            size="lg"
            className="btn-shine bg-brand text-brand-foreground hover:bg-brand/90 h-12 px-6 rounded-full shadow-lg shadow-brand/30"
          >
            <a href="#work" className="font-semibold">
              View selected work
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="chip-pop h-12 px-6 rounded-full border-border/70 bg-background/40 backdrop-blur"
          >
            <a
              href={profile.whatsappUrl}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => trackEvent("whatsapp_click", { label: "hero" })}
            >
              <BadgeCheck className="mr-2 h-4 w-4 text-brand" />
              Get a free audit
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="halo-pulse h-12 px-5 rounded-full text-muted-foreground hover:text-foreground"
          >
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub profile"
            >
              <Github className="h-5 w-5" />
            </a>
          </Button>
        </motion.div>

        {/* ⌘K command palette hint */}
        <motion.button
          variants={fadeUp}
          custom={6}
          initial="hidden"
          animate="show"
          onClick={() => useUIStore.getState().openPalette()}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/40 px-3 py-1.5 font-mono text-[11px] text-muted-foreground backdrop-blur transition-colors hover:border-brand/40 hover:text-brand"
          aria-label="Open command palette"
        >
          <Command className="h-3 w-3" />
          Quick nav
          <kbd className="ml-1 rounded bg-muted px-1.5 py-0.5 text-[10px]">⌘K</kbd>
        </motion.button>

        {/* Stats strip */}
        <motion.div
          variants={fadeUp}
          custom={7}
          initial="hidden"
          animate="show"
          className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 sm:grid-cols-4"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="stat-topline group relative flex flex-col items-center justify-center gap-0.5 bg-card px-3 py-5 text-center transition-colors hover:bg-card/60"
            >
              <div className="brand-gradient-text text-2xl font-bold tracking-tight sm:text-3xl">
                <AnimatedCounter value={s.value} />
              </div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
              <div className="text-[10px] text-muted-foreground/70">{s.hint}</div>
            </div>
          ))}
        </motion.div>

        {/* Live GitHub stats strip */}
        <LiveStats />
      </div>
    </section>
  );
}
