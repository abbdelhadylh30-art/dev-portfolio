"use client";

import { motion } from "framer-motion";
import { MessageCircle, Phone, Mail, BadgeCheck, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { profile } from "@/lib/portfolio-data";
import { ContactForm } from "@/components/portfolio/contact-form";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { trackEvent } from "@/lib/analytics";

/**
 * Business-view contact — simple: WhatsApp first (that's how owners actually
 * reach a developer in Egypt/Gulf), then phone, then email, then the form.
 */
export function ClientContact() {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-border/40 py-20 sm:py-28">
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-brand/12 blur-[110px] pulse-slow float-a" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Contact"
          counter={{ current: "05", total: "05" }}
          title={
            <>
              Let&apos;s talk about <span className="brand-gradient-text">your website</span>.
            </>
          }
          description="WhatsApp is fastest — I usually reply within a few hours, same day at the latest."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Left: channels + promise */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4"
          >
            <a
              href={profile.whatsappUrl}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => trackEvent("whatsapp_click", { label: "client_contact" })}
              className="client-card grad-border shine-sweep group flex items-center gap-4 rounded-2xl border border-brand/40 bg-gradient-to-r from-brand/12 via-card/60 to-card/40 p-5 transition-all hover:border-brand/70 hover:shadow-lg hover:shadow-brand/10 sm:p-6"
            >
              <span className="halo-pulse grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-2 text-brand-foreground shadow-md shadow-brand/25">
                <MessageCircle className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-base font-semibold text-foreground transition-colors group-hover:text-brand">
                  WhatsApp — fastest
                  <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{profile.phoneDisplay}</p>
                <p className="mt-1 text-xs text-muted-foreground/70">Usually replies within a few hours</p>
              </div>
            </a>

            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href={`tel:${profile.phoneIntl}`}
                onClick={() => trackEvent("contact_call", { label: "client_contact" })}
                className="client-card chip-pop group flex items-center gap-3.5 rounded-2xl border border-border/60 bg-card/50 p-5"
              >
                <span className="icon-bob grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/15 text-brand">
                  <Phone className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground transition-colors group-hover:text-brand">Call me</div>
                  <p className="text-xs text-muted-foreground">{profile.phoneDisplay}</p>
                </div>
              </a>

              <a
                href={`mailto:${profile.email}`}
                onClick={() => trackEvent("contact_copy_email", { label: "client_contact" })}
                className="client-card chip-pop group flex items-center gap-3.5 rounded-2xl border border-border/60 bg-card/50 p-5"
              >
                <span className="icon-bob grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/15 text-brand">
                  <Mail className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground transition-colors group-hover:text-brand">Email</div>
                  <p className="truncate text-xs text-muted-foreground">{profile.email}</p>
                </div>
              </a>
            </div>

            {/* Free audit promise card */}
            <div className="glow-card rounded-2xl border border-border/60 bg-card/50 p-5 sm:p-6">
              <div className="flex items-center gap-2.5">
                <BadgeCheck className="icon-bob h-5 w-5 text-brand" />
                <h3 className="text-sm font-semibold text-foreground">
                  What happens in the free 15-minute chat
                </h3>
              </div>
              <ul className="mt-3.5 space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand/60" />
                  I look at your current website (or your competitor&apos;s) with you
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand/60" />
                  I tell you what&apos;s worth fixing and what isn&apos;t
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand/60" />
                  You get a fixed-price quote — with zero obligation
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Right: the form (reused — it already posts to /api/contact) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="contact-form-shell grad-border relative rounded-2xl border border-border/60 bg-card/40 p-6 sm:p-7"
          >
            <div aria-hidden className="grad-divider absolute inset-x-6 top-0 opacity-60" />
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">
                Or send a message — I&apos;ll reply on WhatsApp
              </h3>
              <span className="hidden font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70 sm:inline">
                Same-day reply
              </span>
            </div>
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
