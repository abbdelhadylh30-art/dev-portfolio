"use client";

import { motion } from "framer-motion";
import { Store, Search, ArrowUpRight, BadgeCheck } from "lucide-react";
import { caseStudies, profile, type CaseStudy } from "@/lib/portfolio-data";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { trackEvent } from "@/lib/analytics";

const ICONS: Record<CaseStudy["icon"], typeof Store> = {
  store: Store,
  search: Search,
  gauge: Store,
  message: Store,
};

export function ClientWork() {
  return (
    <section
      id="clients"
      className="relative overflow-hidden py-20 sm:py-28 border-t border-border/40"
    >
      {/* Ambient orb */}
      <div className="pointer-events-none absolute -right-32 top-32 -z-10 h-56 w-56 rounded-full bg-brand/8 blur-[100px] pulse-slow" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Client work"
          counter={{ current: "03", total: "08" }}
          title={
            <>
              Real projects.{" "}
              <span className="text-brand">Real outcomes</span>.
            </>
          }
          description="A bakery in Abu Dhabi. A marketing professional in Cairo. Each project below solved a real business problem — not a portfolio filler."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {caseStudies.map((cs, idx) => {
            const Icon = ICONS[cs.icon];
            return (
              <motion.article
                key={cs.client}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="client-card group relative flex flex-col rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-7"
              >
                {/* Header: icon + client + context tag */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand/15 text-brand transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold leading-tight text-foreground transition-colors group-hover:text-brand">
                        {cs.client}
                      </h3>
                      <p className="text-sm text-muted-foreground">{cs.title}</p>
                    </div>
                  </div>
                  <span className="mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    <BadgeCheck className="h-3 w-3 text-brand" />
                    Delivered
                  </span>
                </div>

                {/* Context chip */}
                <div className="mt-4">
                  <span className="inline-flex items-center rounded-md bg-brand/10 px-2 py-0.5 font-mono text-[11px] font-medium text-brand">
                    {cs.context}
                  </span>
                </div>

                {/* Story */}
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {cs.story}
                </p>

                {/* Outcome metrics */}
                <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border/60 bg-border/60">
                  {cs.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="flex flex-col items-center justify-center gap-0.5 bg-card px-2 py-3.5 text-center transition-colors group-hover:bg-card/70"
                    >
                      <span className="text-lg font-bold tracking-tight text-brand sm:text-xl">
                        {m.value}
                      </span>
                      <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/80">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tech chips */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {cs.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border/50 bg-card/40 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Free-audit CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="audit-banner relative mt-8 overflow-hidden rounded-2xl border border-brand/30 bg-gradient-to-br from-brand/12 via-card/60 to-card/40 p-6 sm:p-8"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-brand/15 blur-[80px]" />
          <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center lg:pr-10">
            <div className="max-w-xl">
              <h3 className="flex items-center gap-2 text-base font-semibold text-foreground sm:text-lg">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand/15 text-brand">
                  <BadgeCheck className="h-4 w-4" />
                </span>
                {profile.freeAudit.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {profile.freeAudit.body}
              </p>
            </div>
            <a
              href={profile.whatsappUrl}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => trackEvent("whatsapp_click", { label: "audit_banner" })}
              className="audit-cta inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/25 transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="currentColor"
                aria-hidden
              >
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.2-.32a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.86-.87 2.07 0 1.22.89 2.39 1 2.56.14.17 1.76 2.67 4.25 3.73.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.27-.25-.14-1.47-.74-1.69-.82-.23-.08-.37-.12-.56.12-.16.25-.64.81-.78.97-.15.17-.29.19-.53.07-.26-.13-1.06-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.12-.24-.01-.39.11-.5.11-.11.27-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.11-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43-.14 0-.3-.01-.47-.01" />
              </svg>
              Book it on WhatsApp
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
