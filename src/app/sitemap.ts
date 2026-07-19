import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { safeCall } from "@/lib/safe-data";
import { mockPostCards, mockCategories } from "@/lib/mock-data";
import * as postsService from "@/services/posts";
import * as categoriesService from "@/services/categories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/authors`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const [postsResult, categories] = await Promise.all([
    safeCall(
      () => postsService.listPosts({ page: 1, limit: 100, sort: "latest" }),
      { data: mockPostCards, meta: { page: 1, limit: 100, total: 6, totalPages: 1, hasNext: false, hasPrev: false } },
    ),
    safeCall(() => categoriesService.listCategories(), mockCategories),
  ]);

  const postPages: MetadataRoute.Sitemap = postsResult.data.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.publishedAt ?? new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${base}/categories/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...postPages, ...categoryPages];
}
