import { STRAPI_URL, type StrapiListResponse } from "./strapi-client";

export function toNumericPrice(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const numeric = Number(value.replace(/\s/g, "").replace(",", "."));
    return Number.isNaN(numeric) ? 0 : numeric;
  }

  return 0;
}

export function toProductPrice(value: unknown): string {
  if (typeof value === "number") {
    return `${value.toLocaleString("ru-RU")} ₽`;
  }

  if (typeof value === "string" && value.trim()) {
    const numeric = Number(value);
    return Number.isNaN(numeric)
      ? value
      : `${numeric.toLocaleString("ru-RU")} ₽`;
  }

  return "Цена по запросу";
}

/**
 * Strapi 5 returns populated media directly as `{ url, ... }`,
 * while Strapi 4 wrapped it in `{ data: { url, ... } }`.
 * This function handles both formats.
 */
export function extractMediaUrl(media: unknown): string | undefined {
  if (!media || typeof media !== "object") {
    return undefined;
  }

  const record = media as Record<string, unknown>;

  // Strapi 5: media object has url directly
  if (typeof record.url === "string" && record.url.trim()) {
    return record.url.startsWith("http")
      ? record.url
      : `${STRAPI_URL}${record.url}`;
  }

  // Strapi 4 fallback: media wrapped in { data: { url } }
  const data = record.data as Record<string, unknown> | null | undefined;
  if (data && typeof data === "object") {
    const url = data.url;
    if (typeof url === "string" && url.trim()) {
      return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
    }
  }

  return undefined;
}

export function normalizeItems<T extends Record<string, unknown>>(
  payload: StrapiListResponse<T> | null
): Array<T & { id: number }> {
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
