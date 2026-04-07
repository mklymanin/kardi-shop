import { fetchFromStrapi, type StrapiListResponse } from "./strapi-client";
import { normalizeItems } from "./helpers";

export type FaqItem = {
  id: number;
  question: string;
  answer: string;
  order: number;
};

export async function getFaqItems(): Promise<FaqItem[]> {
  const payload = await fetchFromStrapi<StrapiListResponse<any>>(
    "/api/faqs?sort=order:asc&status=published"
  );
  const items = normalizeItems(payload);

  return items.map((item) => ({
    id: item.id,
    question: String(item.question ?? ""),
    answer: String(item.answer ?? ""),
    order: Number(item.order ?? 0),
  }));
}
