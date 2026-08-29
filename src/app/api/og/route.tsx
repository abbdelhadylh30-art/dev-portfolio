import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { profile, projects, stats, type Project } from "@/lib/portfolio-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 3600; // cache for 1 hour

/**
 * GET /api/og
 * Generates a 1200×630 Open Graph image on the fly using next/og
 * (Satori under the hood). Renders a branded card:
 *   - Dark Vercel-style background with a subtle emerald mesh
 *   - "AG" avatar block on the right (or full GitHub avatar if fetchable)
 *   - Name + role + tagline on the left
 *   - Footer with "9 repos synced from github.com/abbdelhadylh30-art"
 *
 * Wired into `layout.tsx` metadata as `openGraph.images` + `twitter.images`
 * so Twitter / Slack / Facebook link previews show this branded card
 * instead of just text.
 */

/**
 * Fonts are BUNDLED in `public/fonts/` and read from disk — no runtime
 * network dependency (the old gstatic fetch took up to 47s on cold
 * renders). If a local read somehow fails, we fall back to the Google
 * Fonts CDN (slow, but better than a 500).
 */
const LOCAL_FONTS = {
  sans: "inter-regular.ttf",
  sansBold: "inter-bold.ttf",
  mono: "jetbrains-mono.ttf",
} as const;

const REMOTE_FONT_URLS = {
  // Google Fonts returns TTF for Mozilla UA — more stable across versions
  // than woff2 URLs which change with each font revision.
  sans:
    "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf",
  sansBold:
    "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf",
  mono:
    "https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPQ.ttf",
} as const;

/** Module-level cache so repeated renders skip disk reads entirely. */
const fontCache = new Map<string, ArrayBuffer>();

