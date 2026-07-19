import { z } from "zod";
import { MAX_BIO_LENGTH } from "@/lib/constants";

const optionalUrl = z
  .string()
  .url("Please enter a valid URL")
  .optional()
  .nullable()
  .or(z.literal(""));

const optionalHandle = z
  .string()
  .max(50)
  .regex(/^[a-zA-Z0-9_]*$/, "Handle may only contain letters, numbers, and underscores")
  .optional()
  .nullable()
  .or(z.literal(""));

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(64, "Name must be at most 64 characters")
    .trim()
    .optional(),
  bio: z
    .string()
    .max(MAX_BIO_LENGTH, `Bio must be at most ${MAX_BIO_LENGTH} characters`)
    .trim()
    .optional()
    .nullable(),
  website: optionalUrl,
  twitter: optionalHandle,
  github: optionalHandle,
  location: z.string().max(100).trim().optional().nullable(),
  coverImage: z.string().url().optional().nullable(),
  image: z.string().url().optional().nullable(),
});

export const createBookmarkCollectionSchema = z.object({
  name: z.string().min(1).max(64).trim(),
  description: z.string().max(300).trim().optional().nullable(),
  isPublic: z.boolean().optional().default(false),
});

export const updateBookmarkCollectionSchema = createBookmarkCollectionSchema.partial().extend({
  id: z.string().cuid("Invalid collection ID"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateBookmarkCollectionInput = z.infer<typeof createBookmarkCollectionSchema>;
export type UpdateBookmarkCollectionInput = z.infer<typeof updateBookmarkCollectionSchema>;
