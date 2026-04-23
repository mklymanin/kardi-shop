import { extractMediaUrl } from "./helpers";
import { fetchFromStrapi } from "./strapi-client";

const HERO_BANNERS_REVALIDATE_SECONDS = 30;

type StrapiSingleResponse = {
  data:
    | (Record<string, unknown> & {
        id?: number;
        attributes?: Record<string, unknown>;
      })
    | null;
};

export type HeroBannerSlide = {
  text?: string;
  imageUrl: string;
  imageAlt: string;
  href?: string;
};

function flattenSingleRecord(
  data: StrapiSingleResponse["data"]
): Record<string, unknown> | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const attrs = (data as { attributes?: Record<string, unknown> }).attributes;
  if (attrs && typeof attrs === "object") {
    return { ...(data as Record<string, unknown>), ...attrs };
  }

  return data as Record<string, unknown>;
}

function extractImageAlt(media: unknown): string {
  if (!media || typeof media !== "object") {
    return "Баннер";
  }

  const record = media as Record<string, unknown>;
  for (const key of ["alternativeText", "caption", "name"] as const) {
    const v = record[key];
    if (typeof v === "string" && v.trim()) {
      return v.trim();
    }
  }

  const data = record.data as Record<string, unknown> | undefined;
  if (data && typeof data === "object") {
    for (const key of ["alternativeText", "caption", "name"] as const) {
      const v = data[key];
      if (typeof v === "string" && v.trim()) {
        return v.trim();
      }
    }
  }

  return "Баннер";
}

function normalizeHref(link: string): string {
  const t = link.trim();
  if (!t) {
    return t;
  }
  if (/^mailto:/i.test(t) || /^tel:/i.test(t)) {
    return t;
  }
  if (/^https?:\/\//i.test(t)) {
    return t;
  }
  if (t.startsWith("//")) {
    return `https:${t}`;
  }
  if (t.startsWith("/")) {
    return t;
  }
  return `/${t.replace(/^\//, "")}`;
}

function normalizeHeroSlide(raw: unknown): HeroBannerSlide | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const r = raw as Record<string, unknown>;
  const textRaw = String(r.text ?? "").trim();
  const imageUrl = extractMediaUrl(r.image);
  if (!imageUrl) {
    return null;
  }

  const imageAlt = extractImageAlt(r.image);
  const linkRaw = String(r.link ?? "").trim();
  const href = linkRaw ? normalizeHref(linkRaw) : undefined;

  const slide: HeroBannerSlide = {
    imageUrl,
    imageAlt,
    ...(textRaw ? { text: textRaw } : {}),
    ...(href ? { href } : {}),
  };

  return slide;
}

export async function getHeroBanners(): Promise<HeroBannerSlide[]> {
  const payload = await fetchFromStrapi<StrapiSingleResponse>(
    "/api/site-setting?populate[0]=heroBanners&populate[1]=heroBanners.image",
    { revalidate: HERO_BANNERS_REVALIDATE_SECONDS }
  );

  const flat = flattenSingleRecord(payload?.data ?? null);
  if (!flat) {
    return [];
  }

  const raw = flat.heroBanners;
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((item) => normalizeHeroSlide(item))
    .filter((x): x is HeroBannerSlide => Boolean(x));
}
