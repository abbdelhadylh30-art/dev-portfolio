import "server-only";

import { promises as fs } from "fs";
import path from "path";
import { projects, profile } from "@/lib/portfolio-data";

/**
 * Live GitHub stats, fetched server-side and cached in memory for a short TTL.
 *
 * Uses the GitHub REST API. When a `GITHUB_TOKEN` env var is present it is
 * sent as a bearer token (5,000 req/hr — the site's live-data ceiling is
 * effectively removed). Without a token it falls back to unauthenticated
 * requests (60/hr shared limit), still safe under the 10-minute cache.
 *
 * The per-repo commit ETags are additionally persisted to a small JSON file
 * (`.cache/github-commits.json`) so a dev-server restart or cold start sends
 * conditional `If-None-Match` requests — 304 responses are FREE and don't
 * count against either limit. Without this, every restart would burn 9
 * full requests re-learning ETags.
 */

export type RepoLiveStats = {
  name: string;
  slug: string;
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  updatedAt: string;
  primaryLanguage: string | null;
};

export type GitHubStats = {
  username: string;
  followers: number;
  following: number;
  publicRepos: number;
  accountCreatedAt: string;
  totalStars: number;
  totalForks: number;
  repos: RepoLiveStats[];
  fetchedAt: string;
  source: "cache" | "live" | "fallback";
};

/**
 * A single recent commit (latest per repo, merged + sorted).
 */
export type RepoCommit = {
  repo: string;
  slug: string;
  sha: string;
  message: string;
  author: string | null;
  authorAvatar: string | null;
  committedAt: string;
  url: string;
};

export type RecentCommits = {
  commits: RepoCommit[];
  fetchedAt: string;
  source: "cache" | "live" | "fallback";
};

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
let cache: { stats: GitHubStats; at: number } | null = null;
let commitCache: { commits: RecentCommits; at: number } | null = null;

type GHRepo = {
  name: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  updated_at: string;
  language: string | null;
};

type GHUser = {
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
};

/** Auth headers shared by every GitHub call — bearer token when configured. */
function ghAuthHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "abdelhady-portfolio",
      ...ghAuthHeaders(),
      ...(init?.headers ?? {}),
    },
    next: { revalidate: 600 },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status} for ${url}`);
  return (await res.json()) as T;
}

/** Slug used in our portfolio data for a given GitHub repo name. */
function slugFor(name: string): string {
  return name.toLowerCase();
}

export async function getCachedGitHubStats(): Promise<GitHubStats> {
  const now = Date.now();
  if (cache && now - cache.at < CACHE_TTL_MS) {
    return { ...cache.stats, source: "cache" };
  }

  try {
    const [user, repos] = await Promise.all([
      fetchJSON<GHUser>(`https://api.github.com/users/${profile.githubUsername}`),
      fetchJSON<GHRepo[]>(
        `https://api.github.com/users/${profile.githubUsername}/repos?per_page=100&sort=updated`
      ),
    ]);

    const knownSlugs = new Set(projects.map((p) => p.slug));
    const liveRepos: RepoLiveStats[] = repos
      .filter((r) => knownSlugs.has(slugFor(r.name)))
      .map((r) => ({
        name: r.name,
        slug: slugFor(r.name),
        stars: r.stargazers_count,
        forks: r.forks_count,
        watchers: r.watchers_count,
        openIssues: r.open_issues_count,
        updatedAt: r.updated_at,
        primaryLanguage: r.language,
      }));

    const totalStars = liveRepos.reduce((s, r) => s + r.stars, 0);
    const totalForks = liveRepos.reduce((s, r) => s + r.forks, 0);

    const stats: GitHubStats = {
      username: profile.githubUsername,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      accountCreatedAt: user.created_at,
      totalStars,
      totalForks,
      repos: liveRepos,
      fetchedAt: new Date().toISOString(),
      source: "live",
    };

    cache = { stats, at: now };
    return stats;
  } catch (err) {
    // Network or rate-limit failure — fall back to a zeroed snapshot so the
    // UI degrades gracefully instead of throwing.
    const fallback: GitHubStats = {
      username: profile.githubUsername,
      followers: 0,
      following: 0,
      publicRepos: projects.length,
      accountCreatedAt: "",
      totalStars: 0,
      totalForks: 0,
      repos: projects.map((p) => ({
        name: p.name,
        slug: p.slug,
        stars: 0,
        forks: 0,
        watchers: 0,
        openIssues: 0,
        updatedAt: p.updatedAt,
        primaryLanguage: p.languages[0]?.name ?? null,
      })),
      fetchedAt: new Date().toISOString(),
      source: "fallback",
    };
    // Cache the fallback briefly so we don't hammer GitHub on every request.
    cache = { stats: fallback, at: now - CACHE_TTL_MS + 60 * 1000 };
    return fallback;
  }
}

