import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Cookie policy",
  path: "/cookies",
  description: "How UpSayansi News uses cookies",
});

export default function CookiesPage() {
  return (
    <Container className="py-16">
      <SectionHeading title="Cookie policy" className="mb-10" />
      <div className="prose-pulse mx-auto max-w-3xl space-y-6">
        <p>
          UpSayansi News uses essential cookies to keep you signed in and remember your preferences.
          We do not sell personal data to third parties.
        </p>
        <h2>Essential cookies</h2>
        <p>Session and authentication cookies required for login and account security.</p>
        <h2>Analytics (optional)</h2>
        <p>
          If enabled, anonymous usage analytics help us improve the product. You can disable
          non-essential cookies in your browser settings.
        </p>
        <p>
          See also our <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </div>
    </Container>
  );
}
