import type { CustomerReviewsData } from "@/lib/api/customer-reviews";

import { CustomerReviewsCarousel } from "@/components/home/customer-reviews-carousel";

type Props = {
  data: CustomerReviewsData | null;
};

function reviewsCountLabel(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return `${n} отзыв`;
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${n} отзыва`;
  }
  return `${n} отзывов`;
}

function formatReviewDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return "";
  }
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Stars({ rating }: { rating: number }) {
  const clamped = Math.min(5, Math.max(0, rating));
  const fillPercent = (clamped / 5) * 100;
  return (
    <span className="relative inline-block whitespace-nowrap" aria-hidden>
      <span className="text-black/25">{"★".repeat(5)}</span>
      <span
        className="text-star absolute top-0 left-0 overflow-hidden"
        style={{ width: `${fillPercent}%` }}
      >
        {"★".repeat(5)}
      </span>
    </span>
  );
}

export function CustomerReviewsSection({ data }: Props) {
  return (
    <section id="reviews" className="scroll-mt-32 py-12 md:py-16">
      <div className="flex flex-col gap-2 pb-8">
        <h2 className="font-display text-5xl uppercase">ОТЗЫВЫ ПОКУПАТЕЛЕЙ</h2>
        <div className="my-4 border-b border-black/50" />
        {data && data.overallRating > 0 ? (
          <div className="font-display flex items-center gap-2 text-lg">
            <p className="font-sans text-5xl font-medium">
              {data.overallRating.toLocaleString("ru-RU", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 1,
              })}
            </p>
            <div>
              <Stars rating={data.overallRating} />
              {data.reviews.length > 0 ? (
                <p className="text-sm text-black/60">
                  {reviewsCountLabel(data.reviews.length)}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {!data || data.reviews.length === 0 ? (
        <p className="font-display text-sm text-black/60">Отзывов пока нет</p>
      ) : (
        <CustomerReviewsCarousel reviews={data.reviews} />
      )}
    </section>
  );
}
