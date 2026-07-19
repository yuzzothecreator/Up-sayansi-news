"use client";

import * as React from "react";
import { Command } from "cmdk";
import { Search } from "lucide-react";
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
      <DialogContent className="overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>Search across Pulse content</DialogDescription>
        </DialogHeader>
        <Command
          shouldFilter={false}
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5"
        >
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 size-4 shrink-0 opacity-50" />
            <Command.Input
              value={query}
              onValueChange={onQueryChange}
              placeholder={placeholder}
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-[360px] overflow-y-auto p-2">
            {loading && (
              <Command.Loading>
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Searching…
                </div>
              </Command.Loading>
            )}
            {!loading && query && results.length === 0 && (
              <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </Command.Empty>
            )}
            {!loading && results.length > 0 && (
              <Command.Group heading="Results">
                {results.map((result) => (
                  <Command.Item
                    key={result.id}
                    value={result.id}
                    onSelect={() => onSelect(result)}
                    className={cn(
                      "relative flex cursor-pointer select-none flex-col gap-0.5 rounded-xl px-3 py-2.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground",
                    )}
                  >
                    <span className="font-medium">{result.title}</span>
                    {(result.description || result.category) && (
                      <span className="text-xs text-muted-foreground">
                        {[result.category, result.description].filter(Boolean).join(" · ")}
                      </span>
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
