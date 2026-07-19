import prisma from "@/lib/prisma";
import { slugify, generateUniqueSlug } from "@/lib/slug";
import type { CategoryInput, TagInput } from "@/lib/validators/post";
import { ServiceError } from "@/lib/service-utils";

export async function createCategory(input: CategoryInput) {
  const slug =
    input.slug ??
    (await generateUniqueSlug(input.name, async (candidate) => {
      return Boolean(await prisma.category.findUnique({ where: { slug: candidate } }));
    }));

  return prisma.category.create({
    data: {
      name: input.name,
      slug,
      description: input.description,
      color: input.color,
      icon: input.icon,
    },
  });
}

export async function updateCategory(id: string, input: Partial<CategoryInput>) {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new ServiceError("Category not found", 404);

  let slug = existing.slug;
  if (input.name && !input.slug) {
    slug = slugify(input.name);
  } else if (input.slug) {
    slug = input.slug;
  }

  return prisma.category.update({
    where: { id },
    data: {
      name: input.name,
      slug,
      description: input.description,
      color: input.color,
      icon: input.icon,
    },
  });
}

export async function deleteCategory(id: string) {
  const postsCount = await prisma.post.count({ where: { categoryId: id } });
  if (postsCount > 0) {
    throw new ServiceError("Cannot delete category with posts", 400);
  }
  await prisma.category.delete({ where: { id } });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: { _count: { select: { posts: true } } },
  });
}

export async function listCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });
}

export async function createTag(input: TagInput) {
  const slug =
    input.slug ??
    (await generateUniqueSlug(input.name, async (candidate) => {
      return Boolean(await prisma.tag.findUnique({ where: { slug: candidate } }));
    }));

  return prisma.tag.create({
    data: { name: input.name, slug },
  });
}

export async function updateTag(id: string, input: Partial<TagInput>) {
  const existing = await prisma.tag.findUnique({ where: { id } });
  if (!existing) throw new ServiceError("Tag not found", 404);

  let slug = existing.slug;
  if (input.name && !input.slug) {
    slug = slugify(input.name);
  } else if (input.slug) {
    slug = input.slug;
  }

  return prisma.tag.update({
    where: { id },
    data: { name: input.name, slug },
  });
}

export async function deleteTag(id: string) {
  await prisma.postTag.deleteMany({ where: { tagId: id } });
  await prisma.tag.delete({ where: { id } });
}

export async function getTagBySlug(slug: string) {
  return prisma.tag.findUnique({
    where: { slug },
    include: { _count: { select: { posts: true } } },
  });
}

export async function listTags() {
  return prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });
}

export async function getPopularTags(limit = 20) {
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { posts: { _count: "desc" } },
    take: limit,
  });
  return tags;
}
