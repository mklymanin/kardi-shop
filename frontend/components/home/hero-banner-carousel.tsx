"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import type { HeroBannerSlide } from "@/lib/api/hero-banners";
import { cn } from "@/lib/utils";

const SLIDE_TRANSITION = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1] as const,
};

const AUTOPLAY_MS = 5500;

const linkSurfaceClass =
  "focus-visible:ring-offset-kardi-green block h-full rounded-3xl focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:outline-none";

type Props = {
  slides: HeroBannerSlide[];
};

export function HeroBannerCarousel({ slides }: Props) {
  const slideCount = slides.length;
  const [[selectedIndex, direction], setState] = React.useState<
    [number, number]
  >([0, 0]);
  const [manualEpoch, bumpManualEpoch] = React.useReducer(
    (x: number) => x + 1,
    0
  );
  const reduce = useReducedMotion();
  const selectedRef = React.useRef(selectedIndex);
  selectedRef.current = selectedIndex;

  const goToInternal = React.useCallback(
    (index: number, dir: number = 0) => {
      if (slideCount === 0) {
        return;
      }
      const normalized = ((index % slideCount) + slideCount) % slideCount;
      setState([normalized, dir]);
    },
    [slideCount]
  );

  const userGoTo = React.useCallback(
    (index: number, dir: number = 0) => {
      bumpManualEpoch();
      goToInternal(index, dir);
    },
    [goToInternal, bumpManualEpoch]
  );

  const goPrev = React.useCallback(() => {
    userGoTo(selectedIndex - 1, -1);
  }, [userGoTo, selectedIndex]);

  const goNext = React.useCallback(() => {
    userGoTo(selectedIndex + 1, 1);
  }, [userGoTo, selectedIndex]);

  React.useEffect(() => {
    if (slideCount <= 1 || reduce) {
      return;
    }
    const id = window.setInterval(() => {
      const i = selectedRef.current;
      goToInternal(i + 1, 1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [slideCount, manualEpoch, reduce, goToInternal]);

  if (slideCount === 0) {
    return null;
  }

  const banner = slides[selectedIndex];

  return (
    <section aria-label="Акции и предложения">
      <div className="relative min-h-[220px] md:min-h-[260px] lg:min-h-[300px]">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={selectedIndex}
            custom={direction}
            initial={
              reduce ? { opacity: 0 } : { opacity: 0, x: direction * 16 }
            }
            animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: direction * -16 }}
            transition={SLIDE_TRANSITION}
            className="absolute inset-0"
          >
            {banner.text ? (
              <BannerWithText
                banner={banner}
                priorityImage={selectedIndex === 0}
              />
            ) : (
              <BannerImageOnly
                banner={banner}
                priorityImage={selectedIndex === 0}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {slideCount > 1 && (
          <BannerNav
            selectedIndex={selectedIndex}
            slideCount={slideCount}
            onPrev={goPrev}
            onNext={goNext}
            onSelect={(index) =>
              userGoTo(
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

function BannerClickable({
  href,
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) {
  if (!href) {
    return <div className={linkSurfaceClass}>{children}</div>;
  }

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={linkSurfaceClass}>
        {children}
      </Link>
    );
  }

  if (/^https?:\/\//i.test(href)) {
    return (
      <a
        href={href}
        className={linkSurfaceClass}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <a href={href} className={linkSurfaceClass}>
      {children}
    </a>
  );
}

function BannerWithText({
  banner,
  priorityImage,
}: {
  banner: HeroBannerSlide;
  priorityImage: boolean;
}) {
  return (
    <BannerClickable href={banner.href}>
      <div className="bg-kardi-green border-border/50 relative grid h-full grid-rows-[1fr_160px] overflow-hidden rounded-3xl border md:grid-cols-[1fr_40%] md:grid-rows-1">
        <BgPattern />

        <div className="relative z-10 flex min-w-0 flex-col px-5 pt-5 pb-12 md:px-8 md:pt-8 md:pb-12 lg:pt-8 lg:pb-4 lg:pl-10">
          <p className="text-base leading-snug font-medium whitespace-pre-line text-white md:text-xl lg:text-2xl">
            {banner.text}
          </p>
        </div>

        <div className="relative z-10 h-full min-h-[160px] md:min-h-0">
          <Image
            src={banner.imageUrl}
            alt={banner.imageAlt}
            fill
            className="object-cover object-right"
            sizes="(max-width: 1024px) 40vw, 38vw"
            priority={priorityImage}
          />
        </div>
      </div>
    </BannerClickable>
  );
}

function BannerImageOnly({
  banner,
  priorityImage,
}: {
  banner: HeroBannerSlide;
  priorityImage: boolean;
}) {
  return (
    <BannerClickable href={banner.href}>
      <div className="relative h-full overflow-hidden rounded-3xl">
        <Image
          src={banner.imageUrl}
          alt={banner.imageAlt}
          fill
          className="object-cover"
          sizes="100vw"
          priority={priorityImage}
        />
      </div>
    </BannerClickable>
  );
}

function BgPattern() {
  const uid = React.useId().replace(/:/g, "");
  const patternId = `kardi-bg-pattern-${uid}`;

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
    >
      <defs>
        <pattern
          id={patternId}
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
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
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
    <div className="absolute bottom-4 left-5 z-20 flex items-center gap-2 md:bottom-5 md:left-8 lg:bottom-6 lg:left-14">
      <div className="flex items-center gap-2 rounded-full bg-black/25 px-1.5 py-1 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon-sm"
          type="button"
          className="hover:text-muted-foreground size-7 rounded-full bg-white/20 text-white hover:bg-white/40"
          onClick={(e) => {
            e.preventDefault();
            onPrev();
          }}
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
                onClick={(e) => {
                  e.preventDefault();
                  onSelect(index);
                }}
              />
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          type="button"
          className="hover:text-muted-foreground size-7 rounded-full bg-white/20 text-white hover:bg-white/40"
          onClick={(e) => {
            e.preventDefault();
            onNext();
          }}
          aria-label="Следующий баннер"
        >
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
