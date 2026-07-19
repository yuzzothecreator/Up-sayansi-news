import { listCategoriesAction } from "@/actions/admin";
import { CategoryManager } from "@/features/admin/category-manager";
import { EmptyState } from "@/components/shared/empty-state";
import { Tags } from "lucide-react";

export default async function AdminCategoriesPage() {
  const result = await listCategoriesAction();
  const categories = result.success ? result.data! : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
        <p className="text-sm text-muted-foreground">Organize content by topic.</p>
      </div>

      {categories.length === 0 ? (
        <EmptyState
          icon={Tags}
          title="No categories"
          description="Create your first category below."
          className="mb-4"
        />
      ) : null}

      <CategoryManager categories={categories} />
    </div>
  );
}