async function loadFont(
  localFile: string,
  remoteUrl: string,
): Promise<ArrayBuffer | null> {
  const cached = fontCache.get(localFile);
  if (cached) return cached;

  // 1) Bundled local font first — no network, sub-millisecond.
  try {
    const fontPath = path.join(process.cwd(), "public", "fonts", localFile);
    const buf = await readFile(fontPath);
    const data = buf.buffer.slice(
      buf.byteOffset,
      buf.byteOffset + buf.byteLength,
    ) as ArrayBuffer;
    fontCache.set(localFile, data);
    return data;
  } catch {
    // fall through to remote fetch
  }

  // 2) Remote fallback (slow path — kept for resilience only).
  try {
    const res = await fetch(remoteUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const data = await res.arrayBuffer();
    fontCache.set(localFile, data);
    return data;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  // Fetch fonts in parallel — fail soft: if the fetch fails, fall back to
  // whichever fonts did load. If ALL fail, we abort with a 500 (Satori
  // requires at least one font for layout calculation).
  const [sansR, sansBoldR, monoR] = await Promise.all([
    loadFont(LOCAL_FONTS.sans, REMOTE_FONT_URLS.sans),
    loadFont(LOCAL_FONTS.sansBold, REMOTE_FONT_URLS.sansBold),
    loadFont(LOCAL_FONTS.mono, REMOTE_FONT_URLS.mono),
  ]);

  let fonts: { name: string; data: ArrayBuffer; weight: 400 | 700; style: "normal" }[] = [];
  if (sansR) {
    fonts.push({ name: "Inter", data: sansR, weight: 400, style: "normal" });
  }
  if (sansBoldR) {
    fonts.push({ name: "Inter", data: sansBoldR, weight: 700, style: "normal" });
  }
  if (monoR) {
    fonts.push({ name: "JetBrainsMono", data: monoR, weight: 400, style: "normal" });
  }

  if (fonts.length === 0) {
    console.error("[api/og] all font loads failed — cannot render OG image");
    return new Response("font load failed", { status: 500 });
  }

  const monoFont = fonts.find((f) => f.name === "JetBrainsMono") ? "JetBrainsMono" : "Inter";

  // Per-project variant: /api/og?p=<slug> renders a project-brief card so
  // shared ?p= links preview the actual project (wired via generateMetadata
  // in page.tsx). Unknown/missing slug falls through to the profile card.
  const slug = new URL(request.url).searchParams.get("p")?.toLowerCase();
  const project = slug ? projects.find((p) => p.slug === slug) : undefined;
  if (project) {
    return new ImageResponse(
      <ProjectOGCard project={project} monoFont={monoFont} brandHex="#34d399" />,
      { width: 1200, height: 630, fonts }
    );
  }

  // Business ("client") variant: /api/og?mode=client — the card used when
  // the site is shared from Business mode (wired via generateMetadata in
  // page.tsx). Speaks outcomes to owners, not stack to engineers — and
  // wears the SAME warm coral/amber skin as the Business view.
  const mode = new URL(request.url).searchParams.get("mode");
  if (mode === "client") {
    return new ImageResponse(
      <ClientOGCard monoFont={monoFont} brandHex="#e0512a" />,
      { width: 1200, height: 630, fonts }
    );
  }

  const totalRepos = projects.length;
  const languagesStat = stats.find((s) => s.label === "Languages")?.value ?? "8";
  const liveDeploys = stats.find((s) => s.label === "Live Deploys")?.value ?? "6";

  // Brand color (matches --brand dark token: oklch(0.72 0.17 165))
  const brandHex = "#34d399"; // emerald-400 — close to brand on dark

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "radial-gradient(circle at 20% 30%, rgba(52, 211, 153, 0.18), transparent 35%), radial-gradient(circle at 80% 70%, rgba(52, 211, 153, 0.10), transparent 45%), linear-gradient(135deg, #0a0c0b 0%, #0d1210 50%, #0a0c0b 100%)",
          color: "#f4f7f5",
          padding: "64px",
          fontFamily: "Inter",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                background: brandHex,
                color: "#0a0c0b",
                fontSize: "32px",
                fontWeight: 700,
                fontFamily: monoFont,
                letterSpacing: "-0.04em",
              }}
            >
              AG
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <div
                style={{
                  fontSize: "16px",
                  fontFamily: monoFont,
                  color: brandHex,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  fontWeight: 400,
                }}
              >
                abdelhady.dev
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: "14px",
                  fontFamily: monoFont,
                  color: "rgba(244, 247, 245, 0.55)",
                  fontWeight: 400,
                }}
              >
                {`${profile.location} · ${profile.timezone}`}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 16px",
              borderRadius: "9999px",
              border: `1px solid ${brandHex}55`,
              background: `${brandHex}11`,
              color: brandHex,
              fontSize: "13px",
              fontFamily: monoFont,
              fontWeight: 400,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                display: "flex",
                width: "8px",
                height: "8px",
                borderRadius: "9999px",
                background: brandHex,
                boxShadow: `0 0 0 3px ${brandHex}33`,
              }}
            />
            Available
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginTop: "auto",
            marginBottom: "auto",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0",
            }}
          >
            <div
              style={{
                fontSize: "76px",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                background: `linear-gradient(100deg, #f4f7f5 0%, ${brandHex} 50%, #f4f7f5 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Abdelhady Gabriel
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 400,
                color: "rgba(244, 247, 245, 0.85)",
                marginTop: "12px",
                letterSpacing: "-0.01em",
              }}
            >
              {profile.roleLong}
            </div>
          </div>

          <div
            style={{
              fontSize: "20px",
              fontWeight: 400,
              color: "rgba(244, 247, 245, 0.62)",
              maxWidth: "880px",
              lineHeight: 1.4,
              marginTop: "8px",
            }}
          >
            {profile.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginTop: "auto",
            paddingTop: "24px",
            borderTop: `1px solid ${brandHex}22`,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "32px",
              alignItems: "center",
            }}
          >
            <Stat label="Repos" value={String(totalRepos)} brand={brandHex} mono={monoFont} />
            <Stat label="Languages" value={languagesStat} brand={brandHex} mono={monoFont} />
            <Stat label="Live deploys" value={liveDeploys} brand={brandHex} mono={monoFont} />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "2px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: "13px",
                fontFamily: monoFont,
                color: brandHex,
                fontWeight: 400,
              }}
            >
              {`github.com/${profile.githubUsername}`}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "11px",
                fontFamily: monoFont,
                color: "rgba(244, 247, 245, 0.45)",
                fontWeight: 400,
              }}
            >
              {`synced live · ${new Date().toISOString().slice(0, 10)}`}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
    }
  );
}

function Stat({
  label,
  value,
  brand,
  mono,
  valueColor,
  labelColor,
}: {
  label: string;
  value: string;
  brand: string;
  mono: string;
  valueColor?: string;
  labelColor?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2px",
      }}
    >
      <div
        style={{
          fontSize: "28px",
          fontWeight: 700,
          color: valueColor ?? "#f4f7f5",
          fontFamily: mono,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "11px",
          color: labelColor ?? "rgba(244, 247, 245, 0.55)",
          fontFamily: mono,
          textTransform: "uppercase",
          letterSpacing: "0.16em",
        }}
      >
        {label}
      </div>
    </div>
  );
}

/**
 * Per-project OG card — rendered for /api/og?p=<slug>. Mirrors the profile
 * card's brand language (mesh + dot grid + emerald) but leads with the
 * project: name, category chip, description, a proportional language bar
 * and the repo path in the footer.
 */
function ProjectOGCard({
  project,
  monoFont,
  brandHex,
}: {
  project: Project;
  monoFont: string;
  brandHex: string;
}) {
  // Clamp the description to ~2 rendered lines (Satori has no line-clamp).
  const words = project.description.split(" ");
  let blurb = project.description;
  if (words.length > 34) blurb = words.slice(0, 34).join(" ") + "…";

  const topLanguages = project.languages.slice(0, 4);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background:
          "radial-gradient(circle at 20% 30%, rgba(52, 211, 153, 0.18), transparent 35%), radial-gradient(circle at 80% 70%, rgba(52, 211, 153, 0.10), transparent 45%), linear-gradient(135deg, #0a0c0b 0%, #0d1210 50%, #0a0c0b 100%)",
        color: "#f4f7f5",
        padding: "64px",
        fontFamily: "Inter",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        }}
      />

      {/* Header — brand block + breadcrumb + category chip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: brandHex,
              color: "#0a0c0b",
              fontSize: "26px",
              fontWeight: 700,
              fontFamily: monoFont,
              letterSpacing: "-0.04em",
            }}
          >
            AG
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div
              style={{
                fontSize: "16px",
                fontFamily: monoFont,
                color: brandHex,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
              }}
            >
              abdelhady.dev
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "14px",
                fontFamily: monoFont,
                color: "rgba(244, 247, 245, 0.55)",
              }}
            >
              {`project brief · ${profile.role}`}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {project.homepage && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "9999px",
                border: `1px solid ${brandHex}55`,
                background: `${brandHex}11`,
                color: brandHex,
                fontSize: "13px",
                fontFamily: monoFont,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  display: "flex",
                  width: "8px",
                  height: "8px",
                  borderRadius: "9999px",
                  background: brandHex,
                  boxShadow: `0 0 0 3px ${brandHex}33`,
                }}
              />
              Live
            </div>
          )}
          <div
            style={{
              display: "flex",
              padding: "8px 16px",
              borderRadius: "9999px",
              border: "1px solid rgba(244,247,245,0.18)",
              color: "rgba(244, 247, 245, 0.75)",
              fontSize: "13px",
              fontFamily: monoFont,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {project.category}
          </div>
        </div>
      </div>

      {/* Body — project name + description */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          marginTop: "auto",
          marginBottom: "auto",
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: "68px",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            background: `linear-gradient(100deg, #f4f7f5 0%, ${brandHex} 50%, #f4f7f5 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          {project.name}
        </div>
        <div
          style={{
            fontSize: "22px",
            fontWeight: 400,
            color: "rgba(244, 247, 245, 0.65)",
            maxWidth: "920px",
            lineHeight: 1.45,
          }}
        >
          {blurb}
        </div>

        {/* Proportional language bar + legend */}
        {topLanguages.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "10px",
              width: "640px",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "10px",
                borderRadius: "9999px",
                overflow: "hidden",
                background: "rgba(244,247,245,0.08)",
              }}
            >
              {topLanguages.map((l, i) => (
                <div
                  key={l.name}
                  style={{
                    display: "flex",
                    width: `${l.percent}%`,
                    background: OG_LANG_COLORS[i % OG_LANG_COLORS.length],
                  }}
                />
              ))}
            </div>
            <div
              style={{
                display: "flex",
                gap: "20px",
                fontSize: "13px",
                fontFamily: monoFont,
                color: "rgba(244, 247, 245, 0.6)",
              }}
            >
              {topLanguages.map((l, i) => (
                <div key={l.name} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <span
                    style={{
                      display: "flex",
                      width: "9px",
                      height: "9px",
                      borderRadius: "9999px",
                      background: OG_LANG_COLORS[i % OG_LANG_COLORS.length],
                    }}
                  />
                  {`${l.name} ${l.percent}%`}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer — repo path + tech chips */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          marginTop: "auto",
          paddingTop: "24px",
          borderTop: `1px solid ${brandHex}22`,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "13px",
            fontFamily: monoFont,
            color: brandHex,
          }}
        >
          {`github.com/${profile.githubUsername}/${project.slug}`}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {project.primaryTech.slice(0, 4).map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                padding: "6px 14px",
                borderRadius: "9999px",
                border: "1px solid rgba(244,247,245,0.16)",
                color: "rgba(244, 247, 245, 0.7)",
                fontSize: "13px",
                fontFamily: monoFont,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Static palette for the OG language bar (GitHub-ish, brand-harmonised). */
const OG_LANG_COLORS = [
  "#34d399", // brand emerald
  "#a7f3d0", // pale emerald
  "#fbbf24", // amber
  "#f472b6", // pink
] as const;

/**
 * Business-mode OG card — /api/og?mode=client. Wears the Business view's
 * friendly warm skin: cream canvas, coral → amber accents, espresso text —
 * the exact opposite of the Developer view's black + emerald card.
 */
function ClientOGCard({ monoFont, brandHex }: { monoFont: string; brandHex: string }) {
  const espresso = "#473527";
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background:
          "radial-gradient(circle at 20% 30%, rgba(224, 81, 42, 0.16), transparent 35%), radial-gradient(circle at 80% 70%, rgba(217, 137, 31, 0.14), transparent 45%), linear-gradient(135deg, #fbf6ec 0%, #f8efe0 50%, #fbf6ec 100%)",
        color: espresso,
        padding: "64px",
        fontFamily: "Inter",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(71, 53, 39, 0.10) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        }}
      />

      {/* Header — brand block + audience line + free-chat pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #e0512a 0%, #d9891f 100%)",
              color: "#fdf8ef",
              fontSize: "32px",
              fontWeight: 700,
              fontFamily: monoFont,
              letterSpacing: "-0.04em",
            }}
          >
            AG
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div
              style={{
                fontSize: "16px",
                fontFamily: monoFont,
                color: brandHex,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
              }}
            >
              abdelhady.dev
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "14px",
                fontFamily: monoFont,
                color: "rgba(71, 53, 39, 0.55)",
              }}
            >
              websites for businesses · Egypt &amp; the Gulf
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 16px",
            borderRadius: "9999px",
            border: `1px solid ${brandHex}55`,
            background: `${brandHex}22`,
            color: brandHex,
            fontSize: "13px",
            fontFamily: monoFont,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              display: "flex",
              width: "8px",
              height: "8px",
              borderRadius: "9999px",
              background: brandHex,
              boxShadow: `0 0 0 3px ${brandHex}33`,
            }}
          />
          Free 15-min chat
        </div>
      </div>

      {/* Body — the client promise */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginTop: "auto",
          marginBottom: "auto",
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: "66px",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.08,
            maxWidth: "980px",
            background: `linear-gradient(100deg, ${espresso} 0%, ${brandHex} 50%, ${espresso} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          A website that works as hard as you do.
        </div>
        <div
          style={{
            fontSize: "22px",
            fontWeight: 400,
            color: "rgba(71, 53, 39, 0.78)",
            maxWidth: "880px",
            lineHeight: 1.45,
            marginTop: "8px",
          }}
        >
          Fixed-price websites and booking systems — Arabic + English, fast,
          and built to rank on Google. Support after launch.
        </div>
      </div>

      {/* Footer — client-outcome stats + guarantees line */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          marginTop: "auto",
          paddingTop: "24px",
          borderTop: `1px solid ${brandHex}30`,
        }}
      >
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          <Stat
            label="Loads in"
            value="<2s"
            brand={brandHex}
            mono={monoFont}
            valueColor={brandHex}
            labelColor="rgba(71, 53, 39, 0.55)"
          />
          <Stat
            label="Google rank hit"
            value="#1"
            brand={brandHex}
            mono={monoFont}
            valueColor={brandHex}
            labelColor="rgba(71, 53, 39, 0.55)"
          />
          <Stat
            label="Languages"
            value="AR+EN"
            brand={brandHex}
            mono={monoFont}
            valueColor={brandHex}
            labelColor="rgba(71, 53, 39, 0.55)"
          />
          <Stat
            label="To launch"
            value="2–4wks"
            brand={brandHex}
            mono={monoFont}
            valueColor={brandHex}
            labelColor="rgba(71, 53, 39, 0.55)"
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "2px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "13px",
              fontFamily: monoFont,
              color: brandHex,
            }}
          >
            Fixed price · You own everything
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "11px",
              fontFamily: monoFont,
              color: "rgba(71, 53, 39, 0.45)",
            }}
          >
            {`free website audit · ${new Date().toISOString().slice(0, 10)}`}
          </div>
        </div>
      </div>
    </div>
  );
}
