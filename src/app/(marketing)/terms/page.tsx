import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { createMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";

export const metadata = createMetadata({
  title: "Terms of Service",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <Container size="narrow" className="py-16">
      <SectionHeading title="Terms of Service" description={`Last updated: ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}`} className="mb-10" />
      <div className="prose-pulse space-y-6">
        <p>By using {siteConfig.name}, you agree to these Terms of Service.</p>
        <h2>Using UpSayansi News</h2>
        <p>You must be at least 13 years old to use our platform. You are responsible for maintaining the security of your account and all activity under it.</p>
        <h2>Content guidelines</h2>
        <p>Writers retain ownership of their content. By publishing on {siteConfig.name}, you grant us a license to display and distribute your work on our platform. Content must not violate our community guidelines or applicable laws.</p>
        <h2>Prohibited conduct</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Harassment, hate speech, or discrimination</li>
          <li>Spam, misinformation, or deceptive content</li>
          <li>Copyright infringement</li>
          <li>Attempts to compromise platform security</li>
        </ul>
        <h2>Termination</h2>
        <p>We may suspend or terminate accounts that violate these terms. You may delete your account at any time through settings.</p>
        <h2>Disclaimer</h2>
        <p>{siteConfig.name} is provided &ldquo;as is&rdquo; without warranties. We are not liable for user-generated content or third-party links.</p>
        <h2>Contact</h2>
        <p>Questions about these terms? Email legal@pulse.app.</p>
      </div>
    </Container>
  );
}
