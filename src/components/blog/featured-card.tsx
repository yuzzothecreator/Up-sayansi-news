"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { authorProfileUrl } from "@/lib/username";
import { fadeInUp } from "@/lib/motion";
import type { PostCard } from "@/types";
import { cn } from "@/lib/utils";

type FeaturedCardProps = {
  post: PostCard;
  className?: string;
  priority?: boolean;
};

export function FeaturedCard({ post, className, priority = false }: FeaturedCardProps) {
  const initials = post.author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const postHref = `/blog/${post.slug}`;

  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      transition={{ duration: 0.5 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-border/50 shadow-elevated",
        className,
      )}
    >
      <div className="relative aspect-[21/9] min-h-[280px] sm:min-h-[360px]">
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt=""
            fill
            priority={priority}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Stretched post link — sits under interactive children */}
        <Link
          href={postHref}
          className="absolute inset-0 z-0"
          aria-label={`Read ${post.title}`}
        />

        <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-10 pointer-events-none">
          <div className="flex items-center gap-2">
            <Badge className="gradient-brand border-0 text-primary-foreground">Featured</Badge>
            {post.category && (
              <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-sm">
                {post.category.name}
              </Badge>
            )}
          </div>
          <h2 className="mt-4 max-w-3xl text-2xl font-bold tracking-tight text-white sm:text-4xl">
            {post.title}
          </h2>
          {post.subtitle && (
            <p className="mt-3 max-w-2xl text-base text-white/80 sm:text-lg">{post.subtitle}</p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/70">
            <div className="pointer-events-auto flex items-center gap-2">
              <Avatar className="size-8 border-2 border-white/30">
                <AvatarImage src={post.author.image ?? undefined} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <Link
                href={authorProfileUrl(post.author)}
                className="font-medium text-white hover:underline"
              >
                {post.author.name}
              </Link>
            </div>
            <span>{formatDate(post.publishedAt!)}</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {post.readingTime} min read
            </span>
            <span className="ml-auto flex items-center gap-1 font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
              Read story
              <ArrowUpRight className="size-4" />
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
