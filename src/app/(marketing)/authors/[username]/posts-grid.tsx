"use client";

import { motion } from "framer-motion";
import { PostCardComponent } from "@/components/blog/post-card";
import { staggerContainer } from "@/lib/motion";
import type { PostCard } from "@/types";

export function PostsGrid({ posts }: { posts: PostCard[] }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {posts.map((post, i) => (
        <PostCardComponent key={post.id} post={post} index={i} />
      ))}
    </motion.div>
  );
}
