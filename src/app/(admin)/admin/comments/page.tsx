import { listAdminCommentsAction } from "@/actions/admin";
import { DataTable } from "@/features/admin/data-table";
import { CommentModerationActions } from "@/features/admin/comment-moderation-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { MessageSquare } from "lucide-react";
import { formatRelativeTime, truncate } from "@/lib/utils";
import Link from "next/link";

export default async function AdminCommentsPage() {
  const result = await listAdminCommentsAction(1);
  const comments = result.success ? result.data!.data : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Comments</h1>
        <p className="text-sm text-muted-foreground">Moderate community discussions.</p>
      </div>

      {comments.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No comments" description="Comments will appear here." />
      ) : (
        <DataTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Comment</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Post</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className="max-w-xs">
                    {truncate(comment.content, 120)}
                  </TableCell>
                  <TableCell>{comment.author.name}</TableCell>
                  <TableCell>
                    <Link
                      href={`/blog/${comment.post.slug}`}
                      className="text-primary hover:underline"
                    >
                      {truncate(comment.post.title, 40)}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatRelativeTime(comment.createdAt)}
                  </TableCell>
                  <TableCell>
                    <CommentModerationActions commentId={comment.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataTable>
      )}
    </div>
  );
}
