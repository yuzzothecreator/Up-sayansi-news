import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import * as postsService from "@/services/posts";
import * as analyticsService from "@/services/analytics";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const user = await getCurrentUser();

    const post = await postsService.getPostBySlug(slug, {
      includeDraft: Boolean(user),
      authorId: user?.id,
    });

    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    if (post.status === "PUBLISHED") {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        request.headers.get("x-real-ip") ??
        undefined;

      await analyticsService.recordView(post.id, {
        userId: user?.id,
        ipAddress: ip,
        userAgent: request.headers.get("user-agent") ?? undefined,
      });
    }

    const [related, adjacent] = await Promise.all([
      postsService.getRelatedPosts(post.id),
      postsService.getAdjacentPosts(slug),
    ]);

    return NextResponse.json({
      success: true,
      data: { post, related, adjacent },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch post";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
