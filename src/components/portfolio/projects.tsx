"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Github,
  ExternalLink,
  Star,
  Maximize2,
  Clock,
  ArrowDownUp,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  profile,
  projects,
  projectFilters,
  type Project,
  type ProjectFilter,
} from "@/lib/portfolio-data";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { useUIStore } from "@/lib/ui-store";
import {
  useGitHubStats,
  getRepoStats,
  type GitHubStats,
} from "@/lib/github-stats-client";
import { RepoStatBadges } from "@/components/portfolio/repo-stat-badges";
import { trackEvent } from "@/lib/analytics";

// Map language name to a stable color token (no blue/indigo).
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", // official TS blue is fine as a *language* indicator, not brand
  JavaScript: "#f1e05a",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Python: "#3572A5",
  Rust: "#dea584",
  Shell: "#89e051",
  Haskell: "#5e5086",
};

function relativeTime(iso: string) {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = now - then;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

function LanguageBar({ languages }: { languages: Project["languages"] }) {
  return (
    <div className="space-y-2">
      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
        {languages.map((l) => (
          <div
            key={l.name}
            className="h-full first:rounded-l-full last:rounded-r-full"
            style={{
              width: `${l.percent}%`,
              backgroundColor: LANG_COLORS[l.name] ?? "var(--muted-foreground)",
            }}
            title={`${l.name} ${l.percent.toFixed(1)}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {languages.slice(0, 4).map((l) => (
          <span
            key={l.name}
            className="inline-flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground"
          >
            <span
              className="h-2 w-2 rounded-sm"
              style={{
                backgroundColor:
                  LANG_COLORS[l.name] ?? "var(--muted-foreground)",
              }}
            />
            {l.name}
            <span className="text-muted-foreground/60">
              {l.percent.toFixed(0)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  liveStats,
}: {
  project: Project;
  liveStats: GitHubStats | null;
}) {
  const openModal = useUIStore((s) => s.openModal);
  const live = getRepoStats(liveStats, project.slug);

  const handleOpen = () => {
    trackEvent("project_card_click", { slug: project.slug, label: project.name });
    trackEvent("project_modal_open", { slug: project.slug, label: project.name });
    openModal(project.slug);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -10 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex flex-col rounded-2xl border bg-card/50 p-6 card-hover ${
        project.featured
          ? "border-brand/40 shadow-lg shadow-brand/5"
          : "border-border/60"
      }`}
    >
      {project.featured && (
        <span className="absolute -top-2.5 left-6 inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-foreground shadow">
          <Star className="h-3 w-3" /> Featured
        </span>
      )}

      <button
        type="button"
        onClick={handleOpen}
        className="group/title flex items-start justify-between gap-3 text-left"
        aria-label={`Open details for ${project.name}`}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover/title:text-brand">
              {project.name}
            </h3>
            <Badge
              variant="secondary"
              className="rounded-full bg-brand/10 text-brand border border-brand/20 font-mono text-[10px] uppercase tracking-wide"
            >
              {project.category}
            </Badge>
          </div>
          <p className="mt-0.5 font-mono text-[11px] text-muted-foreground/70">
            /{project.slug}
          </p>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          {relativeTime(project.updatedAt)}
        </div>
      </button>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground line-clamp-3">
        {project.description}
      </p>

      <ul className="mt-4 space-y-1.5">
        {project.highlights.map((h) => (
          <li
            key={h}
            className="flex items-start gap-2 text-xs text-foreground/75"
          >
            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand" />
            {h}
          </li>
        ))}
      </ul>

      <div className="mt-5">
        <LanguageBar languages={project.languages} />
      </div>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.primaryTech.map((t) => (
          <span
            key={t}
            className="inline-flex items-center rounded-md border border-border/50 bg-background/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2 min-h-[16px]">
        <RepoStatBadges repo={live} loading={!liveStats} compact />
      </div>

      <div className="mt-6 flex items-center justify-between gap-2 pt-1">
        <button
          type="button"
          onClick={handleOpen}
          className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground transition-colors hover:text-brand"
        >
          <Maximize2 className="h-3 w-3" />
          Details
        </button>
        <div className="flex items-center gap-1.5">
          {project.homepage && (
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="h-8 px-2.5 text-xs text-muted-foreground hover:text-brand"
            >
              <a
                href={project.homepage}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`Open live demo of ${project.name}`}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Live
              </a>
            </Button>
          )}
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="h-8 px-2.5 text-xs text-muted-foreground hover:text-brand"
          >
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`Open ${project.name} on GitHub`}
            >
              <Github className="h-3.5 w-3.5" />
              Repo
            </a>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

type SortKey = "featured" | "newest" | "alpha" | "largest";

const SORT_LABELS: Record<SortKey, string> = {
  featured: "Featured first",
  newest: "Newest updated",
  alpha: "Alphabetical",
  largest: "Largest codebase",
};

function totalBytes(p: Project) {
  return p.languages.reduce((acc, l) => acc + l.bytes, 0);
}

export function Projects() {
  const [filter, setFilter] = React.useState<ProjectFilter>("All");
  const [sort, setSort] = React.useState<SortKey>("featured");
  const { stats: liveStats } = useGitHubStats();

  const sorted = React.useMemo(() => {
    const list = projects.slice();
    list.sort((a, b) => {
      switch (sort) {
        case "alpha":
          return a.name.localeCompare(b.name);
        case "newest":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case "largest":
          return totalBytes(b) - totalBytes(a);
        case "featured":
        default:
          if (a.featured !== b.featured) return a.featured ? -1 : 1;
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });
    return list;
  }, [sort]);

  const visible = React.useMemo(() => {
    if (filter === "All") return sorted;
    return sorted.filter((p) => p.category === filter);
  }, [filter, sorted]);

  const counts = React.useMemo(() => {
    const map: Record<string, number> = { All: sorted.length };
    for (const f of projectFilters) {
      if (f === "All") continue;
      map[f] = sorted.filter((p) => p.category === f).length;
    }
    return map;
  }, [sorted]);

  const setFilterTracked = (f: ProjectFilter) => {
    if (f !== filter) {
      trackEvent("filter_select", { label: f });
    }
    setFilter(f);
  };

  const setSortTracked = (s: SortKey) => {
    if (s !== sort) {
      trackEvent("filter_select", { label: `sort:${s}` });
    }
    setSort(s);
  };

  return (
    <section id="work" className="relative py-20 sm:py-28 border-t border-border/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Selected Work"
          counter={{ current: "02", total: "08" }}
          title={
            <>
              9 repositories, <span className="text-brand">synced</span> from
              GitHub.
            </>
          }
          description="Every project below is pulled from my live GitHub profile. Filter by category or sort to taste, then jump to the live demo or the source."
        />

        {/* Filter tabs + sort dropdown */}
        <div className="mt-8 flex flex-wrap items-center gap-2 sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {projectFilters.map((f) => {
              const active = f === filter;
              return (
                <button
                  key={f}
                  onClick={() => setFilterTracked(f)}
                  className={`relative inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? "text-brand-foreground"
                      : "text-muted-foreground hover:text-foreground border border-border/50 bg-card/40"
                  }`}
                  style={active ? { backgroundColor: "var(--brand)" } : undefined}
                >
                  {f}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-mono ${
                      active
                        ? "bg-brand-foreground/20 text-brand-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {counts[f] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="sort-chip focus-ring"
                aria-label="Sort projects"
              >
                <ArrowDownUp className="h-3 w-3" />
                {SORT_LABELS[sort]}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 rounded-xl border-border/60 bg-card/95 backdrop-blur-xl"
            >
              <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
                Sort by
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(["featured", "newest", "alpha", "largest"] as const).map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => setSortTracked(s)}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span>{SORT_LABELS[s]}</span>
                  {sort === s && <Check className="h-3.5 w-3.5 text-brand" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <ProjectCard key={p.slug} project={p} liveStats={liveStats} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border/60 bg-gradient-to-br from-brand/10 to-transparent p-6 sm:flex-row sm:p-7"
        >
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Want the raw source?
            </h3>
            <p className="text-sm text-muted-foreground">
              Browse all 9 repositories, commits and issues on GitHub.
            </p>
          </div>
          <Button
            asChild
            className="bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-5 rounded-full"
          >
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Github className="mr-2 h-4 w-4" />
              Visit GitHub
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
