"use client";

import { useState, useTransition } from "react";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { followUserAction, unfollowUserAction } from "@/actions/follows";
import { cn } from "@/lib/utils";

type FollowButtonProps = {
  userId: string;
  initialFollowing?: boolean;
  className?: string;
};

export function FollowButton({
  userId,
  initialFollowing = false,
  className,
}: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const action = following ? unfollowUserAction : followUserAction;
      const result = await action({ userId });
      if (result.success && result.data) {
        setFollowing(result.data.following);
        toast.success(result.data.following ? "Following!" : "Unfollowed");
      } else {
        toast.error(result.error ?? "Sign in to follow authors");
      }
    });
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      variant={following ? "outline" : "default"}
      className={cn("rounded-xl gap-2", className)}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : following ? (
        <>
          <UserMinus className="size-4" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="size-4" />
          Follow
        </>
      )}
    </Button>
  );
}
