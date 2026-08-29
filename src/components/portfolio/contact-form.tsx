"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import { profile } from "@/lib/portfolio-data";

/** The "what do you need?" pill options — first is the default. */
const PROJECT_TYPES = [
  "New site",
  "Redesign",
  "Web app",
  "Free audit",
  "Other",
] as const;

const ContactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Enter a valid email").max(160),
  subject: z.string().max(200, "Subject is too long").optional().or(z.literal("")),
  projectType: z.enum(PROJECT_TYPES).default(PROJECT_TYPES[0]),
  body: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message is too long (max 5000 characters)"),
  website: z.string().max(0, "Spam detected").optional(),
});

type ContactValues = z.infer<typeof ContactSchema>;

const DEFAULTS: ContactValues = {
  name: "",
  email: "",
  subject: "",
  projectType: PROJECT_TYPES[0],
  body: "",
  website: "",
};

export function ContactForm() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = React.useState(false);
  // When the deployment has no writable database (serverless), the API
  // responds ok+persisted:false — we keep the last message around so the
  // success card can offer a one-tap WhatsApp delivery of the same text.
  const [whatsappHref, setWhatsappHref] = React.useState<string | null>(null);

  const form = useForm<ContactValues>({
    resolver: zodResolver(ContactSchema),
    defaultValues: DEFAULTS,
    mode: "onTouched",
  });

  const onSubmit = async (values: ContactValues) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as {
        ok: boolean;
        persisted?: boolean;
        error?: string;
        issues?: Record<string, string[]>;
      };

      if (!res.ok || !data.ok) {
        const msg =
          data.issues && Object.keys(data.issues).length > 0
            ? Object.values(data.issues)[0]?.[0]
            : data.error ?? "Something went wrong.";
        toast({
          title: "Could not send",
          description: msg,
          variant: "destructive",
        });
        return;
      }

      const persisted = data.persisted !== false;
      // Compose a WhatsApp deep-link carrying the same message — used both
      // as the degraded-mode delivery channel and as an optional "fastest
      // reply" accelerator when the DB did persist.
      const text = [
        `Hi, I'm ${values.name}.`,
        `Looking for: ${values.projectType}${values.subject ? ` — ${values.subject}` : ""}`,
        values.body,
        `(email: ${values.email})`,
      ]
        .filter(Boolean)
        .join("\n\n");
      // Compose from the RAW number — profile.whatsappUrl already carries a
      // default ?text= pre-fill, and wa.me honours only the FIRST text
      // param, so appending would silently drop our composed message.
      const waNumber = profile.phoneIntl.replace(/[^0-9]/g, "");
      const wa = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
      setWhatsappHref(wa);

      toast({
        title: "Message sent",
        description: persisted
          ? "Thanks — I'll reply to your email shortly."
          : "Thanks! For the fastest reply, also tap \"Send via WhatsApp\" below.",
      });
      trackEvent("contact_submit", {
        label: persisted ? "success" : "success_whatsapp_fallback",
      });
      setSubmitted(true);
      form.reset(DEFAULTS);
    } catch {
      toast({
        title: "Network error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-brand/40 bg-brand/5 p-8 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-brand text-brand-foreground">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <h3 className="text-lg font-semibold text-foreground">Message sent</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Thanks for reaching out. I&apos;ll get back to you at the email you
          provided.
        </p>
        {whatsappHref && (
          <a href={whatsappHref} target="_blank" rel="noreferrer noopener"
            onClick={() => trackEvent("whatsapp_click", { label: "form_success" })}
            className="group inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-2 text-sm font-medium text-brand transition-all hover:-translate-y-0.5 hover:bg-brand/15 hover:shadow-md hover:shadow-brand/20"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.2-.32a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.86-.87 2.07 0 1.22.89 2.39 1 2.56.14.17 1.76 2.67 4.25 3.73.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.27-.25-.14-1.47-.74-1.69-.82-.23-.08-.37-.12-.56.12-.16.25-.64.81-.78.97-.15.17-.29.19-.53.07-.26-.13-1.06-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.12-.24-.01-.39.11-.5.11-.11.27-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.11-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43-.14 0-.3-.01-.47-.01" />
            </svg>
            Send via WhatsApp too — fastest reply
          </a>
        )}
        <Button
          variant="outline"
          className="mt-1 h-10 rounded-full border-border/70"
          onClick={() => setSubmitted(false)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your name"
                    autoComplete="name"
                    className="h-11 rounded-xl bg-background/60"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="h-11 rounded-xl bg-background/60"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Subject <span className="text-muted-foreground/50">(optional)</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="What's this about?"
                  className="h-11 rounded-xl bg-background/60"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="projectType"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                What do you need?
              </FormLabel>
              <FormControl>
                <div
                  role="radiogroup"
                  aria-label="Project type"
                  className="flex flex-wrap gap-2 pt-1"
                >
                  {PROJECT_TYPES.map((t) => {
                    const active = field.value === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => field.onChange(t)}
                        className={`type-pill ${active ? "type-pill-active" : ""}`}
                      >
                        <span
                          aria-hidden
                          className={`h-1.5 w-1.5 rounded-full transition-colors ${
                            active ? "bg-brand" : "bg-muted-foreground/40"
                          }`}
                        />
                        {t}
                      </button>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Message
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell me about your project, role or idea…"
                  rows={5}
                  className="min-h-28 resize-y rounded-xl bg-background/60"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Honeypot — visually hidden, ignored by humans, filled by bots */}
        <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="website-url">Website (leave empty)</label>
          <Input
            id="website-url"
            tabIndex={-1}
            autoComplete="off"
            {...form.register("website")}
          />
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <p className="font-mono text-[11px] text-muted-foreground/70">
            Saved to my inbox — no third-party mailing.
          </p>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-6 rounded-full shadow-lg shadow-brand/20 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send message
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
