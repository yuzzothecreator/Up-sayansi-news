import { Container } from "@/components/shared/container";
import { HeroSection } from "@/components/blog/hero-section";
import { FeaturedCard } from "@/components/blog/featured-card";
import { safeCall } from "@/lib/safe-data";
import {
  mockCategories,
  mockFaqs,
  mockFeaturedPosts,
  mockPostCards,
  mockTestimonials,
  mockTrendingPosts,
} from "@/lib/mock-data";
import * as postsService from "@/services/posts";
import * as categoriesService from "@/services/categories";
import { createMetadata } from "@/lib/metadata";
import { HomeContent } from "./home-content";

export const metadata = createMetadata({
  title: "Home",
  path: "/",
});

async function getHomeData() {
  const [featured, trending, latest, categories] = await Promise.all([
    safeCall(() => postsService.getFeaturedPosts(3), mockFeaturedPosts),
    safeCall(() => postsService.getTrendingPosts(5), mockTrendingPosts.slice(0, 5)),
    safeCall(
      () => postsService.listPosts({ page: 1, limit: 6, sort: "latest" }),
      { data: mockPostCards.slice(0, 6), meta: { page: 1, limit: 6, total: 6, totalPages: 1, hasNext: false, hasPrev: false } },
    ),
    safeCall(() => categoriesService.listCategories(), mockCategories),
  ]);

  return { featured, trending, latest: latest.data, categories };
}

export default async function HomePage() {
  const { featured, trending, latest, categories } = await getHomeData();
  const featuredHero = featured[0] ?? null;
  const heroPost = featuredHero ?? latest[0] ?? null;

  return (
    <>
      <HeroSection />

      {heroPost ? (
        <Container className="pb-16">
          <FeaturedCard post={heroPost} priority />
        </Container>
      ) : null}

      <HomeContent
        featured={featuredHero ? featured.slice(1) : featured}
        trending={trending}
        latest={latest}
        categories={categories}
        testimonials={mockTestimonials}
        faqs={mockFaqs}
      />
    </>
  );
}
