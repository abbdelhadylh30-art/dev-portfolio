import { profile } from "@/lib/portfolio-data";

/**
 * Server-side email notification for contact-form submissions.
 *
 * WHY THIS EXISTS: production runs on Vercel serverless with no writable
 * database, so a submitted form used to be lost unless the visitor also
 * tapped "Send via WhatsApp". This module closes that gap server-side.
 *
 * Transport: Resend HTTP API — used only when RESEND_API_KEY is set.
 * Resend is the only server-side transport because the zero-credential
 * alternative, FormSubmit.co, sits behind Cloudflare bot detection that
 * challenges server-to-server fetches (Bun sometimes slips through, but
 * Node — which runs the API route on both `next dev` and Vercel — gets
 * a 403 challenge page). FormSubmit IS used for delivery, but from the
 * VISITOR'S BROWSER (see deliverViaFormSubmit in contact-form.tsx),
 * which is its intended client and passes the bot checks natively.
 *
 * The notify target defaults to the site's public contact address
 * (profile.email) and can be overridden with CONTACT_NOTIFY_EMAIL.
 *
 * This module NEVER throws — a mailer outage must not break the form.
 */

export type ContactNotification = {
  name: string;
  email: string;
  subject?: string;
  projectType?: string;
  body: string;
};

export type NotifyResult = {
  ok: boolean;
  provider: "resend" | "none";
  detail?: string;
};

/** Never let an email call hold the request hostage. */
const TIMEOUT_MS = 6_000;

/** Where notifications go — env override wins over the site's public address. */
export function notifyTarget(): string {
  return (
    process.env.CONTACT_NOTIFY_EMAIL?.trim() ||
    profile.email.trim()
  );
}

const SUBJECT_PREFIX = (p: ContactNotification) => {
  const kind = p.projectType && p.projectType !== "Other" ? p.projectType : "Inquiry";
  return `🌐 ${kind} from ${p.name}${p.subject ? ` — ${p.subject}` : ""}`;
};

/**
 * Notify the site owner via Resend (only when RESEND_API_KEY is set).
 * Without a key this resolves instantly with ok:false — the client then
 * delivers via FormSubmit from the visitor's browser.
 */
export async function notifyContactEmail(
  p: ContactNotification
): Promise<NotifyResult> {
  const target = notifyTarget();
  const key = process.env.RESEND_API_KEY?.trim();
  if (!target || !key) {
    return { ok: false, provider: "none", detail: "no transport configured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Without a verified domain Resend only delivers to the account
        // owner's own address — which is exactly the notification use-case.
        from: "Portfolio <onboarding@resend.dev>",
        to: [target],
        reply_to: p.email,
        subject: SUBJECT_PREFIX(p),
        text: [
          `New contact-form submission`,
          ``,
          `Name:         ${p.name}`,
          `Email:        ${p.email}`,
          `Project type: ${p.projectType ?? "—"}`,
          `Subject:      ${p.subject || "—"}`,
          ``,
          `Message:`,
          p.body,
          ``,
          `— Sent from abdelhady-gabriel.vercel.app`,
        ].join("\n"),
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.ok) return { ok: true, provider: "resend" };
    const detail = (await res.text().catch(() => "")).slice(0, 200);
    return { ok: false, provider: "resend", detail };
  } catch (err) {
    return { ok: false, provider: "resend", detail: String(err).slice(0, 200) };
  }
}
