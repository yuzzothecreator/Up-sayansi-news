"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, MoreHorizontal, Pin, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  deletePostAction,
  featurePostAction,
  pinPostAction,
  publishPostAction,
} from "@/actions/posts";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PostWithRelations } from "@/types";

type ArticleRowActionsProps = {
  post: PostWithRelations;
};

export function ArticleRowActions({ post }: ArticleRowActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const run = (action: () => Promise<{ success: boolean; error?: string }>, message: string) => {
    startTransition(async () => {
      const result = await action();
      if (!result.success) {
        toast.error(result.error ?? "Action failed");
        return;
      }
      toast.success(message);
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8" disabled={isPending}>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {post.status === "PENDING_REVIEW" && (
          <DropdownMenuItem
            onClick={() =>
              run(
                () => publishPostAction({ id: post.id, status: "PUBLISHED" }),
                "Post approved and published",
              )
            }
          >
            <CheckCircle className="mr-2 size-4" />
            Approve & publish
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() =>
            run(
              () => featurePostAction({ id: post.id, featured: !post.featured }),
              post.featured ? "Removed from featured" : "Marked as featured",
            )
          }
        >
          <Star className="mr-2 size-4" />
          {post.featured ? "Unfeature" : "Feature"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            run(
              () => pinPostAction({ id: post.id, pinned: !post.pinned }),
              post.pinned ? "Unpinned" : "Pinned",
            )
          }
        >
          <Pin className="mr-2 size-4" />
          {post.pinned ? "Unpin" : "Pin"}
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/posts/${post.id}/edit`}>Edit</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => {
            if (!window.confirm("Delete this post?")) return;
            run(() => deletePostAction({ id: post.id }), "Post deleted");
          }}
        >
          <Trash2 className="mr-2 size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
