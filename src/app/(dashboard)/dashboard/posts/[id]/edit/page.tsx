import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { canPublishPost } from "@/lib/permissions";
import { getPostByIdAction } from "@/actions/dashboard";
import { listCategories, listTags } from "@/services/categories";
import { PostEditor } from "@/features/editor/post-editor";
import type { TipTapContent } from "@/types";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [result, categories, tags] = await Promise.all([
    getPostByIdAction(id),
    listCategories(),
    listTags(),
  ]);

  if (!result.success || !result.data) notFound();

  const post = result.data;

  return (
    <div className="animate-fade-in">
      <PostEditor
        postId={post.id}
        initial={{
          title: post.title,
          subtitle: post.subtitle ?? undefined,
          coverImage: post.coverImage,
          content: post.content as TipTapContent,
          categoryId: post.categoryId,
          tagIds: post.tags.map((t) => t.tagId),
          status: post.status,
          scheduledAt: post.scheduledAt,
        }}
        categories={categories}
        tags={tags}
        canPublish={canPublishPost(user)}
      />
    </div>
  );
}
