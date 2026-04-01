import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/strapi";

export default async function CatalogPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <div className="text-sm uppercase tracking-[0.3em] text-rust">Каталог</div>
        <h1 className="mt-2 text-4xl font-semibold">Товары</h1>
        <p className="mt-3 max-w-2xl text-ink/70">Каталог товаров с основными категориями.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