type GHCommit = {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: {
      name: string | null;
      date: string | null;
    } | null;
  };
  author: {
    login: string | null;
    avatar_url: string | null;
  } | null;
};

/**
 * Latest commit per known repo, merged + sorted newest first, capped.
 *
 * Uses GitHub conditional requests (ETag / If-None-Match): 304 responses
 * do NOT count against the unauthenticated 60 req/hr rate limit, so after
 * the first full load this stays essentially free. A per-repo ETag map is
 * kept in the module; when a repo returns 304 we reuse the cached commit.
 *
 * Degrades gracefully: if every request fails and there is no cached
 * data, returns an empty list with `source: "fallback"` so the UI can
 * hide the strip instead of erroring. Stale data is served (source
 * "cache") while fresh requests fail.
 */
type CachedRepoCommit = { etag: string | null; commit: RepoCommit };

const perRepoCommitCache = new Map<string, CachedRepoCommit>();

/* --- Disk persistence for ETags + commits (survives dev-server restarts) --- */

const DISK_CACHE_DIR = path.join(process.cwd(), ".cache");
const DISK_CACHE_PATH = path.join(DISK_CACHE_DIR, "github-commits.json");

type DiskCacheShape = {
  savedAt: number;
  repos: Record<string, { etag: string | null; commit: RepoCommit }>;
};

let diskCacheLoaded = false;

/** Load the persisted per-repo ETag/commit map into the in-memory map on a
 *  cold start. Best-effort: unreadable/corrupt/missing files are ignored —
 *  retried on a later call while the in-memory map is still empty (the
 *  file may appear after the very first request in a fresh deployment). */
async function ensureDiskCacheLoaded(): Promise<void> {
  if (diskCacheLoaded || perRepoCommitCache.size > 0) {
    diskCacheLoaded = true;
    return;
  }
  try {
    const raw = await fs.readFile(DISK_CACHE_PATH, "utf8");
    const parsed = JSON.parse(raw) as DiskCacheShape;
    if (parsed?.repos && typeof parsed.repos === "object") {
      for (const [slug, entry] of Object.entries(parsed.repos)) {
        if (entry?.commit?.sha) {
          perRepoCommitCache.set(slug, {
            etag: entry.etag ?? null,
            commit: entry.commit,
          });
        }
      }
      diskCacheLoaded = true;
    }
  } catch {
    // No cache file yet (first ever run) or unreadable — retry next cycle.
  }
}

/** Persist the current per-repo map so the next cold start can send free
 *  If-None-Match 304s instead of burning quota on full requests. */
function persistDiskCache(): void {
  void (async () => {
    try {
      const payload: DiskCacheShape = {
        savedAt: Date.now(),
        repos: Object.fromEntries(perRepoCommitCache.entries()),
      };
      await fs.mkdir(DISK_CACHE_DIR, { recursive: true });
      await fs.writeFile(DISK_CACHE_PATH, JSON.stringify(payload), "utf8");
    } catch {
      // Best-effort only — a read-only FS must never break the request.
    }
  })();
}

