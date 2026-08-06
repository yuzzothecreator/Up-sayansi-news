import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "API",
  path: "/docs/api",
  description: "UpSayansi News public API overview",
  noIndex: true,
});

export default function ApiDocsPage() {
  return (
    <Container className="py-16">
      <SectionHeading
        title="Public API"
        description="Read-only endpoints for feeds and search."
        className="mb-10"
      />
      <div className="prose-pulse mx-auto max-w-3xl space-y-6">
        <section>
          <h2>RSS feed</h2>
          <p>
            <code>GET /api/rss</code> — latest published posts as RSS 2.0.
          </p>
        </section>
        <section>
          <h2>Search</h2>
          <p>
            <code>GET /api/search?q=your+query</code> — search posts, authors, categories, and tags.
          </p>
        </section>
        <section>
          <h2>Posts</h2>
          <p>
            <code>GET /api/posts</code> — paginated list of published posts (query params: page,
            limit, sort).
          </p>
        </section>
        <p className="text-sm text-muted-foreground">
          Authenticated write APIs are available through the dashboard and server actions. A full REST
          documentation site is coming soon.
        </p>
      </div>
    </Container>
  );
}
