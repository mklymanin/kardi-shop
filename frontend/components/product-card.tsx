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
    <article className="flex h-full flex-col">
      <div className="aspect-square w-full shrink-0 overflow-hidden rounded-4xl border border-black [corner-shape:squircle]">
        <ProductImageCarousel
          images={productImages}
          title={product.title}
          controlsOnHover
        />
      </div>
      <div className="bg-surface-accent shrink-0 py-3">
        <div className="text-muted-foreground font-display text-sm uppercase">
          {product.sku}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <h3 className="text-md font-display line-clamp-2 text-sm leading-tight">
          {product.title}
        </h3>
        <div className="mt-auto flex flex-col gap-3">
          <div className="font-display font-semibold">{product.price}</div>
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </article>
  );
}
