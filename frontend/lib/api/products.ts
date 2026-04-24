import type { Product } from "@/lib/site-data";

import { fetchFromStrapi, type StrapiListResponse } from "./strapi-client";
import {
  extractMediaUrl,
  extractMediaUrls,
  normalizeItems,
  toNumericPrice,
  toProductPrice,
} from "./helpers";

function extractTextFromRichValue(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (!Array.isArray(value)) {
    return "";
  }

  const chunks: string[] = [];

  for (const node of value) {
    if (!node || typeof node !== "object") {
      continue;
    }

    const nodeRecord = node as Record<string, unknown>;
    const children = nodeRecord.children;

    if (!Array.isArray(children)) {
      continue;
    }

    const line = children
      .map((child) => {
        if (!child || typeof child !== "object") {
          return "";
        }
        return String((child as Record<string, unknown>).text ?? "");
      })
      .join("")
      .trim();

    if (line) {
      chunks.push(line);
    }
  }

  return chunks.join("\n\n");
}

function normalizeText(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractCategory(item: Record<string, unknown>): {
  title: string;
  slug: string;
} {
  if (typeof item.category !== "object" || !item.category) {
    return { title: "Без категории", slug: "" };
  }

  const category = item.category as Record<string, unknown>;
  const seoTitle =
    typeof category.seoTitle === "string" ? category.seoTitle.trim() : "";
  return {
    title: seoTitle || String(category.title ?? "Без категории"),
    slug: String(category.slug ?? ""),
  };
}

function strapiItemToProduct(
  item: Record<string, unknown> & { id: number }
): Product {
  const category = extractCategory(item);
  const rawDescription = extractTextFromRichValue(item.description);
  const rawExcerpt = extractTextFromRichValue(item.excerpt);
  const subtitle = normalizeText(rawExcerpt || rawDescription);

  const imageUrls = Array.from(
    new Set([
      ...extractMediaUrls(item.gallery),
      ...extractMediaUrls(item.images),
      ...extractMediaUrls(item.image),
    ])
  );

  const slug = String(item.slug ?? `product-${item.id}`);
  const skuFromCms =
    typeof item.sku === "string" && item.sku.trim() ? item.sku.trim() : "";

  const rentalAvailable = Boolean(item.rentalAvailable);
  const rentalPriceValue = toNumericPrice(item.rentalPrice);
  const rentalPeriodLabelRaw =
    typeof item.rentalPeriodLabel === "string"
      ? item.rentalPeriodLabel.trim()
      : "";

  const stock = Math.max(0, Math.trunc(Number(item.stock) || 0));

  return {
    id: item.id,
    slug,
    sku: skuFromCms || slug,
    title: String(item.title ?? "Без названия"),
    subtitle,
    excerpt: rawExcerpt || undefined,
    description: rawDescription || undefined,
    priceValue: toNumericPrice(item.price),
    price: toProductPrice(item.price),
    stock,
    ...(rentalAvailable
      ? {
          rentalAvailable: true,
          ...(rentalPriceValue > 0
            ? {
                rentalPriceValue,
                rentalPrice: toProductPrice(item.rentalPrice),
              }
            : {}),
          ...(rentalPeriodLabelRaw
            ? { rentalPeriodLabel: rentalPeriodLabelRaw }
            : {}),
        }
      : {}),
    imageUrl: imageUrls[0] ?? extractMediaUrl(item.image),
    imageUrls: imageUrls.length ? imageUrls : undefined,
    category: category.title,
    categorySlug: category.slug || undefined,
    seoTitle: normalizeText(String(item.seoTitle ?? "")) || undefined,
    seoDescription:
      normalizeText(String(item.seoDescription ?? "")) || undefined,
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

const EXCLUDED_CATEGORY_SLUGS = new Set(["rental"]);

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
      if (EXCLUDED_CATEGORY_SLUGS.has(c.slug)) return false;
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

export async function getRelatedProducts(
  categorySlug: string,
  excludeSlug: string,
  limit = 3
): Promise<Product[]> {
  if (!categorySlug) {
    return [];
  }

  const sectionProducts = await getProductsBySection(categorySlug);
  return sectionProducts
    .filter((product) => product.slug !== excludeSlug)
    .slice(0, Math.max(0, limit));
}
