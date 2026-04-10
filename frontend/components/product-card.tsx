import Link from "next/link";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ProductImageCarousel } from "@/components/product-image-carousel";
import type { Product } from "@/lib/site-data";

export function ProductCard({ product }: { product: Product }) {
  const productImages =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls
      : product.imageUrl
        ? [product.imageUrl]
        : [];

  return (
    <article className="border-border-soft bg-surface group flex h-full flex-col overflow-hidden rounded-[24px] border shadow-[0_18px_40px_rgba(16,33,43,0.06)]">
      <div className="h-48 w-full shrink-0">
        <ProductImageCarousel
          images={productImages}
          title={product.title}
          controlsOnHover
        />
      </div>
      <div className="bg-surface-accent shrink-0 px-6 py-4">
        <div className="text-pine text-xs tracking-[0.22em] uppercase">
          {product.category}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl leading-snug font-semibold">{product.title}</h3>
        <p className="text-ink/68 mt-3 line-clamp-3 text-sm leading-6">
          {product.excerpt ?? product.subtitle}
        </p>
        <div className="mt-auto pt-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-ink/50 text-xs">Цена</div>
              <div className="text-pine text-2xl font-semibold">
                {product.price}
              </div>
            </div>
            <Link
              href={`/catalog/${product.slug}`}
              className="bg-pine shrink-0 rounded-full px-5 py-3 text-sm font-medium text-white transition hover:bg-[#18483f]"
            >
              Подробнее
            </Link>
          </div>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
