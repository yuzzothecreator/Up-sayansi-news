import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CategoriesGrid } from "./categories-grid";
import { safeCall } from "@/lib/safe-data";
import { mockCategories } from "@/lib/mock-data";
import * as categoriesService from "@/services/categories";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Categories",
  path: "/categories",
  description: "Browse stories by category on UpSayansi News",
});

export default async function CategoriesPage() {
  const categories = await safeCall(
    () => categoriesService.listCategories(),
    mockCategories,
  );

  return (
    <Container className="py-16">
      <SectionHeading
        title="Categories"
        description="Explore stories organized by topic"
        className="mb-12"
      />
      <CategoriesGrid categories={categories} />
    </Container>
  );
}
