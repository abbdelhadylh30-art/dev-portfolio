/**
 * LandingForge v4.0 — Lucide icon resolver
 * ----------------------------------------
 * Section configs reference icons by name (string). We resolve them
 * to Lucide components here so configs stay JSON-serializable.
 */

import {
  Rocket,
  Palette,
  Code,
  LineChart,
  ShieldCheck,
  Sparkles,
  Activity,
  GitBranch,
  Gauge,
  Bell,
  Workflow,
  Compass,
  PenTool,
  Layout,
  Clapperboard,
  Megaphone,
  Package,
  Recycle,
  Shield,
  Zap,
  Lock,
  Feather,
  Droplets,
  Link,
  BrainCircuit,
  FileText,
  Star,
  Check,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

const REGISTRY: Record<string, LucideIcon> = {
  Rocket,
  Palette,
  Code,
  LineChart,
  ShieldCheck,
  Sparkles,
  Activity,
  GitBranch,
  Gauge,
  Bell,
  Workflow,
  Compass,
  PenTool,
  Layout,
  Clapperboard,
  Megaphone,
  Package,
  Recycle,
  Shield,
  Zap,
  Lock,
  Feather,
  Droplets,
  Link,
  BrainCircuit,
  FileText,
  Star,
  Check,
  ArrowRight,
};

export function resolveIcon(name: string | undefined): LucideIcon {
  if (!name) return Sparkles;
  return REGISTRY[name] ?? Sparkles;
}
