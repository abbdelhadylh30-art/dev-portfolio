"use client";

import { useEditor } from "@/lib/store/editor-store";
import { TEMPLATES } from "@/lib/templates/templates";
import { buildSiteFromTemplate } from "@/lib/templates/templates";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, FileText, Layout, BarChart3, Sparkles, Download } from "lucide-react";

export function Dashboard() {
  const { site, setView, loadSite, newBlankSite } = useEditor();

  const stats = [
    {
      label: "Pages",
      value: site.pages.length,
      icon: FileText,
      color: "text-blue-500",
    },
    {
      label: "Sections",
      value: site.pages.reduce((sum, p) => sum + p.sections.length, 0),
      icon: Layout,
      color: "text-purple-500",
    },
    {
      label: "Theme",
      value: "Custom",
      icon: Sparkles,
      color: "text-amber-500",
    },
    {
      label: "Status",
      value: "Draft",
      icon: BarChart3,
      color: "text-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">LandingForge</div>
              <div className="text-[11px] text-muted-foreground">v4.0 — Dashboard</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setView("templates")}>
              <Layout className="mr-1.5 h-4 w-4" /> Templates
            </Button>
            <Button onClick={() => setView("editor")}>
              <Plus className="mr-1.5 h-4 w-4" /> Open editor
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Build, ship, and iterate on landing pages — without code.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.label} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                    <div className="mt-1 text-2xl font-bold">{s.value}</div>
                  </div>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Current site */}
        <div className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Current site</h2>
            <Button variant="ghost" size="sm" onClick={() => setView("editor")}>
              Open editor →
            </Button>
          </div>
          <Card className="overflow-hidden">
            <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className="grid h-12 w-12 place-items-center rounded-lg font-bold"
                  style={{ background: site.themeTokens.primary, color: site.themeTokens.primaryFg }}
                >
                  {site.name?.[0]?.toUpperCase() ?? "S"}
                </div>
                <div>
                  <div className="text-base font-semibold">{site.name}</div>
                  <div className="mt-0.5 text-sm text-muted-foreground">
                    {site.pages.length} pages • {site.pages.reduce((s, p) => s + p.sections.length, 0)} sections
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setView("preview")}>
                  Preview
                </Button>
                <Button variant="outline" size="sm" onClick={() => setView("analytics")}>
                  Analytics
                </Button>
                <Button size="sm" onClick={() => setView("editor")}>
                  Edit
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick start */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Quick start</h2>
            <Button variant="ghost" size="sm" onClick={() => setView("templates")}>
              See all templates →
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card
              className="cursor-pointer border-dashed p-6 transition-all hover:border-primary hover:shadow-md"
              onClick={() => {
                newBlankSite("Untitled site");
                setView("editor");
              }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-muted">
                  <Plus className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="mt-3 font-semibold">Blank site</div>
                <div className="mt-1 text-xs text-muted-foreground">Start from scratch</div>
              </div>
            </Card>
            {TEMPLATES.slice(0, 5).map((tpl) => (
              <Card
                key={tpl.slug}
                className="group cursor-pointer overflow-hidden transition-all hover:shadow-md"
                onClick={() => {
                  loadSite(buildSiteFromTemplate(tpl));
                  setView("editor");
                }}
              >
                <div
                  className="aspect-[16/10] w-full"
                  style={{
                    background: `linear-gradient(135deg, ${tpl.theme.primary}, ${tpl.theme.accent})`,
                  }}
                >
                  <div className="flex h-full items-center justify-center text-white">
                    <Layout className="h-8 w-8 opacity-50" />
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-sm font-semibold">{tpl.name}</div>
                  <div className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
                    {tpl.description}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
