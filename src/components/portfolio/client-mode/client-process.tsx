"use client";

import { motion } from "framer-motion";
import { MessagesSquare, FileText, Hammer, Rocket } from "lucide-react";
import { clientProcess, type ClientProcessStep } from "@/lib/portfolio-data";
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
 */
export function ClientProcess() {
  return (
    <section id="process" className="relative overflow-hidden border-t border-border/40 py-20 sm:py-28">
      <div className="pointer-events-none absolute -left-32 bottom-32 -z-10 h-56 w-56 rounded-full bg-brand-2/8 blur-[100px] pulse-slow float-a" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="How it works"
          counter={{ current: "03", total: "05" }}
          title={
            <>
              No mystery. <span className="brand-gradient-text">No jargon</span>. No surprises.
            </>
          }
          description="Hiring a developer feels risky when you can't see the code. Here's exactly how working together goes — start to finish."
        />

        <ol className="mt-12 grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {clientProcess.map((step, idx) => {
            const Icon = ICONS[step.icon];
            return (
              <motion.li
                key={step.num}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="client-card glow-card group relative flex flex-col rounded-2xl border border-border/60 bg-card/50 p-6"
              >
                {/* connector arrow (desktop) — drifting pulse toward the next step */}
                {idx < clientProcess.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute -right-3.5 top-1/2 z-10 hidden -translate-y-1/2 text-brand/60 lg:block float-c"
                  >
                    →
                  </span>
                )}

                <div className="flex items-center justify-between">
                  <span className="icon-bob grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand/20 to-brand-2/15 text-brand">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="brand-gradient-text font-mono text-xs font-bold">{step.num}</span>
                </div>

                <h3 className="mt-4 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-brand">
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
          The whole first step costs you 15 minutes and nothing else.{" "}
          <a href="#contact" className="font-semibold text-brand hover:underline">
            Start with the free chat →
          </a>
        </motion.p>
      </div>
    </section>
  );
}
