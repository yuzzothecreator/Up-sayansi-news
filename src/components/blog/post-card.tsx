"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Clock, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { authorProfileUrl } from "@/lib/username";
import { staggerItem } from "@/lib/motion";
import type { PostCard } from "@/types";
import { cn } from "@/lib/utils";

type PostCardProps = {
  post: PostCard;
  variant?: "default" | "compact" | "horizontal";
  className?: string;
  index?: number;
};

export function PostCardComponent({
  post,
  variant = "default",
  className,
  index = 0,
}: PostCardProps) {
  const initials = post.author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  if (variant === "horizontal") {
    return (
      <motion.article
        variants={staggerItem}
        custom={index}
        className={cn("group flex gap-4", className)}
      >
        {post.coverImage && (
          <Link href={`/blog/${post.slug}`} className="relative shrink-0 overflow-hidden rounded-xl">
            <Image
              src={post.coverImage}
              alt=""
              width={120}
              height={80}
              className="size-20 object-cover transition-transform duration-300 group-hover:scale-105 sm:size-24"
            />
          </Link>
        )}
        <div className="min-w-0 flex-1 space-y-1">
          {post.category && (
            <Link href={`/categories/${post.category.slug}`}>
              <Badge variant="secondary" className="text-xs">
                {post.category.name}
              </Badge>
            </Link>
          )}
          <Link href={`/blog/${post.slug}`}>
            <h3 className="line-clamp-2 font-semibold leading-snug transition-colors group-hover:text-primary">
              {post.title}
            </h3>
          </Link>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{formatDate(post.publishedAt!)}</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {post.readingTime} min
            </span>
          </div>
        </div>
      </motion.article>
    );
  }

  if (variant === "compact") {
    return (
      <motion.article variants={staggerItem} className={cn("group space-y-2", className)}>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="line-clamp-2 font-medium leading-snug transition-colors group-hover:text-primary">
            {post.title}
          </h3>
        </Link>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href={authorProfileUrl(post.author)} className="hover:text-foreground">
            {post.author.name}
          </Link>
          <span>·</span>
          <span>{post.readingTime} min read</span>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      variants={staggerItem}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated",
        className,
      )}
    >
      {post.coverImage && (
        <Link href={`/blog/${post.slug}`} className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={post.coverImage}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {post.featured && (
            <Badge className="absolute left-3 top-3 gradient-brand border-0 text-primary-foreground">
              Featured
            </Badge>
          )}
        </Link>
      )}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {post.category && (
          <Link href={`/categories/${post.category.slug}`}>
            <Badge
              variant="secondary"
              className="text-xs"
              style={post.category.color ? { borderColor: post.category.color } : undefined}
            >
              {post.category.name}
            </Badge>
          </Link>
        )}
        <Link href={`/blog/${post.slug}`} className="flex-1">
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
            {post.title}
          </h3>
          {post.subtitle && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.subtitle}</p>
          )}
        </Link>
        <div className="flex items-center justify-between pt-2">
          <Link
            href={authorProfileUrl(post.author)}
            className="flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
          >
            <Avatar className="size-7">
              <AvatarImage src={post.author.image ?? undefined} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{post.author.name}</span>
          </Link>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="size-3" />
              {post.likesCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="size-3" />
              {post.commentsCount}
            </span>
            <span className="hidden sm:inline">{post.readingTime} min</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
