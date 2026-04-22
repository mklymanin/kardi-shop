"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ProductImageCarousel } from "@/components/product-image-carousel";
import type { Product } from "@/lib/site-data";
import { ArrowRightIcon } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const reduce = useReducedMotion();
  const productImages =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls
      : product.imageUrl
        ? [product.imageUrl]
        : [];

  const productHref = `/catalog/${product.slug}`;

  return (
    <motion.article
      className="group relative flex h-full flex-col"
      whileTap={reduce ? undefined : { scale: 0.99 }}
      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-4xl border border-black transition [corner-shape:squircle] group-hover:shadow-md">
        {product.rentalAvailable ? (
          <span className="pointer-events-none absolute top-3 left-3 z-30 rounded-full border border-white/50 bg-black/55 px-2.5 py-1 text-[10px] font-medium tracking-wide text-white uppercase shadow-sm backdrop-blur-sm sm:text-xs">
            Доступно в аренду
          </span>
        ) : null}
        <ProductImageCarousel
          images={productImages}
          title={product.title}
          controlsOnHover
          slideClassName="transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-4xl bg-linear-to-t from-black/35 via-black/8 to-transparent opacity-0 transition-opacity duration-350 ease-out [corner-shape:squircle] group-focus-within:opacity-80 group-hover:opacity-80"
          aria-hidden
        />
        <Link
          href={productHref}
          aria-label={`Открыть ${product.title}`}
          tabIndex={-1}
          className="font-display pointer-events-none absolute bottom-8 left-1/2 z-40 inline-flex -translate-x-1/2 translate-y-1 items-center gap-1.5 rounded-full border border-white/45 bg-black/20 px-3.5 py-1.5 text-xs tracking-[0.04em] text-white opacity-0 shadow-[0_6px_16px_rgba(0,0,0,0.2)] transition-[opacity,transform,background-color] duration-300 ease-out group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 hover:bg-black/30"
          style={{
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        >
          Подробнее
          <ArrowRightIcon className="size-3" />
        </Link>
      </div>
      <div className="bg-surface-accent shrink-0 py-3">
        <div className="text-muted-foreground font-display text-sm uppercase">
          {product.sku}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <h3 className="text-md font-display line-clamp-2 text-sm leading-tight">
          <Link
            href={productHref}
            className="underline-offset-2 transition-colors group-hover:underline hover:underline"
          >
            {product.title}
          </Link>
        </h3>
        <div className="mt-auto flex flex-col gap-3">
          <div className="font-display font-semibold">{product.price}</div>
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </motion.article>
  );
}
