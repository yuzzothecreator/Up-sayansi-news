"use client";

import { motion } from "framer-motion";
import { AuthorCard } from "@/components/blog/author-card";
import { staggerContainer } from "@/lib/motion";
import type { UserProfile } from "@/types";

type AuthorsGridProps = {
  authors: UserProfile[];
};

export function AuthorsGrid({ authors }: AuthorsGridProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {authors.map((author) => (
        <AuthorCard key={author.id} author={author} />
      ))}
    </motion.div>
  );
}
