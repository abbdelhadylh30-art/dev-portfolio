"use client";

import { useForge } from "@/lib/forge/store";
import { useBuilder } from "@/lib/builder/store/builder-store";
import { TEMPLATES, buildSiteFromTemplate } from "@/lib/builder/templates/templates";
import { usePFStore } from "@/lib/pixelforge/store/pf-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, ShieldCheck, Sparkles, Layout, Search, ArrowRight, Wand2, Megaphone, type LucideIcon } from "lucide-react";

export function ForgeDashboard() {
  const { setView, transferToAuditor } = useForge();
  const { loadSite, newBlankSite, exportHTML, site: builderSite } = useBuilder();
  const { setHTML: setAuditorHTML, projectName: auditorProjectName } = usePFStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 text-slate-900">
      {/* Top bar */}
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight">Forge Studio</div>
              <div className="text-[11px] text-slate-500">Build. Audit. Ship.</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setView("builder")} className="gap-1.5">
              <Layout className="h-4 w-4" /> Open Builder
            </Button>
            <Button variant="outline" onClick={() => setView("auditor")} className="gap-1.5">
              <ShieldCheck className="h-4 w-4" /> Open Auditor
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            The all-in-one <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">landing page studio</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
            Build pages with a drag-and-drop editor, audit them across 5 quality categories, apply one-click fixes, and export clean HTML — all in one place.
          </p>
        </div>

        {/* Two big tool cards */}
        <div className="mb-12 grid gap-6 md:grid-cols-2">
          <ToolCard
            icon={Layout}
            title="Page Builder"
            tagline="Drag-drop editor with 12 section types, 5 templates, 7 themes, multi-page, HTML/ZIP export."
            accent="from-violet-500 to-fuchsia-500"
            onPrimary={() => { newBlankSite("Untitled page"); setView("builder"); }}
            onSecondary={() => setView("templates")}
            primaryLabel="Start blank page"
            secondaryLabel="Browse templates"
          />
          <ToolCard
            icon={ShieldCheck}
            title="Page Auditor"
            tagline="Import any HTML or URL. Get a 0-100 score across SEO, A11y, Content, Structure, Performance. 38 one-click fixes."
            accent="from-cyan-500 to-blue-600"
            onPrimary={() => setView("auditor")}
            onSecondary={() => transferToAuditor(exportHTML(), builderSite.name)}
            primaryLabel="Open auditor"
            secondaryLabel="Audit current builder page"
          />
        </div>

        {/* Quick stats */}
        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Section types" value="12" icon={Layout} color="text-violet-500" />
          <StatCard label="Audit checks" value="30+" icon={ShieldCheck} color="text-cyan-500" />
          <StatCard label="Quick-fixes" value="38" icon={Wand2} color="text-emerald-500" />
          <StatCard label="Templates" value="5" icon={Megaphone} color="text-amber-500" />
        </div>

        {/* Template quick-start */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Quick start with a template</h2>
            <Button variant="ghost" size="sm" onClick={() => setView("templates")}>See all →</Button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card
              className="cursor-pointer border-dashed p-6 transition-all hover:border-violet-400 hover:shadow-md"
              onClick={() => { newBlankSite("Untitled page"); setView("builder"); }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100"><Plus className="h-5 w-5 text-slate-400" /></div>
                <div className="mt-3 font-semibold">Blank page</div>
                <div className="mt-1 text-xs text-slate-500">Start from scratch</div>
              </div>
            </Card>
            {TEMPLATES.slice(0, 5).map((tpl) => (
              <Card
                key={tpl.slug}
                className="group cursor-pointer overflow-hidden transition-all hover:shadow-md"
                onClick={() => { loadSite(buildSiteFromTemplate(tpl)); setView("builder"); }}
              >
                <div className="aspect-[16/10] w-full" style={{ background: `linear-gradient(135deg, ${tpl.theme.primary}, ${tpl.theme.accent})` }}>
                  <div className="flex h-full items-center justify-center text-white">
                    <Layout className="h-8 w-8 opacity-50" />
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-sm font-semibold">{tpl.name}</div>
                  <div className="mt-0.5 line-clamp-2 text-[11px] text-slate-500">{tpl.description}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Workflow explainer */}
        <div className="mt-16 rounded-2xl border bg-white p-8">
          <h2 className="mb-6 text-center text-lg font-semibold">How the two tools work together</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <WorkflowStep num={1} title="Build" desc="Drag sections into the canvas, edit content inline, apply a theme preset, switch device widths." icon={Layout} />
            <WorkflowStep num={2} title="Audit" desc="Click 'Audit this page' in the builder. The auditor opens with your HTML pre-loaded and scored." icon={ShieldCheck} />
            <WorkflowStep num={3} title="Fix & ship" desc="Apply one-click fixes, then export the improved HTML. Or send the audited page back to the builder for further editing." icon={Sparkles} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolCard({ icon: Icon, title, tagline, accent, onPrimary, onSecondary, primaryLabel, secondaryLabel }: {
  icon: LucideIcon; title: string; tagline: string; accent: string;
  onPrimary: () => void; onSecondary: () => void; primaryLabel: string; secondaryLabel: string;
}) {
  return (
    <Card className="overflow-hidden">
      <div className={`h-2 bg-gradient-to-r ${accent}`} />
      <div className="p-6">
        <div className={`mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${accent} text-white shadow-sm`}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold tracking-tight">{title}</h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{tagline}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={onPrimary} className="gap-1.5">
            {primaryLabel} <ArrowRight className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" onClick={onSecondary}>{secondaryLabel}</Button>
        </div>
      </div>
    </Card>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: LucideIcon; color: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-slate-500">{label}</div>
          <div className="mt-1 text-2xl font-bold">{value}</div>
        </div>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
    </Card>
  );
}

function WorkflowStep({ num, title, desc, icon: Icon }: { num: number; title: string; desc: string; icon: LucideIcon }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-600">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-xs font-bold uppercase tracking-wider text-violet-500">Step {num}</div>
      <h4 className="mt-1 text-base font-semibold">{title}</h4>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}
