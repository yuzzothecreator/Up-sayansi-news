"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { authorProfileUrl } from "@/lib/username";
import { staggerItem } from "@/lib/motion";
import type { UserProfile } from "@/types";
import { cn } from "@/lib/utils";

type AuthorCardProps = {
  author: UserProfile;
  className?: string;
  showFollow?: boolean;
};

export function AuthorCard({ author, className }: AuthorCardProps) {
  const initials = author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <motion.div variants={staggerItem}>
      <Link
        href={authorProfileUrl(author)}
        className={cn(
          "group flex flex-col items-center gap-4 rounded-2xl border border-border/50 bg-card p-6 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated",
          className,
        )}
      >
        <Avatar className="size-20 border-2 border-border/50 transition-transform group-hover:scale-105">
          <AvatarImage src={author.image ?? undefined} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5">
            <h3 className="font-semibold tracking-tight transition-colors group-hover:text-primary">
              {author.name}
            </h3>
            {author.verified && <BadgeCheck className="size-4 text-primary" />}
          </div>
          {author.profile?.bio && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{author.profile.bio}</p>
          )}
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span>
            <strong className="text-foreground">{author._count?.posts ?? 0}</strong> stories
          </span>
          <span>
            <strong className="text-foreground">{author._count?.followers ?? 0}</strong> followers
          </span>
        </div>
        <Button variant="outline" size="sm" className="rounded-xl" tabIndex={-1}>
          View profile
        </Button>
      </Link>
    </motion.div>
  );
}
