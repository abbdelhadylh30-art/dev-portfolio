"use client";

import type { ThemeTokens } from "@/lib/sections/types";

export interface GalleryConfig {
  title?: string;
  columns: "2" | "3" | "4";
  images: { url: string; caption?: string }[];
}

export function GallerySection({ config, theme }: { config: GalleryConfig; theme: ThemeTokens }) {
  const c = config;
  const cols = Number(c.columns ?? 3);
  const gridCols = `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cols}`;
  return (
    <section id="work" className="px-6 py-16 sm:py-24" style={{ background: theme.background }}>
      <div className="mx-auto max-w-6xl">
        {c.title && (
          <h2
            className="mb-10 text-center text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: theme.foreground, fontFamily: theme.fontHeading }}
          >
            {c.title}
          </h2>
        )}
        <div className={`grid gap-4 ${gridCols}`}>
          {c.images?.map((img, i) => (
            <figure key={i} className="group overflow-hidden rounded-xl" style={{ borderRadius: theme.radius }}>
              <div className="relative aspect-[4/3] overflow-hidden" style={{ background: theme.muted }}>
                <img
                  src={img.url}
                  alt={img.caption ?? ""}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              {img.caption && (
                <figcaption
                  className="mt-2 text-sm"
                  style={{ color: theme.mutedFg }}
                >
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
