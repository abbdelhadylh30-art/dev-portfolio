"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles, Timer, Wallet } from "lucide-react";
import {
  pricingTiers,
  paymentFlow,
  pricingExtras,
  upgradeCreditNote,
  type PricingTask,
  type PricingTier,
  type PricingVariant,
} from "@/lib/portfolio-data";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { trackEvent } from "@/lib/analytics";

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

/* Task-by-task breakdown — the "what exactly am I paying for" table. */
function TaskList({ tasks }: { tasks: PricingTask[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {tasks.map((t) => (
        <li
          key={t.task}
          className="flex items-start justify-between gap-3 border-b border-border/40 pb-3 last:border-0 last:pb-0"
        >
          <div>
            <p className="text-sm font-semibold text-foreground">{t.task}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{t.detail}</p>
          </div>
          <span className="shrink-0 rounded-full bg-brand/10 px-2 py-0.5 font-mono text-[11px] font-bold text-brand">
            {t.when}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* One package card — price, duration, deposit split, tasks and CTA.
   The one-pager carries two flavours (portfolio / landing) toggled in-card. */
function TierCard({ tier }: { tier: PricingTier }) {
  const [variantIdx, setVariantIdx] = useState(0);
  const active: PricingVariant | null = tier.variants ? tier.variants[variantIdx] : null;

  const price = active ? active.price : tier.price;
  const deposit = active ? active.deposit : tier.deposit;
  const duration = active ? active.duration : tier.duration;
  const tasks = active ? active.tasks : tier.tasks;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`client-card glow-card group relative flex flex-col rounded-2xl border p-6 ${
        tier.popular
          ? "border-brand/50 bg-gradient-to-b from-brand/10 to-card/60 ring-1 ring-brand/30 md:-translate-y-1.5"
          : "border-border/60 bg-card/50"
      }`}
    >
      {tier.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand to-brand-2 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow">
          Most chosen
        </span>
      )}

      <h3 className="text-lg font-bold text-foreground transition-colors group-hover:text-brand">
        {tier.name}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {active ? active.blurb : tier.tagline}
      </p>

      {/* flavour toggle — one-pager only */}
      {tier.variants && (
        <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-muted/60 p-1">
          {tier.variants.map((v, i) => (
            <button
              key={v.name}
              type="button"
              onClick={() => {
                setVariantIdx(i);
                trackEvent("pricing_variant_switch", {
                  label: `${tier.id}:${v.name.toLowerCase()}`,
                });
              }}
              className={`rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors ${
                i === variantIdx
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v.name} · {usd(v.price)}
            </button>
          ))}
        </div>
      )}

      {/* price + duration */}
      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <span className="font-mono text-4xl font-black tracking-tight text-foreground">
            {usd(price)}
          </span>
          <span className="ml-1.5 text-xs text-muted-foreground">one-time</span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
          <Timer className="h-3.5 w-3.5 text-brand" />
          {duration}
        </span>
      </div>

      {/* deposit split — paying feels safe when the rules are visible */}
      <p className="mt-4 flex items-center gap-2 rounded-lg border border-brand/15 bg-brand/10 px-3 py-2 text-xs font-medium text-foreground">
        <Wallet className="h-3.5 w-3.5 shrink-0 text-brand" />
        <span>
          <strong>{usd(deposit)} deposit</strong> to start · {usd(price - deposit)} on launch day
        </span>
      </p>

      {tier.buildsOn && (
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-2">
          {tier.buildsOn}
        </p>
      )}

      <motion.div
        key={active ? active.name : tier.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1"
      >
        <TaskList tasks={tasks} />
      </motion.div>

      <a
        href="#contact"
        onClick={() => trackEvent("pricing_cta_click", { label: tier.id })}
        className={`mt-5 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
          tier.popular
            ? "bg-gradient-to-r from-brand to-brand-2 text-white shadow-lg shadow-brand/25"
            : "border border-border/60 bg-muted/40 text-foreground hover:border-brand/40 hover:text-brand"
        }`}
      >
        Book the free 15-minute chat
        <ArrowRight className="h-4 w-4" />
      </a>
    </motion.div>
  );
}

/**
 * Business-view "Pricing" — full price transparency: every package with its
 * task list, duration and deposit split, the payment flow spelled out
 * step-by-step, an upgrade-credit line and the honesty extras. Nothing is
 * hidden behind "contact us for a quote" except genuinely custom work.
 */
export function ClientPricing() {
  return (
    <section id="pricing" className="relative overflow-hidden border-t border-border/40 py-20 sm:py-28">
      <div className="pointer-events-none absolute -right-32 top-24 -z-10 h-56 w-56 rounded-full bg-brand/8 blur-[100px] pulse-slow float-b" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Pricing"
          counter={{ current: "04", total: "06" }}
          title={
            <>
              Real prices. <span className="brand-gradient-text">Real timelines</span>. No mystery quotes.
            </>
          }
          description="Every package, every task, every dollar — out in the open. Pick what fits today, start small, and upgrade later: you only ever pay the difference."
        />

        {/* the four packages */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {pricingTiers.map((tier) => (
            <TierCard key={tier.id} tier={tier} />
          ))}
        </div>

        {/* upgrade credit — the de-risked path from small to big */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 flex items-start gap-3 rounded-2xl border border-brand/25 bg-brand/10 p-5"
        >
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
          <p className="text-sm leading-relaxed text-foreground">{upgradeCreditNote}</p>
        </motion.div>

        {/* what happens after the deposit — the 5-step payment flow */}
        <div className="mt-14">
          <h3 className="text-center text-xl font-bold text-foreground">
            What happens after <span className="brand-gradient-text">the deposit</span>
          </h3>
          <ol className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {paymentFlow.map((step, idx) => (
              <motion.li
                key={step.num}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="client-card relative flex flex-col rounded-xl border border-border/60 bg-card/50 p-5"
              >
                <span className="brand-gradient-text font-mono text-xs font-bold">{step.num}</span>
                <p className="mt-2 text-sm font-semibold leading-snug text-foreground">{step.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{step.body}</p>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* honesty section + custom-quote escape hatch */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="client-card rounded-2xl border border-border/60 bg-card/50 p-6"
          >
            <h3 className="text-lg font-bold text-foreground">{pricingExtras.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{pricingExtras.lead}</p>
            <ul className="mt-4 space-y-3">
              {pricingExtras.items.map((item) => (
                <li key={item.label} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    <strong className="text-foreground">{item.label}</strong> — {item.detail}
                  </p>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="client-card glow-card relative flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br from-card/60 to-brand/8 p-6"
          >
            <h3 className="text-lg font-bold text-foreground">{pricingExtras.custom.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {pricingExtras.custom.body}
            </p>
            <a
              href="#contact"
              onClick={() => trackEvent("pricing_cta_click", { label: "custom" })}
              className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-brand/40 hover:text-brand"
            >
              {pricingExtras.custom.cta}
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 text-center text-sm text-muted-foreground"
        >
          Not sure which package fits? That&apos;s exactly what the free chat is for.{" "}
          <a href="#contact" className="font-semibold text-brand hover:underline">
            Pin your number in 15 minutes →
          </a>
        </motion.p>
      </div>
    </section>
  );
}
