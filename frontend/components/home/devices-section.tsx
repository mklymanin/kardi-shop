import { ProductCard } from "@/components/product-card";
import { getProductsBySection } from "@/lib/api/products";

const DEVICES_CATEGORY_SLUG = "devices";

export async function DevicesSection() {
  const products = await getProductsBySection(DEVICES_CATEGORY_SLUG);

  return (
    <section id="devices" className="scroll-mt-32 py-12 md:py-16">
      <h2 className="font-display pb-4 text-5xl uppercase">ПРИБОРЫ</h2>
      <div className="my-4 border-b border-black/50" />
      {products.length > 0 ? (
        <div className="mt-6 grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="border-border-subtle bg-surface mt-6 rounded-3xl border p-8 text-center">
          <p className="text-ink/60 text-lg">
            В этом разделе пока нет товаров.
          </p>
        </div>
      )}
    </section>
  );
}
