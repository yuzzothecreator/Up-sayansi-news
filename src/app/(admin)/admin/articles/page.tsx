import { listAdminPostsAction } from "@/actions/admin";
import { DataTable } from "@/features/admin/data-table";
import { ArticleRowActions } from "@/features/admin/article-row-actions";
import { PostStatusBadge } from "@/features/dashboard/posts-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { FileText, Star } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type PageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminArticlesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const result = await listAdminPostsAction({ status: params.status });
  const posts = result.success ? result.data!.data : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Articles</h1>
        <p className="text-sm text-muted-foreground">
          Review, approve, feature, and manage all posts.
        </p>
      </div>

      {posts.length === 0 ? (
        <EmptyState icon={FileText} title="No articles" description="Posts will appear here." />
      ) : (
        <DataTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.author.name}</TableCell>
                  <TableCell>
                    <PostStatusBadge status={post.status} />
                  </TableCell>
                  <TableCell>{post.viewsCount.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {post.featured && (
                        <Badge variant="default" className="gap-1">
                          <Star className="size-3" />
                          Featured
                        </Badge>
                      )}
                      {post.pinned && <Badge variant="outline">Pinned</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatRelativeTime(post.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <ArticleRowActions post={post} />
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
