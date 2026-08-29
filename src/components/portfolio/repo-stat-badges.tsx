"use client";

import { Star, GitFork, CircleDot, Loader2 } from "lucide-react";

import type { RepoLiveStats } from "@/lib/github-stats";

/**
 * Compact live-stats badges for a single repository.
 *
 * Renders a tiny "live" pulse + star/fork/issues counts when data is present,
 * a subtle loading shimmer while fetching, and nothing at all if the fetch
 * failed (graceful degradation).
 */
export function RepoStatBadges({
  repo,
  loading,
  compact = false,
}: {
  repo: RepoLiveStats | null;
  loading: boolean;
  compact?: boolean;
}) {
  if (loading && !repo) {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground/50">
        <Loader2 className="h-3 w-3 animate-spin" />
        live…
      </span>
    );
  }

  if (!repo) return null;

  const items = [
    { icon: Star, value: repo.stars, label: "stars" },
    { icon: GitFork, value: repo.forks, label: "forks" },
    { icon: CircleDot, value: repo.openIssues, label: "issues" },
  ];

  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground/50">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
        </span>
        live
      </span>
      {items.map((it) => (
        <span
          key={it.label}
          className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground"
          title={`${it.value} ${it.label}`}
        >
          <it.icon className="h-3 w-3 text-brand" />
          <span className="font-semibold text-foreground/80">{it.value}</span>
          {!compact && (
            <span className="text-muted-foreground/60">{it.label}</span>
          )}
        </span>
      ))}
    </span>
  );
}
