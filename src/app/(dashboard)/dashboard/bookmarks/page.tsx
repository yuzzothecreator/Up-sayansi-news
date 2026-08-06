import Link from "next/link";
import { Bookmark } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getBookmarks } from "@/services/bookmarks";
import { PageHeader } from "@/features/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { formatRelativeTime } from "@/lib/utils";

export default async function DashboardBookmarksPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { data: bookmarks } = await getBookmarks(user.id);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Bookmarks"
        description="Stories you've saved for later."
      />

      {bookmarks.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No bookmarks yet"
          description="Save stories from the feed to read them later."
          actionLabel="Explore stories"
          actionHref="/"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="overflow-hidden transition-shadow hover:shadow-elevated">
              {bookmark.post.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={bookmark.post.coverImage}
                  alt=""
                  className="aspect-video w-full object-cover"
                />
              )}
              <CardContent className="p-4">
                <Link href={`/blog/${bookmark.post.slug}`} className="font-semibold hover:text-primary">
                  {bookmark.post.title}
                </Link>
                {bookmark.post.subtitle && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {bookmark.post.subtitle}
                  </p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  Saved {formatRelativeTime(bookmark.createdAt)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
