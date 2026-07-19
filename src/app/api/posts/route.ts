import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { can, canPublishPost } from "@/lib/permissions";
import { postQuerySchema, createPostSchema } from "@/lib/validators/post";
import * as postsService from "@/services/posts";
import { writeAuditLog } from "@/services/audit";

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const filters = postQuerySchema.parse(params);
    const result = await postsService.listPosts(filters);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch posts";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.banned) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!can(user, "post:create")) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = createPostSchema.parse(body);
    const status = canPublishPost(user) ? parsed.status : "DRAFT";

    const post = await postsService.createPost({ ...parsed, status }, user.id);

    await writeAuditLog({
      userId: user.id,
      action: "CREATE",
      entityType: "post",
      entityId: post.id,
    });

    return NextResponse.json(
      { success: true, data: { id: post.id, slug: post.slug } },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create post";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
