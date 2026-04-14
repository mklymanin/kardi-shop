import { ProductCard } from "@/components/product-card";
import { getProductsBySection } from "@/lib/api/products";

const DEVICES_CATEGORY_SLUG = "devices";

export async function DevicesSection() {
  const products = await getProductsBySection(DEVICES_CATEGORY_SLUG);

  return (
    <section id="devices" className="scroll-mt-32 py-12 md:py-16">
      <div className="flex min-w-0 flex-col gap-2 pb-4 sm:gap-3 sm:pb-6">
        <h2 className="font-display text-3xl tracking-tight text-balance uppercase sm:text-4xl lg:text-5xl">
          ПРИБОРЫ
        </h2>
        <div className="my-3 border-b border-black/50 sm:my-4" aria-hidden />
      </div>
      {products.length > 0 ? (
        <div className="mt-4 grid auto-rows-fr grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="border-border-subtle bg-surface mt-4 rounded-3xl border p-6 text-center sm:mt-6 sm:p-8">
          <p className="text-ink/60 text-base sm:text-lg">
            В этом разделе пока нет товаров.
          </p>
        </div>
      )}
    </section>
  );
}
