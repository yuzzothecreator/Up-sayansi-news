import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Pagination } from "@/components/blog/pagination";
import { AuthorsGrid } from "./authors-grid";
import { safeCall } from "@/lib/safe-data";
import { mockAuthors } from "@/lib/mock-data";
import * as usersService from "@/services/users";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Authors",
  path: "/authors",
  description: "Meet the writers behind Pulse",
});

type AuthorsPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function AuthorsPage({ searchParams }: AuthorsPageProps) {
  const { page: pageStr } = await searchParams;
  const page = Number(pageStr) || 1;

  const result = await safeCall(
    () => usersService.listAuthors(page, 12),
    { data: mockAuthors, meta: { page: 1, limit: 12, total: mockAuthors.length, totalPages: 1, hasNext: false, hasPrev: false } },
  );

  return (
    <Container className="py-16">
      <SectionHeading
        title="Our authors"
        description="Discover the voices shaping stories on Pulse"
        className="mb-12"
      />
      <AuthorsGrid authors={result.data} />
      <Pagination page={result.meta.page} totalPages={result.meta.totalPages} basePath="/authors" className="mt-12" />
    </Container>
  );
}
