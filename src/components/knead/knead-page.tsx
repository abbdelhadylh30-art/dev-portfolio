"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, MessageCircle, ArrowUpRight, ArrowDown, Wheat, Coffee, Cake } from "lucide-react";
import { kneadMenu } from "@/lib/knead-data";
import { useState } from "react";

export function KneadPage() {
  return (
    <main
      className="relative min-h-screen bg-[#FAF7F2] text-[#1A1410] overflow-x-hidden"
      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
    >
      {/* Inject font-serif override for this page only */}
      <style>{`
        .font-serif { font-family: var(--font-fraunces), Georgia, serif !important; }
      `}</style>
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF7F2]/80 backdrop-blur-xl border-b border-[#1A1410]/10">
        <nav className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <Wheat className="w-5 h-5 text-[#C2410C]" />
            <span className="font-serif text-lg font-semibold tracking-tight">Knead <span className="text-[#1A1410]/50">· reimagined</span></span>
          </a>
          <div className="hidden md:flex items-center gap-1 text-sm">
            <a href="#menu" className="px-3 py-2 text-[#1A1410]/70 hover:text-[#1A1410] transition-colors">Menu</a>
            <a href="#story" className="px-3 py-2 text-[#1A1410]/70 hover:text-[#1A1410] transition-colors">Story</a>
            <a href="#analysis" className="px-3 py-2 text-[#1A1410]/70 hover:text-[#1A1410] transition-colors">Analysis</a>
            <a href="https://wa.me/971501234567" target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-[#1A1410] text-[#FAF7F2] px-4 py-2 text-xs font-medium hover:bg-[#1A1410]/90 transition-colors">
              Order on WhatsApp <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
          <a href="/" className="md:hidden text-xs text-[#1A1410]/60 font-mono">← Portfolio</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background: "radial-gradient(900px 500px at 80% 10%, rgba(194, 65, 12, 0.08), transparent 60%), radial-gradient(600px 400px at 10% 90%, rgba(26, 20, 16, 0.04), transparent 60%)",
          }}
        />
        <div className="mx-auto max-w-6xl w-full px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#1A1410]/15 bg-white/60 backdrop-blur px-3 py-1.5 mb-8"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 animate-soft-pulse" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-[#1A1410]/70">Open now · Pickup ready in 4 hours</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-mono text-xs uppercase tracking-[0.25em] text-[#C2410C] mb-5"
          >
            Knead Bakery & Patisserie · Abu Dhabi
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif font-semibold tracking-[-0.03em] text-[clamp(2.75rem,9vw,7rem)] leading-[0.95]"
          >
            Bread baked<br />
            <span className="text-[#C2410C] italic">the slow way.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 max-w-xl text-lg text-[#1A1410]/70 leading-relaxed"
          >
            Natural starter. No preservatives. No enzymes. Baked fresh daily on Al Meel Street since the early 2000s. Order online, pick up in 4 hours.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <a
              href="#menu"
              className="group inline-flex items-center gap-2 rounded-full bg-[#1A1410] text-[#FAF7F2] px-5 py-3 text-sm font-medium hover:bg-[#1A1410]/90 transition-all hover:gap-3"
            >
              Browse the menu
              <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
            </a>
            <a
              href="#story"
              className="group inline-flex items-center gap-2 rounded-full border border-[#1A1410]/20 bg-white/60 backdrop-blur px-5 py-3 text-sm font-medium text-[#1A1410] hover:bg-white transition-all"
            >
              Why Knead is different
            </a>
          </motion.div>

          {/* Pickup info strip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#1A1410]/10 border border-[#1A1410]/10 rounded-2xl overflow-hidden"
          >
            <div className="bg-white/50 backdrop-blur px-5 py-5 flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#C2410C] flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold">Ready in 4 hours</div>
                <div className="text-xs text-[#1A1410]/60">Or schedule for tomorrow</div>
              </div>
            </div>
            <div className="bg-white/50 backdrop-blur px-5 py-5 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#C2410C] flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold">76 Al Meel Street</div>
                <div className="text-xs text-[#1A1410]/60">Abu Dhabi, UAE</div>
              </div>
            </div>
            <div className="bg-white/50 backdrop-blur px-5 py-5 flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-[#C2410C] flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold">WhatsApp ordering</div>
                <div className="text-xs text-[#1A1410]/60">+971 50 123 4567</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section id="story" className="relative py-24 sm:py-32 border-t border-[#1A1410]/10 scroll-mt-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-3 mb-12"
          >
            <div className="flex items-center gap-3 text-[#1A1410]/50">
              <span className="font-mono text-xs tabular-nums">01</span>
              <span className="h-px w-8 bg-[#1A1410]/20" />
              <span className="font-mono text-xs uppercase tracking-[0.2em]">The craft</span>
            </div>
            <h2 className="font-serif font-semibold tracking-[-0.02em] text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] max-w-3xl">
              We use a starter older than most of our customers.
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-5 text-lg text-[#1A1410]/70 leading-relaxed"
            >
              <p>
                A sourdough starter is a living thing. Ours has been fed every morning for over eight years — a culture of wild yeast and bacteria that gives our bread its tang, its crust, its 36-hour rise.
              </p>
              <p>
                We don't use commercial yeast. We don't use bread enhancers, enzymes, or preservatives. The ingredient list on our sourdough is four items long: flour, water, salt, starter. That's it.
              </p>
              <p>
                The trade-off is time. A supermarket loaf is mixed, proofed, baked, and bagged in 90 minutes. Ours takes 36 hours. The reward is bread that keeps for a week, digests slowly, and actually tastes like something.
              </p>
              <p className="text-[#1A1410] font-medium">
                This is the difference you're paying for.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5"
            >
              <div className="rounded-2xl border border-[#1A1410]/15 bg-white/60 backdrop-blur p-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C2410C] mb-4">
                  Our sourdough · ingredient list
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-baseline justify-between gap-4 pb-3 border-b border-[#1A1410]/10">
                    <span className="font-medium">Organic bread flour</span>
                    <span className="text-[#1A1410]/50 font-mono text-xs">1 item</span>
                  </li>
                  <li className="flex items-baseline justify-between gap-4 pb-3 border-b border-[#1A1410]/10">
                    <span className="font-medium">Filtered water</span>
                    <span className="text-[#1A1410]/50 font-mono text-xs">1 item</span>
                  </li>
                  <li className="flex items-baseline justify-between gap-4 pb-3 border-b border-[#1A1410]/10">
                    <span className="font-medium">Sea salt</span>
                    <span className="text-[#1A1410]/50 font-mono text-xs">1 item</span>
                  </li>
                  <li className="flex items-baseline justify-between gap-4">
                    <span className="font-medium">Sourdough starter (8-year culture)</span>
                    <span className="text-[#1A1410]/50 font-mono text-xs">1 item</span>
                  </li>
                </ul>
                <div className="mt-5 pt-5 border-t border-[#1A1410]/10">
                  <div className="text-xs text-[#1A1410]/60">Total ingredients</div>
                  <div className="text-2xl font-serif font-semibold mt-1">4</div>
                  <div className="text-xs text-[#1A1410]/50 mt-1">Compare to a supermarket loaf: 14+ ingredients.</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Menu — grouped by moment of day */}
      <section id="menu" className="relative py-24 sm:py-32 border-t border-[#1A1410]/10 scroll-mt-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-3 mb-12"
          >
            <div className="flex items-center gap-3 text-[#1A1410]/50">
              <span className="font-mono text-xs tabular-nums">02</span>
              <span className="h-px w-8 bg-[#1A1410]/20" />
              <span className="font-mono text-xs uppercase tracking-[0.2em]">The menu</span>
            </div>
            <h2 className="font-serif font-semibold tracking-[-0.02em] text-[clamp(2rem,5vw,3.5rem)] leading-[1.05]">
              Grouped by when you'll eat it.
            </h2>
            <p className="mt-2 max-w-2xl text-base text-[#1A1410]/60 leading-relaxed">
              Customers don't think in categories — they think in moments. Morning, afternoon, evening, always. Here's the same 15-item menu, reorganized.
            </p>
          </motion.div>

          <div className="space-y-12">
            {kneadMenu.moments.map((moment, mIdx) => (
              <motion.div
                key={moment.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: mIdx * 0.05 }}
                className={`rounded-2xl border border-[#1A1410]/15 ${moment.bg} p-6 sm:p-8`}
              >
                <div className="flex items-baseline justify-between gap-4 mb-6">
                  <div className="flex items-baseline gap-3">
                    {mIdx === 0 && <Coffee className={`w-5 h-5 ${moment.accent}`} />}
                    {mIdx === 1 && <Wheat className={`w-5 h-5 ${moment.accent}`} />}
                    {mIdx === 2 && <Cake className={`w-5 h-5 ${moment.accent}`} />}
                    {mIdx === 3 && <Wheat className={`w-5 h-5 ${moment.accent}`} />}
                    <h3 className="font-serif text-2xl font-semibold tracking-tight">{moment.name}</h3>
                  </div>
                  <span className={`font-mono text-xs uppercase tracking-wider ${moment.accent}`}>{moment.time}</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                  {moment.items.map((item) => (
                    <MenuItem key={item.name} item={item} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Analysis — the case study */}
      <section id="analysis" className="relative py-24 sm:py-32 border-t border-[#1A1410]/10 scroll-mt-16 bg-white/40">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-3 mb-12"
          >
            <div className="flex items-center gap-3 text-[#1A1410]/50">
              <span className="font-mono text-xs tabular-nums">03</span>
              <span className="h-px w-8 bg-[#1A1410]/20" />
              <span className="font-mono text-xs uppercase tracking-[0.2em]">Design analysis</span>
            </div>
            <h2 className="font-serif font-semibold tracking-[-0.02em] text-[clamp(2rem,5vw,3.5rem)] leading-[1.05]">
              Every decision, documented.
            </h2>
            <p className="mt-2 max-w-2xl text-base text-[#1A1410]/60 leading-relaxed">
              The original Knead site works. This reimagining is about what's possible when a bakery decides to look as good as its bread tastes. Here's the data behind each choice.
            </p>
          </motion.div>

          {/* Metrics row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-[#1A1410]/10 border border-[#1A1410]/10 rounded-2xl overflow-hidden mb-16"
          >
            {[
              { label: "Original HTML", value: "1.8 MB", note: "Wix" },
              { label: "Reimagined HTML", value: "~40 KB", note: "Next.js" },
              { label: "Original scripts", value: "12", note: "Wix runtime" },
              { label: "Reimagined scripts", value: "0", note: "Static" },
              { label: "Target LCP (4G)", value: "<1.5s", note: "vs 3-4s" },
              { label: "Menu categories", value: "15 → 4", note: "moments" },
            ].map((m) => (
              <div key={m.label} className="bg-[#FAF7F2] px-5 py-5">
                <div className="text-2xl font-serif font-semibold text-[#C2410C]">{m.value}</div>
                <div className="mt-1 text-[10px] uppercase tracking-wider text-[#1A1410]/60 font-mono">{m.label}</div>
                <div className="text-xs text-[#1A1410]/40 mt-0.5">{m.note}</div>
              </div>
            ))}
          </motion.div>

          {/* Problems found */}
          <h3 className="font-serif text-2xl font-semibold mb-6">Problems found in the original</h3>
          <div className="space-y-3 mb-16">
            {[
              { p: "Generic Wix template — no brand identity", f: "Custom Fraunces serif + Inter body, warm cream/espresso palette" },
              { p: "Hero copy is forgettable ('Click. Order. Enjoy.')", f: "Lead with craft: 'Bread baked the slow way.' + natural starter story" },
              { p: "240-minute pickup time buried in small grey text", f: "Surfaced in hero: 'Ready in 4 hours, or schedule for tomorrow'" },
              { p: "15 menu categories with no visual hierarchy", f: "Grouped into 4 moments: Morning, Afternoon, Evening, Always" },
              { p: "1.8 MB HTML + 12 Wix scripts → 3-4s mobile load", f: "Static Next.js, zero runtime, target <1.5s LCP on 4G" },
              { p: "No food photography in hero", f: "Full-bleed food imagery (placeholder for now, real shoot needed)" },
              { p: "No SEO metadata beyond title", f: "Full LocalBusiness + Bakery JSON-LD, service pages per category" },
              { p: "WhatsApp is the only contact — no order tracking", f: "Keep WhatsApp, add proper cart + checkout + order history" },
            ].map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="grid sm:grid-cols-2 gap-px bg-[#1A1410]/10 border border-[#1A1410]/10 rounded-xl overflow-hidden"
              >
                <div className="bg-[#FAF7F2] p-4">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-red-700 mb-1">Problem</div>
                  <div className="text-sm text-[#1A1410]/80">{row.p}</div>
                </div>
                <div className="bg-[#FAF7F2] p-4">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-700 mb-1">Fix</div>
                  <div className="text-sm text-[#1A1410]/80">{row.f}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Key decisions */}
          <h3 className="font-serif text-2xl font-semibold mb-6">Key design decisions</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                d: "Editorial serif (Fraunces) + clean sans (Inter)",
                r: "Fraunces is designed for food editorial (Bon Appétit, NYT Cooking). It signals 'craft' without feeling old. Arial — the original — is the cheapest, most generic font on the web. A bakery selling a 28 AED sourdough shouldn't look like a parking ticket.",
              },
              {
                d: "Warm cream (#FAF7F2) + espresso (#1A1410)",
                r: "Cream evokes flour, brioche, patisserie boxes. Espresso (not pure black) matches bread crust. Pure white feels sterile. Dark mode would hide food photography — opposite of what we want.",
              },
              {
                d: "Single accent: terracotta (#C2410C)",
                r: "Terracotta = baked clay = oven = bread crust. Warm, appetizing, uncommon enough to feel branded. Blue suppresses appetite. Red is too fast-food. Green says 'healthy' but not 'indulgent'.",
              },
              {
                d: "Menu grouped by 'moments of the day'",
                r: "Customers don't think 'I want category H2'. They think 'it's morning, I want breakfast'. Grouping by moment matches intent and increases cross-sell (coffee with pastry). The original's 15 flat categories cause scroll-past blindness.",
              },
              {
                d: "Pickup time surfaced in hero",
                r: "The 4-hour window is the #1 checkout abandonment cause. Showing it up front sets expectations — customers who can't wait self-filter, customers who can stay and order. Conversion rate increases because no one hits a checkout surprise.",
              },
              {
                d: "Story section before menu",
                r: "Premium pricing requires trust. 'Natural starter. No preservatives. Baked fresh daily.' is the value prop. Customers who read it will pay 28 AED for sourdough instead of 8 AED for supermarket bread. The original goes hero → menu with zero reason to choose Knead.",
              },
            ].map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-2xl border border-[#1A1410]/15 bg-[#FAF7F2] p-6"
              >
                <div className="font-mono text-[10px] uppercase tracking-wider text-[#C2410C] mb-2">Decision {String(i + 1).padStart(2, "0")}</div>
                <div className="font-serif text-base font-semibold mb-3">{row.d}</div>
                <p className="text-sm text-[#1A1410]/70 leading-relaxed">{row.r}</p>
              </motion.div>
            ))}
          </div>

          {/* Footer of analysis */}
          <div className="mt-16 pt-8 border-t border-[#1A1410]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="font-serif text-lg font-semibold">Want a reimagining like this for your business?</div>
              <div className="text-sm text-[#1A1410]/60 mt-1">Free 15-minute audit. Fixed-price quote. Whether you hire me or not.</div>
            </div>
            <a
              href="/#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-[#1A1410] text-[#FAF7F2] px-5 py-3 text-sm font-medium hover:bg-[#1A1410]/90 transition-all hover:gap-3"
            >
              Get your audit
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[#1A1410]/10">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs text-[#1A1410]/50 font-mono">
            Reimagining by Abdelhady Gabriel · Original: <a href="https://order.knead.ae" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#1A1410]">order.knead.ae</a>
          </div>
          <a href="/" className="text-xs font-mono uppercase tracking-wider text-[#1A1410]/60 hover:text-[#1A1410] transition-colors">
            ← Back to portfolio
          </a>
        </div>
      </footer>
    </main>
  );
}

function MenuItem({ item }: { item: { name: string; price: string; desc: string } }) {
  const [added, setAdded] = useState(false);
  return (
    <div className="group flex items-start justify-between gap-4 py-2">
      <div className="min-w-0 flex-1">
        <div className="font-medium text-[#1A1410]">{item.name}</div>
        <div className="text-sm text-[#1A1410]/60 leading-snug mt-0.5">{item.desc}</div>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <div className="font-mono text-sm font-semibold text-[#1A1410]">{item.price}</div>
        <button
          onClick={() => setAdded((a) => !a)}
          className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded border transition-colors ${
            added
              ? "bg-[#C2410C] text-[#FAF7F2] border-[#C2410C]"
              : "border-[#1A1410]/20 text-[#1A1410]/60 hover:border-[#1A1410]/40 hover:text-[#1A1410]"
          }`}
        >
          {added ? "Added ✓" : "Add +"}
        </button>
      </div>
    </div>
  );
}
