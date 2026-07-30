import { NextRequest, NextResponse } from "next/server";
import { RATE_LIMITS } from "@/lib/constants";
import { getRateLimitKey, rateLimit } from "@/lib/rate-limit";
import { isDatabaseReady } from "@/lib/db";
import {
  mockAuthors,
  mockCategories,
  mockPostCards,
  mockTags,
} from "@/lib/mock-data";
import { searchQuerySchema } from "@/lib/validators/common";
import * as searchService from "@/services/search";

function mockSearch(query: string) {
  const q = query.toLowerCase();

  const posts = mockPostCards.filter(
    (post) =>
      post.title.toLowerCase().includes(q) ||
      post.subtitle?.toLowerCase().includes(q) ||
      post.category?.name.toLowerCase().includes(q) ||
      post.author.name.toLowerCase().includes(q),
  );

  return {
    posts: {
      data: posts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        subtitle: post.subtitle,
        author: {
          id: post.author.id,
          name: post.author.name,
          image: post.author.image,
        },
        category: post.category
          ? { name: post.category.name, slug: post.category.slug }
          : null,
      })),
      meta: {
        page: 1,
        limit: 12,
        total: posts.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    },
    authors: mockAuthors
      .filter((author) => author.name.toLowerCase().includes(q))
      .map((author) => ({
        id: author.id,
        name: author.name,
        image: author.image,
        verified: author.verified,
      })),
    categories: mockCategories
      .filter((category) => category.name.toLowerCase().includes(q))
      .map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        color: category.color,
      })),
    tags: mockTags
      .filter((tag) => tag.name.toLowerCase().includes(q))
      .map((tag) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
      })),
  };
}

export async function GET(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "anonymous";

    const rl = rateLimit(getRateLimitKey("search", ip), RATE_LIMITS.search);
    if (!rl.success) {
      return NextResponse.json(
        { success: false, error: "Too many search requests" },
        { status: 429 },
      );
    }

    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const filters = searchQuerySchema.parse(params);

    if (!(await isDatabaseReady())) {
      return NextResponse.json({
        success: true,
        data: mockSearch(filters.q),
      });
    }

    const result = await searchService.globalSearch({
      query: filters.q,
      page: filters.page,
      limit: filters.limit,
      category: filters.category,
      tag: filters.tag,
      author: filters.author,
      sort: filters.sort,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Search failed";

    // Soft-fail to mock results when DB is unavailable mid-request
    try {
      const q = request.nextUrl.searchParams.get("q") ?? "";
      if (q) {
        return NextResponse.json({ success: true, data: mockSearch(q) });
      }
    } catch {
      // ignore
    }

    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
