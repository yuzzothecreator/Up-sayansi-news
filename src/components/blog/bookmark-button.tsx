"use client";

import { useState, useTransition } from "react";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { bookmarkPostAction, removeBookmarkAction } from "@/actions/bookmarks";
import { cn } from "@/lib/utils";

type BookmarkButtonProps = {
  postId: string;
  initialBookmarked?: boolean;
  className?: string;
};

export function BookmarkButton({
  postId,
  initialBookmarked = false,
  className,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const action = bookmarked ? removeBookmarkAction : bookmarkPostAction;
      const result = await action({ postId });
      if (result.success) {
        setBookmarked(!bookmarked);
        toast.success(bookmarked ? "Removed from library" : "Saved to library");
      } else {
        toast.error(result.error ?? "Sign in to save stories");
      }
    });
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleClick}
      disabled={isPending}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
      className={cn(
        "rounded-xl transition-colors",
        bookmarked && "border-primary/50 bg-primary/10 text-primary hover:bg-primary/15",
        className,
      )}
    >
      <Bookmark className={cn("size-4", bookmarked && "fill-current")} />
    </Button>
  );
}
