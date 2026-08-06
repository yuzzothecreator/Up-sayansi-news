import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Help Center",
  path: "/help",
  description: "Get help using UpSayansi News",
});

export default function HelpPage() {
  return (
    <Container className="py-16">
      <SectionHeading
        title="Help center"
        description="Quick answers for readers and writers."
        className="mb-10"
      />
      <div className="prose-pulse mx-auto max-w-3xl space-y-8">
        <section>
          <h2>Getting started</h2>
          <p>
            Create a free account to bookmark stories, comment, and write. Sign in from the header,
            then open <Link href="/dashboard">Dashboard</Link> to manage your profile and posts.
          </p>
        </section>
        <section>
          <h2>Writing a story</h2>
          <p>
            Click <strong>Write</strong> in the navigation or go to{" "}
            <Link href="/dashboard/posts/new">New post</Link>. Save drafts anytime and publish when
            you are ready.
          </p>
        </section>
        <section>
          <h2>Need more help?</h2>
          <p>
            Contact us on the <Link href="/contact">contact page</Link> and we will get back to you.
          </p>
        </section>
      </div>
    </Container>
  );
}
