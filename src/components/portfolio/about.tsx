"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import { profile } from "@/lib/portfolio-data";

const contactItems = [
  { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { icon: Phone, label: "Phone", value: profile.phone, href: profile.phone ? `tel:${profile.phone.replace(/\s/g, "")}` : "" },
  { icon: MessageCircle, label: "WhatsApp", value: profile.phone, href: (profile as { whatsapp?: string }).whatsapp || "" },
].filter((item) => item.href);

export function About() {
  return (
    <section id="about" className="relative py-20 sm:py-28 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col gap-3 mb-10"
        >
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="font-mono text-xs tabular-nums">01</span>
            <span className="h-px w-8 bg-border" />
            <span className="font-mono text-xs uppercase tracking-[0.2em]">About</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left: 2 short paragraphs */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <p className="text-lg text-foreground leading-relaxed">
              I&apos;m a full-stack developer based in {profile.location}. I build websites for
              businesses that need to be found online — clinics that want patients to book
              online, restaurants that want their own ordering system, real estate agencies
              that want leads 24/7.
            </p>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed">
              Every site I build loads in under 2 seconds, works perfectly on mobile, and
              shows up when customers search. No bloated templates, no monthly fees for
              things you don&apos;t need, no waiting 3 weeks for a &ldquo;web guy&rdquo; to
              update your phone number.
            </p>
          </motion.div>

          {/* Right: contact card */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-5"
          >
            <div className="rounded-2xl border border-border bg-card/40 backdrop-blur p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
                Get in touch
              </div>
              <div className="space-y-3">
                {contactItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="group flex items-center gap-3 rounded-lg border border-border bg-secondary/30 px-4 py-3 hover:bg-accent hover:border-foreground/20 transition-colors"
                    >
                      <div className="flex-shrink-0 w-9 h-9 rounded-md bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">
                          {item.label}
                        </div>
                        <div className="text-sm text-foreground truncate font-medium">
                          {item.value}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                <MapPin className="w-3 h-3" /> {profile.location}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  index,
  eyebrow,
  title,
}: {
  index: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center gap-3 text-muted-foreground">
        <span className="font-mono text-xs tabular-nums">{index}</span>
        <span className="h-px w-8 bg-border" />
        <span className="font-mono text-xs uppercase tracking-[0.2em]">{eyebrow}</span>
      </div>
      <h2 className="font-bold tracking-[-0.03em] text-[clamp(2rem,5vw,3.5rem)] leading-[1.02]">
        {title}
      </h2>
    </motion.div>
  );
}