export async function getRecentCommits(take = 6): Promise<RecentCommits> {
  const now = Date.now();
  if (commitCache && now - commitCache.at < CACHE_TTL_MS) {
    // Serve from cache but still honour `take` — a cached take=9 feed must
    // not leak extra entries to a caller that asked for fewer.
    return {
      ...commitCache.commits,
      commits: commitCache.commits.commits.slice(0, take),
      source: "cache",
    };
  }

  // Cold start: hydrate ETags + commits from disk so this round of requests
  // goes out as free 304s (and failures still have stale data to serve).
  await ensureDiskCacheLoaded();

  const owner = profile.githubUsername;

  const results = await Promise.allSettled(
    projects.map(async (p) => {
      const cached = perRepoCommitCache.get(p.slug);
      const headers: Record<string, string> = {
        Accept: "application/vnd.github+json",
        "User-Agent": "abdelhady-portfolio",
        ...ghAuthHeaders(),
      };
      if (cached?.etag) headers["If-None-Match"] = cached.etag;

      const res = await fetch(
        `https://api.github.com/repos/${owner}/${p.slug}/commits?per_page=1`,
        { headers }
      ).catch(() => null);

      if (!res) throw new Error("network");
      // 304 = unchanged → reuse the cached commit for free.
      if (res.status === 304 && cached) return cached.commit;
      if (!res.ok) throw new Error(`status ${res.status}`);

      const etag = res.headers.get("etag");
      const latestList = (await res.json()) as GHCommit[];
      const latest = latestList?.[0];
      if (!latest) throw new Error("empty");

      const commit: RepoCommit = {
        repo: p.name,
        slug: p.slug,
        sha: latest.sha,
        message: (latest.commit?.message ?? "").split("\n")[0],
        author: latest.author?.login ?? latest.commit?.author?.name ?? null,
        authorAvatar: latest.author?.avatar_url ?? null,
        committedAt: latest.commit?.author?.date ?? "",
        url: latest.html_url,
      };
      perRepoCommitCache.set(p.slug, { etag, commit });
      return commit;
    })
  );

  const fresh: RepoCommit[] = [];
  const reusable: RepoCommit[] = [];
  let failedCount = 0;

  results.forEach((res) => {
    if (res.status === "fulfilled") {
      fresh.push(res.value);
    } else {
      failedCount++;
    }
  });

  // Requests that failed but have cached values → reuse stale data.
  if (failedCount > 0) {
    for (const p of projects) {
      if (perRepoCommitCache.has(p.slug)) {
        const c = perRepoCommitCache.get(p.slug)!.commit;
        if (!fresh.some((f) => f.slug === p.slug)) reusable.push(c);
      }
    }
  }

  const merged = [...fresh, ...reusable].sort((a, b) => {
    const ta = new Date(a.committedAt).getTime() || 0;
    const tb = new Date(b.committedAt).getTime() || 0;
    return tb - ta;
  });

  // Everything failed and nothing cached → graceful fallback.
  if (merged.length === 0) {
    const fallback: RecentCommits = {
      commits: [],
      fetchedAt: new Date().toISOString(),
      source: "fallback",
    };
    commitCache = { commits: fallback, at: now - CACHE_TTL_MS + 60 * 1000 };
    return fallback;
  }

  // If every request failed but we have stale data, serve it and retry
  // sooner than the full TTL.
  const allFailed = failedCount === projects.length;
  // Cache the FULL merged list (up to one commit per repo) so a later
  // request with a larger `take` is never under-served from cache; each
  // caller slices exactly what it asked for.
  const full: RecentCommits = {
    commits: merged,
    fetchedAt: new Date().toISOString(),
    source: allFailed ? "cache" : "live",
  };
  commitCache = {
    commits: full,
    at: allFailed ? now - CACHE_TTL_MS + 60 * 1000 : now,
  };
  // Persist ETags + commits so the next cold start hydrates for free.
  if (perRepoCommitCache.size > 0) persistDiskCache();
  return { ...full, commits: merged.slice(0, take) };
}
