import { fetchFromStrapi } from "./strapi-client";

export type CustomerReviewEntry = {
  id: string | number;
  authorName: string;
  rating: number;
  text: string;
  reviewDate: string;
};

export type CustomerReviewsData = {
  overallRating: number;
  reviews: CustomerReviewEntry[];
};

type StrapiSingleResponse = {
  data:
    | (Record<string, unknown> & {
        id?: number;
        attributes?: Record<string, unknown>;
      })
    | null;
};

function toNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const n = Number(value.replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

const RATING_EPS = 1e-6;

function isValidRating(n: number): boolean {
  return n >= 1 - RATING_EPS && n <= 5 + RATING_EPS;
}

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

function normalizeReviewEntry(
  raw: unknown,
  index: number
): CustomerReviewEntry | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const r = raw as Record<string, unknown>;
  const id =
    typeof r.id === "string" || typeof r.id === "number" ? r.id : index;
  const authorName = String(r.authorName ?? "").trim();
  const text = String(r.text ?? "").trim();
  const rating = toNumber(r.rating);
  const reviewDate =
    typeof r.reviewDate === "string"
      ? r.reviewDate
      : typeof r.reviewDate === "number"
        ? new Date(r.reviewDate).toISOString()
        : "";

  if (!authorName || !text || !isValidRating(rating) || !reviewDate) {
    return null;
  }

  return {
    id,
    authorName,
    rating: Math.min(5, Math.max(1, rating)),
    text,
    reviewDate,
  };
}

export async function getCustomerReviews(): Promise<CustomerReviewsData | null> {
  const payload = await fetchFromStrapi<StrapiSingleResponse>(
    "/api/customer-review?populate=reviews"
  );

  const flat = flattenSingleRecord(payload?.data ?? null);
  if (!flat) {
    return null;
  }

  const overallRating = toNumber(flat.overallRating);
  const rawReviews = flat.reviews;

  const list = Array.isArray(rawReviews)
    ? rawReviews
        .map((item, i) => normalizeReviewEntry(item, i))
        .filter((x): x is CustomerReviewEntry => Boolean(x))
    : [];

  if (!overallRating && list.length === 0) {
    return null;
  }

  return {
    overallRating: overallRating || 0,
    reviews: list,
  };
}
