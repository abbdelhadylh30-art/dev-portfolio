"use client";

import { SECTION_TYPES } from "@/lib/sections/registry";
import type { SectionKind } from "@/lib/sections/types";
import { useEditor } from "@/lib/store/editor-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { LayoutTemplate, Sparkles, Images, Star, type LucideIcon } from "lucide-react";

const CATEGORY_LABELS: Record<string, { label: string; icon: LucideIcon }> = {
  structure: { label: "Structure", icon: LayoutTemplate },
  conversion: { label: "Conversion", icon: Sparkles },
  social: { label: "Social proof", icon: Star },
  media: { label: "Media", icon: Images },
};

export function SectionLibrary() {
  const addSection = useEditor((s) => s.addSection);
  const categories = Object.keys(CATEGORY_LABELS);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Section library
        </div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">
          Click to add to the current page
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-3">
          {categories.map((cat) => {
            const types = SECTION_TYPES.filter((t) => t.category === cat);
            if (types.length === 0) return null;
            const CatIcon = CATEGORY_LABELS[cat].icon;
            return (
              <div key={cat}>
                <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <CatIcon className="h-3 w-3" />
                  {CATEGORY_LABELS[cat].label}
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {types.map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.kind}
                        type="button"
                        onClick={() => addSection(t.kind as SectionKind)}
                        className={cn(
                          "group flex items-start gap-2 rounded-md border border-border bg-card p-2 text-left transition-all",
                          "hover:border-accent hover:shadow-sm active:scale-[0.98]"
                        )}
                      >
                        <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground">
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold">{t.label}</div>
                          <div className="line-clamp-2 text-[10px] text-muted-foreground">
                            {t.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
