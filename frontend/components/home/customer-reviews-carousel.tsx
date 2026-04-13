"use client";

import * as React from "react";

import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { CustomerReviewEntry } from "@/lib/api/customer-reviews";
import { cn } from "@/lib/utils";

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

function ReviewCard({ review }: { review: CustomerReviewEntry }) {
  return (
    <article className="bg-muted flex h-full flex-col gap-2 rounded-xl border border-black px-4 py-5 font-sans text-sm">
      <div className="flex flex-col items-start justify-between gap-2">
        <span>{review.authorName}</span>
        <span className="flex items-center gap-1 text-sm">
          <Stars rating={review.rating} />
          <span>{review.rating}</span>
        </span>
      </div>
      <p className="min-h-0 flex-1">{review.text}</p>
    </article>
  );
}

type Props = {
  reviews: CustomerReviewEntry[];
};

export function CustomerReviewsCarousel({ reviews }: Props) {
  if (reviews.length === 0) {
    return null;
  }

  if (reviews.length === 1) {
    return <ReviewCard review={reviews[0]} />;
  }

  return <CustomerReviewsCarouselInner reviews={reviews} />;
}

function CustomerReviewsCarouselInner({
  reviews,
}: {
  reviews: CustomerReviewEntry[];
}) {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    const sync = () => setSelectedIndex(api.selectedScrollSnap());
    sync();
    api.on("reInit", sync);
    api.on("select", sync);
    return () => {
      api.off("reInit", sync);
      api.off("select", sync);
    };
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      className="w-full"
      opts={{ loop: true, align: "start" }}
      aria-label="Карусель отзывов"
    >
      <div className="relative px-11 md:px-14">
        <CarouselContent className="-ml-3 md:-ml-4">
          {reviews.map((review) => (
            <CarouselItem
              key={String(review.id)}
              className="basis-full pl-3 md:basis-1/2 md:pl-4"
            >
              <ReviewCard review={review} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="top-1/2 left-0 z-10 -translate-y-1/2 border-black/20 bg-white/95 shadow-sm backdrop-blur-sm" />
        <CarouselNext className="top-1/2 right-0 z-10 -translate-y-1/2 border-black/20 bg-white/95 shadow-sm backdrop-blur-sm" />
      </div>
      <div
        className="mt-6 flex justify-center gap-1.5"
        aria-label="Навигация по отзывам"
      >
        {reviews.map((review, index) => (
          <button
            key={String(review.id)}
            type="button"
            aria-current={index === selectedIndex ? "true" : undefined}
            aria-label={`Отзыв ${index + 1} из ${reviews.length}`}
            className={cn(
              "touch-manipulation rounded-full transition-[width,background-color,opacity] duration-200",
              index === selectedIndex
                ? "h-1.5 w-5 bg-black opacity-100"
                : "h-1.5 w-1.5 bg-black/35 opacity-90 hover:bg-black/55"
            )}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </Carousel>
  );
}
