"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDown, Check, MapPin, Mail, Phone, MessageCircle } from "lucide-react";
import { useState } from "react";
import type { Industry } from "@/lib/industries-data";
import { profile } from "@/lib/portfolio-data";

export function IndustryPage({ industry }: { industry: Industry }) {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav — simplified, links back to main portfolio */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <nav className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <span className="relative w-7 h-7 rounded-md overflow-hidden ring-1 ring-border">
              <svg viewBox="0 0 500 500" className="w-full h-full" aria-hidden="true">
                <rect width="500" height="500" fill="#08080c"/>
                <text x="250" y="250" textAnchor="middle" dominantBaseline="central" fontSize="260" fontWeight="700" fill="#faf8f4" fontFamily="sans-serif">AG</text>
                <circle cx="430" cy="430" r="28" fill="#10b981">
                  <animate attributeName="r" values="28;32;28" dur="2.2s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="1;0.5;1" dur="2.2s" repeatCount="indefinite"/>
                </circle>
              </svg>
            </span>
            <span className="hidden sm:inline text-xs text-muted-foreground font-mono group-hover:text-foreground transition-colors">
              {industry.name.toLowerCase()}
            </span>
          </a>
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
          >
            ← Full portfolio
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 grain">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background: `radial-gradient(900px 600px at 70% -10%, rgba(250, 248, 244, 0.06), transparent 60%)`,
          }}
        />
        <div className="mx-auto max-w-6xl w-full px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-3 py-1.5 mb-8"
          >
            <span className={`inline-block w-1.5 h-1.5 rounded-full bg-current ${industry.accent}`} />
            <span className="text-xs font-medium text-muted-foreground">{industry.tagline}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-bold tracking-[-0.04em] text-[clamp(2.5rem,8vw,6rem)] leading-[0.95] max-w-4xl"
          >
            {industry.heroTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            {industry.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollTo("#contact"); }}
              className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-medium hover:bg-primary/90 transition-all hover:gap-3"
            >
              {industry.ctaText}
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#features"
              onClick={(e) => { e.preventDefault(); scrollTo("#features"); }}
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/40 backdrop-blur px-5 py-3 text-sm font-medium text-foreground hover:bg-accent transition-all"
            >
              What I build
              <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
            </a>
          </motion.div>

          {/* Metrics strip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px bg-border/60 border border-border rounded-2xl overflow-hidden"
          >
            {industry.metrics.map((m) => (
              <div key={m.label} className="bg-card/40 backdrop-blur px-5 py-5">
                <div className={`text-2xl sm:text-3xl font-bold tracking-tight tabular-nums ${industry.accent}`}>
                  {m.value}
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground font-mono">
                  {m.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pain points */}
      <section className="relative py-24 sm:py-32 border-t border-border">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-3 mb-12"
          >
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="font-mono text-xs tabular-nums">01</span>
              <span className="h-px w-8 bg-border" />
              <span className="font-mono text-xs uppercase tracking-[0.2em]">The problem</span>
            </div>
            <h2 className="font-bold tracking-[-0.03em] text-[clamp(2rem,5vw,3.5rem)] leading-[1.02]">
              Why your current site is losing {industry.name.toLowerCase().includes("dental") ? "patients" : industry.name.toLowerCase().includes("medical") ? "patients" : industry.name.toLowerCase().includes("restaurant") ? "customers" : "clients"}.
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-px bg-border/60 border border-border rounded-2xl overflow-hidden">
            {industry.painPoints.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-card/40 backdrop-blur p-6 sm:p-8 hover:bg-card/70 transition-colors"
              >
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-mono text-[10px] text-muted-foreground tabular-nums">0{i + 1}</span>
                  <h3 className="text-base font-semibold tracking-tight">{p.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24 sm:py-32 border-t border-border scroll-mt-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-3 mb-12"
          >
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="font-mono text-xs tabular-nums">02</span>
              <span className="h-px w-8 bg-border" />
              <span className="font-mono text-xs uppercase tracking-[0.2em]">What I build</span>
            </div>
            <h2 className="font-bold tracking-[-0.03em] text-[clamp(2rem,5vw,3.5rem)] leading-[1.02]">
              Everything your {industry.name.toLowerCase()} needs.
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {industry.features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-card/40 backdrop-blur p-6 hover:bg-card/70 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4 ${industry.accent}`}>
                  <Check className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold tracking-tight mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-24 sm:py-32 border-t border-border">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-3 mb-12"
          >
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="font-mono text-xs tabular-nums">03</span>
              <span className="h-px w-8 bg-border" />
              <span className="font-mono text-xs uppercase tracking-[0.2em]">Questions</span>
            </div>
            <h2 className="font-bold tracking-[-0.03em] text-[clamp(2rem,5vw,3.5rem)] leading-[1.02]">
              Before you ask.
            </h2>
          </motion.div>

          <div className="rounded-2xl border border-border bg-card/40 divide-y divide-border overflow-hidden">
            {industry.faqs.map((faq, i) => (
              <FaqRow key={i} q={faq.q} a={faq.a} defaultOpen={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative py-24 sm:py-36 border-t border-border grain scroll-mt-16">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background: "radial-gradient(700px 400px at 50% 100%, rgba(250, 248, 244, 0.05), transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="font-bold tracking-[-0.04em] text-[clamp(2.5rem,8vw,6rem)] leading-[0.95]"
          >
            Let&apos;s build your<br />
            <span className="text-muted-foreground">{industry.name.toLowerCase()} site.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-8 max-w-xl text-base text-muted-foreground leading-relaxed"
          >
            Free 15-minute call. I&apos;ll audit your current site, show you exactly what to fix, and give you a fixed-price quote — whether you hire me or not.
          </motion.p>

          <div className="mt-14 grid sm:grid-cols-3 gap-3">
            <a
              href={`mailto:${profile.email}?subject=${encodeURIComponent(`New ${industry.name} website inquiry`)}`}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/40 backdrop-blur px-6 py-6 hover:bg-accent transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Email</div>
                  <div className="mt-0.5 text-sm font-medium truncate">Send a message</div>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
            <a
              href={(profile as { whatsapp?: string }).whatsapp || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/40 backdrop-blur px-6 py-6 hover:bg-accent transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">WhatsApp</div>
                  <div className="mt-0.5 text-sm font-medium truncate">Quick reply</div>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
            <a
              href={`tel:${profile.phone}`}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/40 backdrop-blur px-6 py-6 hover:bg-accent transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Call</div>
                  <div className="mt-0.5 text-sm font-medium truncate">{profile.phone}</div>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
          </div>

          <div className="mt-20 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold">AG<span className="text-muted-foreground">·</span></span>
              <span className="text-xs text-muted-foreground font-mono">
                © {new Date().getFullYear()} {profile.name}. Built with Next.js 16.
              </span>
            </div>
            <a href="/" className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
              ← Back to full portfolio
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function FaqRow({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-accent/40 transition-colors"
        aria-expanded={open}
      >
        <span className="text-base font-medium pr-4">{q}</span>
        <span className={`text-muted-foreground transition-transform flex-shrink-0 ${open ? "rotate-90" : ""}`}>
          <ArrowUpRight className="w-4 h-4 rotate-45" />
        </span>
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{a}</p>
        </motion.div>
      )}
    </div>
  );
}
