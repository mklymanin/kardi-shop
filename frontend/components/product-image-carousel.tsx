"use client";

import Image from "next/image";

import {
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
    new Set((images ?? []).filter((src) => typeof src === "string" && src.trim()))
  );

  if (normalizedImages.length === 0) {
    return <div className={cn("bg-surface-accent h-full w-full", className)} />;
  }

  if (normalizedImages.length === 1) {
    return (
      <div className={cn("bg-surface-accent relative h-full w-full", className)}>
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
    <Carousel
      className={cn("bg-surface-accent h-full w-full", className)}
      opts={{ loop: true }}
    >
      <CarouselContent className="-ml-0">
        {normalizedImages.map((imageUrl, index) => (
          <CarouselItem key={`${imageUrl}-${index}`} className={cn("pl-0", slideClassName)}>
            <div className="relative h-full w-full">
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
      <CarouselPrevious
        className={cn(
          "left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm",
          controlsOnHover &&
            "pointer-events-none opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100"
        )}
      />
      <CarouselNext
        className={cn(
          "right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm",
          controlsOnHover &&
            "pointer-events-none opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100"
        )}
      />
    </Carousel>
  );
}
