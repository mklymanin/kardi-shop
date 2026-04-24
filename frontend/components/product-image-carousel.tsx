"use client";

import Image from "next/image";
import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

type ProductImageCarouselProps = {
  images?: string[];
  title: string;
  className?: string;
  slideClassName?: string;
  imageClassName?: string;
  sizes?: string;
  priorityFirst?: boolean;
  controlsOnHover?: boolean;
  link?: string;
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
  link,
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
        <Link href={link ?? ""}>
          <Image
            src={normalizedImages[0]}
            alt={title}
            fill
            className={cn("object-contain", imageClassName)}
            sizes={sizes}
            priority={priorityFirst}
          />
        </Link>
      </div>
    );
  }

  return (
    <ProductImageCarouselSlider
      normalizedImages={normalizedImages}
      title={title}
      className={className}
      slideClassName={slideClassName}
      imageClassName={imageClassName}
      sizes={sizes}
      priorityFirst={priorityFirst}
      controlsOnHover={controlsOnHover}
      link={link}
    />
  );
}

const TRANSITION_MS = 400;

function ProductImageCarouselSlider({
  normalizedImages,
  title,
  className,
  slideClassName,
  imageClassName,
  sizes,
  priorityFirst,
  controlsOnHover,
  link,
}: {
  normalizedImages: string[];
  title: string;
  className?: string;
  slideClassName?: string;
  imageClassName?: string;
  sizes?: string;
  priorityFirst: boolean;
  controlsOnHover: boolean;
  link?: string;
}) {
  const slideCount = normalizedImages.length;

  // Клонируем последний и первый слайд по краям, чтобы при переходе
  // за границу сделать мгновенный «скачок» без анимации на реальную позицию,
  // визуально получая бесконечную карусель.
  const slides = React.useMemo(
    () => [
      normalizedImages[slideCount - 1],
      ...normalizedImages,
      normalizedImages[0],
    ],
    [normalizedImages, slideCount]
  );
  const totalSlides = slides.length;

  const [position, setPosition] = React.useState(1);
  const [withTransition, setWithTransition] = React.useState(true);
  const lockRef = React.useRef(false);
  const safetyTimerRef = React.useRef<number | null>(null);

  const realIndex = (((position - 1) % slideCount) + slideCount) % slideCount;

  const clearSafetyTimer = () => {
    if (safetyTimerRef.current !== null) {
      window.clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
  };

  const armSafetyTimer = () => {
    clearSafetyTimer();
    safetyTimerRef.current = window.setTimeout(() => {
      lockRef.current = false;
      safetyTimerRef.current = null;
    }, TRANSITION_MS + 200);
  };

  const moveBy = React.useCallback((delta: 1 | -1) => {
    if (lockRef.current) return;
    lockRef.current = true;
    setWithTransition(true);
    setPosition((p) => p + delta);
    armSafetyTimer();
  }, []);

  const goPrev = React.useCallback(() => moveBy(-1), [moveBy]);
  const goNext = React.useCallback(() => moveBy(1), [moveBy]);

  const goTo = React.useCallback(
    (index: number) => {
      if (lockRef.current) return;
      const target = index + 1;
      if (target === position) return;
      lockRef.current = true;
      setWithTransition(true);
      setPosition(target);
      armSafetyTimer();
    },
    [position]
  );

  const handleTransitionEnd = (
    event: React.TransitionEvent<HTMLDivElement>
  ) => {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== "transform") return;
    clearSafetyTimer();
    lockRef.current = false;

    // Если мы оказались на клоне — мгновенно перескакиваем на реальную
    // соответствующую позицию без анимации.
    if (position === 0) {
      setWithTransition(false);
      setPosition(slideCount);
    } else if (position === totalSlides - 1) {
      setWithTransition(false);
      setPosition(1);
    }
  };

  React.useEffect(() => {
    // Сброс при смене набора картинок.
    clearSafetyTimer();
    lockRef.current = false;
    setWithTransition(false);
    setPosition(1);
  }, [slideCount]);

  React.useEffect(() => {
    return () => clearSafetyTimer();
  }, []);

  const pointerStartX = React.useRef<number | null>(null);
  const pointerStartY = React.useRef<number | null>(null);
  const pointerIdRef = React.useRef<number | null>(null);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerIdRef.current = event.pointerId;
    pointerStartX.current = event.clientX;
    pointerStartY.current = event.clientY;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      pointerIdRef.current !== event.pointerId ||
      pointerStartX.current === null ||
      pointerStartY.current === null
    ) {
      return;
    }
    const deltaX = event.clientX - pointerStartX.current;
    const deltaY = event.clientY - pointerStartY.current;
    pointerStartX.current = null;
    pointerStartY.current = null;
    pointerIdRef.current = null;

    const threshold = 40;
    if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) goNext();
      else goPrev();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    }
  };

  const slideWidthPercent = 100 / totalSlides;

  return (
    <div
      className={cn(
        "bg-surface-accent relative h-full w-full touch-pan-y overflow-hidden select-none",
        className
      )}
      role="region"
      aria-roledescription="carousel"
      aria-label={`Изображения: ${title}`}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        pointerStartX.current = null;
        pointerStartY.current = null;
        pointerIdRef.current = null;
      }}
    >
      <Link href={link ?? ""}>
        <div
          className="flex h-full"
          style={{
            width: `${totalSlides * 100}%`,
            transform: `translate3d(-${position * slideWidthPercent}%, 0, 0)`,
            transition: withTransition
              ? `transform ${TRANSITION_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1)`
              : "none",
            willChange: "transform",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {slides.map((imageUrl, index) => {
            const altIndex =
              (((index - 1) % slideCount) + slideCount) % slideCount;
            return (
              <div
                key={`${imageUrl}-${index}`}
                aria-hidden={index !== position}
                className={cn("relative h-full shrink-0", slideClassName)}
                style={{ width: `${slideWidthPercent}%` }}
              >
                <Image
                  src={imageUrl}
                  alt={`${title} — изображение ${altIndex + 1}`}
                  fill
                  className={cn("object-contain", imageClassName)}
                  sizes={sizes}
                  priority={priorityFirst && index === 1}
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
      </Link>

      <div
        className="pointer-events-none absolute right-0 bottom-2.5 left-0 z-30 flex justify-center px-4"
        aria-label="Навигация по изображениям"
      >
        <div className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-black/20 px-2.5 py-1 backdrop-blur-[2px]">
          {normalizedImages.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-current={index === realIndex ? "true" : undefined}
              aria-label={`Изображение ${index + 1} из ${slideCount}`}
              className={cn(
                "touch-manipulation rounded-full transition-[width,background-color,opacity] duration-200",
                index === realIndex
                  ? "h-1.5 w-4.5 bg-white opacity-100"
                  : "h-1.5 w-1.5 bg-white/60 opacity-90 hover:bg-white/85"
              )}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={goPrev}
        className="group/btn absolute top-0 bottom-0 left-0 flex h-auto w-auto cursor-pointer items-center justify-center bg-none px-4"
        aria-label="Предыдущее изображение"
      >
        <div
          className={cn(
            "text-muted-foreground touch-manipulation rounded-full border-white/65 bg-white/10 p-2 shadow-sm backdrop-blur-sm transition-[background-color,opacity] duration-200 group-hover/btn:bg-black/10 group-hover/btn:text-black",
            controlsOnHover &&
              "pointer-events-none opacity-0 duration-250 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100"
          )}
        >
          <ChevronLeftIcon size={18} />
        </div>
        <span className="sr-only">Предыдущее изображение</span>
      </button>

      <button
        type="button"
        onClick={goNext}
        className="group/btn absolute top-0 right-0 bottom-0 flex h-auto w-auto cursor-pointer items-center justify-center bg-none px-4"
        aria-label="Следующее изображение"
      >
        <div
          className={cn(
            "text-muted-foreground touch-manipulation rounded-full border-white/65 bg-white/10 p-2 shadow-sm backdrop-blur-sm transition-[background-color,opacity] duration-200 group-hover/btn:bg-black/10 group-hover/btn:text-black",
            controlsOnHover &&
              "pointer-events-none opacity-0 duration-250 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100"
          )}
        >
          <ChevronRightIcon size={18} />
        </div>
        <span className="sr-only">Следующее изображение</span>
      </button>
    </div>
  );
}
