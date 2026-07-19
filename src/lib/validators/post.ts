import { z } from "zod";
import {
  MAX_POST_SUBTITLE_LENGTH,
  MAX_POST_TITLE_LENGTH,
  MAX_SLUG_LENGTH,
  MAX_TAGS_PER_POST,
} from "@/lib/constants";

export const postStatusSchema = z.enum([
  "DRAFT",
  "PUBLISHED",
  "SCHEDULED",
  "ARCHIVED",
  "PENDING_REVIEW",
]);

export const createPostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(MAX_POST_TITLE_LENGTH, `Title must be at most ${MAX_POST_TITLE_LENGTH} characters`)
    .trim(),
  subtitle: z
    .string()
    .max(MAX_POST_SUBTITLE_LENGTH, `Subtitle must be at most ${MAX_POST_SUBTITLE_LENGTH} characters`)
    .trim()
    .optional()
    .nullable(),
  slug: z
    .string()
    .min(3)
    .max(MAX_SLUG_LENGTH)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only")
    .optional(),
  content: z.record(z.string(), z.unknown()),
  coverImage: z.string().url().optional().nullable(),
  categoryId: z.string().cuid().optional().nullable(),
  tagIds: z.array(z.string().cuid()).max(MAX_TAGS_PER_POST).optional().default([]),
  status: postStatusSchema.optional().default("DRAFT"),
  scheduledAt: z.coerce.date().optional().nullable(),
  featured: z.boolean().optional().default(false),
  pinned: z.boolean().optional().default(false),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
});

export const updatePostSchema = createPostSchema.partial().extend({
  id: z.string().cuid("Invalid post ID"),
});

export const publishPostSchema = z.object({
  id: z.string().cuid("Invalid post ID"),
  status: z.enum(["PUBLISHED", "PENDING_REVIEW", "SCHEDULED"]),
  scheduledAt: z.coerce.date().optional().nullable(),
});

export const postQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(12),
  status: postStatusSchema.optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  author: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  sort: z.enum(["latest", "popular", "trending"]).optional().default("latest"),
  q: z.string().max(200).optional(),
});

export const deletePostSchema = z.object({
  id: z.string().cuid("Invalid post ID"),
});

export const categorySchema = z.object({
  name: z.string().min(2).max(64).trim(),
  slug: z
    .string()
    .min(2)
    .max(64)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  description: z.string().max(500).optional().nullable(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex code")
    .optional()
    .nullable(),
  icon: z.string().max(32).optional().nullable(),
});

export const tagSchema = z.object({
  name: z.string().min(2).max(32).trim(),
  slug: z
    .string()
    .min(2)
    .max(32)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type PublishPostInput = z.infer<typeof publishPostSchema>;
export type PostQueryInput = z.infer<typeof postQuerySchema>;
export type DeletePostInput = z.infer<typeof deletePostSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type TagInput = z.infer<typeof tagSchema>;
