import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { createMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";

export const metadata = createMetadata({
  title: "About",
  path: "/about",
  description: `Learn about ${siteConfig.name} — ${siteConfig.tagline}`,
});

export default function AboutPage() {
  return (
    <Container className="py-16">
      <SectionHeading
        title={`About ${siteConfig.name}`}
        description={siteConfig.tagline}
        eyebrow="Our story"
        className="mb-12"
      />
      <div className="prose-pulse mx-auto max-w-3xl space-y-6">
        <p>
          {siteConfig.name} is a premium publishing platform built for thoughtful writers and curious
          readers. We believe great stories deserve a beautiful home — one that respects both the craft
          of writing and the art of reading.
        </p>
        <h2>Our mission</h2>
        <p>
          In a world of noise, we curate signal. {siteConfig.name} brings together voices from sports,
          culture, technology, and beyond — giving writers the tools to publish beautifully and readers
          the experience they deserve.
        </p>
        <h2>What makes us different</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Clean, distraction-free reading experience</li>
          <li>Powerful editor with rich media support</li>
          <li>Thoughtful discovery — trending, categories, and curated picks</li>
          <li>Community features — comments, likes, follows, and bookmarks</li>
          <li>Writer-first tools with analytics and SEO built in</li>
        </ul>
        <h2>Join us</h2>
        <p>
          Whether you&apos;re a reader looking for your next great story or a writer ready to share your
          voice, {siteConfig.name} is your platform. Start reading today, or apply to become a writer
          and join our growing community.
        </p>
      </div>
    </Container>
  );
}
