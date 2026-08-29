"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowUp,
  Github,
  Mail,
  MapPin,
  Sparkles,
  ArrowUpRight,
  Rss,
  Copy,
  Check,
  Phone,
  Languages,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { profile } from "@/lib/portfolio-data";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { ContactForm } from "@/components/portfolio/contact-form";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      trackEvent("contact_copy_email", { label: "email" });
      toast({
        title: "Email copied",
        description: profile.email,
      });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast({
        title: "Couldn't copy",
        description: "Clipboard access denied — select it manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-20 sm:py-28 border-t border-border/40"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-64 w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[120px]" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Contact"
          align="center"
          counter={{ current: "08", total: "08" }}
          title={
            <>
              Let&apos;s build{" "}
              <span className="text-brand">your site</span>.
            </>
          }
          description="Free 15-minute call: I'll audit your current site, show you exactly what to fix, and give you a fixed-price quote — whether you hire me or not."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-10 items-start">
          {/* Left: contact info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <p className="text-sm text-muted-foreground">
              WhatsApp is fastest. Prefer email? Use the form on the right —
              it lands straight in my inbox. English &amp; العربية both work.
            </p>

            <a
              href={profile.whatsappUrl}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => trackEvent("whatsapp_click", { label: "contact_card" })}
              className="group flex items-center gap-4 rounded-2xl border border-brand/40 bg-brand/8 p-5 card-hover"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-brand-foreground shadow-md shadow-brand/25">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.2-.32a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.86-.87 2.07 0 1.22.89 2.39 1 2.56.14.17 1.76 2.67 4.25 3.73.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.27-.25-.14-1.47-.74-1.69-.82-.23-.08-.37-.12-.56.12-.16.25-.64.81-.78.97-.15.17-.29.19-.53.07-.26-.13-1.06-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.12-.24-.01-.39.11-.5.11-.11.27-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.11-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43-.14 0-.3-.01-.47-.01" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  WhatsApp
                </div>
                <div className="truncate text-sm font-semibold text-foreground group-hover:text-brand transition-colors">
                  {profile.phoneDisplay}
                </div>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand/15 px-3 py-1 text-xs font-medium text-brand">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="status-pulse absolute inline-flex h-1.5 w-1.5 rounded-full bg-brand opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
                </span>
                Fastest reply
              </span>
            </a>

            <a
              href={`tel:${profile.phoneIntl}`}
              onClick={() => trackEvent("contact_call", { label: "phone" })}
              className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card/50 p-5 card-hover"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/15 text-brand">
                <Phone className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Call
                </div>
                <div className="truncate text-sm font-semibold text-foreground group-hover:text-brand transition-colors">
                  {profile.phoneDisplay}
                </div>
              </div>
            </a>

            <div
              className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card/50 p-5 card-hover"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/15 text-brand">
                <Mail className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Email
                </div>
                <div className="truncate text-sm font-semibold text-foreground">
                  {profile.email}
                </div>
              </div>
              <button
                type="button"
                onClick={copyEmail}
                aria-label="Copy email address to clipboard"
                className="copy-chip inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-brand" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>

            <a
              href={`mailto:${profile.email}`}
              className="sr-only"
            >
              Email {profile.email}
            </a>

            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card/50 p-5 card-hover"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/15 text-brand">
                <Github className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  GitHub
                </div>
                <div className="truncate text-sm font-semibold text-foreground group-hover:text-brand transition-colors">
                  @{profile.githubUsername}
                </div>
              </div>
            </a>

            <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card/50 p-5">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/15 text-brand">
                <MapPin className="h-5 w-5" />
              </span>
              <div className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-1">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Based in
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {profile.location}
                  </div>
                </div>
                <span className="hidden sm:inline text-muted-foreground/40">
                  ·
                </span>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Languages
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <Languages className="h-3.5 w-3.5 text-brand" />
                    EN · AR
                  </div>
                </div>
              </div>
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
                <Sparkles className="h-3.5 w-3.5" />
                Available
              </span>
            </div>

            <Button
              asChild
              className="w-full bg-brand text-brand-foreground hover:bg-brand/90 h-11 rounded-full shadow-lg shadow-brand/20"
            >
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Github className="mr-2 h-4 w-4" />
                Follow on GitHub
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>

          {/* Right: contact form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="contact-form-shell relative rounded-2xl border border-border/60 bg-card/40 p-6 sm:p-7"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">
                Send a message
              </h3>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
                WhatsApp · same day
              </span>
            </div>
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-brand-foreground font-bold text-sm shadow-sm">
              AG
            </span>
            <div>
              <div className="text-sm font-semibold text-foreground">
                {profile.name}
              </div>
              <div className="font-mono text-[11px] text-muted-foreground">
                {profile.roleLong}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <a
              href={profile.whatsappUrl}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => trackEvent("whatsapp_click", { label: "footer" })}
              className="inline-flex items-center gap-1.5 hover:text-brand transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.2-.32a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.86-.87 2.07 0 1.22.89 2.39 1 2.56.14.17 1.76 2.67 4.25 3.73.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.27-.25-.14-1.47-.74-1.69-.82-.23-.08-.37-.12-.56.12-.16.25-.64.81-.78.97-.15.17-.29.19-.53.07-.26-.13-1.06-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.12-.24-.01-.39.11-.5.11-.11.27-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.11-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43-.14 0-.3-.01-.47-.01" />
              </svg>
              WhatsApp
            </a>
            <a
              href={`tel:${profile.phoneIntl}`}
              className="inline-flex items-center gap-1.5 hover:text-brand transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              {profile.phoneDisplay}
            </a>
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 hover:text-brand transition-colors"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-1.5 hover:text-brand transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              Email
            </a>
            <a
              href="/api/feed"
              className="inline-flex items-center gap-1.5 hover:text-brand transition-colors"
              title="Atom feed — latest commit from every repository"
            >
              <Rss className="h-3.5 w-3.5" />
              RSS
            </a>
            <a
              href="#top"
              className="inline-flex items-center gap-1.5 hover:text-brand transition-colors"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              Back to top
            </a>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-border/40 pt-6 text-center sm:flex-row sm:text-left">
          <p className="font-mono text-[11px] text-muted-foreground/70">
            © {new Date().getFullYear()} {profile.name}. Built with Next.js 16,
            TypeScript &amp; Tailwind 4.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-[11px] text-muted-foreground/70">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/5 px-2.5 py-0.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="status-pulse absolute inline-flex h-1.5 w-1.5 rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
              </span>
              <span className="text-brand">all systems operational</span>
            </span>
            <span className="hidden sm:inline text-muted-foreground/40">·</span>
            <span className="inline-flex items-center gap-1.5">
              Press{" "}
              <kbd className="kbd-key">?</kbd>{" "}
              for shortcuts
            </span>
            <span className="hidden sm:inline text-muted-foreground/40">·</span>
            <span>
              Repo synced from{" "}
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-brand hover:underline"
              >
                github.com/{profile.githubUsername}
              </a>
            </span>
            <span className="hidden sm:inline text-muted-foreground/40">·</span>
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="pill-link"
            >
              <Github className="h-3 w-3" />
              View source
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
