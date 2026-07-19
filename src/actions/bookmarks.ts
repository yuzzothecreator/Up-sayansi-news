"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { actionError, actionSuccess, type ActionResult } from "@/lib/action-utils";
import { requirePermission } from "@/lib/permissions";
import {
  bookmarkPostSchema,
  collectionItemSchema,
} from "@/lib/validators/common";
import {
  createBookmarkCollectionSchema,
  updateBookmarkCollectionSchema,
} from "@/lib/validators/profile";
import * as bookmarksService from "@/services/bookmarks";

export async function bookmarkPostAction(input: unknown): Promise<ActionResult> {
  try {
    const user = await requireAuth();
    requirePermission(user, "bookmark:create");

    const parsed = bookmarkPostSchema.parse(input);
    await bookmarksService.bookmarkPost(user.id, parsed.postId);
    revalidatePath("/bookmarks");
    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}

export async function removeBookmarkAction(input: unknown): Promise<ActionResult> {
  try {
    const user = await requireAuth();
    const parsed = bookmarkPostSchema.parse(input);
    await bookmarksService.removeBookmark(user.id, parsed.postId);
    revalidatePath("/bookmarks");
    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}

export async function createCollectionAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await requireAuth();
    requirePermission(user, "bookmark:create");

    const parsed = createBookmarkCollectionSchema.parse(input);
    const collection = await bookmarksService.createCollection(user.id, parsed);
    revalidatePath("/bookmarks");
    return actionSuccess({ id: collection.id });
  } catch (error) {
    return actionError(error);
  }
}

export async function updateCollectionAction(input: unknown): Promise<ActionResult> {
  try {
    const user = await requireAuth();
    const parsed = updateBookmarkCollectionSchema.parse(input);
    await bookmarksService.updateCollection(user.id, parsed);
    revalidatePath("/bookmarks");
    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteCollectionAction(collectionId: string): Promise<ActionResult> {
  try {
    const user = await requireAuth();
    await bookmarksService.deleteCollection(user.id, collectionId);
    revalidatePath("/bookmarks");
    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}

export async function addToCollectionAction(input: unknown): Promise<ActionResult> {
  try {
    const user = await requireAuth();
    const parsed = collectionItemSchema.parse(input);
    await bookmarksService.addToCollection(user.id, parsed.collectionId, parsed.postId);
    revalidatePath("/bookmarks");
    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}

export async function removeFromCollectionAction(input: unknown): Promise<ActionResult> {
  try {
    const user = await requireAuth();
    const parsed = collectionItemSchema.parse(input);
    await bookmarksService.removeFromCollection(user.id, parsed.collectionId, parsed.postId);
    revalidatePath("/bookmarks");
    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}

export async function getReadingListAction(page = 1) {
  try {
    const user = await requireAuth();
    const result = await bookmarksService.getReadingList(user.id, page);
    return actionSuccess(result);
  } catch (error) {
    return actionError(error);
  }
}
