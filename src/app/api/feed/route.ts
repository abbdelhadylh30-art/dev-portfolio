import { getRecentCommits } from "@/lib/github-stats";
import { profile } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";
export const revalidate = 600;

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * GET /api/feed
 * Public. Serves an Atom feed of the "Recently shipped" commits — the same
 * live GitHub data the homepage strip shows, in a subscribable format so
 * people can follow along in any reader. Entries are the latest commit per
 * repo; each entry links straight to the commit on GitHub.
 */
export async function GET() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const { commits, fetchedAt } = await getRecentCommits(9);

  const updated = fetchedAt || new Date().toISOString();
  const feedId = `${siteUrl}/#shipped`;

  const entries = commits
    .map((c) => {
      const title = `${c.repo}: ${c.message || "(no message)"}`.slice(0, 140);
      const summary = `${c.sha.slice(0, 7)} by ${c.author ?? "unknown"} — ${
        c.message || "(no message)"
      }`;
      return `  <entry>
    <id>${escapeXml(c.url)}</id>
    <title>${escapeXml(title)}</title>
    <link href="${escapeXml(c.url)}" rel="alternate" type="text/html"/>
    <published>${escapeXml(c.committedAt || updated)}</published>
    <updated>${escapeXml(c.committedAt || updated)}</updated>
    <summary>${escapeXml(summary)}</summary>
    <author>
      <name>${escapeXml(c.author ?? profile.name)}</name>
    </author>
    <category term="${escapeXml(c.repo)}"/>
  </entry>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(profile.name)} — Recently shipped</title>
  <subtitle>${escapeXml(
    "Latest commit from every repository, synced live from GitHub."
  )}</subtitle>
  <id>${escapeXml(feedId)}</id>
  <link href="${escapeXml(siteUrl)}/" rel="alternate" type="text/html"/>
  <link href="${escapeXml(siteUrl)}/api/feed" rel="self" type="application/atom+xml"/>
  <updated>${escapeXml(updated)}</updated>
  <author>
    <name>${escapeXml(profile.name)}</name>
    <uri>${escapeXml(profile.githubUrl)}</uri>
  </author>
  <rights>© ${new Date().getFullYear()} ${escapeXml(profile.name)}</rights>
${entries}
</feed>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
    },
  });
}
