"use client";

import Image from "next/image";
import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BannerSlide = {
  text: string;
  imageSrc: string;
  imageAlt: string;
};

const BANNERS: BannerSlide[] = [
  {
    text: "При покупке КардиРу-12-клиника –\n10 медицинских анализов в подарок!",
    imageSrc: "/analyze.png",
    imageAlt: "Пример анализа ЭКГ",
  },
  {
    text: "КардиРу-12 — портативный\nэлектрокардиограф для дома и клиники",
    imageSrc: "/analyze.png",
    imageAlt: "Пример анализа ЭКГ",
  },
  {
    text: "Бесплатная доставка по всей России\nпри заказе от 15 000 ₽",
    imageSrc: "/analyze.png",
    imageAlt: "Пример анализа ЭКГ",
  },
];

export function HeroBannerCarousel() {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const slideCount = BANNERS.length;

  const goTo = React.useCallback(
    (index: number) => {
      if (slideCount === 0) return;
      const normalized = ((index % slideCount) + slideCount) % slideCount;
      setSelectedIndex(normalized);
    },
    [slideCount]
  );

  const goPrev = React.useCallback(() => {
    goTo(selectedIndex - 1);
  }, [goTo, selectedIndex]);

  const goNext = React.useCallback(() => {
    goTo(selectedIndex + 1);
  }, [goTo, selectedIndex]);

  return (
    <section aria-label="Акции и предложения">
      <div className="relative w-full">
        <div className="relative min-h-[200px] md:min-h-[260px] lg:min-h-[300px]">
          {BANNERS.map((banner, index) => (
            <div
              key={index}
              aria-hidden={index !== selectedIndex}
              className={cn(
                "absolute inset-0 transition-opacity duration-500",
                index === selectedIndex
                  ? "pointer-events-auto z-10 opacity-100"
                  : "pointer-events-none z-0 opacity-0"
              )}
            >
              <div className="bg-kardi-green relative flex min-h-[200px] overflow-hidden rounded-3xl md:min-h-[260px] lg:min-h-[300px]">
                <svg
                  aria-hidden
                  className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
                >
                  <defs>
                    <pattern
                      id="kardi-bg-pattern"
                      width="180"
                      height="360"
                      patternUnits="userSpaceOnUse"
                    >
                      <image
                        href="/kardi-bg-pattern.png"
                        x="0"
                        y="0"
                        width="180"
                        height="180"
                      />
                      <image
                        href="/kardi-bg-pattern.png"
                        x="-90"
                        y="180"
                        width="180"
                        height="180"
                      />
                      <image
                        href="/kardi-bg-pattern.png"
                        x="90"
                        y="180"
                        width="180"
                        height="180"
                      />
                    </pattern>
                  </defs>
                  <rect
                    width="100%"
                    height="100%"
                    fill="url(#kardi-bg-pattern)"
                  />
                </svg>

                <div className="relative z-10 flex w-full flex-col md:flex-row md:items-stretch">
                  <div className="flex flex-1 flex-col justify-start px-6 pt-6 pb-16 md:px-10 md:py-10 md:pb-16 lg:px-10 lg:py-8 lg:pb-4">
                    <p className="text-lg leading-snug font-medium whitespace-pre-line text-white md:text-xl lg:text-2xl">
                      {banner.text}
                    </p>
                  </div>

                  <div className="relative mx-4 mb-4 h-[180px] shrink-0 md:mx-0 md:mb-0 md:h-auto md:w-[45%] lg:w-[38.5%]">
                    <Image
                      src={banner.imageSrc}
                      alt={banner.imageAlt}
                      fill
                      className="rounded-lg object-contain md:rounded-xl"
                      sizes="(max-width: 768px) 90vw, 45vw"
                      priority={index === 0}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {slideCount > 1 && (
          <BannerNav
            selectedIndex={selectedIndex}
            slideCount={slideCount}
            onPrev={goPrev}
            onNext={goNext}
            onSelect={goTo}
          />
        )}
      </div>
    </section>
  );
}

function BannerNav({
  selectedIndex,
  slideCount,
  onPrev,
  onNext,
  onSelect,
}: {
  selectedIndex: number;
  slideCount: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="absolute bottom-4 left-6 z-20 flex items-center gap-2 md:bottom-5 md:left-10 lg:bottom-6 lg:left-14">
      <Button
        variant="ghost"
        size="icon-sm"
        className="hover:text-muted-foreground size-7 rounded-full bg-white/20 text-white hover:bg-white/40"
        onClick={onPrev}
        aria-label="Предыдущий баннер"
      >
        <ChevronLeftIcon className="size-4" />
      </Button>

      <div className="flex items-center gap-1.5">
        {Array.from({ length: slideCount }).map((_, index) => (
          <button
            key={index}
            type="button"
            aria-current={index === selectedIndex ? "true" : undefined}
            aria-label={`Баннер ${index + 1} из ${slideCount}`}
            className={cn(
              "touch-manipulation rounded-full transition-all duration-200",
              index === selectedIndex
                ? "h-2.5 w-2.5 bg-white"
                : "h-2 w-2 bg-white/50 hover:bg-white/70"
            )}
            onClick={() => onSelect(index)}
          />
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon-sm"
        className="hover:text-muted-foreground size-7 rounded-full bg-white/20 text-white hover:bg-white/40"
        onClick={onNext}
        aria-label="Следующий баннер"
      >
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
}
