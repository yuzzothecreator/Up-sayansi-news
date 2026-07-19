"use client";

import { motion } from "framer-motion";
import { CategoryCard } from "@/components/blog/category-card";
import { staggerContainer } from "@/lib/motion";

type CategoriesGridProps = {
  categories: Array<{
    name: string;
    slug: string;
    description?: string | null;
    color?: string | null;
    icon?: string | null;
    _count?: { posts: number };
  }>;
};

export function CategoriesGrid({ categories }: CategoriesGridProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {categories.map((cat) => (
        <CategoryCard key={cat.slug} category={cat} />
      ))}
    </motion.div>
  );
}
