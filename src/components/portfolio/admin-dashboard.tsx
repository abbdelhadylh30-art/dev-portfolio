"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Inbox,
  Loader2,
  Lock,
  Mail,
  MailOpen,
  RefreshCw,
  Trash2,
  KeyRound,
  AlertCircle,
  BarChart3,
  Activity,
  TrendingUp,
  TrendingDown,
  FileText,
  Save,
  Eye,
  Code2,
  LineChart,
  History,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import { useUIStore } from "@/lib/ui-store";
import { useToast } from "@/hooks/use-toast";
import { renderMarkdown } from "@/lib/markdown";
import { nowSection } from "@/lib/now-notes";

type StoredMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  projectType?: string;
  body: string;
  read: boolean;
  createdAt: string;
};

/** Tailwind tint per project type — reuse for list chip + expanded row. */
const TYPE_TINTS: Record<string, string> = {
  "New site": "bg-brand/15 text-brand border-brand/30",
  Redesign: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  "Web app": "bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/30",
  "Free audit": "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
  Other: "bg-muted text-muted-foreground border-border",
};

function TypeChip({ type }: { type?: string }) {
  if (!type) return null;
  const tint = TYPE_TINTS[type] ?? TYPE_TINTS.Other;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tint}`}
    >
      {type}
    </span>
  );
}

type RecentEvent = {
  id: string;
  type: string;
  slug: string;
  label: string;
  createdAt: string;
};

type AnalyticsSeries = {
  labels: string[];
  types: Record<string, number[]>;
};

type AnalyticsSummary = {
  total: number;
  last24: number;
  prev24: number;
  delta24: number;
  topTypes: { type: string; count: number }[];
  topSlugs: { slug: string; count: number }[];
  recent: RecentEvent[];
  series?: AnalyticsSeries;
};

type NowPayload = {
  source: "db" | "fallback";
  blurb: string;
  bodyMarkdown?: string;
  updatedAt: string;
};

type NowHistoryEntry = {
  id: string;
  body: string;
  blurb: string;
  updatedAt: string;
};

const TOKEN_KEY = "portfolio-admin-token";

function relativeTime(iso: string) {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = now - then;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const EVENT_LABELS: Record<string, string> = {
  project_card_click: "Card click",
  project_modal_open: "Modal open",
  modal_nav: "Modal ←/→ browse",
  project_share: "Share link",
  project_live_click: "Live demo",
  project_repo_click: "View source",
  palette_open: "⌘K open",
  shortcuts_open: "? overlay",
  rail_click: "Section rail",
  theme_toggle: "Theme toggle",
  filter_select: "Filter select",
  shipped_click: "Shipped click",
  contact_submit: "Contact submit",
  contact_copy_email: "Copy email",
  whatsapp_click: "WhatsApp click",
  contact_call: "Phone call click",
  admin_open: "Admin open",
  mode_switch: "View mode switch",
  faq_open: "FAQ open",
  service_click: "Service CTA",
  result_card_click: "Result card",
};

/**
 * Color palette for the top-6 event-type sparklines. Each color is an OKLCH
 * string close to the emerald brand but with a slightly different hue so
 * each type is visually distinguishable. Avoids blue/indigo.
 */
const SPARKLINE_COLORS = [
  "var(--brand)", // brand emerald (top type)
  "oklch(0.7 0.14 155)", // emerald-leaning toward green
  "oklch(0.72 0.15 175)", // emerald-leaning toward teal
  "oklch(0.7 0.13 140)", // emerald-leaning toward lime
  "oklch(0.66 0.14 195)", // soft teal (kept off pure blue)
  "oklch(0.74 0.12 100)", // amber-leaning green (kept off red)
];

let sparklineUidCounter = 0;
function nextSparklineUid(): string {
  sparklineUidCounter = (sparklineUidCounter + 1) % 1_000_000;
  return `sl-${sparklineUidCounter}`;
}

/**
 * Combined overview chart — overlays the per-type 7-day series as
 * overlapping filled areas + thin lines, with the day labels at the
 * bottom. Wider + taller than the per-type sparklines so it reads as
 * the "headline" chart at the top of the Stats tab.
 *
 * Pure SVG, no chart library. Each type gets a unique color from the
 * SPARKLINE_COLORS palette so the eye can trace it across both this
 * combined chart and the per-type sparklines below.
 */
function CombinedChart({
  seriesTypes,
  labels,
  topTypes,
  mode = "overlay",
}: {
  seriesTypes: Record<string, number[]>;
  labels: string[];
  topTypes: string[];
  /** "overlay" = each series normalized to the global max; "stacked" = cumulative bands summing to the daily total. */
  mode?: "overlay" | "stacked";
}) {
  const width = 460;
  const height = 80;
  const padX = 8;
  const padY = 8;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  // Stacked mode: cumulative sums per type; Y axis normalized to the max
  // daily total. Overlay mode: each series normalized to the global max.
  const days = labels.length;
  let stackedLower: Record<string, number[]> = {};
  const stackedUpper: Record<string, number[]> = {};
  let max = 1;
  if (mode === "stacked") {
    const cumul = new Array(days).fill(0);
    for (const type of topTypes) {
      const values = seriesTypes[type] ?? [];
      const lower: number[] = [];
      const upper: number[] = [];
      for (let d = 0; d < days; d++) {
        lower.push(cumul[d] ?? 0);
        const v = values[d] ?? 0;
        cumul[d] = (cumul[d] ?? 0) + v;
        upper.push(cumul[d]);
      }
      stackedLower[type] = lower;
      stackedUpper[type] = upper;
    }
    max = Math.max(1, ...cumul);
  } else {
    const allValues = Object.values(seriesTypes).flat();
    max = Math.max(1, ...allValues);
  }
  const stepX = innerW / Math.max(1, labels.length - 1);

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
      preserveAspectRatio="xMidYMid meet"
      aria-label="Combined 7-day event activity chart"
    >
      {/* Y-axis gridlines (3 horizontal lines at 25/50/75/100%) */}
      {[0.25, 0.5, 0.75, 1].map((frac) => {
        const y = padY + innerH * (1 - frac);
        return (
          <line
            key={frac}
            x1={padX}
            y1={y}
            x2={width - padX}
            y2={y}
            stroke="var(--border)"
            strokeWidth="0.5"
            strokeDasharray="2 3"
            opacity="0.4"
          />
        );
      })}

      {/* Per-type filled area + line (stacked: draw from the top band down
          so lower bands don't paint over upper ones) */}
      {topTypes.map((type, idx) => {
        const values = seriesTypes[type] ?? [];
        if (values.length === 0) return null;
        const color = SPARKLINE_COLORS[idx % SPARKLINE_COLORS.length];
        const uid = `${type}-${idx}-${mode}`;
        const gradId = `combined-grad-${uid}`;

        let linePath: string;
        let areaPath: string;
        let lastPoint: { x: number; y: number } | null = null;

        if (mode === "stacked") {
          const upper = stackedUpper[type] ?? values;
          const lower = stackedLower[type] ?? new Array(values.length).fill(0);
          const upperPts = upper.map((v, i) => ({
            x: padX + i * stepX,
            y: padY + innerH * (1 - v / max),
          }));
          const lowerPts = lower.map((v, i) => ({
            x: padX + i * stepX,
            y: padY + innerH * (1 - v / max),
          }));
          linePath = upperPts
            .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
            .join(" ");
          // Band area: upper edge forward, lower edge backward.
          const lowerReversed = [...lowerPts].reverse();
          areaPath =
            `${linePath} ` +
            lowerReversed
              .map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
              .join(" ") +
            " Z";
          lastPoint = upperPts[upperPts.length - 1] ?? null;
        } else {
          const points = values.map((v, i) => {
            const x = padX + i * stepX;
            const y = padY + innerH * (1 - v / max);
            return { x, y };
          });
          linePath = points
            .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
            .join(" ");
          areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(2)} ${padY + innerH} L ${points[0].x.toFixed(2)} ${padY + innerH} Z`;
          lastPoint = points[points.length - 1] ?? null;
        }

        return (
          <g key={type}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.28" />
                <stop offset="100%" stopColor={color} stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill={`url(#${gradId})`} stroke="none" />
            <path
              d={linePath}
              fill="none"
              stroke={color}
              strokeWidth="1.4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* today dot */}
            {lastPoint && (
              <circle
                cx={lastPoint.x}
                cy={lastPoint.y}
                r="2.5"
                fill={color}
                stroke="var(--background)"
                strokeWidth="1"
              />
            )}
          </g>
        );
      })}

      {/* Day labels */}
      {labels.map((label, i) => {
        const x = padX + i * stepX;
        return (
          <text
            key={label}
            x={x}
            y={height - 1}
            textAnchor={i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle"}
            fontSize="7"
            fill="var(--muted-foreground)"
            opacity="0.7"
            fontFamily="var(--font-geist-mono)"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

/**
 * Tiny inline SVG sparkline for a 7-day per-type bucket.
 * Pure-SVG, no chart library — scales to the container width.
 * Supports per-instance color via the `color` prop (defaults to brand).
 */
function Sparkline({
  values,
  labels,
  height = 28,
  color = "var(--brand)",
  showLabels = true,
}: {
  values: number[];
  labels: string[];
  height?: number;
  color?: string;
  showLabels?: boolean;
}) {
  const width = 110;
  const pad = 2;
  const max = Math.max(1, ...values);
  const stepX = (width - pad * 2) / Math.max(1, values.length - 1);
  const points = values.map((v, i) => {
    const x = pad + i * stepX;
    const y = pad + (height - pad * 2) * (1 - v / max);
    return { x, y };
  });

  const uid = React.useMemo(() => nextSparklineUid(), []);
  const gradId = `sparkline-grad-${uid}`;

  // Build a smooth path. We use straight line segments — sparklines are
  // meant to be terse.
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
  // Filled area path (line + close to baseline).
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x.toFixed(2)} ${height - pad} L ${points[0].x.toFixed(2)} ${height - pad} Z`
      : "";
  // Recent (today) value as a dot.
  const lastPoint = points[points.length - 1];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {areaPath && (
        <path
          d={areaPath}
          fill={`url(#${gradId})`}
          stroke="none"
        />
      )}
      {linePath && (
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="1.25"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}
      {lastPoint && (
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r="2"
          fill={color}
          stroke="var(--background)"
          strokeWidth="1"
        />
      )}
      {showLabels &&
        labels.map((label, i) => {
          const x = pad + i * stepX;
          return (
            <text
              key={label}
              x={x}
              y={height - 1}
              textAnchor="middle"
              fontSize="6"
              fill="var(--muted-foreground)"
              opacity="0.6"
              fontFamily="var(--font-geist-mono)"
            >
              {label}
            </text>
          );
        })}
    </svg>
  );
}

function AnalyticsTab({
  token,
  onRefresh,
}: {
  token: string;
  onRefresh: () => void;
}) {
  const [data, setData] = React.useState<AnalyticsSummary | null>(null);
  const [chartMode, setChartMode] = React.useState<"overlay" | "stacked">("overlay");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetch_ = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        setError("Unauthorized — token revoked.");
        return;
      }
      if (!res.ok) {
        setError(`Server error (${res.status}).`);
        return;
      }
      const json = (await res.json()) as AnalyticsSummary;
      setData(json);
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  React.useEffect(() => {
    void fetch_();
  }, [fetch_]);

  const totalEvents = data?.total ?? 0;
  const maxType = data?.topTypes?.[0]?.count ?? 1;
  const seriesLabels = data?.series?.labels ?? [];
  const seriesTypes = data?.series?.types ?? {};

  return (
    <div className="space-y-4 pt-2">
      {/* Summary + refresh */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
        <div className="flex items-center gap-3 text-sm">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {totalEvents} total events
          </span>
          <span className="text-muted-foreground/40">·</span>
          {data && (
            <Badge className="rounded-full bg-brand/10 text-brand border border-brand/20 font-mono text-[10px] uppercase tracking-wider">
              {data.last24} last 24h
            </Badge>
          )}
          {data && data.delta24 !== 0 && (
            <span
              className={`inline-flex items-center gap-1 font-mono text-[11px] ${
                data.delta24 > 0 ? "text-brand" : "text-muted-foreground"
              }`}
            >
              {data.delta24 > 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {data.delta24 > 0 ? "+" : ""}
              {data.delta24} vs prev
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            fetch_();
            onRefresh();
          }}
          disabled={loading}
          className="h-8 rounded-full text-muted-foreground hover:text-brand"
        >
          {loading ? (
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
          )}
          Refresh
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </div>
      )}

      {!data && loading && (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 p-8 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading analytics…
        </div>
      )}

      {data && data.total === 0 && (
        <div className="rounded-xl border border-dashed border-border/60 p-8 text-center">
          <BarChart3 className="mx-auto h-8 w-8 text-muted-foreground/50" />
          <p className="mt-2 text-sm text-muted-foreground">
            No events recorded yet. Interactions on the portfolio (palette
            opens, project clicks, theme toggles, etc.) will appear here.
          </p>
        </div>
      )}

      {data && data.total > 0 && (
        <>
          {/* Combined 7-day overview chart (overlay or stacked) */}
          {seriesLabels.length > 0 && (
            <div className="rounded-xl border border-brand/30 bg-brand/5 p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
                  <LineChart className="h-3.5 w-3.5" />
                  7-day total activity
                </h3>
                <div
                  className="flex gap-0.5 rounded-full border border-border/60 bg-background/40 p-0.5"
                  role="group"
                  aria-label="Chart mode"
                >
                  {(["overlay", "stacked"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setChartMode(m)}
                      aria-pressed={chartMode === m}
                      className={`chart-mode-pill rounded-full px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                        chartMode === m
                          ? "bg-brand text-brand-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <CombinedChart
                seriesTypes={seriesTypes}
                labels={seriesLabels}
                topTypes={data.topTypes.slice(0, 6).map((t) => t.type)}
                mode={chartMode}
              />
              <p className="mt-2 font-mono text-[9px] leading-relaxed text-muted-foreground/70">
                {chartMode === "overlay"
                  ? "overlay · each type scaled to the busiest type's peak"
                  : "stacked · bands sum to the daily total · top type on top"}
              </p>
            </div>
          )}

          {/* 7-day per-type sparklines (color-coded) */}
          {seriesLabels.length > 0 && (
            <div className="rounded-xl border border-border/60 bg-background/40 p-4">
              <h3 className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <LineChart className="h-3.5 w-3.5 text-brand" />
                7-day trend per type
              </h3>
              <ul className="space-y-2">
                {data.topTypes.slice(0, 6).map((t, idx) => {
                  const series = seriesTypes[t.type] ?? [0, 0, 0, 0, 0, 0, 0];
                  const color = SPARKLINE_COLORS[idx % SPARKLINE_COLORS.length];
                  return (
                    <li
                      key={t.type}
                      className="flex items-center gap-2 font-mono text-[11px]"
                    >
                      <span className="inline-flex w-28 shrink-0 items-center gap-1.5 truncate text-foreground/80">
                        <span
                          className="inline-block h-2 w-2 shrink-0 rounded-sm"
                          style={{ backgroundColor: color }}
                        />
                        <span className="truncate">
                          {EVENT_LABELS[t.type] ?? t.type}
                        </span>
                      </span>
                      <div className="flex h-7 flex-1 items-center overflow-hidden rounded-md bg-muted/40">
                        <div className="flex-1 pl-1">
                          <Sparkline
                            values={series}
                            labels={seriesLabels}
                            color={color}
                            showLabels={false}
                          />
                        </div>
                      </div>
                      <span className="w-16 shrink-0 text-right font-mono text-[10px] text-muted-foreground">
                        Σ {series.reduce((a, b) => a + b, 0)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Top event types — horizontal bar list */}
          <div className="rounded-xl border border-border/60 bg-background/40 p-4">
            <h3 className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Activity className="h-3.5 w-3.5 text-brand" />
              Top event types
            </h3>
            <ul className="space-y-1.5">
              {data.topTypes.map((t) => (
                <li
                  key={t.type}
                  className="flex items-center gap-2 font-mono text-[11px]"
                >
                  <span className="w-28 shrink-0 truncate text-foreground/80">
                    {EVENT_LABELS[t.type] ?? t.type}
                  </span>
                  <div className="relative h-4 flex-1 overflow-hidden rounded-full bg-muted/60">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand/70 to-brand"
                      style={{
                        width: `${(t.count / maxType) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right text-foreground">
                    {t.count}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Top project slugs */}
          {data.topSlugs.length > 0 && (
            <div className="rounded-xl border border-border/60 bg-background/40 p-4">
              <h3 className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <BarChart3 className="h-3.5 w-3.5 text-brand" />
                Top projects
              </h3>
              <ul className="space-y-1">
                {data.topSlugs.map((s) => (
                  <li
                    key={s.slug}
                    className="flex items-center justify-between font-mono text-[11px]"
                  >
                    <span className="text-foreground/80">
                      /{s.slug}
                    </span>
                    <span className="text-foreground">{s.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recent events feed */}
          <div className="rounded-xl border border-border/60 bg-background/40 p-4">
            <h3 className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Activity className="h-3.5 w-3.5 text-brand" />
              Recent activity
            </h3>
            <ul className="space-y-1.5">
              {data.recent.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground"
                >
                  <span className="inline-flex items-center gap-1 rounded-md bg-brand/10 px-1.5 py-0.5 text-brand">
                    {EVENT_LABELS[e.type] ?? e.type}
                  </span>
                  {e.slug && (
                    <span className="text-foreground/60">/{e.slug}</span>
                  )}
                  <span className="ml-auto text-muted-foreground/60">
                    {relativeTime(e.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * "Now" tab — markdown editor + live preview for the public Now section.
 * Loads the active Now content from /api/now, lets the admin edit the
 * markdown body, and POSTs to /api/now on save.
 */
function NowTab({
  token,
  onRefresh,
}: {
  token: string;
  onRefresh: () => void;
}) {
  const { toast } = useToast();
  const [payload, setPayload] = React.useState<NowPayload | null>(null);
  const [body, setBody] = React.useState("");
  const [blurb, setBlurb] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [view, setView] = React.useState<"editor" | "preview" | "split" | "history">("split");
  const [dirty, setDirty] = React.useState(false);
  const [history, setHistory] = React.useState<NowHistoryEntry[]>([]);
  const [historyTotal, setHistoryTotal] = React.useState(0);
  const [historyHasMore, setHistoryHasMore] = React.useState(false);
  const [historyLoading, setHistoryLoading] = React.useState(false);
  const [historyLoadingMore, setHistoryLoadingMore] = React.useState(false);
  const [restoringId, setRestoringId] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);

  const fetch_ = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/now", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) {
        setError(`Server error (${res.status}).`);
        return;
      }
      const json = (await res.json()) as NowPayload;
      setPayload(json);
      setBody(json.bodyMarkdown ?? "");
      setBlurb(json.blurb ?? nowSection.blurb);
      setDirty(false);
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchHistory = React.useCallback(
    async (opts?: { append?: boolean; offset?: number }) => {
      const append = opts?.append ?? false;
      const offset = opts?.offset ?? 0;
      if (append) setHistoryLoadingMore(true);
      else setHistoryLoading(true);
      try {
        const res = await fetch(
          `/api/now?history=1&limit=10&offset=${offset}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }
        );
        if (!res.ok) {
          toast({
            title: "History fetch failed",
            description: `Server returned ${res.status}.`,
            variant: "destructive",
          });
          return;
        }
        const data = (await res.json()) as {
          ok: boolean;
          count: number;
          total: number;
          hasMore: boolean;
          history: NowHistoryEntry[];
        };
        setHistory((prev) =>
          append ? [...prev, ...(data.history ?? [])] : (data.history ?? [])
        );
        setHistoryTotal(data.total ?? 0);
        setHistoryHasMore(Boolean(data.hasMore));
      } catch {
        toast({
          title: "History fetch failed",
          description: "Network error.",
          variant: "destructive",
        });
      } finally {
        setHistoryLoading(false);
        setHistoryLoadingMore(false);
      }
    },
    [token, toast]
  );

  const onLoadMoreHistory = async () => {
    await fetchHistory({ append: true, offset: history.length });
  };

  const onDeleteSnapshot = async (entry: NowHistoryEntry) => {
    setDeletingId(entry.id);
    try {
      const res = await fetch("/api/now", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: entry.id }),
      });
      if (res.status === 401) {
        toast({
          title: "Unauthorized",
          description: "Token revoked.",
          variant: "destructive",
        });
        return;
      }
      if (res.status === 409) {
        toast({
          title: "Cannot delete the live snapshot",
          description:
            "Save a new version or restore another one first — the public section must always have content.",
          variant: "destructive",
        });
        return;
      }
      if (!res.ok) {
        toast({
          title: "Delete failed",
          description: `Server returned ${res.status}.`,
          variant: "destructive",
        });
        return;
      }
      setHistory((prev) => prev.filter((h) => h.id !== entry.id));
      setHistoryTotal((t) => Math.max(0, t - 1));
      setConfirmDeleteId(null);
      toast({
        title: "Snapshot deleted",
        description: `Removed the ${new Date(entry.updatedAt).toLocaleString(
          "en-US",
          { dateStyle: "medium", timeStyle: "short" }
        )} version for good.`,
      });
    } catch {
      toast({
        title: "Delete failed",
        description: "Network error.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  React.useEffect(() => {
    void fetch_();
  }, [fetch_]);

  // When the user switches to the History view, fetch the history if we
  // haven't already (or it's stale).
  React.useEffect(() => {
    if (view === "history" && history.length === 0 && !historyLoading) {
      void fetchHistory();
    }
  }, [view, history.length, historyLoading, fetchHistory]);

  const onSave = async () => {
    if (!body.trim()) {
      toast({
        title: "Cannot save empty Now content",
        description: "Write something first — the section would render blank.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/now", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body, blurb }),
      });
      if (res.status === 401) {
        setError("Unauthorized — token revoked.");
        return;
      }
      if (!res.ok) {
        setError(`Save failed (${res.status}).`);
        return;
      }
      const json = (await res.json()) as NowPayload;
      setPayload(json);
      setBody(json.bodyMarkdown ?? body);
      setBlurb(json.blurb ?? blurb);
      setDirty(false);
      toast({
        title: "Now content saved",
        description: "The public /now section will reflect this on next visit.",
      });
      onRefresh();
    } catch {
      setError("Network error during save.");
    } finally {
      setSaving(false);
    }
  };

  const onReset = () => {
    setBody(payload?.bodyMarkdown ?? "");
    setBlurb(payload?.blurb ?? nowSection.blurb);
    setDirty(false);
  };

  const onUpdate = (next: string) => {
    setBody(next);
    setDirty(next !== (payload?.bodyMarkdown ?? ""));
  };

  const onUpdateBlurb = (next: string) => {
    setBlurb(next);
    setDirty(true);
  };

  const onRestore = async (entry: NowHistoryEntry) => {
    setRestoringId(entry.id);
    try {
      const res = await fetch("/api/now", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: entry.id }),
      });
      if (res.status === 401) {
        toast({
          title: "Unauthorized",
          description: "Token revoked.",
          variant: "destructive",
        });
        return;
      }
      if (!res.ok) {
        toast({
          title: "Restore failed",
          description: `Server returned ${res.status}.`,
          variant: "destructive",
        });
        return;
      }
      const json = (await res.json()) as NowPayload;
      setPayload(json);
      setBody(json.bodyMarkdown ?? "");
      setBlurb(json.blurb ?? nowSection.blurb);
      setDirty(false);
      // Refresh history so the restored entry moves to the top.
      void fetchHistory();
      toast({
        title: "Snapshot restored",
        description: `Public Now section now reflects the ${new Date(
          entry.updatedAt
        ).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        })} snapshot.`,
      });
      onRefresh();
    } catch {
      toast({
        title: "Restore failed",
        description: "Network error.",
        variant: "destructive",
      });
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
        <div className="flex items-center gap-3 text-sm">
          <FileText className="h-3.5 w-3.5 text-brand" />
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {payload?.source === "db" ? "Editing live content" : "First-time setup"}
          </span>
          {payload && (
            <span className="font-mono text-[10px] text-muted-foreground/60">
              last saved {relativeTime(payload.updatedAt)}
            </span>
          )}
          {dirty && (
            <Badge className="rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/20 font-mono text-[10px] uppercase tracking-wider">
              unsaved
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <div className="mr-1 flex gap-1 rounded-full border border-border/60 bg-background/40 p-0.5">
            {(["editor", "split", "preview", "history"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors ${
                  view === v
                    ? "bg-brand text-brand-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {v === "editor" ? (
                  <Code2 className="h-3 w-3" />
                ) : v === "split" ? (
                  <Eye className="h-3 w-3" />
                ) : v === "preview" ? (
                  <FileText className="h-3 w-3" />
                ) : (
                  <History className="h-3 w-3" />
                )}
                {v}
              </button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetch_}
            disabled={loading}
            className="h-8 rounded-full text-muted-foreground hover:text-brand"
          >
            {loading ? (
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
            )}
            Reload
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            disabled={!dirty || saving}
            className="h-8 rounded-full text-muted-foreground hover:text-foreground"
          >
            Reset
          </Button>
          <Button
            onClick={onSave}
            disabled={saving || !dirty}
            className="h-8 rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
          >
            {saving ? (
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="mr-2 h-3.5 w-3.5" />
            )}
            Save
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </div>
      )}

      {loading && !payload && (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 p-8 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading Now content…
        </div>
      )}

      {payload && (
        <>
          {/* Blurb */}
          <div className="rounded-xl border border-border/60 bg-background/40 p-3">
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
              Blurb (one-line summary shown above the body)
            </label>
            <Input
              value={blurb}
              onChange={(e) => onUpdateBlurb(e.target.value)}
              maxLength={280}
              placeholder="A living snapshot of what I'm building, learning and reading."
              className="font-mono text-sm"
            />
            <div className="mt-1 flex items-center justify-between font-mono text-[10px] text-muted-foreground/60">
              <span>Plain text · max 280 chars</span>
              <span>{blurb.length}/280</span>
            </div>
          </div>

          {/* Editor / Preview / History */}
          {view === "history" ? (
            <div className="rounded-xl border border-border/60 bg-background/40 p-3">
              <div className="mb-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
                  <History className="h-3 w-3" />
                  Version history
                </span>
                <span className="font-mono text-[10px] text-muted-foreground/60">
                  {historyHasMore
                    ? `${history.length} of ${historyTotal} snapshots · restore or delete`
                    : `${historyTotal} snapshot${historyTotal === 1 ? "" : "s"} · restore or delete`}
                </span>
              </div>

              {historyLoading ? (
                <div className="flex items-center justify-center gap-2 py-8 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Loading history…
                </div>
              ) : history.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border/60 p-6 text-center text-xs text-muted-foreground/70">
                  No saved snapshots yet. Edits you save are kept forever —
                  browse + restore previous versions here.
                </div>
              ) : (
                <ul className="space-y-1.5 max-h-[360px] overflow-y-auto scroll-area-thin">
                  {history.map((entry, i) => {
                    const isCurrent = payload?.updatedAt === entry.updatedAt;
                    const isRestoring = restoringId === entry.id;
                    const isDeleting = deletingId === entry.id;
                    return (
                      <li
                        key={entry.id}
                        className={`rounded-lg border p-2.5 transition-colors ${
                          isCurrent
                            ? "border-brand/40 bg-brand/5"
                            : "border-border/40 hover:border-brand/30 hover:bg-brand/3"
                        }`}
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] uppercase tracking-wider text-brand">
                                {isCurrent ? "live" : `v${historyTotal - i}`}
                              </span>
                              {entry.blurb ? (
                                <span className="truncate text-xs text-foreground/70">
                                  {entry.blurb}
                                </span>
                              ) : (
                                <span className="font-mono text-[10px] italic text-muted-foreground/60">
                                  (no blurb)
                                </span>
                              )}
                            </div>
                            <div className="mt-0.5 font-mono text-[10px] text-muted-foreground/70">
                              {new Date(entry.updatedAt).toLocaleString("en-US", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}{" "}
                              · {relativeTime(entry.updatedAt)} ·{" "}
                              {entry.body.length} chars
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onRestore(entry)}
                              disabled={isCurrent || isRestoring}
                              className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                                isCurrent
                                  ? "border-brand/30 bg-brand/10 text-brand opacity-60"
                                  : "border-border/60 bg-background/40 text-muted-foreground hover:border-brand/40 hover:text-brand"
                              }`}
                            >
                              {isRestoring ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <RotateCcw className="h-3 w-3" />
                              )}
                              {isCurrent ? "current" : "restore"}
                            </button>
                            {!isCurrent && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirmDeleteId === entry.id) {
                                    void onDeleteSnapshot(entry);
                                  } else {
                                    setConfirmDeleteId(entry.id);
                                    // auto-cancel the confirm after 4s
                                    setTimeout(
                                      () =>
                                        setConfirmDeleteId((cur) =>
                                          cur === entry.id ? null : cur
                                        ),
                                      4000
                                    );
                                  }
                                }}
                                disabled={isDeleting}
                                aria-label={`Permanently delete the snapshot from ${new Date(
                                  entry.updatedAt
                                ).toLocaleDateString("en-US")}`}
                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                                  confirmDeleteId === entry.id
                                    ? "border-destructive/60 bg-destructive/10 text-destructive"
                                    : "border-border/60 bg-background/40 text-muted-foreground/70 hover:border-destructive/40 hover:text-destructive"
                                }`}
                              >
                                {isDeleting ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : confirmDeleteId === entry.id ? (
                                  <Trash2 className="h-3 w-3" />
                                ) : (
                                  <Trash2 className="h-3 w-3" />
                                )}
                                {confirmDeleteId === entry.id
                                  ? "confirm delete"
                                  : "delete"}
                              </button>
                            )}
                          </div>
                        </div>
                        {entry.body && (
                          <pre className="mt-2 max-h-24 overflow-y-auto scroll-area-thin whitespace-pre-wrap break-words rounded-md bg-card/40 p-2 font-mono text-[10px] leading-relaxed text-muted-foreground/80">
                            {entry.body.slice(0, 240)}
                            {entry.body.length > 240 ? "…" : ""}
                          </pre>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}

              {historyHasMore && (
                <button
                  type="button"
                  onClick={onLoadMoreHistory}
                  disabled={historyLoadingMore}
                  className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border/60 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand disabled:opacity-60"
                >
                  {historyLoadingMore ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                  Load older snapshots ({historyTotal - history.length} left)
                </button>
              )}

              <p className="mt-3 font-mono text-[10px] leading-relaxed text-muted-foreground/60">
                Tip: <span className="text-brand">restore</span> re-activates an
                old snapshot (nothing is lost);{" "}
                <span className="text-destructive">delete</span> removes it
                permanently — the live snapshot can’t be deleted.
              </p>
            </div>
          ) : (
            <div
              className={`grid gap-3 ${
                view === "split" ? "md:grid-cols-2" : "grid-cols-1"
              }`}
            >
              {(view === "editor" || view === "split") && (
                <div className="rounded-xl border border-border/60 bg-background/40 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
                      <Code2 className="h-3 w-3" />
                      Markdown source
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground/60">
                      {body.length} chars
                    </span>
                  </div>
                  <Textarea
                    value={body}
                    onChange={(e) => onUpdate(e.target.value)}
                    spellCheck={false}
                    placeholder={`## Building\n- Forge Studio — iterating on the auditor's deterministic checks.\n- This portfolio — added live GitHub stats + admin inbox.\n\n## Reading\n> Designing Data-Intensive Applications — replication & partitioning chapters.`}
                    className="min-h-[280px] resize-y font-mono text-xs leading-relaxed scroll-area-thin"
                  />
                </div>
              )}

              {(view === "preview" || view === "split") && (
                <div className="rounded-xl border border-border/60 bg-background/40 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
                      <Eye className="h-3 w-3" />
                      Live preview
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground/60">
                      rendered client-side
                    </span>
                  </div>
                  {body.trim() ? (
                    <div
                      className="md-rendered min-h-[280px] rounded-md bg-card/40 p-3 text-sm"
                      dangerouslySetInnerHTML={{
                        __html: renderMarkdown(body),
                      }}
                    />
                  ) : (
                    <div className="grid min-h-[280px] place-items-center text-xs text-muted-foreground/60">
                      Nothing to preview yet.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Markdown hint — hidden in history view */}
          {view !== "history" && (
            <p className="font-mono text-[10px] leading-relaxed text-muted-foreground/70">
              Supports: <code className="text-brand">## headings</code>,{" "}
              <code className="text-brand">- bullet</code>,{" "}
              <code className="text-brand">1. ordered</code>,{" "}
              <code className="text-brand">**bold**</code>,{" "}
              <code className="text-brand">*italic*</code>,{" "}
              <code className="text-brand">`code`</code>,{" "}
              <code className="text-brand">{">"} blockquote</code>,{" "}
              <code className="text-brand">[text](url)</code>,{" "}
              <code className="text-brand">---</code> rule.
            </p>
          )}
        </>
      )}
    </div>
  );
}

export function AdminDashboard() {
  const open = useUIStore((s) => s.adminOpen);
  const close = useUIStore((s) => s.closeAdmin);
  const { toast } = useToast();

  const [token, setToken] = React.useState("");
  const [authed, setAuthed] = React.useState(false);
  const [messages, setMessages] = React.useState<StoredMessage[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [tab, setTab] = React.useState<"inbox" | "stats" | "now">("inbox");

  // Restore any previously-saved admin token on first mount.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(TOKEN_KEY);
    if (saved) {
      setToken(saved);
      // Don't auto-authenticate — let the user click "Unlock" so we don't
      // fire requests against the admin endpoint silently on every page load.
    }
  }, []);

  const fetchMessages = React.useCallback(
    async (tokenValue: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/contact/messages?limit=100", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenValue}`,
          },
        });
        if (res.status === 401) {
          setAuthed(false);
          setError("Invalid token. Try again.");
          return;
        }
        if (!res.ok) {
          setError(`Server error (${res.status}).`);
          return;
        }
        const data = await res.json();
        setAuthed(true);
        window.localStorage.setItem(TOKEN_KEY, tokenValue);
        setMessages(data.messages ?? []);
      } catch {
        setError("Network error. Is the dev server running?");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // When the dashboard opens, if we already have a saved token, refresh.
  React.useEffect(() => {
    if (!open) return;
    if (token) {
      void fetchMessages(token);
    }
  }, [open, token, fetchMessages]);

  const onUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    void fetchMessages(token.trim());
  };

  const toggleRead = async (m: StoredMessage) => {
    const next = !m.read;
    setMessages((list) =>
      list.map((x) => (x.id === m.id ? { ...x, read: next } : x))
    );
    try {
      const res = await fetch("/api/contact/messages", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: m.id, read: next }),
      });
      if (!res.ok) throw new Error("update failed");
      toast({
        title: next ? "Marked as read" : "Marked as unread",
      });
    } catch {
      // revert on failure
      setMessages((list) =>
        list.map((x) => (x.id === m.id ? { ...x, read: m.read } : x))
      );
      toast({
        title: "Update failed",
        variant: "destructive",
      });
    }
  };

  const onDelete = async (m: StoredMessage) => {
    const prev = messages;
    setMessages((list) => list.filter((x) => x.id !== m.id));
    try {
      const res = await fetch(`/api/contact/messages/${m.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("delete failed");
      toast({ title: "Message deleted" });
    } catch {
      setMessages(prev);
      toast({
        title: "Delete failed",
        variant: "destructive",
      });
    }
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setAuthed(false);
          setError(null);
          close();
        }
      }}
    >
      <DialogContent
        className="sm:max-w-2xl max-h-[88vh] overflow-y-auto scroll-area-thin rounded-2xl border-border/60 bg-card/95 backdrop-blur-xl p-6 sm:p-7"
        aria-describedby={undefined}
      >
        <DialogHeader className="pb-1">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Inbox className="h-5 w-5 text-brand" />
            Admin inbox
          </DialogTitle>
          <DialogDescription className="font-mono text-[11px] text-muted-foreground/70">
            Stored contact submissions · authenticated bearer endpoint
          </DialogDescription>
        </DialogHeader>

        {!authed ? (
          <form onSubmit={onUnlock} className="space-y-4 pt-2">
            <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-4">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand/15 text-brand">
                <Lock className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <div className="text-sm font-semibold text-foreground">
                  Token-gated
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter the admin bearer token to list stored messages and
                  analytics. The token is saved to your browser and sent only
                  to{" "}
                  <code className="font-mono text-[11px] text-brand">
                    /api/contact/messages
                  </code>{" "}
                  and{" "}
                  <code className="font-mono text-[11px] text-brand">
                    /api/events
                  </code>
                  .
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="admin-token"
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Admin token
              </label>
              <div className="flex gap-2">
                <Input
                  id="admin-token"
                  type="password"
                  autoComplete="off"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="ag-portfolio-dev-2026"
                  className="font-mono text-sm"
                />
                <Button
                  type="submit"
                  className="bg-brand text-brand-foreground hover:bg-brand/90 rounded-full"
                  disabled={!token.trim() || loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <KeyRound className="mr-2 h-4 w-4" />
                  )}
                  Unlock
                </Button>
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5" />
                {error}
              </div>
            )}
            <p className="font-mono text-[10px] text-muted-foreground/70">
              Default dev token is{" "}
              <code className="text-brand">ag-portfolio-dev-2026</code>. Override
              with <code>PORTFOLIO_ADMIN_TOKEN</code> env var in production.
            </p>
          </form>
        ) : (
          <div className="space-y-4 pt-2">
            {/* Tab toggle */}
            <div className="flex gap-1 rounded-full border border-border/60 bg-background/40 p-1">
              {(["inbox", "stats", "now"] as const).map((t) => {
                const active = tab === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`relative inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      active
                        ? "bg-brand text-brand-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t === "inbox" ? (
                      <Inbox className="h-3 w-3" />
                    ) : t === "stats" ? (
                      <BarChart3 className="h-3 w-3" />
                    ) : (
                      <FileText className="h-3 w-3" />
                    )}
                    {t === "inbox" ? "Inbox" : t === "stats" ? "Stats" : "Now"}
                  </button>
                );
              })}
            </div>

            {tab === "stats" ? (
              <AnalyticsTab
                token={token}
                onRefresh={() => fetchMessages(token)}
              />
            ) : tab === "now" ? (
              <NowTab
                token={token}
                onRefresh={() => fetchMessages(token)}
              />
            ) : (
              <>
                {/* Summary + refresh */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      {messages.length} total
                    </span>
                    <span className="text-muted-foreground/40">·</span>
                    <Badge className="rounded-full bg-brand/10 text-brand border border-brand/20 font-mono text-[10px] uppercase tracking-wider">
                      {unread} unread
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fetchMessages(token)}
                    disabled={loading}
                    className="h-8 rounded-full text-muted-foreground hover:text-brand"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-3.5 w-3.5" />
                    )}
                    Refresh
                  </Button>
                </div>

                {/* List */}
                {messages.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border/60 p-8 text-center">
                    <Inbox className="mx-auto h-8 w-8 text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      No messages yet. Submissions from the contact form will
                      appear here.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-2.5">
                    {messages.map((m) => {
                      const open = expandedId === m.id;
                      return (
                        <li
                          key={m.id}
                          className={`rounded-xl border bg-background/40 transition-colors ${
                            m.read
                              ? "border-border/50 opacity-70"
                              : "border-brand/40"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedId(open ? null : m.id)
                            }
                            className="flex w-full items-start gap-3 p-3 text-left"
                          >
                            <span
                              className={`mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
                                m.read
                                  ? "bg-muted text-muted-foreground"
                                  : "bg-brand/15 text-brand"
                              }`}
                            >
                              {m.read ? (
                                <MailOpen className="h-3.5 w-3.5" />
                              ) : (
                                <Mail className="h-3.5 w-3.5" />
                              )}
                            </span>
                            <span className="flex-1 min-w-0">
                              <span className="flex items-center gap-2">
                                <span className="truncate text-sm font-semibold text-foreground">
                                  {m.name}
                                </span>
                                {!m.read && (
                                  <span className="rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-foreground">
                                    New
                                  </span>
                                )}
                                <TypeChip type={m.projectType} />
                                <span className="ml-auto font-mono text-[11px] text-muted-foreground">
                                  {relativeTime(m.createdAt)}
                                </span>
                              </span>
                              <span className="block truncate font-mono text-[11px] text-muted-foreground">
                                {m.email}
                              </span>
                              <span className="mt-1 block truncate text-xs text-foreground/80">
                                {m.subject
                                  ? m.subject
                                  : "(no subject)"}{" "}
                                — {m.body.slice(0, 80)}
                                {m.body.length > 80 ? "…" : ""}
                              </span>
                            </span>
                          </button>
                          {open && (
                            <div className="border-t border-border/50 p-3 pt-3 space-y-3">
                              <div className="grid grid-cols-1 gap-1 font-mono text-[11px] text-muted-foreground sm:grid-cols-2">
                                <span>
                                  <span className="text-muted-foreground/60">
                                    From:{" "}
                                  </span>
                                  {m.name} ·{" "}
                                  <a
                                    href={`mailto:${m.email}`}
                                    className="text-brand hover:underline"
                                  >
                                    {m.email}
                                  </a>
                                </span>
                                <span>
                                  <span className="text-muted-foreground/60">
                                    Received:{" "}
                                  </span>
                                  {new Date(m.createdAt).toLocaleString("en-US", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                  })}
                                </span>
                                {m.projectType && (
                                  <span className="flex items-center gap-2">
                                    <span className="text-muted-foreground/60">
                                      Type:{" "}
                                    </span>
                                    <TypeChip type={m.projectType} />
                                  </span>
                                )}
                              </div>
                              {m.subject && (
                                <div className="text-sm font-semibold text-foreground">
                                  {m.subject}
                                </div>
                              )}
                              <p className="whitespace-pre-line text-sm text-foreground/85">
                                {m.body}
                              </p>
                              <div className="flex items-center gap-2 pt-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleRead(m)}
                                  className="h-8 rounded-full text-muted-foreground hover:text-brand"
                                >
                                  {m.read ? (
                                    <>
                                      <Mail className="mr-1.5 h-3.5 w-3.5" />
                                      Mark unread
                                    </>
                                  ) : (
                                    <>
                                      <MailOpen className="mr-1.5 h-3.5 w-3.5" />
                                      Mark read
                                    </>
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onDelete(m)}
                                  className="h-8 rounded-full text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
