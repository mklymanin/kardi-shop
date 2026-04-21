import type { CustomerReviewsData } from "@/lib/api/customer-reviews";

import { CustomerReviewsCarousel } from "@/components/home/customer-reviews-carousel";
import { FadeInSection } from "@/components/motion/fade-in-section";

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
      <FadeInSection className="flex min-w-0 flex-col gap-2 pb-6 sm:gap-4 sm:pb-8">
        <h2 className="font-display text-3xl tracking-tight text-balance uppercase sm:text-4xl lg:text-5xl">
          ОТЗЫВЫ ПОКУПАТЕЛЕЙ
        </h2>
        <div className="my-3 border-b border-black/50 sm:my-4" />
        {data && data.overallRating > 0 ? (
          <div className="font-display flex flex-col gap-3 text-base sm:flex-row sm:items-center sm:gap-2 sm:text-lg">
            <p className="font-sans text-4xl font-medium sm:text-5xl">
              {data.overallRating.toLocaleString("ru-RU", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 1,
              })}
            </p>
            <div className="min-w-0">
              <Stars rating={data.overallRating} />
              {data.reviews.length > 0 ? (
                <p className="text-xs text-black/60 sm:text-sm">
                  {reviewsCountLabel(data.reviews.length)}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </FadeInSection>

      {!data || data.reviews.length === 0 ? (
        <p className="font-display text-xs text-black/60 sm:text-sm">
          Отзывов пока нет
        </p>
      ) : (
        <FadeInSection amount={0.15}>
          <CustomerReviewsCarousel reviews={data.reviews} />
        </FadeInSection>
      )}
    </section>
  );
}
