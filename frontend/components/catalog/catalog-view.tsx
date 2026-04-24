import Link from "next/link";

import { FadeInSection } from "@/components/motion/fade-in-section";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { ProductCard } from "@/components/product-card";
import type { Category } from "@/lib/api/products";
import type { Product } from "@/lib/site-data";
import { cn } from "@/lib/utils";

type CatalogViewProps = {
  title: string;
  eyebrow?: string;
  activeSlug?: string;
  categories: Category[];
  products: Product[];
  emptyMessage?: string;
};

export function CatalogView({
  title,
  eyebrow = "Каталог",
  activeSlug,
  categories,
  products,
  emptyMessage = "Товары временно недоступны. Попробуйте обновить страницу позже.",
}: CatalogViewProps) {
  return (
    <>
      <FadeInSection
        as="section"
        className="flex min-w-0 flex-col gap-1.5 sm:gap-3"
        amount={0.1}
      >
        {eyebrow ? (
          <div className="text-primary text-xs tracking-[0.24em] uppercase sm:text-sm sm:tracking-[0.3em]">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="font-display text-3xl tracking-tight text-balance uppercase sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <div className="my-2.5 border-b border-black/50 sm:my-4" aria-hidden />
      </FadeInSection>

      {categories.length > 0 ? (
        <FadeInSection as="section" className="mt-1.5 sm:mt-2" amount={0.05}>
          <div className="-mx-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-max gap-2 px-1 sm:flex-wrap sm:gap-3 sm:px-0">
              <CatalogTab href="/catalog" active={!activeSlug}>
                Все
              </CatalogTab>
              {categories.map((cat) => (
                <CatalogTab
                  key={cat.slug}
                  href={`/catalog/${cat.slug}`}
                  active={activeSlug === cat.slug}
                >
                  {cat.seoTitle || cat.title}
                </CatalogTab>
              ))}
            </div>
          </div>
        </FadeInSection>
      ) : null}

      {products.length > 0 ? (
        <StaggerList className="mt-5 grid auto-rows-fr grid-cols-1 gap-3.5 sm:mt-6 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {products.map((product) => (
            <StaggerItem key={product.id} className="h-full">
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerList>
      ) : (
        <FadeInSection className="mt-6 rounded-xl border border-black p-6 text-center sm:p-8">
          <p className="text-muted-foreground text-base sm:text-lg">
            {emptyMessage}
          </p>
        </FadeInSection>
      )}
    </>
  );
}

function CatalogTab({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "font-display inline-flex min-h-9 items-center rounded-full border px-3 py-1.5 text-xs tracking-[0.04em] whitespace-nowrap uppercase transition-colors sm:min-h-0 sm:px-4 sm:text-sm",
        active
          ? "border-foreground bg-foreground text-background"
          : "text-foreground hover:bg-foreground/5 border-black/60"
      )}
    >
      {children}
    </Link>
  );
}
