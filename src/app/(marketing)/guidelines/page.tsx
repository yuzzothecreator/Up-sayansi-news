import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Community guidelines",
  path: "/guidelines",
  description: "Content and community standards for UpSayansi News",
});

export default function GuidelinesPage() {
  return (
    <Container className="py-16">
      <SectionHeading
        title="Community guidelines"
        description="We keep UpSayansi News thoughtful, accurate, and respectful."
        className="mb-10"
      />
      <div className="prose-pulse mx-auto max-w-3xl space-y-6">
        <p>By publishing or commenting on UpSayansi News, you agree to:</p>
        <ul>
          <li>Write original work or properly attribute sources.</li>
          <li>Avoid harassment, hate speech, and misinformation.</li>
          <li>Respect reader privacy — no doxing or personal attacks.</li>
          <li>Label opinion pieces clearly when presenting commentary.</li>
          <li>Report content that violates these standards.</li>
        </ul>
        <p>
          Editors may remove content or restrict accounts that break these rules. Repeated violations
          can lead to a permanent ban.
        </p>
      </div>
    </Container>
  );
}
