import Link from "next/link";
import {
  AlertTriangle,
  Eye,
  FileText,
  MessageSquare,
  TrendingUp,
  Users,
} from "lucide-react";
import { getAdminStatsAction } from "@/actions/admin";
import { AdminStatsCard } from "@/features/admin/admin-stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminOverviewPage() {
  const result = await getAdminStatsAction();
  const stats = result.success
    ? result.data!
    : {
        users: 0,
        posts: 0,
        publishedPosts: 0,
        comments: 0,
        subscribers: 0,
        pendingReports: 0,
        viewsLast30Days: 0,
        newUsersLast30Days: 0,
        topPosts: [],
      };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Site overview</h1>
        <p className="text-sm text-muted-foreground">
          Platform health and key metrics at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatsCard title="Total users" value={stats.users} icon={Users} description={`+${stats.newUsersLast30Days} this month`} />
        <AdminStatsCard title="Published posts" value={stats.publishedPosts} icon={FileText} description={`${stats.posts} total`} />
        <AdminStatsCard title="Comments" value={stats.comments} icon={MessageSquare} />
        <AdminStatsCard title="Views (30d)" value={stats.viewsLast30Days.toLocaleString()} icon={Eye} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Pending reports</CardTitle>
            {stats.pendingReports > 0 && (
              <Badge variant="destructive">{stats.pendingReports}</Badge>
            )}
          </CardHeader>
          <CardContent>
            {stats.pendingReports === 0 ? (
              <p className="text-sm text-muted-foreground">No pending reports. All clear!</p>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <AlertTriangle className="size-5 text-destructive" />
                <div>
                  <p className="font-medium">{stats.pendingReports} reports need review</p>
                  <Link href="/admin/reports" className="text-sm text-primary hover:underline">
                    Review now →
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="size-4" />
              Top posts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.topPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No published posts yet.</p>
            ) : (
              stats.topPosts.map((post, i) => (
                <div key={post.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{i + 1}.</span>
                    <Link href={`/posts/${post.slug}`} className="font-medium hover:text-primary">
                      {post.title}
                    </Link>
                  </div>
                  <span className="text-muted-foreground">{post.viewsCount} views</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
