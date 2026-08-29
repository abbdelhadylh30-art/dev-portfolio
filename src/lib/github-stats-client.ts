"use client";

import { useEffect, useState } from "react";
import type { GitHubStats, RepoLiveStats } from "@/lib/github-stats";

// Re-export the types so client components never import the server-only module.
export type { GitHubStats, RepoLiveStats };

/**
 * Client-side cache + dedupe for the /api/github response.
 *
 * A single in-flight promise is shared across every component that needs live
 * stats (hero strip, project cards, project modal), so we never fetch more
 * than once per ~60s regardless of how many components mount.
 */

const CLIENT_TTL_MS = 60_000;
let cache: { data: GitHubStats; at: number } | null = null;
let inflight: Promise<GitHubStats> | null = null;

export function fetchGitHubStats(): Promise<GitHubStats> {
  if (cache && Date.now() - cache.at < CLIENT_TTL_MS) {
    return Promise.resolve(cache.data);
  }
  if (inflight) return inflight;
  inflight = fetch("/api/github", { cache: "no-store" })
    .then((r) => {
      if (!r.ok) throw new Error(`github stats ${r.status}`);
      return r.json() as Promise<GitHubStats>;
    })
    .then((d) => {
      cache = { data: d, at: Date.now() };
      inflight = null;
      return d;
    })
    .catch((err) => {
      inflight = null;
      throw err;
    });
  return inflight;
}

export function useGitHubStats() {
  const [stats, setStats] = useState<GitHubStats | null>(cache?.data ?? null);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    fetchGitHubStats()
      .then((d) => {
        if (active) {
          setStats(d);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return { stats, loading, error };
}

export function getRepoStats(
  stats: GitHubStats | null,
  slug: string
): RepoLiveStats | null {
  if (!stats) return null;
  return stats.repos.find((r) => r.slug === slug) ?? null;
}
