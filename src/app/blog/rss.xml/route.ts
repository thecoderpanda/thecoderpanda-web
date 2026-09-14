import { marked } from "marked";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

const SITE_URL = "https://thecoderpanda.com";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = getAllPosts();

  const items = await Promise.all(
    posts.map(async (p) => {
      const full = getPostBySlug(p.slug);
      const html = full ? await marked(full.content, { breaks: true, gfm: true }) : "";
      const link = `${SITE_URL}/blog/${p.slug}`;
      const pubDate = new Date(p.date).toUTCString();
      return `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(p.subtitle || "")}</description>
      <content:encoded><![CDATA[${html}]]></content:encoded>
    </item>`;
    })
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>thecoderpanda — Blog</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Notes on developer relations, AI tooling, and building things worth using.</description>
    <language>en-us</language>${items.join("")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
