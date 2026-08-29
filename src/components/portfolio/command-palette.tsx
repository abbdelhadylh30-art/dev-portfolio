"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
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
  Moon,
  Sun,
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
  navLinks,
  projects,
  projectFilters,
  profile,
} from "@/lib/portfolio-data";
import { trackEvent } from "@/lib/analytics";

export function CommandPalette() {
  const open = useUIStore((s) => s.paletteOpen);
  const setOpen = useUIStore((s) => s.openPalette);
  const close = useUIStore((s) => s.closePalette);
  const openModal = useUIStore((s) => s.openModal);
  const openShortcuts = useUIStore((s) => s.openShortcuts);
  const openAdmin = useUIStore((s) => s.openAdmin);
  const { theme, setTheme, resolvedTheme } = useTheme();

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

  const scrollTo = (href: string) => {
    close();
    // wait a tick for the dialog close animation
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) (el as HTMLElement).scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  const openProject = (slug: string) => {
    close();
    setTimeout(() => {
      trackEvent("project_modal_open", { slug, label: slug });
      openModal(slug);
    }, 80);
  };

  const toggleTheme = () => {
    const isDark = (resolvedTheme ?? theme) === "dark";
    const next = isDark ? "light" : "dark";
    setTheme(next);
    trackEvent("theme_toggle", { label: next });
    close();
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

        <CommandGroup heading="Navigate">
          <CommandItem
            onSelect={() => scrollTo("#top")}
            className="cursor-pointer"
          >
            <ArrowUp className="mr-2 h-4 w-4 text-brand" />
            Back to top
          </CommandItem>
          {navLinks.map((l) => (
            <CommandItem
              key={l.href}
              onSelect={() => scrollTo(l.href)}
              className="cursor-pointer"
            >
              <Layout className="mr-2 h-4 w-4 text-brand" />
              Go to {l.label}
            </CommandItem>
          ))}
          <CommandItem onSelect={toggleTheme} className="cursor-pointer">
            {(resolvedTheme ?? theme) === "dark" ? (
              <Sun className="mr-2 h-4 w-4 text-brand" />
            ) : (
              <Moon className="mr-2 h-4 w-4 text-brand" />
            )}
            Toggle theme
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
              onSelect={() => {
                close();
                setTimeout(() => {
                  const el = document.getElementById("work");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 80);
              }}
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
