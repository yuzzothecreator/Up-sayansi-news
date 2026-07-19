import { listTagsAction } from "@/actions/admin";
import { TagManager } from "@/features/admin/tag-manager";

export default async function AdminTagsPage() {
  const result = await listTagsAction();
  const tags = result.success ? result.data! : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tags</h1>
        <p className="text-sm text-muted-foreground">Manage content tags.</p>
      </div>
      <TagManager tags={tags} />
    </div>
  );
}
