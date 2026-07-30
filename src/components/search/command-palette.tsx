"use client";

import * as React from "react";
import { Command } from "cmdk";
import { FileText, FolderOpen, Hash, Search, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type SearchResult = {
  id: string;
  title: string;
  description?: string;
  href: string;
  category?: string;
  type?: "post" | "author" | "category" | "tag";
};

type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
  onQueryChange: (query: string) => void;
  results: SearchResult[];
  onSelect: (result: SearchResult) => void;
  loading?: boolean;
  placeholder?: string;
  emptyMessage?: string;
};

const typeIcon = {
  post: FileText,
  author: User,
  category: FolderOpen,
  tag: Hash,
} as const;

export function CommandPalette({
  open,
  onOpenChange,
  query,
  onQueryChange,
  results,
  onSelect,
  loading = false,
  placeholder = "Search stories, authors, topics…",
  emptyMessage = "No results found.",
}: CommandPaletteProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "gap-0 overflow-hidden p-0 sm:max-w-xl",
          "rounded-2xl border-border/60 bg-background/95 shadow-elevated backdrop-blur-xl",
          "top-[20%] translate-y-0 data-[state=closed]:slide-out-to-top-[10%] data-[state=open]:slide-in-from-top-[10%]",
        )}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>Search across Pulse content</DialogDescription>
        </DialogHeader>

        <Command
          shouldFilter={false}
          className="flex w-full flex-col overflow-hidden rounded-2xl bg-transparent text-foreground"
        >
          <div className="flex items-center gap-3 border-b border-border/60 px-4">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <Command.Input
              value={query}
              onValueChange={onQueryChange}
              placeholder={placeholder}
              className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Close search"
            >
              <X className="size-4" />
            </button>
          </div>

          <Command.List className="max-h-[min(60vh,420px)] overflow-y-auto overscroll-contain p-2 outline-none">
            {!query.trim() && !loading && (
              <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                Type to search stories, authors, and topics
                <div className="mt-3 flex items-center justify-center gap-2 text-xs">
                  <kbd className="rounded-md border border-border/60 bg-muted px-1.5 py-0.5 font-medium">
                    Esc
                  </kbd>
                  <span>to close</span>
                </div>
              </div>
            )}

            {loading && (
              <Command.Loading>
                <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                  Searching…
                </div>
              </Command.Loading>
            )}

            {!loading && query.trim() && results.length === 0 && (
              <Command.Empty className="px-3 py-8 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </Command.Empty>
            )}

            {!loading && results.length > 0 && (
              <Command.Group
                heading="Results"
                className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-muted-foreground"
              >
                {results.map((result) => {
                  const Icon = typeIcon[result.type ?? "post"];
                  return (
                    <Command.Item
                      key={`${result.type ?? "post"}-${result.id}`}
                      value={`${result.title} ${result.description ?? ""} ${result.id}`}
                      onSelect={() => onSelect(result)}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 text-sm outline-none",
                        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
                        "aria-selected:bg-accent aria-selected:text-accent-foreground",
                      )}
                    >
                      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{result.title}</span>
                        {(result.description || result.category) && (
                          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                            {[result.category, result.description]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                        )}
                      </span>
                    </Command.Item>
                  );
                })}
              </Command.Group>
            )}
          </Command.List>

          <div className="flex items-center justify-between border-t border-border/60 px-4 py-2.5 text-xs text-muted-foreground">
            <span>
              <kbd className="rounded border border-border/60 bg-muted px-1 py-0.5">↑↓</kbd>{" "}
              navigate
            </span>
            <span>
              <kbd className="rounded border border-border/60 bg-muted px-1 py-0.5">↵</kbd> open
            </span>
            <button
              type="button"
              className="hover:text-foreground"
              onClick={() => {
                onOpenChange(false);
                window.location.href = query.trim()
                  ? `/search?q=${encodeURIComponent(query.trim())}`
                  : "/search";
              }}
            >
              View all results →
            </button>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
