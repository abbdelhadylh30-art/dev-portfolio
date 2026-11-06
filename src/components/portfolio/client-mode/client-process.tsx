"use client";

import { motion } from "framer-motion";
import { MessagesSquare, FileText, Hammer, Rocket } from "lucide-react";
import { type ClientProcessStep } from "@/lib/portfolio-data";
import { usePrefs, GradTitle } from "@/lib/i18n/language";
import { SectionHeading } from "@/components/portfolio/section-heading";

const ICONS: Record<ClientProcessStep["icon"], typeof MessagesSquare> = {
  chat: MessagesSquare,
  quote: FileText,
  build: Hammer,
  launch: Rocket,
};

/**
 * Business-view "How it works" — four plain steps that de-risk hiring
 * a developer: free chat → fixed quote → visible progress → launch+support.
 *
 * Makeover: the four identical cards become an open journey on a warm
 * panel band — numbered nodes sitting on a connected gradient line
 * (desktop), each step breathing instead of boxed. The line is a
 * symmetric fade so it mirrors cleanly in RTL; the node halo matches
 * the band tint so the track appears to pause at every step.
 */
export function ClientProcess() {
  const { t, isRtl } = usePrefs();
  return (
    <section id="process" className="band-panel relative overflow-hidden border-t border-border/40 py-20 sm:py-28">
      <div className="pointer-events-none absolute -left-32 bottom-32 -z-10 h-56 w-56 rounded-full bg-brand-2/8 blur-[100px] pulse-slow float-a" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Chapter numeral — decorative ghost behind the heading */}
        <span aria-hidden className="page-ghost-num font-mono">03</span>

        <SectionHeading
          eyebrow={t.process.head.eyebrow}
          counter={{ current: "03", total: "06" }}
          title={<GradTitle parts={t.process.head.title} />}
          description={t.process.head.description}
        />

        <ol className="relative mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Desktop connector — one gradient track threading all nodes.
              Symmetric fades at both ends, so it never needs mirroring. */}
          <span aria-hidden className="journey-line absolute top-7 hidden lg:block" />

          {t.process.items.map((step, idx) => {
            const Icon = ICONS[step.icon];
            return (
              <motion.li
                key={step.num}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex flex-col"
              >
                <div className="flex items-center gap-3">
                  <span className="journey-node grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-border/70 bg-card text-brand shadow-sm">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-mono text-xs font-bold text-brand">{step.num}</span>
                </div>

                <h3 className="mt-5 text-base font-semibold leading-snug text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </motion.li>
            );
          })}
        </ol>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 text-center text-sm text-muted-foreground"
        >
          {t.process.footerPre}
          <a href="#contact" className="font-semibold text-brand hover:underline">
            {t.process.footerLink} {isRtl ? "←" : "→"}
          </a>
        </motion.p>
      </div>
    </section>
  );
}
