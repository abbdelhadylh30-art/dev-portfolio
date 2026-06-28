"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Linkedin, Github, MapPin } from "lucide-react";
import { profile, philosophy } from "@/lib/portfolio-data";

const contactItems = [
  { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { icon: Phone, label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
  { icon: Linkedin, label: "LinkedIn", value: "Mohamed Medhat Ahmed", href: profile.linkedin },
  { icon: Github, label: "GitHub", value: "@mohamed-medhat", href: profile.github },
];

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Section header */}
        <SectionHeader index="01" eyebrow="Who I am" title="Builder, not bystander." />

        <div className="mt-12 grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: contact card */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-5"
          >
            <p className="text-base text-muted-foreground leading-relaxed">
              I&apos;m a full-stack developer who ships end-to-end product — Prisma schema, API routes,
              React components, the last pixel of margin, and the export button. I work alone and I work
              fast: each project below went from idea to a deployable Next.js app in days, not quarters.
            </p>

            <p className="mt-5 text-base text-muted-foreground leading-relaxed">
              My instinct is to build tools that compound. PixelForge begot LandingForge, which begot Forge
              Studio. Each project took a previous one as raw material. That&apos;s the only way I know to
              move fast without leaving wreckage behind.
            </p>

            {/* Contact list */}
            <div className="mt-10 grid sm:grid-cols-2 gap-3">
              {contactItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-3 rounded-lg border border-border bg-card/40 px-4 py-3 hover:bg-accent hover:border-foreground/20 transition-colors"
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

            <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
              <MapPin className="w-3 h-3" /> {profile.location}
            </div>
          </motion.div>

          {/* Right: philosophy statements */}
          <div className="lg:col-span-7">
            <div className="grid sm:grid-cols-2 gap-px bg-border/60 border border-border rounded-2xl overflow-hidden">
              {philosophy.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                  className="bg-card/40 backdrop-blur p-6 hover:bg-card/70 transition-colors"
                >
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                      0{i + 1}
                    </span>
                    <h4 className="text-sm font-semibold tracking-tight text-foreground">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
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
