import { ContactForm } from "./contact-form";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { createMetadata } from "@/lib/metadata";
import { Mail, MapPin, MessageSquare } from "lucide-react";

export const metadata = createMetadata({
  title: "Contact",
  path: "/contact",
  description: "Get in touch with the UpSayansi News team",
});

export default function ContactPage() {
  return (
    <Container className="py-16">
      <SectionHeading
        title="Get in touch"
        description="Have a question, partnership idea, or feedback? We'd love to hear from you."
        align="center"
        className="mb-12"
      />
      <div className="mx-auto grid max-w-4xl gap-12 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <div className="flex gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-soft">
            <Mail className="size-5 shrink-0 text-primary" />
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-muted-foreground">hello@pulse.app</p>
            </div>
          </div>
          <div className="flex gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-soft">
            <MessageSquare className="size-5 shrink-0 text-primary" />
            <div>
              <p className="font-medium">Support</p>
              <p className="text-sm text-muted-foreground">support@pulse.app</p>
            </div>
          </div>
          <div className="flex gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-soft">
            <MapPin className="size-5 shrink-0 text-primary" />
            <div>
              <p className="font-medium">Location</p>
              <p className="text-sm text-muted-foreground">San Francisco, CA</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-elevated lg:col-span-3">
          <ContactForm />
        </div>
      </div>
    </Container>
  );
}
