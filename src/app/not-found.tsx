import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Page not found",
  description: "The page you're looking for doesn't exist",
  noIndex: true,
});

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center py-32">
      <Container size="narrow" className="text-center">
        <p className="text-gradient text-8xl font-bold tracking-tighter">404</p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-3 text-muted-foreground">
          The story you&apos;re looking for may have moved or no longer exists.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild className="rounded-xl">
            <Link href="/">Go home</Link>
          </Button>
          <Button variant="outline" asChild className="rounded-xl">
            <Link href="/blog">Browse stories</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
