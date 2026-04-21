import { FadeInSection } from "@/components/motion/fade-in-section";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { ProductCard } from "@/components/product-card";
import { getProductsBySection } from "@/lib/api/products";

const ACCESSORIES_CATEGORY_SLUG = "accessories";

export async function AccessoriesSection() {
  const products = await getProductsBySection(ACCESSORIES_CATEGORY_SLUG);

  return (
    <section id="accessories" className="scroll-mt-32 py-12 md:py-16">
      <FadeInSection className="flex min-w-0 flex-col gap-2 pb-4 sm:gap-3 sm:pb-6">
        <h2 className="font-display text-3xl tracking-tight text-balance uppercase sm:text-4xl lg:text-5xl">
          АКСЕССУАРЫ
        </h2>
        <div className="my-3 border-b border-black/50 sm:my-4" aria-hidden />
      </FadeInSection>
      {products.length > 0 ? (
        <StaggerList className="mt-4 grid auto-rows-fr grid-cols-1 gap-4 sm:mt-6 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {products.map((product) => (
            <StaggerItem key={product.id} className="h-full">
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerList>
      ) : (
        <FadeInSection className="border-border-subtle bg-surface mt-4 rounded-3xl border p-6 text-center sm:mt-6 sm:p-8">
          <p className="text-ink/60 text-base sm:text-lg">
            В этом разделе пока нет товаров.
          </p>
        </FadeInSection>
      )}
    </section>
  );
}
