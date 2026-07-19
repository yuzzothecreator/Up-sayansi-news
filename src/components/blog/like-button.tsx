"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { likePostAction } from "@/actions/likes";
import { cn } from "@/lib/utils";

type LikeButtonProps = {
  postId: string;
  initialCount: number;
  initialLiked?: boolean;
  className?: string;
};

export function LikeButton({
  postId,
  initialCount,
  initialLiked = false,
  className,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await likePostAction({ postId });
      if (result.success && result.data) {
        setLiked(result.data.liked);
        setCount((c) => (result.data!.liked ? c + 1 : c - 1));
      } else {
        toast.error(result.error ?? "Sign in to like this story");
      }
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "rounded-xl gap-2 transition-colors",
        liked && "border-primary/50 bg-primary/10 text-primary hover:bg-primary/15",
        className,
      )}
    >
      <Heart className={cn("size-4", liked && "fill-current")} />
      {count}
    </Button>
  );
}
