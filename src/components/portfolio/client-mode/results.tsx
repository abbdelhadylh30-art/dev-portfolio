"use client";

import { motion } from "framer-motion";
import { Store, Search, Scissors, Sparkles, ArrowUpRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clientResults, profile, type ClientResult } from "@/lib/portfolio-data";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { trackEvent } from "@/lib/analytics";

const ICONS: Record<ClientResult["icon"], typeof Store> = {
  store: Store,
  search: Search,
  scissors: Scissors,
  cta: Sparkles,
};

/**
 * Business-view "Results" — the case studies retold as business outcomes.
 * The final card is a CTA: "The next story could be yours."
 */
export function Results() {
  return (
    <section id="results" className="relative overflow-hidden border-t border-border/40 py-20 sm:py-28">
      <div className="pointer-events-none absolute -right-32 top-32 -z-10 h-56 w-56 rounded-full bg-brand-3/8 blur-[100px] pulse-slow float-c" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Results"
          counter={{ current: "02", total: "05" }}
          title={
            <>
              What businesses <span className="brand-gradient-text">actually got</span>.
            </>
          }
          description="No client cares about the tech behind it. Here's what changed for real businesses — in numbers they care about."
        />

        <div className="mt-12 grid gap-5 sm:gap-6 lg:grid-cols-2">
          {clientResults.map((r, idx) => {
            const Icon = ICONS[r.icon];
            const isCta = r.icon === "cta";
            return (
              <motion.article
                key={r.client}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`client-card tilt-card shine-sweep group relative flex flex-col rounded-2xl border p-6 sm:p-7 ${
                  isCta
                    ? "grad-border always border-brand/40 bg-gradient-to-br from-brand/12 via-card/60 to-card/40"
                    : "border-border/60 bg-card/50"
                }`}
                onClick={() => !isCta && trackEvent("result_card_click", { label: r.client })}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <span className={`icon-bob grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
                      isCta ? "grad-badge" : "bg-gradient-to-br from-brand/20 to-brand-2/15 text-brand"
                    }`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold leading-tight text-foreground transition-colors group-hover:text-brand">
                        {r.client}
                      </h3>
                      <p className="text-xs text-muted-foreground">{r.headline}</p>
                    </div>
                  </div>
                  {!isCta && (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  )}
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{r.story}</p>

                <div className="mt-auto pt-6">
                  <div className="grid grid-cols-3 gap-2">
                    {r.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="stat-topline rounded-xl border border-border/50 bg-background/60 px-2 py-3 text-center"
                      >
                        <div className="brand-gradient-text text-lg font-bold tracking-tight sm:text-xl">
                          {m.value}
                        </div>
                        <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {isCta && (
                    <Button
                      asChild
                      className="btn-shine mt-5 h-11 w-full rounded-full bg-brand text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/25 transition-transform hover:scale-[1.02] hover:bg-brand/90"
                    >
                      <a
                        href={profile.whatsappUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        onClick={() => trackEvent("whatsapp_click", { label: "results_cta_card" })}
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Start your free chat
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
