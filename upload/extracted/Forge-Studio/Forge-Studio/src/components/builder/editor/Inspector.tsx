"use client";

import { useBuilder, useSelectedSection } from "@/lib/builder/store/builder-store";
import { getSectionType } from "@/lib/builder/sections/registry";
import type { FieldSchema } from "@/lib/builder/sections/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, ChevronUp, ChevronDown, Copy, Trash, Sparkles } from "lucide-react";
import { useState } from "react";

export function BuilderInspector() {
  const section = useSelectedSection();
  const { selectedSectionId, duplicateSection, removeSection, moveSection, currentPageId, site } = useBuilder();
  const page = useBuilder((s) => s.site.pages.find((p) => p.id === (s.currentPageId || s.site.pages[0]?.id)));
  if (!section) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100">
          <Sparkles className="h-5 w-5 text-slate-400" />
        </div>
        <p className="text-sm font-medium">No section selected</p>
        <p className="text-xs text-slate-500">Click a section in the canvas to edit its content and style.</p>
      </div>
    );
  }
  const type = getSectionType(section.kind);
  const idx = page?.sections.findIndex((s) => s.id === section.id) ?? -1;
  const total = page?.sections.length ?? 0;
  return (
    <div className="flex h-full flex-col bg-white text-slate-900">
      <div className="flex items-center justify-between border-b p-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{type.category}</div>
          <div className="text-sm font-semibold">{type.label}</div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => idx > 0 && moveSection(idx, idx - 1)} disabled={idx <= 0} title="Move up"><ChevronUp className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => idx < total - 1 && moveSection(idx, idx + 1)} disabled={idx >= total - 1} title="Move down"><ChevronDown className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => selectedSectionId && duplicateSection(selectedSectionId)} title="Duplicate"><Copy className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => selectedSectionId && removeSection(selectedSectionId)} title="Delete"><Trash className="h-4 w-4" /></Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {type.schema.map((field) => <FieldEditor key={field.key} field={field} sectionId={section.id} />)}
        </div>
      </ScrollArea>
    </div>
  );
}

function FieldEditor({ field, sectionId }: { field: FieldSchema; sectionId: string }) {
  const value = useBuilder((s) => {
    const pageId = s.currentPageId || s.site.pages[0]?.id;
    const page = s.site.pages.find((p) => p.id === pageId);
    const sec = page?.sections.find((x) => x.id === sectionId);
    return sec?.config?.[field.key];
  });
  const update = useBuilder((s) => s.updateSectionConfig);
  if (field.type === "list") return <ListFieldEditor field={field} sectionId={sectionId} />;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={`${sectionId}-${field.key}`} className="text-xs font-medium">{field.label}{field.aiSuggest && <AIBadge />}</Label>
      {renderField(field, value, (v) => update(sectionId, { [field.key]: v }))}
    </div>
  );
}

function renderField(field: FieldSchema, value: any, onChange: (v: any) => void) {
  switch (field.type) {
    case "text":
      return (
        <div className="flex gap-1">
          <Input id={field.key} value={value ?? ""} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} className="h-8 text-sm" />
          {field.aiSuggest && <AISuggestButton fieldKey={field.key} current={value ?? ""} onSuggest={onChange} />}
        </div>
      );
    case "textarea":
      return (
        <div className="flex flex-col gap-1">
          <Textarea value={value ?? ""} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} rows={3} className="text-sm" />
          {field.aiSuggest && <AISuggestButton fieldKey={field.key} current={value ?? ""} onSuggest={onChange} />}
        </div>
      );
    case "color":
      return (
        <div className="flex items-center gap-2">
          <input type="color" value={value ?? "#000000"} onChange={(e) => onChange(e.target.value)} className="h-8 w-8 cursor-pointer rounded border" />
          <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="h-8 text-sm" />
        </div>
      );
    case "number":
      return <Input type="number" value={value ?? 0} min={field.min} max={field.max} step={field.step} onChange={(e) => onChange(Number(e.target.value))} className="h-8 text-sm" />;
    case "boolean":
      return <Switch checked={!!value} onCheckedChange={onChange} />;
    case "select":
      return (
        <Select value={String(value ?? "")} onValueChange={onChange}>
          <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
          <SelectContent>{field.options?.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
        </Select>
      );
    case "image":
      return <Input value={value ?? ""} placeholder="https://…" onChange={(e) => onChange(e.target.value)} className="h-8 text-sm" />;
    default: return null;
  }
}

