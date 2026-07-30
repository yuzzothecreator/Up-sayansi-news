import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { canPublishPost } from "@/lib/permissions";
import { listCategories, listTags } from "@/services/categories";
import { PostEditor } from "@/features/editor/post-editor";

export default async function NewPostPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [categories, tags] = await Promise.all([listCategories(), listTags()]);

  return (
    <div className="animate-fade-in">
      <PostEditor categories={categories} tags={tags} canPublish={canPublishPost(user)} />
    </div>
  );
}
