"use client";

import { useState } from "react";
import { useEditor } from "@/lib/store/editor-store";
import { TEMPLATES, buildSiteFromTemplate } from "@/lib/templates/templates";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Sparkles, Eye } from "lucide-react";

const CATEGORIES = ["all", "saas", "portfolio", "agency", "ecommerce", "startup"] as const;

export function TemplatesGallery() {
  const { setView, loadSite } = useEditor();
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("all");
  const [query, setQuery] = useState("");

  const filtered = TEMPLATES.filter((t) => {
    if (filter !== "all" && t.category !== filter) return false;
    if (query && !t.name.toLowerCase().includes(query.toLowerCase()) && !t.description.toLowerCase().includes(query.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setView("dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Templates</h1>
              <p className="text-xs text-muted-foreground">
                {filtered.length} of {TEMPLATES.length} templates
              </p>
            </div>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates…"
              className="h-9 pl-8 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Category filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Button
              key={c}
              variant={filter === c ? "default" : "outline"}
              size="sm"
              className="capitalize"
              onClick={() => setFilter(c)}
            >
              {c}
            </Button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tpl) => (
            <Card key={tpl.slug} className="group overflow-hidden transition-all hover:shadow-lg">
              {/* Preview thumbnail */}
              <div
                className="relative aspect-[16/10] overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${tpl.theme.primary}, ${tpl.theme.accent})`,
                }}
              >
                <div className="absolute inset-0 flex flex-col p-4 text-white">
                  <div className="flex items-center gap-2">
                    <div className="grid h-5 w-5 place-items-center rounded bg-white/20 text-[10px] font-bold">
                      {tpl.name[0]}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider opacity-90">
                      {tpl.name.split(" ")[0]}
                    </span>
                  </div>
                  <div className="mt-auto">
                    <div className="text-base font-bold leading-tight">
                      {tpl.buildPages()[0]?.sections.find((s) => s.kind === "hero")?.config?.headline ?? tpl.name}
                    </div>
                  </div>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    size="sm"
                    onClick={() => {
                      loadSite(buildSiteFromTemplate(tpl));
                      setView("editor");
                    }}
                  >
                    <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Use template
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{tpl.name}</div>
                  <Badge variant="secondary" className="text-[10px] capitalize">
                    {tpl.category}
                  </Badge>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {tpl.description}
                </p>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Theme:</span>
                  <div className="flex gap-0.5">
                    <span
                      className="h-3 w-3 rounded-full border"
                      style={{ background: tpl.theme.primary, borderColor: "rgba(0,0,0,0.1)" }}
                    />
                    <span
                      className="h-3 w-3 rounded-full border"
                      style={{ background: tpl.theme.accent, borderColor: "rgba(0,0,0,0.1)" }}
                    />
                    <span
                      className="h-3 w-3 rounded-full border"
                      style={{ background: tpl.theme.background, borderColor: "rgba(0,0,0,0.1)" }}
                    />
                  </div>
                  <span className="ml-2 text-[10px] text-muted-foreground">
                    {tpl.buildPages().length} page{tpl.buildPages().length > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="grid place-items-center py-20 text-center">
            <div>
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-muted">
                <Eye className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">No templates match your search</p>
              <p className="mt-1 text-xs text-muted-foreground">Try a different keyword or category.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
