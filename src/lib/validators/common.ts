import { z } from "zod";
import { REPORT_REASONS } from "@/lib/constants";

export const subscribeNewsletterSchema = z.object({
  email: z.string().email("Please enter a valid email").trim().toLowerCase(),
});

export const verifyNewsletterSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const unsubscribeNewsletterSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
});

export type SubscribeNewsletterInput = z.infer<typeof subscribeNewsletterSchema>;
export type VerifyNewsletterInput = z.infer<typeof verifyNewsletterSchema>;
export type UnsubscribeNewsletterInput = z.infer<typeof unsubscribeNewsletterSchema>;

export const createReportSchema = z
  .object({
    reason: z.enum(REPORT_REASONS),
    description: z.string().max(1000).optional(),
    postId: z.string().cuid().optional(),
    commentId: z.string().cuid().optional(),
    targetUserId: z.string().cuid().optional(),
  })
  .refine((data) => data.postId || data.commentId || data.targetUserId, {
    message: "A report target is required",
  });

export const resolveReportSchema = z.object({
  id: z.string().cuid(),
  status: z.enum(["RESOLVED", "DISMISSED", "REVIEWING"]),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
export type ResolveReportInput = z.infer<typeof resolveReportSchema>;

export const bookmarkPostSchema = z.object({
  postId: z.string().cuid(),
});

export const collectionItemSchema = z.object({
  collectionId: z.string().cuid(),
  postId: z.string().cuid(),
});

export const likePostSchema = z.object({
  postId: z.string().cuid(),
});

export const likeCommentSchema = z.object({
  commentId: z.string().cuid(),
});

export const followUserSchema = z.object({
  userId: z.string().cuid(),
});

export const searchQuerySchema = z.object({
  q: z.string().min(1).max(200),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(12),
  category: z.string().optional(),
  tag: z.string().optional(),
  author: z.string().optional(),
  sort: z.enum(["latest", "popular", "trending"]).optional().default("latest"),
});

export type SearchQueryInput = z.infer<typeof searchQuerySchema>;

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(64).trim(),
  email: z.string().email("Please enter a valid email").trim().toLowerCase(),
  subject: z.string().min(3, "Subject is required").max(120).trim(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000).trim(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
