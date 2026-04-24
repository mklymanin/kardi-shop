import { getHeroBanners } from "@/lib/api/hero-banners";
import { Skeleton } from "@/components/ui/skeleton";

import { HeroBannerCarousel } from "./hero-banner-carousel";

export function HeroBannerSkeleton() {
  return (
    <section aria-label="Акции и предложения">
      <Skeleton className="min-h-[220px] w-full rounded-3xl md:min-h-[260px] lg:min-h-[300px]" />
    </section>
  );
}

export async function HeroBannerSection() {
  const slides = await getHeroBanners();
  return <HeroBannerCarousel slides={slides} />;
}
