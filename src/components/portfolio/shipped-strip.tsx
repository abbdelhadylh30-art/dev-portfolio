"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GitCommitHorizontal, ArrowUpRight, RefreshCw } from "lucide-react";
import { SectionHeading } from "@/components/portfolio/section-heading";
import type { RepoCommit } from "@/lib/github-stats";
import { trackEvent } from "@/lib/analytics";
import { projects } from "@/lib/portfolio-data";

/** GitHub-style language colours — same palette the project modal uses for
 *  its language-breakdown bar, so a repo's dot here matches its bar there. */
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Python: "#3572A5",
  Rust: "#dea584",
  Shell: "#89e051",
  Haskell: "#5e5086",
};

/** The repo's dominant language + its GitHub colour, used for the dot on
 *  each commit card and the dots inside the filter chips. */
function primaryLanguage(slug: string): { name: string; color: string } | null {
  const p = projects.find((pr) => pr.slug === slug);
  if (!p || p.languages.length === 0) return null;
  const top = [...p.languages].sort((a, b) => b.percent - a.percent)[0];
  return {
    name: top.name,
    color: LANG_COLORS[top.name] ?? "var(--muted-foreground)",
  };
}

function relativeTime(iso: string) {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const diff = Date.now() - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function CommitCard({ commit, index }: { commit: RepoCommit; index: number }) {
  const project = projects.find((p) => p.slug === commit.slug);
  const lang = primaryLanguage(commit.slug);
  return (
    <motion.a
      href={commit.url}
      target="_blank"
      rel="noreferrer noopener"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      onClick={() =>
        trackEvent("shipped_click", {
          slug: commit.slug,
          label: `${commit.slug}:${commit.sha.slice(0, 7)}`,
        })
      }
      className="shipped-card group relative flex flex-col gap-2.5 rounded-2xl border border-border/60 bg-card/50 p-4 backdrop-blur-sm"
      aria-label={`Open commit ${commit.sha.slice(0, 7)} on ${commit.repo} — ${commit.message}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex min-w-0 items-center gap-2">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand/15 text-brand transition-colors group-hover:bg-brand/25">
            <GitCommitHorizontal className="h-4 w-4" />
          </span>
          <span className="truncate font-mono text-xs font-semibold uppercase tracking-wider text-foreground/90">
            {commit.repo}
          </span>
          {lang && (
            <span
              className="inline-flex shrink-0 items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70"
              title={`${lang.name} — dominant language in ${commit.repo}`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: lang.color }}
              />
              <span className="hidden sm:inline">{lang.name}</span>
            </span>
          )}
        </span>
        <span className="shrink-0 rounded-md border border-brand/25 bg-brand/10 px-1.5 py-0.5 font-mono text-[10px] text-brand">
          {commit.sha.slice(0, 7)}
        </span>
      </div>

      <p className="line-clamp-2 text-sm leading-relaxed text-foreground/85">
        {commit.message || "(no message)"}
      </p>

      <div className="mt-auto flex items-center justify-between gap-2 pt-1">
        <span className="inline-flex min-w-0 items-center gap-1.5 font-mono text-[10px] text-muted-foreground/80">
          {commit.authorAvatar ? (
            <img
              src={commit.authorAvatar}
              alt=""
              width={16}
              height={16}
              loading="lazy"
              className="h-4 w-4 rounded-full border border-border/60"
            />
          ) : (
            <span className="h-4 w-4 rounded-full border border-border/60 bg-muted" />
          )}
          <span className="truncate">{commit.author ?? "unknown"}</span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 font-mono text-[10px] text-muted-foreground/60">
          {relativeTime(commit.committedAt)}
          <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-brand" />
        </span>
      </div>

      {project?.primaryTech?.[0] && (
        <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/0 transition-colors group-hover:text-muted-foreground/40">
          {project.primaryTech[0]}
        </span>
      )}
    </motion.a>
  );
}

function SkeletonCard() {
  return (
    <div className="flex animate-pulse flex-col gap-2.5 rounded-2xl border border-border/40 bg-card/30 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-muted/60" />
          <div className="h-3 w-24 rounded bg-muted/60" />
        </div>
        <div className="h-4 w-14 rounded bg-muted/60" />
      </div>
      <div className="h-3 w-full rounded bg-muted/40" />
      <div className="h-3 w-2/3 rounded bg-muted/40" />
      <div className="mt-auto flex items-center justify-between pt-1">
        <div className="h-3 w-20 rounded bg-muted/40" />
        <div className="h-3 w-12 rounded bg-muted/40" />
      </div>
    </div>
  );
}

export function ShippedStrip() {
  const [commits, setCommits] = useState<RepoCommit[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [repoFilter, setRepoFilter] = useState<string>("all");

  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      // take=9 — the server already fetches every repo's latest commit (with
      // free 304s via ETag), so pulling all of them costs nothing extra and
      // lets the per-repo filter chips below cover the full picture.
      const res = await fetch("/api/github/commits?take=9", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("fetch failed");
      const data = (await res.json()) as {
        commits: RepoCommit[];
        fetchedAt: string;
      };
      setCommits(data.commits ?? []);
      setFetchedAt(data.fetchedAt ?? null);
    } catch {
      setCommits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Unique repo names in the feed, newest commit first — drives the filter
  // chips. Memoised so re-renders (e.g. filter switches) don't recompute.
  const repos = useMemo(
    () => Array.from(new Set(commits.map((c) => c.repo))),
    [commits]
  );

  // Drop the filter if a refresh no longer contains that repo.
  useEffect(() => {
    if (repoFilter !== "all" && !repos.includes(repoFilter)) {
      setRepoFilter("all");
    }
  }, [repos, repoFilter]);

  const visible =
    repoFilter === "all"
      ? commits
      : commits.filter((c) => c.repo === repoFilter);

  const selectFilter = (repo: string) => {
    setRepoFilter(repo);
    trackEvent("filter_select", {
      label: `shipped:${repo === "all" ? "all" : repo}`,
    });
  };

  // Hide the entire section when there is nothing to show (e.g. GitHub
  // unreachable) — better than rendering an empty frame.
  if (!loading && commits.length === 0) return null;

  return (
    <section
      id="shipped"
      aria-label="Recently shipped — live from GitHub"
      className="relative scroll-mt-20 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Live from GitHub"
          title={
            <>
              Recently <span className="gradient-text">shipped</span>
            </>
          }
          description="The latest commit from every repository, synced straight from the GitHub API — the site literally shows what I worked on last."
          counter={{ current: "06", total: "08" }}
        />

        <div className="mt-8 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1.5 font-mono text-[11px] text-muted-foreground backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full rounded-full bg-brand opacity-75 ${
                  loading ? "animate-ping" : ""
                }`}
              />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            {loading
              ? "Syncing commits…"
              : `${commits.length} repos · updated ${relativeTime(fetchedAt ?? "")}`}
          </span>
          <button
            type="button"
            onClick={() => load(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-background/40 px-2.5 py-1.5 font-mono text-[10px] text-muted-foreground/70 transition-colors hover:border-brand/40 hover:text-brand"
            aria-label="Refresh recently shipped commits"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        {/* Per-repo filter chips — "All" plus one chip per repo with its
         *  dominant-language dot, same colour as the dot on the cards. */}
        {!loading && repos.length > 1 && (
          <div
            className="mt-4 flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Filter commits by repository"
          >
            <button
              type="button"
              className="repo-chip"
              aria-pressed={repoFilter === "all"}
              onClick={() => selectFilter("all")}
            >
              All
              <span className="text-muted-foreground/60">{commits.length}</span>
            </button>
            {repos.map((repo) => {
              const slug = commits.find((c) => c.repo === repo)?.slug ?? "";
              const lang = slug ? primaryLanguage(slug) : null;
              return (
                <button
                  key={repo}
                  type="button"
                  className="repo-chip"
                  aria-pressed={repoFilter === repo}
                  onClick={() => selectFilter(repo)}
                >
                  {lang && (
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: lang.color }}
                    />
                  )}
                  {repo}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : visible.map((c, i) => (
                <CommitCard key={c.sha} commit={c} index={i} />
              ))}
        </div>

        <p className="mt-5 text-center font-mono text-[10px] text-muted-foreground/60">
          Every card links straight to the commit on{" "}
          <span className="text-brand">github.com</span> — click through to see
          the diff.
        </p>
      </div>
    </section>
  );
}
