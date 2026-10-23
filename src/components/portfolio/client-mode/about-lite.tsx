"use client";

import { motion } from "framer-motion";
import { MapPin, Languages, MessageCircle, Briefcase } from "lucide-react";
import { aboutLite, profile } from "@/lib/portfolio-data";
import { SectionHeading } from "@/components/portfolio/section-heading";

const FACT_ICONS = [MapPin, Briefcase, Languages, MessageCircle];

/**
 * Business-view "About" — a short human story anchored by the real studio
 * portrait. No philosophy cards, no tech marquee: who I am, where I work,
 * and how I treat clients. The photo does the trust-building; the copy
 * points at it ("the person in this photo") instead of stock-model vibes.
 */
export function AboutLite() {
  return (
    <section id="about" className="relative overflow-hidden border-t border-border/40 py-20 sm:py-28">
      <div className="pointer-events-none absolute -right-32 bottom-24 -z-10 h-56 w-56 rounded-full bg-brand-3/8 blur-[100px] pulse-slow float-b" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="About"
          counter={{ current: "05", total: "06" }}
          title={
            <>
              The person you&apos;ll <span className="brand-gradient-text">actually talk to</span>.
            </>
          }
          description="No agency middlemen, no account managers. When you message me, you get me."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-5 lg:gap-12">
          {/* Left: studio portrait + quick facts */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2"
          >
            <div className="client-card group relative overflow-hidden rounded-2xl border border-border/60 bg-card/50">
              <div className="relative">
                {/* real studio portrait */}
                <img
                  src={profile.portraitUrl}
                  alt="Abdelhady Gabriel — web developer for businesses, Cairo"
                  width={640}
                  height={960}
                  loading="lazy"
                  className="aspect-[2/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />

                {/* legibility gradient for the name plate */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/85 via-black/40 to-transparent"
                />

                {/* availability badge — floating over the photo */}
                <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="status-pulse absolute h-1.5 w-1.5 rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  Available now
                </span>

                {/* brand-gradient hairline on the photo's top edge */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-brand via-brand-2 to-brand-3"
                />

                {/* name plate over the photo */}
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="text-lg font-bold text-white">{profile.name}</h3>
                  <p className="mt-0.5 text-xs text-white/75">
                    Web developer for businesses · Cairo
                  </p>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-3 p-5">
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

            <motion.a
              href="#contact"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
            >
              Say hello on WhatsApp — I answer myself
              <span aria-hidden>→</span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
