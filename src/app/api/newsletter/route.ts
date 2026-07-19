import { NextRequest, NextResponse } from "next/server";
import { RATE_LIMITS } from "@/lib/constants";
import { getRateLimitKey, rateLimit } from "@/lib/rate-limit";
import {
  subscribeNewsletterSchema,
  unsubscribeNewsletterSchema,
  verifyNewsletterSchema,
} from "@/lib/validators/common";
import * as newsletterService from "@/services/newsletter";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = subscribeNewsletterSchema.parse(body);

    const rl = rateLimit(getRateLimitKey("newsletter", parsed.email), RATE_LIMITS.newsletter);
    if (!rl.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests" },
        { status: 429 },
      );
    }

    await newsletterService.subscribeNewsletter(parsed.email);

    return NextResponse.json({
      success: true,
      message: "Check your email to confirm your subscription.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Subscription failed";
    const status = message.includes("Already subscribed") ? 409 : 400;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = verifyNewsletterSchema.parse(body);
    await newsletterService.verifyNewsletterSubscription(parsed.token);

    return NextResponse.json({
      success: true,
      message: "Subscription confirmed.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Verification failed";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = unsubscribeNewsletterSchema.parse(body);
    await newsletterService.unsubscribeNewsletter(parsed.email);

    return NextResponse.json({
      success: true,
      message: "You have been unsubscribed.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unsubscribe failed";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
