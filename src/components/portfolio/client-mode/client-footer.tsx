"use client";

import { Phone, Mail, ArrowUp, MessageCircle } from "lucide-react";
import { profile } from "@/lib/portfolio-data";
import { usePrefs } from "@/lib/i18n/language";
import { trackEvent } from "@/lib/analytics";

/**
 * Business-view footer — contact essentials and a warm close.
 * No RSS/GitHub-source/repo-synced chrome; that lives in the dev footer.
 */
export function ClientFooter() {
  const { t } = usePrefs();
  return (
    <footer className="mt-auto border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="grad-badge grid h-9 w-9 place-items-center rounded-lg text-sm font-bold">
              AG
            </span>
            <div>
              <div className="text-sm font-semibold text-foreground">{t.ownerName}</div>
              <div className="text-[11px] text-muted-foreground">{t.footer.nameRole}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <a
              href={profile.whatsappUrl}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => trackEvent("whatsapp_click", { label: "client_footer" })}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-brand"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              {t.footer.whatsapp}
            </a>
            <a
              href={`tel:${profile.phoneIntl}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-brand"
            >
              <Phone className="h-3.5 w-3.5" />
              {profile.phoneDisplay}
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-brand"
            >
              <Mail className="h-3.5 w-3.5" />
              {t.footer.email}
            </a>
            <a
              href="#top"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-brand"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              {t.footer.backToTop}
            </a>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-border/40 pt-6 text-center sm:flex-row sm:text-start">
          <p className="text-[11px] text-muted-foreground/70">
            © {new Date().getFullYear()} {t.ownerName} · <span className="brand-gradient-text font-semibold">{t.footer.tagline}</span>
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/5 px-2.5 py-0.5 text-[11px] text-brand">
            <span className="relative flex h-1.5 w-1.5">
              <span className="status-pulse absolute h-1.5 w-1.5 rounded-full bg-brand opacity-75" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-brand" />
            </span>
            {t.footer.takingNew}
          </span>
        </div>
      </div>
    </footer>
  );
}
