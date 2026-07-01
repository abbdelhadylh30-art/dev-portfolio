"use client";

import { useEffect, useRef } from "react";
import { useEditor } from "@/lib/store/editor-store";
import { EditorShell } from "@/components/landingforge/editor/EditorShell";
import { Dashboard } from "@/components/landingforge/dashboard/Dashboard";
import { TemplatesGallery } from "@/components/landingforge/templates/TemplatesGallery";
import { AnalyticsDashboard } from "@/components/landingforge/analytics/AnalyticsDashboard";
import { Preview } from "@/components/landingforge/preview/Preview";
import { buildSiteFromTemplate, TEMPLATES } from "@/lib/templates/templates";
import { Toaster as SonnerToaster } from "sonner";

export default function Home() {
  const view = useEditor((s) => s.view);
  const site = useEditor((s) => s.site);
  const loadSite = useEditor((s) => s.loadSite);
  const didInit = useRef(false);

  // On first mount: load the SaaS template so the user sees a fully-populated
  // editor instead of an empty page. They can swap from the dashboard later.
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    const saas = TEMPLATES[0];
    if (saas) {
      loadSite(buildSiteFromTemplate(saas));
    }
  }, [loadSite]);

  return (
    <>
      {view === "dashboard" && <Dashboard />}
      {view === "editor" && <EditorShell />}
      {view === "templates" && <TemplatesGallery />}
      {view === "preview" && <Preview />}
      {view === "analytics" && <AnalyticsDashboard />}
      <SonnerToaster richColors position="bottom-right" />
    </>
  );
}
