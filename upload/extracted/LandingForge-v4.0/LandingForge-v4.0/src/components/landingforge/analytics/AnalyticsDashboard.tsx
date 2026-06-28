"use client";

import { useMemo } from "react";
import { useEditor } from "@/lib/store/editor-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointerClick,
  Target,
  Users,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#ef4444"];

interface AnalyticsData {
  summary: { label: string; value: string; change: number; icon: any; color: string }[];
  timeseries: { date: string; views: number; visitors: number; conversions: number }[];
  bySection: { name: string; views: number; conversions: number }[];
  bySource: { name: string; value: number }[];
  funnel: { stage: string; value: number }[];
}

function generate(seed: string): AnalyticsData {
  // Deterministic pseudo-random based on seed
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  const rng = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
  const days = 30;
  const timeseries = Array.from({ length: days }, (_, i) => {
    const trend = 1 + i * 0.04;
    const noise = 0.7 + rng() * 0.6;
    const views = Math.floor(800 * trend * noise);
    return {
      date: `Day ${i + 1}`,
      views,
      visitors: Math.floor(views * (0.55 + rng() * 0.15)),
      conversions: Math.floor(views * (0.02 + rng() * 0.025)),
    };
  });

  const totalViews = timeseries.reduce((a, b) => a + b.views, 0);
  const totalConv = timeseries.reduce((a, b) => a + b.conversions, 0);
  const totalVisitors = timeseries.reduce((a, b) => a + b.visitors, 0);

  return {
    summary: [
      { label: "Page views", value: totalViews.toLocaleString(), change: 24.3, icon: Eye, color: "text-blue-500" },
      { label: "Unique visitors", value: totalVisitors.toLocaleString(), change: 18.1, icon: Users, color: "text-purple-500" },
      { label: "Conversions", value: totalConv.toLocaleString(), change: 12.7, icon: Target, color: "text-green-500" },
      { label: "Conversion rate", value: `${((totalConv / totalViews) * 100).toFixed(2)}%`, change: -1.4, icon: MousePointerClick, color: "text-amber-500" },
    ],
    timeseries,
    bySection: [
      { name: "Hero", views: Math.floor(totalViews * 0.95), conversions: Math.floor(totalConv * 0.4) },
      { name: "Features", views: Math.floor(totalViews * 0.7), conversions: Math.floor(totalConv * 0.2) },
      { name: "Pricing", views: Math.floor(totalViews * 0.55), conversions: Math.floor(totalConv * 0.3) },
      { name: "Testimonials", views: Math.floor(totalViews * 0.4), conversions: Math.floor(totalConv * 0.05) },
      { name: "FAQ", views: Math.floor(totalViews * 0.25), conversions: Math.floor(totalConv * 0.05) },
    ],
    bySource: [
      { name: "Direct", value: 35 },
      { name: "Organic search", value: 28 },
      { name: "Social", value: 18 },
      { name: "Referral", value: 12 },
      { name: "Email", value: 7 },
    ],
    funnel: [
      { stage: "Visited", value: totalVisitors },
      { stage: "Scrolled", value: Math.floor(totalVisitors * 0.7) },
      { stage: "Saw pricing", value: Math.floor(totalVisitors * 0.45) },
      { stage: "Clicked CTA", value: Math.floor(totalVisitors * 0.18) },
      { stage: "Converted", value: totalConv },
    ],
  };
}

export function AnalyticsDashboard() {
  const { site, setView } = useEditor();
  const data = useMemo(() => generate(site.id + site.name), [site.id, site.name]);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setView("dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Analytics — {site.name}</h1>
              <p className="text-xs text-muted-foreground">Last 30 days • Simulated data</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Live
          </Badge>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {data.summary.map((s) => {
            const Icon = s.icon;
            const up = s.change >= 0;
            return (
              <Card key={s.label} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                    <div className="mt-1 text-2xl font-bold tracking-tight">{s.value}</div>
                  </div>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  {up ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={up ? "text-green-600" : "text-red-600"}>
                    {up ? "+" : ""}{s.change}%
                  </span>
                  <span className="text-muted-foreground">vs prev period</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Traffic chart */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Traffic over time</h2>
              <p className="text-xs text-muted-foreground">Views vs visitors vs conversions</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.timeseries}>
              <defs>
                <linearGradient id="cViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="cVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="cConv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={5} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="views" stroke="#0ea5e9" fill="url(#cViews)" strokeWidth={2} />
              <Area type="monotone" dataKey="visitors" stroke="#8b5cf6" fill="url(#cVisitors)" strokeWidth={2} />
              <Area type="monotone" dataKey="conversions" stroke="#10b981" fill="url(#cConv)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Two-column: section performance + sources */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-5">
            <div className="mb-4">
              <h2 className="text-sm font-semibold">Section performance</h2>
              <p className="text-xs text-muted-foreground">Views and conversions per section</p>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.bySection} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={80} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="views" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
                <Bar dataKey="conversions" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5">
            <div className="mb-4">
              <h2 className="text-sm font-semibold">Traffic sources</h2>
              <p className="text-xs text-muted-foreground">Where your visitors came from</p>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={data.bySource}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={2}
                >
                  {data.bySource.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => `${v}%`} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Funnel */}
        <Card className="p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">Conversion funnel</h2>
            <p className="text-xs text-muted-foreground">Drop-off through each stage</p>
          </div>
          <div className="space-y-2">
            {data.funnel.map((stage, i) => {
              const max = data.funnel[0].value;
              const widthPct = (stage.value / max) * 100;
              const prev = i > 0 ? data.funnel[i - 1].value : stage.value;
              const dropoff = i > 0 ? ((prev - stage.value) / prev) * 100 : 0;
              return (
                <div key={stage.stage} className="flex items-center gap-4">
                  <div className="w-28 text-right text-xs font-medium">{stage.stage}</div>
                  <div className="relative flex-1">
                    <div
                      className="flex h-9 items-center rounded-md transition-all"
                      style={{
                        width: `${widthPct}%`,
                        background: `linear-gradient(90deg, ${COLORS[i % COLORS.length]}, ${COLORS[i % COLORS.length]}80)`,
                      }}
                    >
                      <span className="px-3 text-xs font-bold text-white">{stage.value.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-16 text-xs text-muted-foreground">
                    {i > 0 && (
                      <span className="text-red-500">−{dropoff.toFixed(1)}%</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Insight banner */}
        <Card className="border-primary/30 bg-primary/5 p-5">
          <div className="flex items-start gap-3">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">Insight</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Your hero is performing well (95% view rate) but only 18% of visitors reach the CTA. Consider moving pricing higher on the page, or adding a mid-page CTA after testimonials.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
