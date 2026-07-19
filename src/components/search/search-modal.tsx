"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CommandPalette, type SearchResult } from "@/components/search/command-palette";
import { API_ROUTES } from "@/lib/constants";

type SearchModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(
          `${API_ROUTES.search}?q=${encodeURIComponent(query.trim())}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          setResults([]);
          return;
        }

        const payload = (await response.json()) as {
          data?: Array<{
            id: string;
            title: string;
            slug: string;
            subtitle?: string | null;
            category?: { name: string } | null;
          }>;
        };

        setResults(
          (payload.data ?? []).map((post) => ({
            id: post.id,
            title: post.title,
            description: post.subtitle ?? undefined,
            href: `/posts/${post.slug}`,
            category: post.category?.name,
          })),
        );
      } catch {
        if (!controller.signal.aborted) {
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [open, query]);

  function handleSelect(result: SearchResult) {
    onOpenChange(false);
    router.push(result.href);
  }

  return (
    <CommandPalette
      open={open}
      onOpenChange={onOpenChange}
      query={query}
      onQueryChange={setQuery}
      results={results}
      onSelect={handleSelect}
      loading={loading}
    />
  );
}

export function useSearchModal() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return { open, setOpen };
}
