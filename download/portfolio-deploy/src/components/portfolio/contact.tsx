"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Linkedin, Github, ArrowUp, ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/portfolio-data";

const channels = [
  {
    icon: Mail,
    label: "Send an email",
    value: profile.email,
    href: `mailto:${profile.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: profile.phone,
    href: profile.phone ? `tel:${profile.phone.replace(/\s/g, "")}` : "",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "View profile",
    href: profile.linkedin,
  },
  {
    icon: Github,
    label: "GitHub",
    value: "View profile",
    href: profile.github,
  },
].filter((ch) => ch.href);

export function Contact() {
  return (
    <section
      id="contact"
      className="relative py-24 sm:py-36 scroll-mt-16 border-t border-border grain"
    >
      {/* Background glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(700px 400px at 50% 100%, rgba(250, 248, 244, 0.05), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-start gap-3 mb-12"
        >
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="font-mono text-xs tabular-nums">04</span>
            <span className="h-px w-8 bg-border" />
            <span className="font-mono text-xs uppercase tracking-[0.2em]">Contact</span>
          </div>
        </motion.div>

        {/* Big CTA */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-bold tracking-[-0.04em] text-[clamp(2.5rem,8vw,6rem)] leading-[0.95]"
        >
          Let&apos;s build
          <br />
          <span className="text-muted-foreground">something.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="mt-8 max-w-xl text-base text-muted-foreground leading-relaxed"
        >
          I&apos;m open to freelance briefs, full-time roles, and the occasional weekend side-quest.
          If you have a tool-shaped problem — a builder, an auditor, a workflow that should be one
          app instead of three — let&apos;s talk.
        </motion.p>

        {/* Channel grid */}
        <div className="mt-14 grid sm:grid-cols-2 gap-3">
          {channels.map((ch, i) => {
            const Icon = ch.icon;
            return (
              <motion.a
                key={ch.label}
                href={ch.href}
                target={ch.href.startsWith("http") ? "_blank" : undefined}
                rel={ch.href.startsWith("http") ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/40 backdrop-blur px-6 py-6 hover:bg-accent hover:border-foreground/20 transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {ch.label}
                    </div>
                    <div className="mt-0.5 text-sm sm:text-base font-medium text-foreground truncate">
                      {ch.value}
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
              </motion.a>
            );
          })}
        </div>

        {/* Footer row */}
        <div className="mt-20 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold">
              {profile.initials}
              <span className="text-muted-foreground">·</span>
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              © {new Date().getFullYear()} {profile.name}. Built with Next.js 16, React 19, Tailwind 4.
            </span>
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-2 text-xs font-mono uppercase tracking-wider hover:bg-accent transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            Back to top
          </button>
        </div>
      </div>
    </section>
  );
}
