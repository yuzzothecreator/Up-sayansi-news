import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { NewsletterForm } from "@/components/blog/newsletter-form";
import { createMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";

export const metadata = createMetadata({
  title: "Newsletter",
  path: "/newsletter",
  description: `Subscribe to the ${siteConfig.name} weekly digest`,
});

export default function NewsletterPage() {
  return (
    <Container className="py-16">
      <SectionHeading
        title="Weekly digest"
        description="Curated stories from our editors — free, no spam, unsubscribe anytime."
        align="center"
        className="mb-10"
      />
      <div className="mx-auto max-w-lg rounded-2xl border border-border/50 bg-card p-8 shadow-elevated">
        <NewsletterForm variant="stacked" />
      </div>
    </Container>
  );
}
