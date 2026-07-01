'use client'

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Loader2, Copy, Check, Sparkles, RotateCcw, ChevronRight, AlertTriangle, Wand2, FileText, Link2, Scan, ArrowRight, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import {
  STEP_ORDER,
  STEP_LABELS,
  STEP_DESCRIPTIONS,
  type StepName,
  type UserServices,
  type LeadObservation,
} from "@/lib/lead-profiler-types";
import { ImageUploader, type UploadedImage } from "@/components/image-uploader";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type StepStatus = "pending" | "running" | "done" | "error";

interface StepState {
  status: StepStatus;
  output?: Record<string, unknown>;
  duration_ms?: number;
  error?: string;
}

type Tab = "profiler" | "audit";

// ---------------------------------------------------------------------------
// Default data
// ---------------------------------------------------------------------------

const DEFAULT_USER_SERVICES: UserServices = {
  primary: "",
  secondary: "",
  past_work_examples: [],
  track_record: "",
  service_depth: "",
};

const EMPTY_DATA: LeadObservation = {
  lead_name: "",
  profession: "",
  apparent_subculture: "",
  westernization_signals: "",
  digital_presence_audit: {
    has_website: "no",
    has_booking_or_payment_link: "no",
    has_google_reviews: "no",
    primary_call_to_action: "dm",
  },
  observation_notes: {
    pace: "",
    people_orientation: "",
    content_shape: "",
    engagement: "",
    self_presentation: "",
    pressure_tells: "",
  },
  additional_context: "",
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function Home() {
  const [tab, setTab] = useState<Tab>("profiler");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header tab={tab} setTab={setTab} />
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-8">
        {tab === "profiler" ? <LeadProfiler /> : <ProspectAudit />}
      </main>
      <footer className="border-t mt-16 py-6">
        <div className="container mx-auto max-w-6xl px-4 text-center text-xs text-muted-foreground">
          Lead Profiler v4 · Arabic-first · Hook-driven · Factuality-checked · 5-step chain: Culture Map → DiSC → Status Anxiety ∥ Laws → Influence → SPIN
        </div>
      </footer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Header with tab switcher
// ---------------------------------------------------------------------------

function Header({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <header className="border-b bg-card sticky top-0 z-10">
      <div className="container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Lead Profiler</h1>
            <p className="text-xs text-muted-foreground">Research compression for cold WhatsApp openers</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setTab("profiler")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === "profiler" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Lead Profiler
          </button>
          <button
            onClick={() => setTab("audit")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === "audit" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Prospect Audit
          </button>
        </div>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Lead Profiler tab
// ---------------------------------------------------------------------------

function LeadProfiler() {
  const [observation, setObservation] = useState<LeadObservation>(EMPTY_DATA);
  const [userServices, setUserServices] = useState<UserServices>(DEFAULT_USER_SERVICES);
  const [steps, setSteps] = useState<Record<StepName, StepState>>({
    step1_culture_map: { status: "pending" },
    step2_disc: { status: "pending" },
    step3a_status_anxiety: { status: "pending" },
    step3b_laws: { status: "pending" },
    step3_reconciliation: { status: "pending" },
    step4_influence: { status: "pending" },
    step5_spin: { status: "pending" },
  });
  const [isRunning, setIsRunning] = useState(false);
  const [leadImages, setLeadImages] = useState<UploadedImage[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [vlmExtraction, setVlmExtraction] = useState<Record<string, unknown> | null>(null);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [isReadingPortfolio, setIsReadingPortfolio] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const updateNote = useCallback((key: keyof LeadObservation["observation_notes"], value: string) => {
    setObservation((prev) => ({ ...prev, observation_notes: { ...prev.observation_notes, [key]: value } }));
  }, []);

  const callStep = useCallback(
    async (step: StepName, accumulated: Record<string, Record<string, unknown> | undefined>) => {
      const res = await fetch("/api/profile-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step, observation, userServices, ...accumulated }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: "Network error" }));
        throw new Error(errBody.error ?? `HTTP ${res.status}`);
      }
      return (await res.json()) as { step: StepName; output: Record<string, unknown>; duration_ms: number };
    },
    [observation, userServices],
  );

  const runPipeline = useCallback(async () => {
    if (!observation.lead_name.trim() || !observation.profession.trim()) {
      toast.error("Lead name and profession are required");
      return;
    }
    if (!userServices.primary.trim()) {
      toast.error("Fill in 'What You Sell' first — the opener needs to know what you offer");
      return;
    }

    setIsRunning(true);
    setSteps({
      step1_culture_map: { status: "pending" },
      step2_disc: { status: "pending" },
      step3a_status_anxiety: { status: "pending" },
      step3b_laws: { status: "pending" },
      step3_reconciliation: { status: "pending" },
      step4_influence: { status: "pending" },
      step5_spin: { status: "pending" },
    });

    const accumulated: Record<string, Record<string, unknown> | undefined> = {};
    const stepToBodyKey: Record<StepName, string> = {
      step1_culture_map: "step1",
      step2_disc: "step2",
      step3a_status_anxiety: "step3a",
      step3b_laws: "step3b",
      step3_reconciliation: "step3_reconciled",
      step4_influence: "step4",
      step5_spin: "step5",
    };

    try {
      for (const step of STEP_ORDER) {
        if (step === "step3b_laws") continue;

        setSteps((prev) => ({ ...prev, [step]: { status: "running" } }));

        if (step === "step3a_status_anxiety") {
          setSteps((prev) => ({ ...prev, step3b_laws: { status: "running" } }));
          try {
            const [r3a, r3b] = await Promise.all([
              callStep("step3a_status_anxiety", accumulated),
              callStep("step3b_laws", accumulated),
            ]);
            accumulated.step3a = r3a.output;
            accumulated.step3b = r3b.output;
            setSteps((prev) => ({
              ...prev,
              step3a_status_anxiety: { status: "done", output: r3a.output, duration_ms: r3a.duration_ms },
              step3b_laws: { status: "done", output: r3b.output, duration_ms: r3b.duration_ms },
            }));
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error";
            setSteps((prev) => ({
              ...prev,
              step3a_status_anxiety: { status: "error", error: msg },
              step3b_laws: { status: "error", error: msg },
            }));
            throw err;
          }
          continue;
        }

        try {
          const result = await callStep(step, accumulated);
          accumulated[stepToBodyKey[step]] = result.output;
          setSteps((prev) => ({
            ...prev,
            [step]: { status: "done", output: result.output, duration_ms: result.duration_ms },
          }));
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Unknown error";
          setSteps((prev) => ({ ...prev, [step]: { status: "error", error: msg } }));
          throw err;
        }
      }

      toast.success("Profile generated!");
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Pipeline failed";
      toast.error(`Pipeline failed: ${msg}`);
    } finally {
      setIsRunning(false);
    }
  }, [observation, userServices, callStep]);

  const readPortfolio = useCallback(async () => {
    if (!portfolioUrl.trim()) {
      toast.error("Enter your portfolio URL first");
      return;
    }
    setIsReadingPortfolio(true);
    try {
      const res = await fetch("/api/read-portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: portfolioUrl }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed" }));
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }
      const data = await res.json();
      const ex = data.extracted;
      setUserServices({
        primary: ex.primary || "",
        secondary: ex.secondary || "",
        past_work_examples: ex.past_work_examples || [],
        track_record: ex.track_record || "",
        service_depth: ex.service_depth || "",
      });
      toast.success(`Portfolio read: ${data.page_title?.slice(0, 50) ?? "page loaded"}`);
      if (ex.extraction_notes) toast.info(ex.extraction_notes);
    } catch (err) {
      toast.error(`Portfolio read failed: ${err instanceof Error ? err.message : "unknown"}`);
    } finally {
      setIsReadingPortfolio(false);
    }
  }, [portfolioUrl]);

  const extractFromImages = useCallback(async () => {
    if (leadImages.length === 0) {
      toast.error("Upload at least one screenshot first");
      return;
    }
    setIsExtracting(true);
    try {
      const res = await fetch("/api/analyze-lead-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: leadImages.map((img) => ({ dataUrl: img.dataUrl, name: img.name })),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed" }));
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }
      const data = await res.json();
      setVlmExtraction(data.extracted);
      toast.success(`VLM analyzed ${data.images_analyzed} screenshot(s)`);
    } catch (err) {
      toast.error(`Image analysis failed: ${err instanceof Error ? err.message : "unknown"}`);
    } finally {
      setIsExtracting(false);
    }
  }, [leadImages]);

  const acceptVlmField = useCallback(
    (category: string, field: string, value: string) => {
      if (category === "observation_notes") {
        setObservation((prev) => ({
          ...prev,
          observation_notes: { ...prev.observation_notes, [field]: value },
        }));
      } else if (category === "digital_presence_audit") {
        setObservation((prev) => ({
          ...prev,
          digital_presence_audit: {
            ...prev.digital_presence_audit,
            [field]: value,
          },
        }));
      }
      toast.success(`Accepted: ${field}`);
    },
    [],
  );

  const reset = useCallback(() => {
    setObservation(EMPTY_DATA);
    setUserServices(DEFAULT_USER_SERVICES);
    setLeadImages([]);
    setVlmExtraction(null);
    setPortfolioUrl("");
    setSteps({
      step1_culture_map: { status: "pending" },
      step2_disc: { status: "pending" },
      step3a_status_anxiety: { status: "pending" },
      step3b_laws: { status: "pending" },
      step3_reconciliation: { status: "pending" },
      step4_influence: { status: "pending" },
      step5_spin: { status: "pending" },
    });
  }, []);

  const allDone = steps.step5_spin.status === "done" && steps.step4_influence.status === "done";
  const openerData = steps.step5_spin.output as Record<string, unknown> | undefined;
  const completedCount = STEP_ORDER.filter((s) => steps[s].status === "done").length;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="max-w-3xl">
        <h2 className="text-3xl font-bold tracking-tight mb-2">
          5-minute observation in. Pitch-ready Arabic opener out.
        </h2>
        <p className="text-muted-foreground">
          Paste your social-media observation notes, upload screenshots for VLM cross-check,
          and the 5-step chain produces a draft WhatsApp opener designed to feel like it came
          from someone who already understood them — not a cold pitch.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Input form — 3 cols */}
        <div className="lg:col-span-3 space-y-6">
          {/* What You Sell */}
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>What You Sell</span>
                <Badge variant="secondary" className="text-xs">fill once</Badge>
              </CardTitle>
              <CardDescription>
                Your real services and track record. The opener draws ONLY from this — never invents social proof.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Portfolio URL auto-fill */}
              <div className="space-y-2">
                <Label htmlFor="portfolio_url" className="text-sm font-medium flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5" /> Auto-fill from your portfolio URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="portfolio_url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://your-portfolio-or-website.com"
                    disabled={isReadingPortfolio}
                  />
                  <Button
                    onClick={readPortfolio}
                    disabled={isReadingPortfolio || !portfolioUrl.trim()}
                    variant="outline"
                    size="default"
                  >
                    {isReadingPortfolio ? (
                      <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Reading...</>
                    ) : (
                      <><Scan className="w-4 h-4 mr-1.5" /> Auto-fill</>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Paste your portfolio/website URL. The tool reads the page and extracts your real services + past work.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="us_primary">Primary service *</Label>
                <Textarea
                  id="us_primary"
                  value={userServices.primary}
                  onChange={(e) => setUserServices((p) => ({ ...p, primary: e.target.value }))}
                  placeholder="Custom web tools — landing pages, dashboards, functional apps"
                  disabled={isRunning}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="us_track">Real track record</Label>
                <Textarea
                  id="us_track"
                  value={userServices.track_record}
                  onChange={(e) => setUserServices((p) => ({ ...p, track_record: e.target.value }))}
                  placeholder="3 years building web tools for Gulf SMB owners. ~15 clients across dental, retail, e-commerce."
                  disabled={isRunning}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="us_examples">Past work examples (one per line)</Label>
                <Textarea
                  id="us_examples"
                  value={userServices.past_work_examples.join("\n")}
                  onChange={(e) =>
                    setUserServices((p) => ({
                      ...p,
                      past_work_examples: e.target.value.split("\n").filter((s) => s.trim()),
                    }))
                  }
                  placeholder={"Booking dashboard for a Riyadh dental clinic\nProduct page funnel for a Jeddah dropshipper"}
                  disabled={isRunning}
                  rows={4}
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  These are the ONLY social proof the tool can use. If empty, Social Proof lever is forbidden.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="us_depth">Service depth — what makes you different</Label>
                <Textarea
                  id="us_depth"
                  value={userServices.service_depth}
                  onChange={(e) => setUserServices((p) => ({ ...p, service_depth: e.target.value }))}
                  placeholder="I build real functional tools with working backends — not just landing pages."
                  disabled={isRunning}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Lead Observation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Lead Observation</span>
                <Badge variant="secondary" className="text-xs">5 min manual</Badge>
              </CardTitle>
              <CardDescription>
                Take the 5-minute scroll. Paste shorthand notes. Optionally upload screenshots for VLM cross-check.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lead_name">Lead name *</Label>
                  <Input
                    id="lead_name"
                    value={observation.lead_name}
                    onChange={(e) => setObservation((p) => ({ ...p, lead_name: e.target.value }))}
                    placeholder="Dr. Ahmed Al-Rashid"
                    disabled={isRunning}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profession">Profession *</Label>
                  <Input
                    id="profession"
                    value={observation.profession}
                    onChange={(e) => setObservation((p) => ({ ...p, profession: e.target.value }))}
                    placeholder="Dental clinic owner (Jeddah)"
                    disabled={isRunning}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apparent_subculture">Apparent sub-culture</Label>
                <Input
                  id="apparent_subculture"
                  value={observation.apparent_subculture}
                  onChange={(e) => setObservation((p) => ({ ...p, apparent_subculture: e.target.value }))}
                  placeholder="Saudi national, Jeddah-based, UK educated"
                  disabled={isRunning}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="westernization_signals">Westernization signals</Label>
                <Textarea
                  id="westernization_signals"
                  value={observation.westernization_signals}
                  onChange={(e) => setObservation((p) => ({ ...p, westernization_signals: e.target.value }))}
                  placeholder="English fluency, references to Western brands/frameworks, education markers"
                  disabled={isRunning}
                  rows={2}
                />
              </div>

              <Separator />

              {/* Digital Presence Audit */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Label className="text-base font-semibold">Digital presence audit</Label>
                  <Badge variant="secondary" className="text-xs">30 sec factual check</Badge>
                </div>
                <p className="text-xs text-muted-foreground -mt-1">
                  Quick factual inventory — drives the cost_of_absence hook for activation selling.
                </p>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-sm">Has website?</Label>
                    <Select
                      value={observation.digital_presence_audit.has_website}
                      onValueChange={(v) =>
                        setObservation((prev) => ({
                          ...prev,
                          digital_presence_audit: { ...prev.digital_presence_audit, has_website: v as "yes" | "no" | "weak" },
                        }))
                      }
                      disabled={isRunning}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No website</SelectItem>
                        <SelectItem value="weak">Weak (just a link)</SelectItem>
                        <SelectItem value="yes">Yes, real website</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm">Booking/payment link?</Label>
                    <Select
                      value={observation.digital_presence_audit.has_booking_or_payment_link}
                      onValueChange={(v) =>
                        setObservation((prev) => ({
                          ...prev,
                          digital_presence_audit: { ...prev.digital_presence_audit, has_booking_or_payment_link: v as "yes" | "no" },
                        }))
                      }
                      disabled={isRunning}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No — DM/call only</SelectItem>
                        <SelectItem value="yes">Yes — online booking/payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm">Google reviews?</Label>
                    <Select
                      value={observation.digital_presence_audit.has_google_reviews}
                      onValueChange={(v) =>
                        setObservation((prev) => ({
                          ...prev,
                          digital_presence_audit: { ...prev.digital_presence_audit, has_google_reviews: v as "yes" | "no" },
                        }))
                      }
                      disabled={isRunning}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No Google reviews</SelectItem>
                        <SelectItem value="yes">Yes, has Google reviews</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm">Primary call-to-action</Label>
                    <Select
                      value={observation.digital_presence_audit.primary_call_to_action}
                      onValueChange={(v) =>
                        setObservation((prev) => ({
                          ...prev,
                          digital_presence_audit: { ...prev.digital_presence_audit, primary_call_to_action: v as "dm" | "call" | "link" | "none" | "other" },
                        }))
                      }
                      disabled={isRunning}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dm">DM to order/book</SelectItem>
                        <SelectItem value="call">Call us</SelectItem>
                        <SelectItem value="link">Click a link</SelectItem>
                        <SelectItem value="none">No CTA visible</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm">Competitor digital presence (optional)</Label>
                  <Textarea
                    value={observation.digital_presence_audit.competitor_digital_presence ?? ""}
                    onChange={(e) =>
                      setObservation((prev) => ({
                        ...prev,
                        digital_presence_audit: { ...prev.digital_presence_audit, competitor_digital_presence: e.target.value },
                      }))
                    }
                    placeholder="e.g., Competitor X launched a website with online ordering 3 months ago"
                    disabled={isRunning}
                    rows={2}
                    className="text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm">Customer complaint pattern (optional)</Label>
                  <Textarea
                    value={observation.digital_presence_audit.customer_complaint_pattern ?? ""}
                    onChange={(e) =>
                      setObservation((prev) => ({
                        ...prev,
                        digital_presence_audit: { ...prev.digital_presence_audit, customer_complaint_pattern: e.target.value },
                      }))
                    }
                    placeholder="e.g., Customers comment 'why don't you have a website?'"
                    disabled={isRunning}
                    rows={2}
                    className="text-sm"
                  />
                </div>
              </div>

              <Separator />

              {/* Image upload for VLM cross-check */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Label className="text-base font-semibold">Screenshot cross-check (optional)</Label>
                  <Badge variant="secondary" className="text-xs">VLM extraction</Badge>
                </div>
                <p className="text-xs text-muted-foreground -mt-1">
                  Upload screenshots of the lead's profile. The VLM extracts observations you can accept/reject as a cross-check.
                </p>
                <ImageUploader images={leadImages} onChange={setLeadImages} maxImages={6} disabled={isRunning || isExtracting} />
                {leadImages.length > 0 && (
                  <Button onClick={extractFromImages} disabled={isExtracting} variant="outline" className="w-full">
                    {isExtracting ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing screenshots...</>
                    ) : (
                      <><Scan className="w-4 h-4 mr-2" /> Extract observations from {leadImages.length} screenshot(s)</>
                    )}
                  </Button>
                )}

                {/* VLM extraction results */}
                {vlmExtraction && (
                  <VlmExtractionPanel extraction={vlmExtraction} onAccept={acceptVlmField} />
                )}
              </div>

              <Separator />

              {/* Observation notes */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Observation notes (6 categories)</Label>
                {([
                  ["pace", "Pace signals", "Posting frequency, reply speed, content cadence"],
                  ["people_orientation", "People orientation", "Warmth vs. skepticism in captions and replies"],
                  ["content_shape", "Content shape", "Carousels, reels, formal posts, BTS, polished vs. raw"],
                  ["engagement", "Engagement style", "Reply patterns, tone, selectivity"],
                  ["self_presentation", "Self-presentation", "Front-and-center vs. behind-the-brand"],
                  ["pressure_tells", "Pressure tells", "Stories, rants, brags, withdrawal under stress"],
                ] as const).map(([key, label, placeholder]) => (
                  <div key={key} className="space-y-1.5">
                    <Label htmlFor={`note-${key}`} className="text-sm font-medium">{label}</Label>
                    <Textarea
                      id={`note-${key}`}
                      value={observation.observation_notes[key]}
                      onChange={(e) => updateNote(key, e.target.value)}
                      placeholder={placeholder}
                      disabled={isRunning}
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="additional_context">Additional context (optional)</Label>
                <Textarea
                  id="additional_context"
                  value={observation.additional_context ?? ""}
                  onChange={(e) => setObservation((p) => ({ ...p, additional_context: e.target.value }))}
                  placeholder="Competitors, family dynamics, recent changes, anything else relevant"
                  disabled={isRunning}
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={runPipeline}
                  disabled={isRunning || !observation.lead_name.trim() || !observation.profession.trim() || !userServices.primary.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  size="lg"
                >
                  {isRunning ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Running pipeline...</>
                  ) : (
                    <><Sparkles className="w-4 h-4 mr-2" /> Generate Profile</>
                  )}
                </Button>
                <Button variant="ghost" size="sm" onClick={reset} disabled={isRunning}>
                  <RotateCcw className="w-4 h-4 mr-1.5" /> Reset
                </Button>
                {completedCount > 0 && !isRunning && (
                  <span className="text-sm text-muted-foreground">{completedCount}/{STEP_ORDER.length} steps complete</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress sidebar — 2 cols */}
        <div className="lg:col-span-2">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-base">Pipeline Progress</CardTitle>
              <CardDescription>5 steps run sequentially. Step 3a + 3b run in parallel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {STEP_ORDER.map((step) => {
                const state = steps[step];
                const isParallel = step === "step3a_status_anxiety" || step === "step3b_laws";
                return (
                  <div
                    key={step}
                    className={`flex items-start gap-3 p-3 rounded-md border transition-colors ${
                      state.status === "running" ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                      : state.status === "done" ? "border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/10"
                      : state.status === "error" ? "border-red-300 bg-red-50 dark:bg-red-950/20"
                      : "border-border"
                    }`}
                  >
                    <div className="mt-0.5">
                      {state.status === "running" && <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />}
                      {state.status === "done" && <Check className="w-4 h-4 text-emerald-600" />}
                      {state.status === "error" && <AlertTriangle className="w-4 h-4 text-red-600" />}
                      {state.status === "pending" && <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">{STEP_LABELS[step]}</span>
                        {isParallel && <Badge variant="outline" className="text-[10px] py-0 px-1.5">parallel</Badge>}
                        {state.duration_ms && (
                          <span className="text-[11px] text-muted-foreground">{(state.duration_ms / 1000).toFixed(1)}s</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {state.status === "error" ? state.error : STEP_DESCRIPTIONS[step]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results */}
      <div ref={resultsRef} className="mt-10 space-y-6">
        {allDone && openerData ? (
          <OpenerDisplay openerData={openerData} steps={steps} />
        ) : (
          !isRunning && completedCount === 0 && (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center text-muted-foreground">
                <ChevronRight className="w-8 h-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">
                  Fill in the observation notes and click <span className="font-medium text-foreground">Generate Profile</span>.
                </p>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// VLM Extraction Panel — shows extracted observations with accept buttons
// ---------------------------------------------------------------------------

function VlmExtractionPanel({
  extraction,
  onAccept,
}: {
  extraction: Record<string, unknown>;
  onAccept: (category: string, field: string, value: string) => void;
}) {
  const obs = (extraction.observation_notes ?? {}) as Record<string, string>;
  const audit = (extraction.digital_presence_audit ?? {}) as Record<string, string>;
  const confidence = extraction.extraction_confidence as string | undefined;
  const couldNotDetermine = (extraction.what_i_could_not_determine ?? []) as string[];

  return (
    <div className="mt-3 border-2 border-blue-200 rounded-md p-4 bg-blue-50/50 dark:bg-blue-950/10 space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <Scan className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">VLM also observed...</span>
        {confidence && <Badge variant="outline" className="text-xs">confidence: {confidence}</Badge>}
      </div>
      <p className="text-xs text-blue-700 dark:text-blue-300">
        Review each extracted field. Click "Accept" to merge into your manual notes (you can still edit after).
      </p>

      {Object.entries(obs).map(([key, value]) => {
        if (!value || value.includes("not visible")) return null;
        return (
          <div key={key} className="flex items-start justify-between gap-2 text-xs bg-white dark:bg-zinc-900 p-2 rounded border">
            <div className="flex-1">
              <span className="font-medium text-blue-800 dark:text-blue-200">{key.replace(/_/g, " ")}:</span>{" "}
              <span className="text-foreground">{value}</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs"
              onClick={() => onAccept("observation_notes", key, value)}
            >
              <ArrowRight className="w-3 h-3 mr-1" /> Accept
            </Button>
          </div>
        );
      })}

      {audit.bio_text && !audit.bio_text.includes("not visible") && (
        <div className="flex items-start justify-between gap-2 text-xs bg-white dark:bg-zinc-900 p-2 rounded border">
          <div className="flex-1">
            <span className="font-medium text-blue-800 dark:text-blue-200">Bio text:</span>{" "}
            <span className="text-foreground font-mono">{audit.bio_text}</span>
          </div>
        </div>
      )}

      {couldNotDetermine.length > 0 && (
        <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">
          <span className="font-medium">Could not determine from screenshots:</span>{" "}
          {couldNotDetermine.join(", ")}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Opener Display — shows the final opener with all inspection panels
// ---------------------------------------------------------------------------

function OpenerDisplay({
  openerData,
  steps,
}: {
  openerData: Record<string, unknown>;
  steps: Record<StepName, StepState>;
}) {
  const opener = openerData.opener_draft as string | undefined;
  const alt = openerData.alternative_opener as string | undefined;
  const warnings = (openerData.warnings ?? []) as string[];
  const wordCount = openerData.word_count as number | undefined;
  const confidence = openerData.confidence as string | undefined;
  const openerLanguage = openerData.opener_language as string | undefined;
  const openerRegister = openerData.opener_register as string | undefined;
  const hook = openerData.hook as string | undefined;
  const hookType = openerData.hook_type as string | undefined;
  const offer = openerData.offer as string | undefined;
  const vocabUsed = openerData.vocabulary_used as string | undefined;
  const factuality = openerData.factuality_check as Record<string, unknown> | undefined;
  const claimsWithSources = (factuality?.claims_with_sources ?? []) as Array<Record<string, string>>;
  const fabricatedClaims = (factuality?.fabricated_claims ?? []) as string[];
  const allTraced = factuality?.all_claims_traced as string | undefined;
  const isArabic = openerLanguage === "arabic";

  const chainSummary = {
    culture: (steps.step1_culture_map.output as { sub_culture?: string } | undefined)?.sub_culture,
    disc: (steps.step2_disc.output as { primary_dimension?: string; disc_style?: string } | undefined),
    drive: (steps.step3a_status_anxiety.output as { primary_drive?: string } | undefined)?.primary_drive,
    law: (steps.step3b_laws.output as { dominant_law?: string } | undefined)?.dominant_law,
    lever: (steps.step4_influence.output as { primary_lever?: string; social_proof_available?: string } | undefined),
  };

  return (
    <>
      {/* Final opener */}
      <Card className="border-emerald-500 border-2 bg-emerald-50/30 dark:bg-emerald-950/10">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 flex-wrap">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                Draft WhatsApp Opener
                {openerLanguage && (
                  <Badge variant="default" className="text-xs">
                    {isArabic ? "العربية" : "English"}
                  </Badge>
                )}
                {hookType && <Badge variant="outline" className="text-xs">hook: {hookType}</Badge>}
              </CardTitle>
              <CardDescription className="mt-1">
                Ready to send. {wordCount ?? 0} words.
                {confidence && <> Confidence: <span className="font-medium">{confidence}</span></>}
                {openerRegister && isArabic && <> · Register: <span className="font-medium">{openerRegister}</span></>}
              </CardDescription>
            </div>
            <CopyButton text={opener ?? ""} label="Copy opener" />
          </div>
        </CardHeader>
        <CardContent>
          <div
            className="bg-white dark:bg-zinc-900 border rounded-md p-4 text-sm leading-relaxed whitespace-pre-wrap"
            dir={isArabic ? "rtl" : "ltr"}
            style={{
              fontFamily: isArabic ? "'Noto Sans Arabic', 'Segoe UI', system-ui, sans-serif" : "inherit",
              fontSize: "16px",
              lineHeight: 1.7,
            }}
          >
            {opener}
          </div>

          {/* Hook inspection */}
          {hook && (
            <div className="mt-4 p-3 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200">
              <div className="text-xs text-emerald-700 dark:text-emerald-300 uppercase tracking-wide font-semibold mb-1">
                The Hook (first ~14 words)
              </div>
              <div className="text-sm font-medium text-emerald-900 dark:text-emerald-100" dir={isArabic ? "rtl" : "ltr"}>
                {hook}
              </div>
            </div>
          )}

          {/* Offer + vocabulary */}
          <div className="mt-3 grid sm:grid-cols-2 gap-3">
            {offer && (
              <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-950/30 border border-blue-200">
                <div className="text-xs text-blue-700 dark:text-blue-300 uppercase tracking-wide font-semibold mb-1">Offer Used</div>
                <div className="text-sm text-blue-900 dark:text-blue-100">{offer}</div>
              </div>
            )}
            {vocabUsed && (
              <div className="p-3 rounded-md bg-purple-50 dark:bg-purple-950/30 border border-purple-200">
                <div className="text-xs text-purple-700 dark:text-purple-300 uppercase tracking-wide font-semibold mb-1">Vocabulary Mirrored</div>
                <div className="text-sm text-purple-900 dark:text-purple-100" dir={isArabic ? "rtl" : "ltr"}>{vocabUsed}</div>
              </div>
            )}
          </div>

          {/* Factuality check */}
          {factuality && (
            <div className={`mt-4 p-3 rounded-md border ${allTraced === "yes" ? "bg-green-50 dark:bg-green-950/30 border-green-300" : "bg-red-50 dark:bg-red-950/30 border-red-300"}`}>
              <div className={`text-xs uppercase tracking-wide font-semibold mb-2 ${allTraced === "yes" ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
                Factuality Check · {allTraced === "yes" ? "✓ All claims traced" : "✗ FABRICATED CLAIMS DETECTED"}
              </div>
              {claimsWithSources.length > 0 && (
                <div className="space-y-2">
                  {claimsWithSources.map((c, i) => (
                    <div key={i} className="text-xs">
                      <div className="font-medium text-foreground">"{c.claim}"</div>
                      <div className="text-muted-foreground ml-3 mt-0.5">
                        source:{" "}
                        <span className={`font-medium ${c.source === "NONE" || c.source_detail === "FABRICATED" ? "text-red-600 dark:text-red-400" : "text-green-700 dark:text-green-400"}`}>
                          {c.source === "NONE" ? "FABRICATED" : c.source}
                        </span>
                        {c.source_detail && c.source !== "NONE" && c.source_detail !== "FABRICATED" && <> — {c.source_detail.slice(0, 120)}</>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {fabricatedClaims.length > 0 && (
                <Alert variant="destructive" className="mt-2">
                  <AlertTriangle className="w-4 h-4" />
                  <AlertTitle>Fabricated claims — DO NOT SEND</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside mt-1 text-xs">
                      {fabricatedClaims.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Warnings */}
          {warnings.length > 0 && (
            <Alert className="mt-4 border-amber-300 bg-amber-50 dark:bg-amber-950/20">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <AlertTitle className="text-amber-900 dark:text-amber-200">Warnings — read before sending</AlertTitle>
              <AlertDescription className="text-amber-900 dark:text-amber-200">
                <ul className="list-disc list-inside mt-1 space-y-1 text-sm">
                  {warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Alternative opener */}
      {alt && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <CardTitle className="text-base">Alternative Opener (A/B test)</CardTitle>
                <CardDescription>A second version with a different hook or angle.</CardDescription>
              </div>
              <CopyButton text={alt} label="Copy alternative" small />
            </div>
          </CardHeader>
          <CardContent>
            <div
              className="bg-muted/50 border rounded-md p-4 text-sm leading-relaxed whitespace-pre-wrap"
              dir={isArabic ? "rtl" : "ltr"}
              style={{ fontFamily: isArabic ? "'Noto Sans Arabic', 'Segoe UI', system-ui, sans-serif" : "inherit" }}
            >
              {alt}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chain summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chain Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <SummaryItem label="Culture" value={chainSummary.culture} />
            <SummaryItem
              label="DiSC"
              value={chainSummary.disc ? `${chainSummary.disc.primary_dimension} (${chainSummary.disc.disc_style})` : undefined}
            />
            <SummaryItem label="Status drive" value={chainSummary.drive} />
            <SummaryItem label="Dominant law" value={chainSummary.law} />
            <SummaryItem label="Persuasion lever" value={chainSummary.lever?.primary_lever} />
            <SummaryItem
              label="Social proof available"
              value={chainSummary.lever?.social_proof_available}
            />
          </div>
        </CardContent>
      </Card>

      {/* Step-by-step outputs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Step-by-step Outputs</CardTitle>
          <CardDescription>Inspect each step's full JSON output for debugging.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {STEP_ORDER.map((step) => {
              const state = steps[step];
              if (state.status !== "done" || !state.output) return null;
              return (
                <AccordionItem key={step} value={step}>
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{STEP_LABELS[step]}</span>
                      {state.duration_ms && <span className="text-xs text-muted-foreground">{(state.duration_ms / 1000).toFixed(1)}s</span>}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <pre className="text-xs bg-muted/50 p-3 rounded-md overflow-x-auto max-h-96">
                      {JSON.stringify(state.output, null, 2)}
                    </pre>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </>
  );
}

// ---------------------------------------------------------------------------
// Prospect Audit tab
// ---------------------------------------------------------------------------

function ProspectAudit() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [audit, setAudit] = useState<Record<string, unknown> | null>(null);

  const runAudit = useCallback(async () => {
    if (images.length === 0) {
      toast.error("Upload at least one screenshot of the prospect's posts");
      return;
    }
    setIsRunning(true);
    try {
      const res = await fetch("/api/prospect-content-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: images.map((img) => ({ dataUrl: img.dataUrl, name: img.name })),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed" }));
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }
      const data = await res.json();
      setAudit(data.audit);
      toast.success(`Audit complete — ${data.images_analyzed} images analyzed`);
    } catch (err) {
      toast.error(`Audit failed: ${err instanceof Error ? err.message : "unknown"}`);
    } finally {
      setIsRunning(false);
    }
  }, [images]);

  const reset = useCallback(() => {
    setImages([]);
    setAudit(null);
  }, []);

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Prospect Content Audit</h2>
        <p className="text-muted-foreground">
          Upload screenshots of a prospect's social media posts. The VLM analyzes their content strategy,
          brand voice, engagement patterns, and gaps — then recommends whether and how to pitch them.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Upload Prospect's Posts
          </CardTitle>
          <CardDescription>
            Screenshot their main feed, individual posts, comments, Stories — anything that shows their content strategy.
            3-8 screenshots gives the best analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUploader images={images} onChange={setImages} maxImages={12} disabled={isRunning} />

          <div className="flex items-center gap-3">
            <Button
              onClick={runAudit}
              disabled={isRunning || images.length === 0}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              size="lg"
            >
              {isRunning ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing content...</>
              ) : (
                <><Scan className="w-4 h-4 mr-2" /> Run Content Audit</>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={reset} disabled={isRunning}>
              <RotateCcw className="w-4 h-4 mr-1.5" /> Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {audit && <AuditReport audit={audit} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Audit Report Display
// ---------------------------------------------------------------------------

function AuditReport({ audit }: { audit: Record<string, unknown> }) {
  const confidence = audit.audit_confidence as string | undefined;
  const themes = (audit.content_themes ?? []) as Array<Record<string, string>>;
  const visualStyle = audit.visual_style as Record<string, string> | undefined;
  const postingStrategy = audit.posting_strategy as Record<string, unknown> | undefined;
  const engagement = audit.engagement_patterns as Record<string, string> | undefined;
  const brandVoice = audit.brand_voice as Record<string, unknown> | undefined;
  const gaps = audit.gaps_and_opportunities as Record<string, string[]> | undefined;
  const recommendation = audit.sales_recommendation as Record<string, string> | undefined;
  const couldNotDetermine = (audit.what_i_could_not_determine ?? []) as string[];

  return (
    <div className="space-y-4">
      {/* Sales recommendation — most important, show first */}
      {recommendation && (
        <Card className="border-emerald-500 border-2 bg-emerald-50/30 dark:bg-emerald-950/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              Sales Recommendation
            </CardTitle>
            {confidence && <Badge variant="outline" className="text-xs">audit confidence: {confidence}</Badge>}
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-md bg-white dark:bg-zinc-900 border">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Should pitch?</div>
                <div className="text-lg font-bold mt-1">{recommendation.should_pitch}</div>
              </div>
              <div className="p-3 rounded-md bg-white dark:bg-zinc-900 border">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Rough DiSC style</div>
                <div className="text-lg font-bold mt-1">{recommendation.rough_disc_style ?? "?"}</div>
              </div>
            </div>
            {recommendation.why && (
              <div><span className="text-sm font-medium">Why: </span><span className="text-sm">{recommendation.why}</span></div>
            )}
            {recommendation.pitch_angle && (
              <div><span className="text-sm font-medium">Pitch angle: </span><span className="text-sm">{recommendation.pitch_angle}</span></div>
            )}
            {recommendation.likely_pain_point && (
              <div><span className="text-sm font-medium">Likely pain: </span><span className="text-sm">{recommendation.likely_pain_point}</span></div>
            )}
            {recommendation.recommended_register && (
              <div><span className="text-sm font-medium">Recommended register: </span><span className="text-sm">{recommendation.recommended_register}</span></div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Gaps and opportunities */}
      {gaps && (
        <Card>
          <CardHeader><CardTitle className="text-base">Gaps & Opportunities</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {gaps.missing_content?.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-1">Missing content:</div>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-0.5">
                  {gaps.missing_content.map((g, i) => <li key={i}>{g}</li>)}
                </ul>
              </div>
            )}
            {gaps.operational_pain_points?.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-1">Operational pain points:</div>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-0.5">
                  {gaps.operational_pain_points.map((g, i) => <li key={i}>{g}</li>)}
                </ul>
              </div>
            )}
            {gaps.digital_presence_gaps?.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-1">Digital presence gaps:</div>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-0.5">
                  {gaps.digital_presence_gaps.map((g, i) => <li key={i}>{g}</li>)}
                </ul>
              </div>
            )}
            {gaps.services_to_pitch?.length > 0 && (
              <div className="p-3 rounded-md bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200">
                <div className="text-sm font-medium mb-1 text-emerald-900 dark:text-emerald-100">Services to pitch:</div>
                <ul className="list-disc list-inside text-sm text-emerald-800 dark:text-emerald-200 space-y-0.5">
                  {gaps.services_to_pitch.map((g, i) => <li key={i}>{g}</li>)}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Content themes */}
      {themes.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Content Themes</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {themes.map((t, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-md border">
                <Badge variant="secondary" className="text-xs">{t.estimated_percentage}</Badge>
                <div className="flex-1">
                  <div className="text-sm font-medium">{t.theme}</div>
                  {t.example_post && <div className="text-xs text-muted-foreground mt-0.5">{t.example_post}</div>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Brand voice */}
      {brandVoice && (
        <Card>
          <CardHeader><CardTitle className="text-base">Brand Voice</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {brandVoice.tone && <div><span className="font-medium">Tone:</span> {String(brandVoice.tone)}</div>}
            {brandVoice.language_register && <div><span className="font-medium">Language:</span> {String(brandVoice.language_register)}</div>}
            {brandVoice.audience_address && <div><span className="font-medium">Audience address:</span> {String(brandVoice.audience_address)}</div>}
            {Array.isArray(brandVoice.signature_phrases) && brandVoice.signature_phrases.length > 0 && (
              <div>
                <span className="font-medium">Signature phrases:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {brandVoice.signature_phrases.map((p, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{String(p)}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Visual style + posting strategy + engagement */}
      <div className="grid md:grid-cols-3 gap-4">
        {visualStyle && (
          <Card>
            <CardHeader><CardTitle className="text-sm">Visual Style</CardTitle></CardHeader>
            <CardContent className="text-xs space-y-1">
              <div>Polish: {visualStyle.polish_level}</div>
              <div>Consistency: {visualStyle.consistency}</div>
              {visualStyle.colors_or_design_notes && <div className="text-muted-foreground mt-1">{visualStyle.colors_or_design_notes}</div>}
            </CardContent>
          </Card>
        )}
        {postingStrategy && (
          <Card>
            <CardHeader><CardTitle className="text-sm">Posting Strategy</CardTitle></CardHeader>
            <CardContent className="text-xs space-y-1">
              <div>Pattern: {String(postingStrategy.pattern ?? "?")}</div>
              {Array.isArray(postingStrategy.formats_used) && (
                <div>Formats: {postingStrategy.formats_used.join(", ")}</div>
              )}
            </CardContent>
          </Card>
        )}
        {engagement && (
          <Card>
            <CardHeader><CardTitle className="text-sm">Engagement</CardTitle></CardHeader>
            <CardContent className="text-xs space-y-1">
              <div>Comment volume: {engagement.comment_volume}</div>
              <div>Negative comments: {engagement.negative_comments_visible}</div>
              {engagement.reply_behavior && <div className="text-muted-foreground mt-1">{engagement.reply_behavior}</div>}
            </CardContent>
          </Card>
        )}
      </div>

      {/* What couldn't be determined */}
      {couldNotDetermine.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-sm">What the VLM Could Not Determine</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
              {couldNotDetermine.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Full JSON for debugging */}
      <Accordion type="single" collapsible>
        <AccordionItem value="full">
          <AccordionTrigger className="text-sm">Full audit JSON (debugging)</AccordionTrigger>
          <AccordionContent>
            <pre className="text-xs bg-muted/50 p-3 rounded-md overflow-x-auto max-h-96">
              {JSON.stringify(audit, null, 2)}
            </pre>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared small components
// ---------------------------------------------------------------------------

function SummaryItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="p-3 rounded-md border bg-muted/30">
      <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
      <div className="text-sm font-medium mt-1">{value ?? "—"}</div>
    </div>
  );
}

function CopyButton({ text, label, small }: { text: string; label: string; small?: boolean }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  }, [text]);
  return (
    <Button variant="outline" size={small ? "sm" : "default"} onClick={handleCopy}>
      {copied ? <><Check className="w-4 h-4 mr-1.5" />Copied</> : <><Copy className="w-4 h-4 mr-1.5" />{label}</>}
    </Button>
  );
}
