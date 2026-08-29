"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Hammer, Book, Glasses, RefreshCw, FileText, Rss, ArrowUpRight } from "lucide-react";
import { nowSection } from "@/lib/now-notes";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { renderMarkdown } from "@/lib/markdown";

const ICONS: Record<string, typeof Hammer> = {
  hammer: Hammer,
  book: Book,
  glasses: Glasses,
};

function relativeUpdated(iso: string) {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
}

type NowPayload = {
  source: "db" | "fallback";
  blurb: string;
  bodyMarkdown?: string;
  updatedAt: string;
};

export function NowSection() {
  const [payload, setPayload] = React.useState<NowPayload | null>(null);

  // Public fetch of the current Now content. Falls back silently to the
  // bundled `now-notes.ts` payload if the API is unreachable, so the
  // section always renders something coherent.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/now", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as NowPayload;
        if (!cancelled && data) setPayload(data);
      } catch {
        // Silent — the bundled `nowSection` is the fallback below.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const blurb = payload?.blurb ?? nowSection.blurb;
  const updatedAt = payload?.updatedAt ?? nowSection.updatedAt;
  const fromDb = payload?.source === "db" && Boolean(payload?.bodyMarkdown);

  return (
    <section
      id="now"
      className="relative py-20 sm:py-28 border-t border-border/40 overflow-hidden"
    >
      {/* Ambient orb */}
      <div className="pointer-events-none absolute left-1/3 -bottom-32 -z-10 h-56 w-56 rounded-full bg-brand/8 blur-[100px] pulse-slow" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Now"
          counter={{ current: "07", total: "08" }}
          title={
            <>
              What I&apos;m working on{" "}
              <span className="text-brand">right now</span>.
            </>
          }
          description={blurb}
        />

        {fromDb ? (
          // Admin-edited markdown rendered to HTML. Two-column layout at lg:
          // the notes card (comfortable reading measure) + a compact meta
          // column (freshness, /now movement explainer, RSS chip).
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 rounded-2xl border border-border/60 bg-card/40 p-6 sm:p-8 card-hover"
            >
              <div className="mb-4 flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand/15 text-brand">
                  <FileText className="h-4 w-4" />
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  Live notes
                </h3>
                <span className="ml-auto font-mono text-[10px] text-muted-foreground/60">
                  admin-edited
                </span>
              </div>
              <div
                className="md-rendered text-sm leading-relaxed text-foreground/85"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(payload?.bodyMarkdown ?? ""),
                }}
              />
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="flex flex-col gap-4"
              aria-label="Now page meta"
            >
              <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Freshness
                </div>
                <div className="mt-1.5 text-lg font-semibold tracking-tight text-foreground">
                  Updated {relativeUpdated(updatedAt)}
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-brand/25 bg-brand/10 px-2.5 py-1 font-mono text-[10px] text-brand">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="status-pulse absolute inline-flex h-1.5 w-1.5 rounded-full bg-brand opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
                  </span>
                  live · synced from database
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  What is a /now page
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  A public status update of what I&apos;m focused on — inspired
                  by{" "}
                  <a
                    href="https://nownownow.com"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-brand hover:underline"
                  >
                    nownownow.com
                  </a>
                  . Updated whenever the focus shifts.
                </p>
              </div>

              <a
                href="/api/feed"
                className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-card/40 p-4 card-hover"
                aria-label="Atom feed of recently shipped commits"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand/15 text-brand">
                  <Rss className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-foreground group-hover:text-brand transition-colors">
                    Follow along
                  </span>
                  <span className="block font-mono text-[10px] text-muted-foreground/70">
                    Atom feed · every push lands here
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:text-brand" />
              </a>
            </motion.aside>
          </div>
        ) : (
          // Default structured layout from `now-notes.ts`.
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {nowSection.groups.map((group, gi) => {
              const Icon = ICONS[group.icon] ?? Hammer;
              return (
                <motion.div
                  key={group.heading}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: gi * 0.1 }}
                  className="rounded-2xl border border-border/60 bg-card/40 p-6 card-hover"
                >
                  <div className="mb-4 flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand/15 text-brand">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <h3 className="text-base font-semibold text-foreground">
                      {group.heading}
                    </h3>
                    <span className="ml-auto font-mono text-[10px] text-muted-foreground/60">
                      {group.entries.length} items
                    </span>
                  </div>
                  <ul className="space-y-4">
                    {group.entries.map((entry) => (
                      <li
                        key={entry.label}
                        className="group/entry space-y-1 border-l border-border/40 pl-3 transition-colors group-hover/entry:border-brand/60"
                      >
                        <div className="text-sm font-semibold text-foreground transition-colors group-hover/entry:text-brand">
                          {entry.label}
                        </div>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {entry.detail}
                        </p>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 flex items-center justify-center gap-2 font-mono text-[11px] text-muted-foreground/70"
        >
          <RefreshCw className="h-3 w-3" />
          Last updated {relativeUpdated(updatedAt)} · inspired by{" "}
          <a
            href="https://nownownow.com"
            target="_blank"
            rel="noreferrer noopener"
            className="text-brand hover:underline"
          >
            /now
          </a>
        </motion.div>
      </div>
    </section>
  );
}
