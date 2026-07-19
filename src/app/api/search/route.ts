import { NextRequest, NextResponse } from "next/server";
import { RATE_LIMITS } from "@/lib/constants";
import { getRateLimitKey, rateLimit } from "@/lib/rate-limit";
import { searchQuerySchema } from "@/lib/validators/common";
import * as searchService from "@/services/search";

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
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
