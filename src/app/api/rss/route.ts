import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/utils";
import * as postsService from "@/services/posts";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  try {
    const { data: posts } = await postsService.listPosts({
      page: 1,
      limit: 50,
      sort: "latest",
    });

    const items = posts
      .map((post) => {
        const url = absoluteUrl(`/blog/${post.slug}`);
        const pubDate = post.publishedAt?.toUTCString() ?? new Date().toUTCString();
        const description = escapeXml(post.subtitle ?? post.title);

        return `<item>
  <title>${escapeXml(post.title)}</title>
  <link>${url}</link>
  <guid isPermaLink="true">${url}</guid>
  <description>${description}</description>
  <pubDate>${pubDate}</pubDate>
  <author>${escapeXml(post.author.name)}</author>
</item>`;
      })
      .join("\n");

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${siteConfig.url}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>${siteConfig.defaultLocale}</language>
    <atom:link href="${absoluteUrl("/api/rss")}" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

    return new NextResponse(feed, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to generate RSS feed" }, { status: 500 });
  }
}
