import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { createMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";

export const metadata = createMetadata({
  title: "Pricing",
  path: "/pricing",
  description: `${siteConfig.name} is free to read and publish`,
});

export default function PricingPage() {
  return (
    <Container className="py-16">
      <SectionHeading
        title="Simple and free"
        description="Reading and publishing on UpSayansi News costs nothing."
        align="center"
        className="mb-12"
      />
      <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-soft">
          <h2 className="text-lg font-semibold">Readers</h2>
          <p className="mt-2 text-3xl font-bold">$0</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Unlimited access to published stories, bookmarks, comments, and the weekly newsletter.
          </p>
        </div>
        <div className="rounded-2xl border border-primary/30 bg-card p-8 shadow-elevated">
          <h2 className="text-lg font-semibold">Writers</h2>
          <p className="mt-2 text-3xl font-bold">$0</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Create an account and publish. Draft, edit, and share stories with the built-in editor.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-flex text-sm font-medium text-primary hover:underline"
          >
            Start writing →
          </Link>
        </div>
      </div>
    </Container>
  );
}
