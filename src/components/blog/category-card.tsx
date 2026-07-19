"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

type CategoryCardProps = {
  category: {
    name: string;
    slug: string;
    description?: string | null;
    color?: string | null;
    icon?: string | null;
    _count?: { posts: number };
  };
  className?: string;
};

export function CategoryCard({ category, className }: CategoryCardProps) {
  const IconComponent =
    category.icon && category.icon in LucideIcons
      ? (LucideIcons[category.icon as keyof typeof LucideIcons] as React.ComponentType<{
          className?: string;
        }>)
      : LucideIcons.Folder;

  return (
    <motion.div variants={staggerItem}>
      <Link
        href={`/categories/${category.slug}`}
        className={cn(
          "group flex flex-col gap-4 rounded-2xl border border-border/50 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated",
          className,
        )}
      >
        <div
          className="flex size-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
          style={{
            backgroundColor: category.color ? `${category.color}20` : "var(--accent)",
            color: category.color ?? "var(--primary)",
          }}
        >
          <IconComponent className="size-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
            {category.name}
          </h3>
          {category.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{category.description}</p>
          )}
        </div>
        {category._count && (
          <p className="text-xs font-medium text-muted-foreground">
            {category._count.posts} {category._count.posts === 1 ? "story" : "stories"}
          </p>
        )}
      </Link>
    </motion.div>
  );
}
