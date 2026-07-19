"use server";

import { actionError, actionSuccess, type ActionResult } from "@/lib/action-utils";
import { RATE_LIMITS } from "@/lib/constants";
import { getRateLimitKey, rateLimit } from "@/lib/rate-limit";
import {
  subscribeNewsletterSchema,
  unsubscribeNewsletterSchema,
  verifyNewsletterSchema,
} from "@/lib/validators/common";
import * as newsletterService from "@/services/newsletter";

export async function subscribeNewsletterAction(input: unknown): Promise<ActionResult> {
  try {
    const parsed = subscribeNewsletterSchema.parse(input);

    const rl = rateLimit(getRateLimitKey("newsletter", parsed.email), RATE_LIMITS.newsletter);
    if (!rl.success) return actionError(new Error("Too many requests. Please try again later."));

    await newsletterService.subscribeNewsletter(parsed.email);
    return actionSuccess(undefined);
  } catch (error) {
    return actionError(error);
  }
}

export async function verifyNewsletterAction(input: unknown): Promise<ActionResult> {
  try {
    const parsed = verifyNewsletterSchema.parse(input);
    await newsletterService.verifyNewsletterSubscription(parsed.token);
    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}

export async function unsubscribeNewsletterAction(input: unknown): Promise<ActionResult> {
  try {
    const parsed = unsubscribeNewsletterSchema.parse(input);
    await newsletterService.unsubscribeNewsletter(parsed.email);
    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}
