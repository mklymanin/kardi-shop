"use client";

import Image from "next/image";
import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
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
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [slideCount, setSlideCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    const sync = () => {
      setSelectedIndex(api.selectedScrollSnap());
      setSlideCount(api.scrollSnapList().length);
    };
    sync();
    api.on("reInit", sync);
    api.on("select", sync);
    return () => {
      api.off("reInit", sync);
      api.off("select", sync);
    };
  }, [api]);

  return (
    <section aria-label="Акции и предложения">
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
        <CarouselContent className="-ml-0">
          {BANNERS.map((banner, index) => (
            <CarouselItem key={index} className="pl-0">
              <div
                className="relative flex min-h-[200px] overflow-hidden rounded-3xl md:min-h-[260px] lg:min-h-[300px]"
                style={{ backgroundColor: "#5a9e6f" }}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: "url(/kardi-bg-pattern.png)",
                    backgroundRepeat: "repeat",
                    backgroundSize: "180px",
                  }}
                  aria-hidden
                />

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
            </CarouselItem>
          ))}
        </CarouselContent>

        {slideCount > 1 && (
          <BannerNav
            api={api}
            selectedIndex={selectedIndex}
            slideCount={slideCount}
          />
        )}
      </Carousel>
    </section>
  );
}

function BannerNav({
  api,
  selectedIndex,
  slideCount,
}: {
  api: CarouselApi | null;
  selectedIndex: number;
  slideCount: number;
}) {
  return (
    <div className="absolute bottom-4 left-6 z-20 flex items-center gap-2 md:bottom-5 md:left-10 lg:bottom-6 lg:left-14">
      <Button
        variant="ghost"
        size="icon-sm"
        className="size-7 rounded-full bg-white/20 text-white hover:bg-white/40 hover:text-white"
        onClick={() => api?.scrollPrev()}
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
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon-sm"
        className="size-7 rounded-full bg-white/20 text-white hover:bg-white/40 hover:text-white"
        onClick={() => api?.scrollNext()}
        aria-label="Следующий баннер"
      >
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
}
