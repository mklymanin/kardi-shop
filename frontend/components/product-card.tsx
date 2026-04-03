import Link from "next/link";
import Image from "next/image";

import type { Product } from "@/lib/site-data";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="overflow-hidden rounded-[24px] border border-border-soft bg-surface shadow-[0_18px_40px_rgba(16,33,43,0.06)]">
      {product.imageUrl ? (
        <div className="relative h-48 w-full bg-surface-accent">
          <Image src={product.imageUrl} alt={product.title} fill className="object-cover" />
        </div>
      ) : (
        <div className="h-48 w-full bg-surface-accent" />
      )}
      <div className="bg-surface-accent px-6 py-4">
        <div className="text-xs uppercase tracking-[0.22em] text-pine">{product.category}</div>
      </div>
      <div className="p-6">
        <h3 className="min-h-14 text-xl font-semibold leading-snug">{product.title}</h3>
        <p className="mt-3 min-h-16 text-sm leading-6 text-ink/68">{product.subtitle}</p>
        <div className="mt-6 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-ink/50">Цена</div>
            <div className="text-2xl font-semibold text-pine">{product.price}</div>
          </div>
          <Link
            href={`/catalog/${product.slug}`}
            className="rounded-full bg-pine px-5 py-3 text-sm font-medium text-white transition hover:bg-[#18483f]"
          >
            Подробнее
          </Link>
        </div>
      </div>
    </article>
  );
}
