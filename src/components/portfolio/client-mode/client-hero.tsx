"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, MessageCircle, ShieldCheck, Timer, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { profile, clientStats } from "@/lib/portfolio-data";
import { AnimatedCounter } from "@/components/portfolio/animated-counter";
import { trackEvent } from "@/lib/analytics";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const trustChips = [
  { icon: Wallet, label: "Fixed-price quotes" },
  { icon: ShieldCheck, label: "You own everything" },
  { icon: Timer, label: "Launch in 2–4 weeks" },
];

/**
 * Business-view hero — benefit-led copy for owners and clients.
 * No role rotator, no live GitHub strip, no tech stack mention.
 */
export function ClientHero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-24"
    >
      {/* Backgrounds — aurora mesh + dotted grid (same family as dev hero) */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid bg-grid-fade" />
      <div className="aurora-bg pointer-events-none absolute inset-0 -z-10 opacity-70" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-brand/15 blur-[100px] pulse-slow" />

      {/* Floating decor orbs — tri-hue ambient motion */}
      <div aria-hidden className="pointer-events-none absolute -left-16 top-32 -z-10 h-24 w-24 rounded-full bg-brand/10 blur-2xl float-a pulse-slow" />
      <div aria-hidden className="pointer-events-none absolute -right-20 top-24 -z-10 h-28 w-28 rounded-full bg-brand-2/12 blur-2xl float-b" />
      <div aria-hidden className="pointer-events-none absolute -bottom-10 left-1/4 -z-10 h-20 w-20 rounded-full bg-brand-3/10 blur-2xl float-c pulse-slow" />
      <div aria-hidden className="pointer-events-none absolute -right-10 bottom-24 -z-10 h-16 w-16 rounded-full bg-brand/12 blur-xl float-a" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Availability badge */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="status-pulse absolute inline-flex h-2 w-2 rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            Taking on new businesses for this quarter
          </span>
        </motion.div>

        {/* Avatar + name (smaller — the offer is the headline now) */}
        <motion.div variants={fadeUp} custom={1} initial="hidden" animate="show" className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <div className="relative float-y">
            <div
              aria-hidden
              className="absolute -inset-1.5 rounded-full opacity-60"
              style={{
                background:
                  "conic-gradient(from 0deg, color-mix(in oklch, var(--brand) 60%, transparent), transparent 35%, transparent 65%, color-mix(in oklch, var(--brand-2) 50%, transparent))",
                animation: "spin 14s linear infinite",
                maskImage: "radial-gradient(circle, transparent 62%, black 63%, black 100%)",
                WebkitMaskImage: "radial-gradient(circle, transparent 62%, black 63%, black 100%)",
              }}
            />
            <Avatar className="relative h-14 w-14 border-2 border-brand/40 shadow-md">
              <AvatarImage src={profile.avatarUrl} alt={profile.name} />
              <AvatarFallback className="bg-brand text-brand-foreground font-bold">AG</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold text-foreground">{profile.name}</p>
            <p className="text-xs text-muted-foreground">Web developer for businesses · Cairo, working with Egypt &amp; the Gulf</p>
          </div>
        </motion.div>

        {/* The offer — the headline */}
        <motion.h1
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="show"
          className="mx-auto mt-8 max-w-3xl text-center text-4xl font-bold leading-[1.12] tracking-tight sm:text-6xl"
        >
          A website that <span className="brand-gradient-text">works as hard</span> as you do.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="show"
          className="mx-auto mt-6 max-w-2xl text-center text-base text-muted-foreground sm:text-lg"
        >
          I build fast, beautiful websites for businesses — sites that load instantly,
          show up on Google, and turn visitors into customers.{" "}
          <span className="text-foreground">In Arabic and English.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          custom={4}
          initial="hidden"
          animate="show"
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button
            asChild
            size="lg"
            className="btn-shine h-12 rounded-full bg-brand px-7 text-base font-semibold text-brand-foreground shadow-lg shadow-brand/30 transition-transform hover:scale-[1.03] hover:bg-brand/90"
          >
            <a
              href={profile.whatsappUrl}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => trackEvent("whatsapp_click", { label: "client_hero" })}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Get your free website audit
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="chip-pop h-12 rounded-full border-border/70 bg-background/40 px-6 text-base backdrop-blur"
          >
            <a href="#results">
              <BadgeCheck className="mr-2 h-4 w-4 text-brand" />
              See what clients got
            </a>
          </Button>
        </motion.div>

        {/* Free-audit reassurance */}
        <motion.p
          variants={fadeUp}
          custom={5}
          initial="hidden"
          animate="show"
          className="mt-4 text-center text-xs text-muted-foreground"
        >
          Free 15-minute chat · I&apos;ll tell you honestly what&apos;s worth fixing — whether you hire me or not.
        </motion.p>

        {/* Trust chips */}
        <motion.div
          variants={fadeUp}
          custom={6}
          initial="hidden"
          animate="show"
          className="mt-8 flex flex-wrap items-center justify-center gap-2.5"
        >
          {trustChips.map((chip) => (
            <span
              key={chip.label}
              className="chip-pop inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
            >
              <chip.icon className="h-3.5 w-3.5 text-brand" />
              {chip.label}
            </span>
          ))}
        </motion.div>

        {/* Outcome stats */}
        <motion.div
          variants={fadeUp}
          custom={7}
          initial="hidden"
          animate="show"
          className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 sm:grid-cols-4"
        >
          {clientStats.map((s) => (
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
      </div>
    </section>
  );
}
