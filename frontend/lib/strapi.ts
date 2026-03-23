import { articles as fallbackArticles, featuredProducts, type ArticlePreview, type Product } from "@/lib/site-data";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

type StrapiListResponse<T> =
  | { data: T[] }
  | { data: Array<{ id: number; attributes?: T } & T> };

function toProductPrice(value: unknown) {
  if (typeof value === "number") {
    return `${value.toLocaleString("ru-RU")} ₽`;
  }

  if (typeof value === "string" && value.trim()) {
    const numeric = Number(value);
    return Number.isNaN(numeric) ? value : `${numeric.toLocaleString("ru-RU")} ₽`;
  }

  return "Цена по запросу";
}

function normalizeItems<T extends Record<string, unknown>>(payload: StrapiListResponse<T> | null): Array<T & { id: number }> {
  if (!payload || !Array.isArray(payload.data)) {
    return [];
  }

  return payload.data.map((item: any) => {
    if (item.attributes) {
      return { id: item.id, ...item.attributes };
    }

    return item;
  });
}

async function fetchFromStrapi<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${STRAPI_URL}${path}`, {
      next: { revalidate: 30 }
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getProducts(): Promise<Product[]> {
  const payload = await fetchFromStrapi<StrapiListResponse<any>>("/api/products?populate=category&sort=createdAt:desc");
  const items = normalizeItems(payload);

  if (!items.length) {
    return featuredProducts;
  }

  return items.map((item, index) => ({
    id: item.id ?? index + 1,
    slug: String(item.slug ?? `product-${index + 1}`),
    title: String(item.title ?? "Без названия"),
    subtitle: String(item.excerpt ?? item.description ?? ""),
    price: toProductPrice(item.price),
    category:
      typeof item.category === "object" && item.category
        ? String((item.category as Record<string, unknown>).title ?? "Без категории")
        : "Без категории"
  }));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const payload = await fetchFromStrapi<StrapiListResponse<any>>(
    `/api/products?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=category`
  );
  const item = normalizeItems(payload)[0];

  if (!item) {
    return featuredProducts.find((product) => product.slug === slug) ?? null;
  }

  return {
    id: item.id,
    slug: String(item.slug ?? slug),
    title: String(item.title ?? "Без названия"),
    subtitle: String(item.excerpt ?? item.description ?? ""),
    price: toProductPrice(item.price),
    category:
      typeof item.category === "object" && item.category
        ? String((item.category as Record<string, unknown>).title ?? "Без категории")
        : "Без категории"
  };
}

export async function getArticles(): Promise<ArticlePreview[]> {
  const payload = await fetchFromStrapi<StrapiListResponse<any>>("/api/articles?sort=createdAt:desc");
  const items = normalizeItems(payload);

  if (!items.length) {
    return fallbackArticles;
  }

  return items.map((item) => ({
    slug: String(item.slug ?? ""),
    title: String(item.title ?? "Без названия"),
    excerpt: String(item.excerpt ?? "")
  }));
}
