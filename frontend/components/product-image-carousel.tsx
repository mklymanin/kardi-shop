"use client";

import Image from "next/image";
import * as React from "react";

import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type ProductImageCarouselProps = {
  images?: string[];
  title: string;
  className?: string;
  slideClassName?: string;
  imageClassName?: string;
  sizes?: string;
  priorityFirst?: boolean;
  controlsOnHover?: boolean;
};

export function ProductImageCarousel({
  images,
  title,
  className,
  slideClassName,
  imageClassName,
  sizes,
  priorityFirst = false,
  controlsOnHover = false,
}: ProductImageCarouselProps) {
  const normalizedImages = Array.from(
    new Set(
      (images ?? []).filter((src) => typeof src === "string" && src.trim())
    )
  );

  if (normalizedImages.length === 0) {
    return <div className={cn("bg-surface-accent h-full w-full", className)} />;
  }

  if (normalizedImages.length === 1) {
    return (
      <div
        className={cn("bg-surface-accent relative h-full w-full", className)}
      >
        <Image
          src={normalizedImages[0]}
          alt={title}
          fill
          className={cn("object-cover", imageClassName)}
          sizes={sizes}
          priority={priorityFirst}
        />
      </div>
    );
  }

  return (
    <ProductImageCarouselWithDots
      normalizedImages={normalizedImages}
      title={title}
      className={className}
      slideClassName={slideClassName}
      imageClassName={imageClassName}
      sizes={sizes}
      priorityFirst={priorityFirst}
      controlsOnHover={controlsOnHover}
    />
  );
}

function ProductImageCarouselWithDots({
  normalizedImages,
  title,
  className,
  slideClassName,
  imageClassName,
  sizes,
  priorityFirst,
  controlsOnHover,
}: {
  normalizedImages: string[];
  title: string;
  className?: string;
  slideClassName?: string;
  imageClassName?: string;
  sizes?: string;
  priorityFirst: boolean;
  controlsOnHover: boolean;
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
      className={cn("bg-surface-accent h-full w-full", className)}
      opts={{ loop: true }}
    >
      <CarouselContent className="-ml-0 h-full">
        {normalizedImages.map((imageUrl, index) => (
          <CarouselItem
            key={`${imageUrl}-${index}`}
            className={cn("h-full pl-0", slideClassName)}
          >
            <div className="relative h-full min-h-full w-full">
              <Image
                src={imageUrl}
                alt={`${title} — изображение ${index + 1}`}
                fill
                className={cn("object-cover", imageClassName)}
                sizes={sizes}
                priority={priorityFirst && index === 0}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div
        className="pointer-events-none absolute right-0 bottom-2.5 left-0 z-10 flex justify-center gap-1.5 px-3"
        aria-label="Навигация по изображениям"
      >
        {normalizedImages.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-current={index === selectedIndex ? "true" : undefined}
            aria-label={`Изображение ${index + 1} из ${normalizedImages.length}`}
            className={cn(
              "pointer-events-auto touch-manipulation rounded-full transition-[width,background-color,opacity] duration-200",
              index === selectedIndex
                ? "h-1.5 w-5 bg-white opacity-100 shadow-sm"
                : "h-1.5 w-1.5 bg-white/55 opacity-90 hover:bg-white/80"
            )}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
      <CarouselPrevious
        className={cn(
          "top-1/2 left-3 -translate-y-1/2 bg-white/90 backdrop-blur-sm",
          controlsOnHover &&
            "pointer-events-none opacity-0 transition-opacity group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100"
        )}
      />
      <CarouselNext
        className={cn(
          "top-1/2 right-3 -translate-y-1/2 bg-white/90 backdrop-blur-sm",
          controlsOnHover &&
            "pointer-events-none opacity-0 transition-opacity group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100"
        )}
      />
    </Carousel>
  );
}
