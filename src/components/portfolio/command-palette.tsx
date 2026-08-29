"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  ArrowUp,
  Github,
  Mail,
  Briefcase,
  Sparkles,
  Folder,
  Layout,
  Layers,
  Code2,
  Send,
  Keyboard,
  Inbox,
  Rss,
} from "lucide-react";
import { useUIStore } from "@/lib/ui-store";
import {
  projects,
  projectFilters,
  profile,
} from "@/lib/portfolio-data";
import { usePageRouter } from "@/components/portfolio/page-router";
import { trackEvent } from "@/lib/analytics";
import { setModeCookie } from "@/lib/mode";
import { useModeTransform } from "@/lib/mode-transform";
import { TF_COVER_MS } from "@/components/portfolio/mode-transform-overlay";

export function CommandPalette() {
  const open = useUIStore((s) => s.paletteOpen);
  const setOpen = useUIStore((s) => s.openPalette);
  const close = useUIStore((s) => s.closePalette);
  const openModal = useUIStore((s) => s.openModal);
  const openShortcuts = useUIStore((s) => s.openShortcuts);
  const openAdmin = useUIStore((s) => s.openAdmin);
  const { pages, navigate } = usePageRouter();
  const router = useRouter();

  // Global ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        trackEvent("palette_open", { label: "shortcut" });
        setOpen();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setOpen]);

  const goToPage = (id: string) => {
    close();
    // wait a tick for the dialog close animation
    setTimeout(() => navigate(id), 80);
  };

  const openProject = (slug: string) => {
    close();
    setTimeout(() => {
      trackEvent("project_modal_open", { slug, label: slug });
      openModal(slug);
    }, 80);
  };

  /* Skins are fixed per view (Business = light, Developer = dark), so
     the palette's theme entry became a mode shift instead — launching
     the same Transformers sequence as the navbar toggle. */
  const switchMode = () => {
    close();
    useModeTransform.getState().begin("client");
    trackEvent("mode_switch", { label: "client" });
    window.setTimeout(() => {
      if (setModeCookie("client")) router.refresh();
    }, Math.max(200, TF_COVER_MS - 140));
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={(o) => (o ? setOpen() : close())}
      className="max-w-xl"
    >
      <CommandInput placeholder="Search sections, projects, links…" />
      <CommandList className="scroll-area-thin">
        <CommandEmpty>No matches found.</CommandEmpty>

        <CommandGroup heading="Pages">
          <CommandItem
            onSelect={() => goToPage("home")}
            className="cursor-pointer"
          >
            <ArrowUp className="mr-2 h-4 w-4 text-brand" />
            Back to home
          </CommandItem>
          {pages.map((p) => (
            p.id === "home" ? null : (
              <CommandItem
                key={p.id}
                onSelect={() => goToPage(p.id)}
                className="cursor-pointer"
              >
                <Layout className="mr-2 h-4 w-4 text-brand" />
                Go to {p.label}
              </CommandItem>
            )
          ))}
          <CommandItem onSelect={switchMode} className="cursor-pointer">
            <Briefcase className="mr-2 h-4 w-4 text-brand" />
            Switch to Business view
            <span className="ml-auto font-mono text-[10px] text-muted-foreground">
              light skin
            </span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              close();
              setTimeout(() => openShortcuts(), 80);
            }}
            className="cursor-pointer"
          >
            <Keyboard className="mr-2 h-4 w-4 text-brand" />
            Keyboard shortcuts
            <span className="ml-auto font-mono text-[10px] text-muted-foreground">
              <kbd className="rounded bg-muted px-1 py-0.5">?</kbd>
            </span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              close();
              setTimeout(() => openAdmin(), 80);
              trackEvent("admin_open", { label: "palette" });
            }}
            className="cursor-pointer"
          >
            <Inbox className="mr-2 h-4 w-4 text-brand" />
            Admin inbox
            <span className="ml-auto font-mono text-[10px] text-muted-foreground">
              <kbd className="rounded bg-muted px-1 py-0.5">?admin=1</kbd>
            </span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={`Projects · ${projects.length}`}>
          {projects.map((p) => (
            <CommandItem
              key={p.slug}
              onSelect={() => openProject(p.slug)}
              className="cursor-pointer"
            >
              <Folder className="mr-2 h-4 w-4 text-brand" />
              <span className="flex-1">{p.name}</span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {p.category}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Filter work by">
          {projectFilters.map((f) => (
            <CommandItem
              key={f}
              onSelect={() => goToPage("work")}
              className="cursor-pointer"
            >
              <Layers className="mr-2 h-4 w-4 text-brand" />
              Show {f} projects
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="External">
          <CommandItem
            onSelect={() => {
              close();
              window.open(profile.githubUrl, "_blank", "noreferrer noopener");
            }}
            className="cursor-pointer"
          >
            <Github className="mr-2 h-4 w-4 text-brand" />
            GitHub profile · @{profile.githubUsername}
          </CommandItem>
          <CommandItem
            onSelect={() => {
              close();
              window.location.href = `mailto:${profile.email}`;
            }}
            className="cursor-pointer"
          >
            <Mail className="mr-2 h-4 w-4 text-brand" />
            Email · {profile.email}
          </CommandItem>
          <CommandItem
            onSelect={() => {
              close();
              window.open(
                "https://nextjs.org/docs/app",
                "_blank",
                "noreferrer noopener"
              );
            }}
            className="cursor-pointer"
          >
            <Code2 className="mr-2 h-4 w-4 text-brand" />
            Next.js 16 docs
          </CommandItem>
          <CommandItem
            onSelect={() => {
              close();
              window.open("/api/feed", "_blank", "noreferrer noopener");
            }}
            className="cursor-pointer"
          >
            <Rss className="mr-2 h-4 w-4 text-brand" />
            Subscribe · Atom feed
            <span className="ml-auto font-mono text-[10px] text-muted-foreground">
              /api/feed
            </span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />
        <CommandGroup heading="Tips">
          <CommandItem disabled>
            <Sparkles className="mr-2 h-4 w-4 text-muted-foreground" />
            Press <kbd className="mx-1 rounded bg-muted px-1 font-mono text-[10px]">⌘K</kbd>
            anywhere to open this palette
          </CommandItem>
          <CommandItem disabled>
            <Send className="mr-2 h-4 w-4 text-muted-foreground" />
            Click any project card for a full detail view
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
