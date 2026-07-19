import { Suspense } from "react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { SearchResults } from "./search-results";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Search",
  path: "/search",
  description: "Search stories on Pulse",
});

type SearchPageProps = {
  searchParams: Promise<{ q?: string; page?: string; sort?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  return (
    <Container className="py-16">
      <SectionHeading
        title={params.q ? `Results for "${params.q}"` : "Search"}
        description="Find stories, topics, and authors"
        className="mb-10"
      />
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <SearchResults
          query={params.q ?? ""}
          page={Number(params.page) || 1}
          sort={(params.sort as "latest" | "popular" | "trending") ?? "latest"}
        />
      </Suspense>
    </Container>
  );
}
