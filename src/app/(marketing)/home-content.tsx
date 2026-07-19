"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { FeaturedCard } from "@/components/blog/featured-card";
import { PostCardComponent } from "@/components/blog/post-card";
import { CategoryCard } from "@/components/blog/category-card";
import { NewsletterForm } from "@/components/blog/newsletter-form";
import { TestimonialsSection } from "@/components/blog/testimonials-section";
import { FaqSection } from "@/components/blog/faq-section";
import { Button } from "@/components/ui/button";
import { staggerContainer } from "@/lib/motion";
import type { PostCard } from "@/types";

type HomeContentProps = {
  featured: PostCard[];
  trending: PostCard[];
  latest: PostCard[];
  categories: Array<{
    name: string;
    slug: string;
    description?: string | null;
    color?: string | null;
    icon?: string | null;
    _count?: { posts: number };
  }>;
  testimonials: Array<{ quote: string; author: string; role: string; avatar: string }>;
  faqs: Array<{ question: string; answer: string }>;
};

export function HomeContent({
  featured,
  trending,
  latest,
  categories,
  testimonials,
  faqs,
}: HomeContentProps) {
  return (
    <>
      {featured.length > 0 && (
        <section className="py-16">
          <Container>
            <div className="mb-10 flex items-end justify-between">
              <SectionHeading title="Featured stories" eyebrow="Editor's picks" />
              <Button variant="ghost" asChild className="hidden rounded-xl sm:inline-flex">
                <Link href="/blog?featured=true">
                  View all
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {featured.map((post) => (
                <FeaturedCard key={post.id} post={post} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="border-y border-border/50 bg-muted/30 py-16">
        <Container>
          <div className="mb-10 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
              <TrendingUp className="size-5 text-primary" />
            </div>
            <SectionHeading title="Trending this week" description="What everyone's reading" />
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:divide-y lg:divide-border/50"
          >
            {trending.map((post, i) => (
              <div key={post.id} className="flex gap-4 lg:py-4">
                <span className="hidden text-3xl font-bold text-muted-foreground/30 lg:block lg:w-12">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <PostCardComponent post={post} variant="horizontal" index={i} className="flex-1" />
              </div>
            ))}
          </motion.div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeading
            title="Popular categories"
            description="Explore topics that matter to you"
            className="mb-10"
          />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {categories.slice(0, 4).map((cat) => (
              <CategoryCard key={cat.slug} category={cat} />
            ))}
          </motion.div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="mb-10 flex items-end justify-between">
            <SectionHeading title="Latest posts" description="Fresh stories from our writers" />
            <Button variant="ghost" asChild className="hidden rounded-xl sm:inline-flex">
              <Link href="/blog">
                View all
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {latest.map((post, i) => (
              <PostCardComponent key={post.id} post={post} index={i} />
            ))}
          </motion.div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card p-8 shadow-elevated sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative mx-auto max-w-xl text-center">
              <SectionHeading
                title="Stay in the loop"
                description="Weekly curated picks delivered to your inbox. No spam, ever."
                align="center"
                className="mb-8"
              />
              <NewsletterForm variant="stacked" />
            </div>
          </div>
        </Container>
      </section>

      <TestimonialsSection items={testimonials} />
      <FaqSection items={faqs} />
    </>
  );
}
