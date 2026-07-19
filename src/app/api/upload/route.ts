import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getCurrentUser } from "@/lib/auth";
import { RATE_LIMITS, STORAGE_BUCKETS } from "@/lib/constants";
import { can } from "@/lib/permissions";
import { getRateLimitKey, rateLimit } from "@/lib/rate-limit";
import { uploadFileServer } from "@/lib/supabase/server";
import { siteConfig } from "@/config/site";

const ALLOWED_TYPES = new Set(siteConfig.supportedImageTypes);
const MAX_SIZE = siteConfig.maxUploadSizeMb * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.banned) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!can(user, "post:create") && !can(user, "user:update:own")) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const rl = rateLimit(getRateLimitKey("upload", user.id), RATE_LIMITS.upload);
    if (!rl.success) {
      return NextResponse.json(
        { success: false, error: "Too many uploads" },
        { status: 429 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const bucket = (formData.get("bucket") as string) ?? "posts";

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type as (typeof siteConfig.supportedImageTypes)[number])) {
      return NextResponse.json({ success: false, error: "Unsupported file type" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: `File exceeds ${siteConfig.maxUploadSizeMb}MB limit` },
        { status: 400 },
      );
    }

    const storageBucket = bucket in STORAGE_BUCKETS
      ? (bucket as keyof typeof STORAGE_BUCKETS)
      : "posts";

    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${user.id}/${nanoid()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await uploadFileServer(storageBucket, path, buffer, {
      contentType: file.type,
    });

    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        path: result.path,
        size: file.size,
        mimeType: file.type,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
