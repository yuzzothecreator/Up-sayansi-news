import Image from "next/image";
import { notFound } from "next/navigation";
import { BadgeCheck, MapPin } from "lucide-react";
import { Container } from "@/components/shared/container";
import { FollowButton } from "@/components/blog/follow-button";
import { PostsGrid } from "./posts-grid";
import { safeCall, safeCallNullable } from "@/lib/safe-data";
import { mockAuthors, mockPostCards } from "@/lib/mock-data";
import { nameToUsername } from "@/lib/username";
import * as usersService from "@/services/users";
import * as postsService from "@/services/posts";
import { createMetadata } from "@/lib/metadata";

type AuthorPageProps = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: AuthorPageProps) {
  const { username } = await params;
  const author = await safeCallNullable(
    () => usersService.getUserByUsername(username),
    mockAuthors.find((a) => nameToUsername(a.name) === username) ?? null,
  );
  if (!author) return createMetadata({ title: "Author not found", noIndex: true });
  return createMetadata({
    title: author.name,
    description: author.profile?.bio ?? `Stories by ${author.name} on Pulse`,
    path: `/authors/${username}`,
    image: author.image ?? undefined,
  });
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { username } = await params;

  const author = await safeCallNullable(
    () => usersService.getUserByUsername(username),
    mockAuthors.find((a) => nameToUsername(a.name) === username) ?? null,
  );

  if (!author) notFound();

  const posts = await safeCall(
    () => postsService.listPosts({ author: author.id, page: 1, limit: 12, sort: "latest" }),
    { data: mockPostCards.filter((p) => p.author.id === author.id || p.author.name === author.name), meta: { page: 1, limit: 12, total: 3, totalPages: 1, hasNext: false, hasPrev: false } },
  );

  const initials = author.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <>
      <div className="relative border-b border-border/50 bg-muted/30">
        {author.profile?.coverImage && (
          <Image src={author.profile.coverImage} alt="" fill className="object-cover opacity-30" />
        )}
        <Container className="relative py-16">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <div className="relative size-24 overflow-hidden rounded-2xl border-4 border-background shadow-elevated sm:size-32">
              {author.image ? (
                <Image src={author.image} alt={author.name} fill className="object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center bg-primary/10 text-2xl font-bold text-primary">{initials}</div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-start">
                <h1 className="text-3xl font-bold tracking-tight">{author.name}</h1>
                {author.verified && <BadgeCheck className="size-6 text-primary" />}
              </div>
              {author.profile?.bio && (
                <p className="max-w-xl text-muted-foreground">{author.profile.bio}</p>
              )}
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground sm:justify-start">
                {author.profile?.location && (
                  <span className="flex items-center gap-1"><MapPin className="size-3.5" />{author.profile.location}</span>
                )}
                <span><strong className="text-foreground">{author._count?.posts ?? 0}</strong> stories</span>
                <span><strong className="text-foreground">{author._count?.followers ?? 0}</strong> followers</span>
                <span><strong className="text-foreground">{author._count?.following ?? 0}</strong> following</span>
              </div>
            </div>
            <FollowButton userId={author.id} />
          </div>
        </Container>
      </div>

      <Container className="py-16">
        <h2 className="mb-8 text-2xl font-semibold tracking-tight">Stories by {author.name}</h2>
        {posts.data.length > 0 ? (
          <PostsGrid posts={posts.data} />
        ) : (
          <p className="text-muted-foreground">No published stories yet.</p>
        )}
      </Container>
    </>
  );
}
