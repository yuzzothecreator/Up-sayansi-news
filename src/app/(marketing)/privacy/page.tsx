import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { createMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";

export const metadata = createMetadata({
  title: "Privacy Policy",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <Container size="narrow" className="py-16">
      <SectionHeading title="Privacy Policy" description={`Last updated: ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}`} className="mb-10" />
      <div className="prose-pulse space-y-6">
        <p>This Privacy Policy describes how {siteConfig.name} collects, uses, and protects your personal information.</p>
        <h2>Information we collect</h2>
        <p>We collect information you provide directly, such as your name, email address, and profile details when you create an account. We also collect usage data to improve our platform.</p>
        <h2>How we use your information</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>To provide and maintain our services</li>
          <li>To send newsletters and notifications you&apos;ve opted into</li>
          <li>To improve our platform and user experience</li>
          <li>To comply with legal obligations</li>
        </ul>
        <h2>Data security</h2>
        <p>We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure.</p>
        <h2>Your rights</h2>
        <p>You may access, update, or delete your personal information through your account settings. Contact us at privacy@pulse.app for additional requests.</p>
        <h2>Contact</h2>
        <p>For privacy-related questions, email us at privacy@pulse.app.</p>
      </div>
    </Container>
  );
}