function ListFieldEditor({ field, sectionId }: { field: FieldSchema; sectionId: string }) {
  const value = useBuilder((s) => {
    const pageId = s.currentPageId || s.site.pages[0]?.id;
    const page = s.site.pages.find((p) => p.id === pageId);
    const sec = page?.sections.find((x) => x.id === sectionId);
    return (sec?.config?.[field.key] as any[]) ?? [];
  });
  const update = useBuilder((s) => s.updateSectionConfig);
  const items = Array.isArray(value) ? value : [];
  const maxItems = field.maxItems ?? 20;
  const updateItem = (idx: number, key: string, v: any) => update(sectionId, { [field.key]: items.map((it, i) => (i === idx ? { ...it, [key]: v } : it)) });
  const addItem = () => {
    const newItem: Record<string, any> = {};
    field.itemSchema?.forEach((f) => { newItem[f.key] = f.type === "boolean" ? false : f.type === "list" ? [] : ""; });
    update(sectionId, { [field.key]: [...items, newItem] });
  };
  const removeItem = (idx: number) => update(sectionId, { [field.key]: items.filter((_, i) => i !== idx) });
  const moveItem = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items]; [next[idx], next[target]] = [next[target], next[idx]];
    update(sectionId, { [field.key]: next });
  };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">{field.label}</Label>
        <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={addItem} disabled={items.length >= maxItems}><Plus className="mr-1 h-3 w-3" /> Add</Button>
      </div>
      <Separator />
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="space-y-2 rounded-md border bg-slate-50 p-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Item {idx + 1}</span>
              <div className="flex gap-0.5">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveItem(idx, -1)} disabled={idx === 0}><ChevronUp className="h-3 w-3" /></Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveItem(idx, 1)} disabled={idx === items.length - 1}><ChevronDown className="h-3 w-3" /></Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => removeItem(idx)}><Trash2 className="h-3 w-3" /></Button>
              </div>
            </div>
            <div className="space-y-2">
              {field.itemSchema?.map((sub) => (
                <div key={sub.key} className="space-y-1">
                  <Label className="text-[10px] uppercase tracking-wider text-slate-500">{sub.label}{sub.aiSuggest && <AIBadge />}</Label>
                  {sub.type === "list" ? <ListFieldEditor field={sub} sectionId={`${sectionId}.${field.key}.${idx}`} /> : renderField(sub, item[sub.key], (v) => updateItem(idx, sub.key, v))}
                </div>
              ))}
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="py-2 text-center text-xs text-slate-400">No items yet.</p>}
      </div>
    </div>
  );
}

function AIBadge() {
  return <span className="ml-1.5 inline-flex items-center gap-0.5 rounded bg-violet-100 px-1 py-px text-[9px] font-semibold uppercase text-violet-600"><Sparkles className="h-2.5 w-2.5" /> AI</span>;
}

function AISuggestButton({ fieldKey, current, onSuggest }: { fieldKey: string; current: string; onSuggest: (s: string) => void }) {
  const [loading, setLoading] = useState(false);
  const siteName = useBuilder((s) => s.site.name);
  const suggest = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-copy", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: fieldKey === "headline" ? "headline" : fieldKey === "subhead" || fieldKey === "subtitle" ? "subhead" : fieldKey === "eyebrow" ? "eyebrow" : fieldKey === "question" ? "faq_question" : fieldKey === "answer" ? "faq_answer" : fieldKey === "quote" ? "testimonial" : "headline", current, context: { siteName } }) });
      if (!res.ok) throw new Error("AI request failed");
      const data = await res.json();
      if (data.text) onSuggest(data.text);
    } catch { /* fall back silently */ } finally { setLoading(false); }
  };
  return (
    <Button type="button" variant="outline" size="sm" className="h-8 shrink-0 px-2 text-xs" onClick={suggest} disabled={loading}>
      <Sparkles className={`mr-1 h-3 w-3 ${loading ? "animate-pulse" : ""}`} />{loading ? "..." : "Suggest"}
    </Button>
  );
}
