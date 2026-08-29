"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Wallet, KeyRound, Timer, HeartHandshake } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { guarantees, faqs, type Guarantee } from "@/lib/portfolio-data";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { trackEvent } from "@/lib/analytics";

const GUARANTEE_ICONS: Record<Guarantee["icon"], typeof Wallet> = {
  price: Wallet,
  own: KeyRound,
  time: Timer,
  support: HeartHandshake,
};

/**
 * Business-view "Straight answers" — the two things that de-risk hiring a
 * developer: a visible guarantees strip + an FAQ answering the money/time/
 * language questions every owner actually asks.
 */
export function TrustFaq() {
  const [opened, setOpened] = React.useState<string[]>([]);

  return (
    <section id="answers" className="relative overflow-hidden border-t border-border/40 py-20 sm:py-28">
      <div className="pointer-events-none absolute -left-32 top-24 -z-10 h-56 w-56 rounded-full bg-brand-2/8 blur-[100px] pulse-slow float-a" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Straight answers"
          title={
            <>
              The things you&apos;d <span className="brand-gradient-text">ask anyway</span>.
            </>
          }
          description="Money, timing, Arabic, and what happens after launch — answered plainly."
        />

        {/* Guarantees strip */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((g, idx) => {
            const Icon = GUARANTEE_ICONS[g.icon];
            return (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="client-card glow-card shine-sweep group rounded-2xl border border-border/60 bg-card/50 p-5"
              >
                <span className="icon-bob grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand/20 to-brand-2/15 text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3.5 text-sm font-semibold leading-snug text-foreground">
                  {g.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{g.body}</p>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ accordion */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-12 max-w-3xl"
        >
          <Accordion
            type="multiple"
            value={opened}
            onValueChange={(v) => {
              const added = v.find((x) => !opened.includes(x));
              if (added) trackEvent("faq_open", { label: added });
              setOpened(v);
            }}
            className="divide-y divide-border/50 rounded-2xl border border-border/60 bg-card/50 px-2"
          >
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`} className="border-0">
                <AccordionTrigger className="px-4 py-4 text-left text-sm font-semibold text-foreground hover:text-brand hover:no-underline sm:text-[15px]">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
