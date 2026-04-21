"use client";

import Image from "next/image";
import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

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

const SLIDE_TRANSITION = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function HeroBannerCarousel() {
  const [[selectedIndex, direction], setState] = React.useState<
    [number, number]
  >([0, 0]);
  const slideCount = BANNERS.length;
  const reduce = useReducedMotion();

  const goTo = React.useCallback(
    (index: number, dir: number = 0) => {
      if (slideCount === 0) return;
      const normalized = ((index % slideCount) + slideCount) % slideCount;
      setState([normalized, dir]);
    },
    [slideCount]
  );

  const goPrev = React.useCallback(() => {
    goTo(selectedIndex - 1, -1);
  }, [goTo, selectedIndex]);

  const goNext = React.useCallback(() => {
    goTo(selectedIndex + 1, 1);
  }, [goTo, selectedIndex]);

  const banner = BANNERS[selectedIndex];

  return (
    <section aria-label="Акции и предложения">
      <div className="relative w-full">
        <div className="relative min-h-[200px] md:min-h-[260px] lg:min-h-[300px]">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={selectedIndex}
              custom={direction}
              initial={
                reduce ? { opacity: 0 } : { opacity: 0, x: direction * 16 }
              }
              animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
              exit={
                reduce ? { opacity: 0 } : { opacity: 0, x: direction * -16 }
              }
              transition={SLIDE_TRANSITION}
              className="absolute inset-0"
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
                      priority={selectedIndex === 0}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {slideCount > 1 && (
          <BannerNav
            selectedIndex={selectedIndex}
            slideCount={slideCount}
            onPrev={goPrev}
            onNext={goNext}
            onSelect={(index) =>
              goTo(
                index,
                index > selectedIndex ? 1 : index < selectedIndex ? -1 : 0
              )
            }
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
        {Array.from({ length: slideCount }).map((_, index) => {
          const isActive = index === selectedIndex;
          return (
            <motion.button
              key={index}
              type="button"
              aria-current={isActive ? "true" : undefined}
              aria-label={`Баннер ${index + 1} из ${slideCount}`}
              className={cn(
                "touch-manipulation rounded-full",
                isActive ? "bg-white" : "bg-white/50 hover:bg-white/70"
              )}
              animate={{
                width: isActive ? 10 : 8,
                height: isActive ? 10 : 8,
              }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => onSelect(index)}
            />
          );
        })}
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
