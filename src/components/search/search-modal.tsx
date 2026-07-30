"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CommandPalette, type SearchResult } from "@/components/search/command-palette";
import { API_ROUTES } from "@/lib/constants";
import { authorProfileUrl } from "@/lib/username";

type SearchModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type SearchApiPayload = {
  success?: boolean;
  data?: {
    posts?: {
      data?: Array<{
        id: string;
        title: string;
        slug: string;
        subtitle?: string | null;
        category?: { name: string } | null;
      }>;
    };
    authors?: Array<{
      id: string;
      name: string;
      image?: string | null;
      verified?: boolean;
    }>;
    categories?: Array<{
      id: string;
      name: string;
      slug: string;
      color?: string | null;
    }>;
    tags?: Array<{ id: string; name: string; slug: string }>;
  };
};

const MOCK_RESULTS: SearchResult[] = [
  {
    id: "mock-post-1",
    title: "The Last Dance: What Modern Athletes Can Learn from Jordan's Mindset",
    description: "Beyond the highlights — the discipline that defined a generation.",
    href: "/blog/last-dance-modern-athletes-jordan-mindset",
    category: "Sports",
    type: "post",
  },
  {
    id: "mock-post-3",
    title: "The AI Revolution in Sports Analytics",
    description: "A compelling story worth your time.",
    href: "/blog/ai-revolution-sports-analytics",
    category: "Technology",
    type: "post",
  },
  {
    id: "mock-maya",
    title: "Maya Chen",
    description: "Author",
    href: "/authors/maya-chen",
    type: "author",
  },
  {
    id: "mock-cat-sports",
    title: "Sports",
    description: "Category",
    href: "/categories/sports",
    type: "category",
  },
];

function filterMockResults(query: string): SearchResult[] {
  const q = query.toLowerCase();
  return MOCK_RESULTS.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q),
  );
}

function mapApiResults(payload: SearchApiPayload): SearchResult[] {
  const results: SearchResult[] = [];
  const data = payload.data;

  for (const post of data?.posts?.data ?? []) {
    results.push({
      id: post.id,
      title: post.title,
      description: post.subtitle ?? undefined,
      href: `/blog/${post.slug}`,
      category: post.category?.name,
      type: "post",
    });
  }

  for (const author of data?.authors ?? []) {
    results.push({
      id: author.id,
      title: author.name,
      description: author.verified ? "Verified author" : "Author",
      href: authorProfileUrl({ id: author.id, name: author.name }),
      type: "author",
    });
  }

  for (const category of data?.categories ?? []) {
    results.push({
      id: category.id,
      title: category.name,
      description: "Category",
      href: `/categories/${category.slug}`,
      type: "category",
    });
  }

  for (const tag of data?.tags ?? []) {
    results.push({
      id: tag.id,
      title: tag.name,
      description: "Tag",
      href: `/tags/${tag.slug}`,
      type: "tag",
    });
  }

  return results;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      const trimmed = query.trim();
      if (!trimmed) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(
          `${API_ROUTES.search}?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          setResults(filterMockResults(trimmed));
          return;
        }

        const payload = (await response.json()) as SearchApiPayload;
        const mapped = mapApiResults(payload);
        setResults(mapped.length > 0 ? mapped : filterMockResults(trimmed));
      } catch {
        if (!controller.signal.aborted) {
          setResults(filterMockResults(trimmed));
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
