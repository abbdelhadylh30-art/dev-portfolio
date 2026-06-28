"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ThemeTokens } from "@/lib/sections/types";

export interface FaqConfig {
  title?: string;
  subtitle?: string;
  items: { question: string; answer: string }[];
}

export function FaqSection({ config, theme }: { config: FaqConfig; theme: ThemeTokens }) {
  const c = config;
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section id="faq" className="px-6 py-16 sm:py-24" style={{ background: theme.background }}>
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          {c.title && (
            <h2
              className="text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: theme.foreground, fontFamily: theme.fontHeading }}
            >
              {c.title}
            </h2>
          )}
          {c.subtitle && (
            <p className="mt-4 text-lg" style={{ color: theme.mutedFg }}>
              {c.subtitle}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-3">
          {c.items?.map((item, i) => {
            const open = openIdx === i;
            return (
              <div
                key={i}
                className="overflow-hidden rounded-xl border"
                style={{ borderColor: theme.border, background: theme.background, borderRadius: theme.radius }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  style={{ color: theme.foreground }}
                >
                  <span className="font-semibold">{item.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                    style={{ color: theme.mutedFg }}
                  />
                </button>
                <div
                  className="grid transition-all"
                  style={{
                    gridTemplateRows: open ? "1fr" : "0fr",
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: theme.mutedFg }}>
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
