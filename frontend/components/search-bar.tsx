"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import type { Product } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import {
  isValidSearchQuery,
  MIN_SEARCH_QUERY_LENGTH,
} from "@/lib/search-products";

const ALL_RESULTS_VALUE = "__all_results__";

type SearchBarProps = {
  className?: string;
};

export function SearchBar({ className }: SearchBarProps) {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [commandValue, setCommandValue] = React.useState("");

  React.useEffect(() => {
    if (!isValidSearchQuery(query)) {
      setResults([]);
      setLoading(false);
      return;
    }

    const handle = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&limit=8`
        );
        if (!res.ok) {
          setResults([]);
          return;
        }
        const data = (await res.json()) as { products?: Product[] };
        setResults(data.products ?? []);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => window.clearTimeout(handle);
  }, [query]);

  React.useEffect(() => {
    if (!open) {
      return;
    }
    if (!isValidSearchQuery(query)) {
      setCommandValue("");
      return;
    }
    if (loading) {
      return;
    }
    if (results.length > 0) {
      setCommandValue(ALL_RESULTS_VALUE);
    } else {
      setCommandValue("");
    }
  }, [open, query, loading, results.length]);

  const goToFullResults = React.useCallback(() => {
    const trimmed = query.trim();
    if (!isValidSearchQuery(trimmed)) {
      return;
    }
    setOpen(false);
    inputRef.current?.blur();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }, [query, router]);

  const goToProduct = React.useCallback(
    (slug: string) => {
      setOpen(false);
      router.push(`/catalog/${slug}`);
    },
    [router]
  );

  const handleInputKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") {
        return;
      }
      if (
        commandValue === "" &&
        isValidSearchQuery(query) &&
        results.length === 0 &&
        !loading
      ) {
        e.preventDefault();
        goToFullResults();
      }
    },
    [commandValue, query, results.length, loading, goToFullResults]
  );

  const handleContainerMouseDown = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (target.closest("button[data-search-submit]")) {
        return;
      }
      if (target.closest("input")) {
        return;
      }
      e.preventDefault();
      inputRef.current?.focus();
    },
    []
  );

  const handleOpenChange = React.useCallback((next: boolean) => {
    setOpen(next);
    if (!next) {
      setCommandValue("");
    }
  }, []);

  return (
    <div className={cn("relative w-full md:max-w-xs", className)}>
      <Command
        shouldFilter={false}
        value={commandValue}
        onValueChange={setCommandValue}
        className="overflow-visible rounded-none border-0 bg-transparent shadow-none"
      >
        <Popover open={open} onOpenChange={handleOpenChange} modal={false}>
          <PopoverAnchor asChild>
            <div
              className={cn(
                "border-pine/20 bg-background focus-within:border-pine/50 focus-within:ring-pine/15 group relative flex h-10 w-full items-center gap-2 rounded-full border px-3 text-sm transition focus-within:ring-2"
              )}
              onMouseDown={handleContainerMouseDown}
            >
              <button
                type="button"
                data-search-submit
                aria-label="Показать все результаты"
                className="text-muted-foreground hover:text-pine shrink-0 transition-colors"
                onClick={() => goToFullResults()}
              >
                <Search className="size-4" />
              </button>
              <CommandPrimitive.Input
                ref={inputRef}
                placeholder="Поиск по товарам…"
                value={query}
                onValueChange={setQuery}
                onFocus={() => setOpen(true)}
                onBlur={() => {
                  window.setTimeout(() => setOpen(false), 120);
                }}
                onKeyDown={handleInputKeyDown}
                className="placeholder:text-muted-foreground/60 flex-1 bg-transparent outline-none"
              />
            </div>
          </PopoverAnchor>
          <PopoverContent
            className="border-border-subtle w-[min(calc(100vw-1rem),calc(var(--radix-popover-trigger-width)+3rem))] overflow-hidden border p-0 shadow-lg ring-0"
            align="end"
            sideOffset={6}
            onOpenAutoFocus={(e) => e.preventDefault()}
            onMouseDown={(e) => {
              if (e.target !== inputRef.current) {
                e.preventDefault();
              }
            }}
          >
            <CommandList className="max-h-[min(400px,70vh)] overflow-y-auto p-2">
              {!loading &&
                isValidSearchQuery(query) &&
                results.length === 0 && (
                  <CommandEmpty className="text-muted-foreground py-8 text-center text-sm">
                    Ничего не найдено по запросу «{query.trim()}».
                  </CommandEmpty>
                )}

              {!loading && results.length > 0 && (
                <CommandGroup
                  heading="Товары"
                  className="text-muted-foreground **:[[cmdk-group-heading]]:text-xs"
                >
                  <CommandItem
                    value={ALL_RESULTS_VALUE}
                    onSelect={() => goToFullResults()}
                    onPointerDown={(e) => e.preventDefault()}
                    className="hover:bg-surface-soft cursor-pointer rounded-lg py-2 font-medium"
                  >
                    Все результаты поиска
                  </CommandItem>
                  {results.map((product) => (
                    <CommandItem
                      key={product.id}
                      value={String(product.id)}
                      onSelect={() => goToProduct(product.slug)}
                      onPointerDown={(e) => e.preventDefault()}
                      className="hover:bg-surface-soft cursor-pointer gap-3 rounded-lg py-2"
                    >
                      <div className="bg-muted relative size-10 shrink-0 overflow-hidden rounded-md">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate leading-snug font-medium">
                          {product.title}
                        </div>
                        <div className="text-muted-foreground truncate text-xs">
                          {product.category} · {product.price}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {!isValidSearchQuery(query) && !loading && (
                <div className="text-muted-foreground px-2 py-8 text-center text-xs">
                  Введите не менее {MIN_SEARCH_QUERY_LENGTH} символов.
                </div>
              )}
            </CommandList>
          </PopoverContent>
        </Popover>
      </Command>
    </div>
  );
}
