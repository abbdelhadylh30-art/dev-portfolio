"use client";

import { motion } from "framer-motion";
import { MapPin, Languages, MessageCircle, Briefcase } from "lucide-react";
import { aboutLite, profile } from "@/lib/portfolio-data";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SectionHeading } from "@/components/portfolio/section-heading";

const FACT_ICONS = [MapPin, Briefcase, Languages, MessageCircle];

/**
 * Business-view "About" — a short human story. No philosophy cards,
 * no tech marquee: who I am, where I work, and how I treat clients.
 */
export function AboutLite() {
  return (
    <section id="about" className="relative overflow-hidden border-t border-border/40 py-20 sm:py-28">
      <div className="pointer-events-none absolute -right-32 bottom-24 -z-10 h-56 w-56 rounded-full bg-brand-3/8 blur-[100px] pulse-slow float-b" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="About"
          counter={{ current: "04", total: "05" }}
          title={
            <>
              The person you&apos;ll <span className="brand-gradient-text">actually talk to</span>.
            </>
          }
          description="No agency middlemen, no account managers. When you message me, you get me."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-5 lg:gap-12">
          {/* Left: avatar + quick facts */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2"
          >
            <div className="client-card rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-7">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div
                    aria-hidden
                    className="absolute -inset-1 rounded-full opacity-50"
                    style={{
                      background:
                        "conic-gradient(from 0deg, color-mix(in oklch, var(--brand) 55%, transparent), transparent 40%, transparent 60%, color-mix(in oklch, var(--brand) 45%, transparent))",
                      animation: "spin 16s linear infinite",
                      maskImage: "radial-gradient(circle, transparent 62%, black 63%, black 100%)",
                      WebkitMaskImage: "radial-gradient(circle, transparent 62%, black 63%, black 100%)",
                    }}
                  />
                  <Avatar className="relative h-20 w-20 border-2 border-brand/40 shadow-lg float-y">
                    <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                    <AvatarFallback className="bg-brand text-brand-foreground text-xl font-bold">AG</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{profile.name}</h3>
                  <p className="text-sm text-muted-foreground">Web developer for businesses</p>
                  <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/8 px-2.5 py-0.5 text-[11px] font-medium text-brand">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="status-pulse absolute h-1.5 w-1.5 rounded-full bg-brand opacity-75" />
                      <span className="relative h-1.5 w-1.5 rounded-full bg-brand" />
                    </span>
                    Available now
                  </span>
                </div>
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-3">
                {aboutLite.quickFacts.map((fact, i) => {
                  const Icon = FACT_ICONS[i % FACT_ICONS.length];
                  return (
                    <div key={fact.label} className="chip-pop rounded-xl border border-border/50 bg-background/60 px-3.5 py-3">
                      <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        <Icon className="h-3 w-3 text-brand" />
                        {fact.label}
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-foreground">{fact.value}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </motion.div>

          {/* Right: story paragraphs */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3"
          >
            <div className="space-y-5 text-base leading-relaxed text-foreground/85">
              {aboutLite.paragraphs.map((p, i) => (
                <p key={i} className={i === 0 ? "text-lg text-foreground" : undefined}>
                  {p}
                </p>
              ))}
            </div>

            <div className="grad-border always mt-7 rounded-2xl border border-brand/25 bg-brand/6 p-5 sm:p-6">
              <p className="text-sm leading-relaxed text-foreground/90">
                <span className="brand-gradient-text font-bold">My promise:</span> you&apos;ll always
                understand what you&apos;re paying for. If I ever need to explain something
                technical, I&apos;ll explain it like you&apos;re the client — because you are.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
