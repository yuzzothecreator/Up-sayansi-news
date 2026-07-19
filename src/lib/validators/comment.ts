import { z } from "zod";
import { MAX_COMMENT_LENGTH } from "@/lib/constants";

export const createCommentSchema = z.object({
  postId: z.string().cuid("Invalid post ID"),
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(MAX_COMMENT_LENGTH, `Comment must be at most ${MAX_COMMENT_LENGTH} characters`)
    .trim(),
  parentId: z.string().cuid("Invalid parent comment ID").optional().nullable(),
});

export const updateCommentSchema = z.object({
  id: z.string().cuid("Invalid comment ID"),
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(MAX_COMMENT_LENGTH, `Comment must be at most ${MAX_COMMENT_LENGTH} characters`)
    .trim(),
});

export const deleteCommentSchema = z.object({
  id: z.string().cuid("Invalid comment ID"),
});

export const commentQuerySchema = z.object({
  postId: z.string().cuid("Invalid post ID"),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
  parentId: z.string().cuid().optional().nullable(),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type DeleteCommentInput = z.infer<typeof deleteCommentSchema>;
export type CommentQueryInput = z.infer<typeof commentQuerySchema>;
