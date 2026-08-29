"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, Star, Users, GitFork, RefreshCw } from "lucide-react";
import type { GitHubStats } from "@/lib/github-stats";

function relativeTime(iso: string) {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function LiveStats() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    try {
      const res = await fetch("/api/github", { cache: "no-store" });
      if (!res.ok) throw new Error("fetch failed");
      const data = (await res.json()) as GitHubStats;
      setStats(data);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const items = stats
    ? [
        {
          icon: Users,
          label: "Followers",
          value: stats.followers,
        },
        {
          icon: Star,
          label: "Total stars",
          value: stats.totalStars,
        },
        {
          icon: GitFork,
          label: "Total forks",
          value: stats.totalForks,
        },
        {
          icon: Github,
          label: "Public repos",
          value: stats.publicRepos,
        },
      ]
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-2"
    >
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1.5 font-mono text-[11px] text-muted-foreground backdrop-blur">
        <span className="relative flex h-2 w-2">
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
              error ? "bg-destructive" : "bg-brand"
            } ${loading ? "animate-ping" : ""}`}
          />
          <span
            className={`relative inline-flex h-2 w-2 rounded-full ${
              error ? "bg-destructive" : "bg-brand"
            }`}
          />
        </span>
        {loading ? "Syncing from GitHub…" : error ? "Live sync offline" : "Live from GitHub"}
      </span>

      {!loading && !error && stats
        ? items.map((it) => (
            <span
              key={it.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/40 px-3 py-1.5 font-mono text-[11px] text-muted-foreground"
            >
              <it.icon className="h-3.5 w-3.5 text-brand" />
              <span className="font-semibold text-foreground">{it.value}</span>
              {it.label}
            </span>
          ))
        : null}

      {!loading && !error && stats && (
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-1 rounded-full border border-border/40 bg-background/40 px-2.5 py-1.5 font-mono text-[10px] text-muted-foreground/70 transition-colors hover:text-brand"
          aria-label="Refresh live stats"
          title={`Synced ${relativeTime(stats.fetchedAt)}`}
        >
          <RefreshCw className="h-3 w-3" />
          {relativeTime(stats.fetchedAt)}
        </button>
      )}
    </motion.div>
  );
}
