/**
 * LandingForge v4.0 — Section renderer
 * ------------------------------------
 * Resolves a SectionInstance to its React component, scoped with theme CSS vars.
 * In editor mode, wraps the section with click-to-select + hover affordances.
 */

"use client";

import { useCallback, type CSSProperties } from "react";
import * as Icons from "lucide-react";
import type { SectionInstance, ThemeTokens } from "@/lib/sections/types";
import { themeToInlineStyle } from "@/lib/sections/theme-utils";
import { NavbarSection } from "./Navbar";
import { HeroSection } from "./Hero";
import { LogoCloudSection } from "./LogoCloud";
import { FeaturesSection } from "./Features";
import { StatsSection } from "./Stats";
import { GallerySection } from "./Gallery";
import { TestimonialsSection } from "./Testimonials";
import { PricingSection } from "./Pricing";
import { FaqSection } from "./Faq";
import { CtaSection } from "./Cta";
import { NewsletterSection } from "./Newsletter";
import { FooterSection } from "./Footer";

export interface SectionRendererProps {
  section: SectionInstance;
  theme: ThemeTokens;
  /** Editor mode: clicking selects, hover shows controls */
  editable?: boolean;
  selected?: boolean;
  onSelect?: (id: string) => void;
  /** When editable, hovering shows a label */
  pagePath?: string;
}

export function SectionRenderer({
  section,
  theme,
  editable,
  selected,
  onSelect,
}: SectionRendererProps) {
  const style = themeToInlineStyle(theme) as CSSProperties;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!editable) return;
      e.stopPropagation();
      onSelect?.(section.id);
    },
    [editable, onSelect, section.id]
  );

  const inner = renderInner(section, theme);

  if (!editable) {
    return (
      <div data-lf-section={section.id} style={style} className="lf-section">
        {inner}
      </div>
    );
  }

  return (
    <div
      data-lf-section={section.id}
      style={style}
      onClick={handleClick}
      className={`lf-section relative group transition-all ${selected ? "outline outline-2 -outline-offset-2" : "hover:outline hover:outline-1 hover:-outline-offset-1"}`}
      data-selected={selected ? "1" : "0"}
    >
      {/* Hover label */}
      <div
        className={`absolute left-2 top-2 z-10 flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wider shadow-sm transition-opacity ${
          selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        style={{ background: theme.primary, color: theme.primaryFg }}
      >
        <SectionLabelIcon kind={section.kind} />
        {section.kind}
      </div>
      {inner}
    </div>
  );
}

function renderInner(section: SectionInstance, theme: ThemeTokens) {
  switch (section.kind) {
    case "navbar": return <NavbarSection config={section.config} theme={theme} />;
    case "hero": return <HeroSection config={section.config} theme={theme} />;
    case "logocloud": return <LogoCloudSection config={section.config} theme={theme} />;
    case "features": return <FeaturesSection config={section.config} theme={theme} />;
    case "stats": return <StatsSection config={section.config} theme={theme} />;
    case "gallery": return <GallerySection config={section.config} theme={theme} />;
    case "testimonials": return <TestimonialsSection config={section.config} theme={theme} />;
    case "pricing": return <PricingSection config={section.config} theme={theme} />;
    case "faq": return <FaqSection config={section.config} theme={theme} />;
    case "cta": return <CtaSection config={section.config} theme={theme} />;
    case "newsletter": return <NewsletterSection config={section.config} theme={theme} />;
    case "footer": return <FooterSection config={section.config} theme={theme} />;
    default:
      return (
        <div className="p-8 text-center" style={{ color: theme.mutedFg }}>
          Unknown section: {section.kind}
        </div>
      );
  }
}

function SectionLabelIcon({ kind }: { kind: string }) {
  const Icon = (Icons as any)[iconNameFor(kind)] ?? Icons.Square;
  return <Icon className="h-3 w-3" />;
}

function iconNameFor(kind: string): string {
  switch (kind) {
    case "navbar": return "PanelTop";
    case "hero": return "Sparkles";
    case "logocloud": return "LayoutTemplate";
    case "features": return "Sparkles";
    case "stats": return "Trophy";
    case "gallery": return "Images";
    case "testimonials": return "Star";
    case "pricing": return "Tag";
    case "faq": return "HelpCircle";
    case "cta": return "Megaphone";
    case "newsletter": return "Mail";
    case "footer": return "LayoutTemplate";
    default: return "Square";
  }
}
