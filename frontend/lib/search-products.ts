import type { Product } from "@/lib/site-data";

export const MIN_SEARCH_QUERY_LENGTH = 2;

export function normalizeSearchQuery(q: string): string {
  return q.trim().toLowerCase();
}

export function isValidSearchQuery(q: string): boolean {
  return normalizeSearchQuery(q).length >= MIN_SEARCH_QUERY_LENGTH;
}

function productHaystack(p: Product): string {
  return `${p.title} ${p.subtitle} ${p.category} ${p.slug}`.toLowerCase();
}

/** Каждое слово из запроса должно встречаться в названии, описании, категории или slug. */
export function filterProductsByQuery(
  products: Product[],
  q: string
): Product[] {
  const normalized = normalizeSearchQuery(q);
  if (normalized.length < MIN_SEARCH_QUERY_LENGTH) {
    return [];
  }
  const words = normalized.split(/\s+/).filter(Boolean);
  return products.filter((p) => {
    const hay = productHaystack(p);
    return words.every((w) => hay.includes(w));
  });
}
