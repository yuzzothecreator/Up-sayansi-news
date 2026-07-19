"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Edit, ExternalLink, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deletePostAction } from "@/actions/posts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";
import type { PostWithRelations } from "@/types";

type PostsTableProps = {
  posts: PostWithRelations[];
  showAuthor?: boolean;
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  PUBLISHED: "default",
  DRAFT: "secondary",
  SCHEDULED: "outline",
  PENDING_REVIEW: "outline",
  ARCHIVED: "destructive",
};

export function PostsTable({ posts: initialPosts, showAuthor = false }: PostsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "all");
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (status !== "all") params.set("status", status);
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : "?", { scroll: false });
  }, [debouncedQuery, status, router]);

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await deletePostAction({ id });
      if (!result.success) {
        toast.error(result.error ?? "Failed to delete");
        return;
      }
      toast.success("Post deleted");
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search posts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
            <SelectItem value="PENDING_REVIEW">Pending review</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border/60 bg-card shadow-soft">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              {showAuthor && <TableHead>Author</TableHead>}
              <TableHead>Views</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <div>
                    <Link
                      href={`/dashboard/posts/${post.id}/edit`}
                      className="font-medium hover:text-primary"
                    >
                      {post.title}
                    </Link>
                    {post.subtitle && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {post.subtitle}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[post.status] ?? "secondary"}>
                    {post.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                {showAuthor && (
                  <TableCell className="text-sm">{post.author.name}</TableCell>
                )}
                <TableCell>{post.viewsCount.toLocaleString()}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatRelativeTime(post.updatedAt)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/posts/${post.id}/edit`}>
                          <Edit className="mr-2 size-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      {post.status === "PUBLISHED" && (
                        <DropdownMenuItem asChild>
                          <Link href={`/posts/${post.slug}`} target="_blank">
                            <ExternalLink className="mr-2 size-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        disabled={isPending}
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function PostStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={STATUS_VARIANT[status] ?? "secondary"}>
      {status.replace("_", " ")}
    </Badge>
  );
}

export { formatDate };
