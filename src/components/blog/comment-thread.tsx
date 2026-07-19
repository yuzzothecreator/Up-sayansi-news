"use client";

import { useState, useTransition } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { likeCommentAction } from "@/actions/comments";
import { CommentForm } from "@/components/blog/comment-form";
import { formatRelativeTime } from "@/lib/utils";
import type { CommentWithAuthor } from "@/types";
import { cn } from "@/lib/utils";

type CommentThreadProps = {
  comments: CommentWithAuthor[];
  postId: string;
  className?: string;
};

function CommentItem({
  comment,
  postId,
  depth = 0,
}: {
  comment: CommentWithAuthor;
  postId: string;
  depth?: number;
}) {
  const [showReply, setShowReply] = useState(false);
  const [likes, setLikes] = useState(comment._count?.likes ?? 0);
  const [isPending, startTransition] = useTransition();

  const initials = comment.author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  function handleLike() {
    startTransition(async () => {
      const result = await likeCommentAction(comment.id);
      if (result.success && result.data) {
        setLikes((l) => (result.data!.liked ? l + 1 : l - 1));
      }
    });
  }

  return (
    <div id={`comment-${comment.id}`} className={cn("space-y-4", depth > 0 && "ml-6 border-l-2 border-border/50 pl-4")}>
      <div className="flex gap-3">
        <Avatar className="size-9 shrink-0">
          <AvatarImage src={comment.author.image ?? undefined} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{comment.author.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm leading-relaxed">{comment.content}</p>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isPending}
              className="h-7 rounded-lg px-2 text-xs text-muted-foreground"
            >
              <Heart className="size-3.5" />
              {likes}
            </Button>
            {depth < 2 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReply(!showReply)}
                className="h-7 rounded-lg px-2 text-xs text-muted-foreground"
              >
                <MessageCircle className="size-3.5" />
                Reply
              </Button>
            )}
          </div>
          {showReply && (
            <CommentForm
              postId={postId}
              parentId={comment.id}
              placeholder="Write a reply…"
              onSuccess={() => setShowReply(false)}
            />
          )}
        </div>
      </div>
      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} postId={postId} depth={depth + 1} />
      ))}
    </div>
  );
}

export function CommentThread({ comments, postId, className }: CommentThreadProps) {
  if (comments.length === 0) {
    return (
      <div className={cn("rounded-2xl border border-dashed border-border/50 p-8 text-center", className)}>
        <MessageCircle className="mx-auto size-8 text-muted-foreground/50" />
        <p className="mt-3 text-sm text-muted-foreground">No comments yet. Be the first to share your thoughts.</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} postId={postId} />
      ))}
    </div>
  );
}
