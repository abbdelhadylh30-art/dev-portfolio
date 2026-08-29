"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Github,
  ExternalLink,
  Star,
  Calendar,
  Clock,
  Code2,
  Layers,
  Check,
  Twitter,
  Linkedin,
  Link2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/lib/ui-store";
import {
  projects,
  projectDetails,
  profile,
  type Project,
} from "@/lib/portfolio-data";
import {
  useGitHubStats,
  getRepoStats,
} from "@/lib/github-stats-client";
import { RepoStatBadges } from "@/components/portfolio/repo-stat-badges";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";

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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function totalBytes(p: Project) {
  return p.languages.reduce((s, l) => s + l.bytes, 0);
}

function formatBytes(b: number) {
  if (b >= 1000) return `${(b / 1000).toFixed(1)}k`;
  return `${b}`;
}

/**
 * Social share row: X (Twitter), LinkedIn, and copy-link. Share intents
 * carry the deep-link URL (`/?p=slug`) whose link preview is rendered by
 * the OG image route. Every action is tracked in analytics.
 */
function ShareRow({
  slug,
  name,
  blurb,
}: {
  slug: string;
  name: string;
  blurb: string;
}) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareUrl = () =>
    `${window.location.origin}/?p=${slug}`;
  const shareText = () => `${name} — ${blurb}`;

  const openIntent = (network: "x" | "linkedin") => {
    const url = shareUrl();
    const text = shareText();
    const intent =
      network === "x"
        ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${encodeURIComponent(url)}`
        : `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`;
    trackEvent("project_share", { slug, label: `${slug}:${network}` });
    window.open(intent, "_blank", "noopener,noreferrer,width=680,height=560");
  };

  const copy = async () => {
    const url = shareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackEvent("project_share", { slug, label: `${slug}:copy` });
      toast({
        title: "Link copied",
        description: "Share it anywhere — the modal reopens on load.",
      });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast({
        title: "Couldn't copy",
        description: "Clipboard access denied — copy the URL manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Share this project">
      <Button
        type="button"
        onClick={() => openIntent("x")}
        variant="outline"
        className="share-btn h-11 rounded-full border-border/70 bg-background/40 px-4 hover:border-brand/40 hover:text-brand"
        aria-label={`Share ${name} on X (Twitter)`}
      >
        <Twitter className="mr-2 h-4 w-4" />
        Share on X
      </Button>
      <Button
        type="button"
        onClick={() => openIntent("linkedin")}
        variant="outline"
        className="share-btn h-11 rounded-full border-border/70 bg-background/40 px-4 hover:border-brand/40 hover:text-brand"
        aria-label={`Share ${name} on LinkedIn`}
      >
        <Linkedin className="mr-2 h-4 w-4" />
        LinkedIn
      </Button>
      <Button
        type="button"
        onClick={copy}
        variant="outline"
        className="share-btn h-11 rounded-full border-border/70 bg-background/40 px-4 hover:border-brand/40 hover:text-brand"
        aria-label="Copy shareable link to this project"
      >
        {copied ? (
          <>
            <Check className="mr-2 h-4 w-4 text-brand" />
            Copied
          </>
        ) : (
          <>
            <Link2 className="mr-2 h-4 w-4" />
            Copy link
          </>
        )}
      </Button>
    </div>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  const details = projectDetails[project.slug] ?? [];
  const total = totalBytes(project);
  const { stats, loading } = useGitHubStats();
  const live = getRepoStats(stats, project.slug);

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="rounded-full bg-brand/10 text-brand border border-brand/20 font-mono text-[10px] uppercase tracking-wider">
          {project.category}
        </Badge>
        {project.featured && (
          <Badge className="rounded-full bg-brand text-brand-foreground font-mono text-[10px] uppercase tracking-wider">
            <Star className="mr-1 h-3 w-3" /> Featured
          </Badge>
        )}
        <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
          <Calendar className="h-3 w-3" />
          Created {formatDate(project.createdAt)}
        </span>
      </div>

      {/* Long description */}
      <p className="text-sm leading-relaxed text-foreground/85">
        {project.description}
      </p>

      {/* Narrative bullets */}
      {details.length > 0 && (
        <ul className="space-y-2.5">
          {details.map((d, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="flex items-start gap-2.5 text-sm text-muted-foreground"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              <span className="leading-relaxed">{d}</span>
            </motion.li>
          ))}
        </ul>
      )}

      {/* Full language breakdown */}
      <div className="rounded-xl border border-border/60 bg-background/40 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Code2 className="h-3.5 w-3.5 text-brand" />
            Language breakdown
          </span>
          <span className="font-mono text-[11px] text-muted-foreground/70">
            {formatBytes(total)} bytes · {project.languages.length} langs
          </span>
        </div>
        <div className="mb-3 flex h-2 w-full overflow-hidden rounded-full bg-muted">
          {project.languages.map((l) => (
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
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
          {project.languages.map((l) => (
            <div
              key={l.name}
              className="flex items-center justify-between gap-2 font-mono text-[11px]"
            >
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <span
                  className="h-2 w-2 rounded-sm"
                  style={{
                    backgroundColor:
                      LANG_COLORS[l.name] ?? "var(--muted-foreground)",
                  }}
                />
                {l.name}
              </span>
              <span className="text-muted-foreground/70">
                {l.percent.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech + dates */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tech stack
          </div>
          <div className="flex flex-wrap gap-1.5">
            {project.primaryTech.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-md border border-border/50 bg-background/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Timeline
          </div>
          <div className="space-y-1 font-mono text-[11px] text-muted-foreground">
            <div className="inline-flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-brand" /> Updated{" "}
              {formatDate(project.updatedAt)}
            </div>
            <div className="inline-flex items-center gap-1.5">
              <Layers className="h-3 w-3 text-brand" /> {project.slug}
            </div>
          </div>
        </div>
      </div>

      {/* Live GitHub stats */}
      <div className="rounded-xl border border-border/60 bg-background/40 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Star className="h-3.5 w-3.5 text-brand" />
            Live GitHub stats
          </span>
        </div>
        <RepoStatBadges repo={live} loading={loading} />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2.5 pt-1">
        {project.homepage && (
          <Button
            asChild
            className="bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-5 rounded-full"
          >
            <a
              href={project.homepage}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() =>
                trackEvent("project_live_click", {
                  slug: project.slug,
                  label: project.name,
                })
              }
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open live demo
              <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
            </a>
          </Button>
        )}
        <Button
          asChild
          variant="outline"
          className="h-11 px-5 rounded-full border-border/70 bg-background/40"
        >
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() =>
              trackEvent("project_repo_click", {
                slug: project.slug,
                label: project.name,
              })
            }
          >
            <Github className="mr-2 h-4 w-4" />
            View source
          </a>
        </Button>
        <ShareRow
          slug={project.slug}
          name={project.name}
          blurb={project.description.split(". ")[0]}
        />
      </div>

      <p className="font-mono text-[10px] text-muted-foreground/60">
        Synced from github.com/{profile.githubUsername}/{project.slug}
      </p>
    </div>
  );
}

export function ProjectModal() {
  const modalSlug = useUIStore((s) => s.modalSlug);
  const closeModal = useUIStore((s) => s.closeModal);
  const openModal = useUIStore((s) => s.openModal);

  const index = projects.findIndex((p) => p.slug === modalSlug);
  const project = index >= 0 ? projects[index] : null;
  const prevProject =
    project && projects.length > 1
      ? projects[(index - 1 + projects.length) % projects.length]
      : null;
  const nextProject =
    project && projects.length > 1
      ? projects[(index + 1) % projects.length]
      : null;
  const firstRunRef = useRef(true);

  /** Browse to the previous/next repo without closing the modal. Keeps the
   *  deep link in sync (the modalSlug effect below rewrites `?p=`), scrolls
   *  the dialog body back to the top and records a modal_nav analytics
   *  event so the admin stats tab can see browse behaviour. */
  const browse = (dir: 1 | -1) => {
    const target = dir === 1 ? nextProject : prevProject;
    if (!target || target.slug === modalSlug) return;
    openModal(target.slug);
    trackEvent("modal_nav", {
      slug: target.slug,
      label: `${modalSlug}:${dir === 1 ? "next" : "prev"}`,
    });
    // Reset the scrollable dialog body after the re-render settles.
    requestAnimationFrame(() => {
      const dialog = document.querySelector('[role="dialog"]');
      if (dialog instanceof HTMLElement) dialog.scrollTop = 0;
    });
  };

  // Sync URL `?p=slug` with the open modal so links are shareable.
  // Skip the very first run so we don't clobber a deep-link param before
  // the DeepLinkHandler has a chance to read it.
  useEffect(() => {
    if (firstRunRef.current) {
      firstRunRef.current = false;
      return;
    }
    const url = new URL(window.location.href);
    if (modalSlug) {
      url.searchParams.set("p", modalSlug);
    } else {
      url.searchParams.delete("p");
    }
    window.history.replaceState(null, "", url.toString());
  }, [modalSlug]);

  // Lock body scroll while modal open (the Dialog already handles focus,
  // but we ensure escape + outside-click also clear the store). Arrow keys
  // browse to the previous/next repo — power-user affordance, matches the
  // "←/→ to browse" hint rendered in the nav footer below.
  useEffect(() => {
    if (!modalSlug) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inTextField =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (e.key === "Escape") closeModal();
      if (inTextField) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        browse(1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        browse(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalSlug, prevProject, nextProject]);

  return (
    <Dialog
      open={modalSlug !== null}
      onOpenChange={(open) => {
        if (!open) closeModal();
      }}
    >
      <DialogContent
        className="max-h-[88vh] overflow-y-auto scroll-area-thin sm:max-w-2xl rounded-2xl border-border/60 bg-card/95 backdrop-blur-xl p-6 sm:p-7"
        aria-describedby={undefined}
      >
        {/* Brand hairline across the top of the card */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand/70 to-transparent"
        />
        <DialogHeader className="pb-1">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            {project?.name ?? ""}
          </DialogTitle>
          <DialogDescription className="font-mono text-[11px] text-muted-foreground/70">
            /{project?.slug}
          </DialogDescription>
        </DialogHeader>
        {project && (
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProjectDetail project={project} />
          </motion.div>
        )}

        {/* Prev/next repo browser — sticky at the bottom of the scrollable
         *  dialog so it stays visible even mid-scroll. Wraps around the 9
         *  repos, keeps the deep link + scroll position in sync, and mirrors
         *  the ←/→ arrow keys. */}
        {project && prevProject && nextProject && (
          <nav
            aria-label="Browse projects"
            className="sticky bottom-0 -mx-6 sm:-mx-7 mt-7 flex items-center justify-between gap-3 border-t border-border/60 bg-card/95 px-6 py-3 backdrop-blur-xl sm:px-7 rounded-b-2xl"
          >
            <button
              type="button"
              onClick={() => browse(-1)}
              className="modal-nav-btn group"
              aria-label={`Previous project: ${prevProject.name}`}
            >
              <ChevronLeft className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-brand" />
              <span className="flex min-w-0 flex-col items-start text-left">
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60">
                  Prev
                </span>
                <span className="max-w-[9rem] truncate text-xs font-semibold text-foreground/90 sm:max-w-[11rem]">
                  {prevProject.name}
                </span>
              </span>
            </button>

            <span className="flex shrink-0 flex-col items-center gap-0.5">
              <span className="font-mono text-[11px] font-semibold text-brand">
                {index + 1} / {projects.length}
              </span>
              <span className="hidden items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/50 sm:flex">
                <kbd className="kbd-key">←</kbd>
                <kbd className="kbd-key">→</kbd>
                to browse
              </span>
            </span>

            <button
              type="button"
              onClick={() => browse(1)}
              className="modal-nav-btn group flex-row-reverse"
              aria-label={`Next project: ${nextProject.name}`}
            >
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-brand" />
              <span className="flex min-w-0 flex-col items-end text-right">
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60">
                  Next
                </span>
                <span className="max-w-[9rem] truncate text-xs font-semibold text-foreground/90 sm:max-w-[11rem]">
                  {nextProject.name}
                </span>
              </span>
            </button>
          </nav>
        )}
      </DialogContent>
    </Dialog>
  );
}
