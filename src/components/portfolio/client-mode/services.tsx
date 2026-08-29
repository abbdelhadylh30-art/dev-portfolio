"use client";

import { motion } from "framer-motion";
import { Globe, CalendarCheck, TrendingUp, ShieldCheck, Check, ArrowRight } from "lucide-react";
import { services, type Service } from "@/lib/portfolio-data";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { trackEvent } from "@/lib/analytics";

const ICONS: Record<Service["icon"], typeof Globe> = {
  globe: Globe,
  calendar: CalendarCheck,
  search: TrendingUp,
  shield: ShieldCheck,
};

/**
 * Business-view "What I do" — four plain-language service cards,
 * each ending on the outcome the business owner actually buys.
 */
export function Services() {
  return (
    <section id="services" className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute -left-32 top-40 -z-10 h-56 w-56 rounded-full bg-brand-2/8 blur-[100px] pulse-slow float-b" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="What I do"
          counter={{ current: "01", total: "05" }}
          title={
            <>
              Websites that <span className="brand-gradient-text">pay for themselves</span>.
            </>
          }
          description="Four things I do for businesses like yours — described the way I'd describe them over coffee, not in tech-speak."
        />

        <div className="mt-12 grid gap-5 sm:gap-6 md:grid-cols-2">
          {services.map((svc, idx) => {
            const Icon = ICONS[svc.icon];
            return (
              <motion.article
                key={svc.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="client-card glow-card shine-sweep group relative flex flex-col rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-7"
              >
                <div className="flex items-center gap-3.5">
                  <span className="icon-bob grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand/20 to-brand-2/15 text-brand">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold leading-tight text-foreground transition-colors group-hover:text-brand">
                    {svc.title}
                  </h3>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{svc.body}</p>

                <ul className="mt-4 space-y-2.5">
                  {svc.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-foreground/85">
                      <span className="mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full bg-brand/12 text-brand">
                        <Check className="h-3 w-3" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-5">
                  <div className="grad-border flex items-center gap-2 rounded-lg border border-brand/25 bg-brand/6 px-3.5 py-2.5 transition-colors group-hover:border-brand/40">
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-brand transition-transform duration-300 group-hover:translate-x-1" />
                    <span className="text-sm font-semibold text-foreground">{svc.outcome}</span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Soft CTA under the grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Not sure which one you need?{" "}
            <a
              href="#contact"
              onClick={() => trackEvent("service_click", { label: "not_sure_cta" })}
              className="font-semibold text-brand hover:underline"
            >
              Tell me what&apos;s bothering you about your current website
            </a>{" "}
            — I&apos;ll map it to the right fix for free.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
