"use client";

import type * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, MessageCircle, ShieldCheck, Timer, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { profile } from "@/lib/portfolio-data";
import { usePrefs } from "@/lib/i18n/language";
import { AnimatedCounter } from "@/components/portfolio/animated-counter";
import { trackEvent } from "@/lib/analytics";
import { ENTRY_EASE } from "@/components/portfolio/reveal";
import { entrySequenceDone } from "@/components/portfolio/entry-curtain";

/**
 * Signature hero entry (Sun view) — same 0.78s settle as the Developer
 * hero, delayed once per load so the Business hero rises out of the
 * EntryCurtain's sunrise lift. Reduced motion collapses to a crossfade.
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
        delay: base + i * (reduce ? 0.03 : 0.09),
        ease: reduce ? ("easeOut" as const) : ENTRY_EASE,
      },
    }),
  };
}

const TRUST_ICONS = [Wallet, ShieldCheck, Timer] as const;

/**
 * Business-view hero — benefit-led copy for owners and clients.
 * No role rotator, no live GitHub strip, no tech stack mention.
 * Copy comes from the active language (EN/AR) via usePrefs.
 */
export function ClientHero() {
  const { t } = usePrefs();
  const fadeUp = useHeroEntry();
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-24"
    >
      {/* Backgrounds — aurora mesh + dotted grid (same family as dev hero) */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid bg-grid-fade" />
      <div className="aurora-bg pointer-events-none absolute inset-0 -z-10 opacity-70" />
      {/* Sunrise glow — warm horizon ambience for the Business daylight sky */}
      <div aria-hidden className="sunrise-glow pointer-events-none absolute -bottom-24 left-1/2 -z-10 h-72 w-[54rem] -translate-x-1/2" />
      {/* Sun ray accents rising from the horizon */}
      {[[-64, 0.2], [-32, 0.45], [0, 0.7], [32, 0.45], [64, 0.2]].map(([angle, delay], i) => (
        <span
          key={i}
          aria-hidden
          className="sunrise-ray pointer-events-none -z-10"
          style={{ "--ray-a": `${angle}deg`, animationDelay: `${delay}s` } as React.CSSProperties}
        />
      ))}
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
            {t.hero.badge}
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
            <Avatar className="relative h-16 w-16 border-2 border-brand/40 shadow-md">
              <AvatarImage src={profile.avatarUrl} alt={t.ownerName} />
              <AvatarFallback className="bg-brand text-brand-foreground font-bold">AG</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center sm:text-start">
            <p className="text-sm font-semibold text-foreground">{t.ownerName}</p>
            <p className="text-xs text-muted-foreground">{t.hero.nameRole}</p>
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
          {t.hero.title.pre}
          <span className="brand-gradient-text">{t.hero.title.grad}</span>
          {t.hero.title.post}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="show"
          className="mx-auto mt-6 max-w-2xl text-center text-base text-muted-foreground sm:text-lg"
        >
          {t.hero.sub}{" "}
          <span className="text-foreground">{t.hero.subEm}</span>
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
              <MessageCircle className="me-2 h-5 w-5" />
              {t.hero.ctaPrimary}
              <ArrowUpRight className="ms-2 h-4 w-4" />
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="chip-pop h-12 rounded-full border-border/70 bg-background/40 px-6 text-base backdrop-blur"
          >
            <a href="#results">
              <BadgeCheck className="me-2 h-4 w-4 text-brand" />
              {t.hero.ctaSecondary}
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
          {t.hero.auditNote}
        </motion.p>

        {/* Trust chips */}
        <motion.div
          variants={fadeUp}
          custom={6}
          initial="hidden"
          animate="show"
          className="mt-8 flex flex-wrap items-center justify-center gap-2.5"
        >
          {t.hero.trustChips.map((label, i) => {
            const Icon = TRUST_ICONS[i % TRUST_ICONS.length];
            return (
              <span
                key={label}
                className="chip-pop inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
              >
                <Icon className="h-3.5 w-3.5 text-brand" />
                {label}
              </span>
            );
          })}
        </motion.div>

        {/* Outcome stats */}
        <motion.div
          variants={fadeUp}
          custom={7}
          initial="hidden"
          animate="show"
          className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 sm:grid-cols-4"
        >
          {t.stats.map((s) => (
            <div
              key={s.label}
              className="stat-topline group relative flex flex-col items-center justify-center gap-0.5 bg-card px-3 py-5 text-center transition-colors hover:bg-card/60"
            >
              <div className="brand-gradient-text text-2xl font-bold tracking-tight sm:text-3xl">
                {/* dir=ltr keeps metric strings like "<2s" / "45×" in
                    reading order inside RTL paragraphs */}
                <span dir="ltr">
                  <AnimatedCounter value={s.value} />
                </span>
              </div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
              <div className="text-[10px] text-muted-foreground">{s.hint}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
