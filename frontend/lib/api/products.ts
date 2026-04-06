import type { Product } from "@/lib/site-data";

import { fetchFromStrapi, type StrapiListResponse } from "./strapi-client";
import {
  extractMediaUrl,
  normalizeItems,
  toNumericPrice,
  toProductPrice,
} from "./helpers";

function strapiItemToProduct(
  item: Record<string, unknown> & { id: number }
): Product {
  return {
    id: item.id,
    slug: String(item.slug ?? `product-${item.id}`),
    title: String(item.title ?? "Без названия"),
    subtitle: String(item.excerpt ?? item.description ?? ""),
    priceValue: toNumericPrice(item.price),
    price: toProductPrice(item.price),
    imageUrl: extractMediaUrl(item.image),
    category:
      typeof item.category === "object" && item.category
        ? String(
            (item.category as Record<string, unknown>).title ?? "Без категории"
          )
        : "Без категории",
  };
}

export async function getProducts(): Promise<Product[]> {
  const payload = await fetchFromStrapi<StrapiListResponse<any>>(
    "/api/products?populate[0]=category&populate[1]=image&sort=createdAt:desc&status=published"
  );
  const items = normalizeItems(payload);

  return items.map(strapiItemToProduct);
}

export async function getProductsBySection(
  sectionSlug: string
): Promise<Product[]> {
  const payload = await fetchFromStrapi<StrapiListResponse<any>>(
    `/api/products?filters[category][slug][$eq]=${encodeURIComponent(sectionSlug)}&populate[0]=category&populate[1]=image&sort=createdAt:desc&status=published`
  );
  return normalizeItems(payload).map(strapiItemToProduct);
}

export type Category = {
  title: string;
  seoTitle: string;
  slug: string;
};

export async function getCategories(): Promise<Category[]> {
  const payload = await fetchFromStrapi<StrapiListResponse<any>>(
    "/api/categories?status=published&sort=title:asc"
  );
  const items = normalizeItems(payload);
  const seen = new Set<string>();
  return items
    .map((item) => ({
      title: String(item.title ?? ""),
      seoTitle: String(item.seoTitle ?? ""),
      slug: String(item.slug ?? ""),
    }))
    .filter((c) => {
      if (!c.slug || !c.title || seen.has(c.slug)) return false;
      seen.add(c.slug);
      return true;
    });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const payload = await fetchFromStrapi<StrapiListResponse<any>>(
    `/api/products?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[0]=category&populate[1]=image&status=published`
  );
  const item = normalizeItems(payload)[0];

  if (!item) {
    return null;
  }

  return strapiItemToProduct(item);
}
