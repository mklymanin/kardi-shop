import { notFound } from "next/navigation";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { getProductBySlug } from "@/lib/api/products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="rounded-[36px] bg-white/80 p-8 shadow-sm">
        <div className="text-pine text-sm uppercase tracking-[0.3em]">
          {product.category}
        </div>
        <h1 className="mt-3 text-4xl font-semibold">{product.title}</h1>
        <p className="text-ink/70 mt-4 max-w-2xl">{product.subtitle}</p>
        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_320px]">
          <div className="text-ink/80 space-y-4 text-sm leading-7">
            <p>Подробная карточка товара с описанием и характеристиками.</p>
            <p>
              Для уточнения комплектации и сроков поставки свяжитесь с
              менеджером.
            </p>
          </div>
          <aside className="bg-sand rounded-[28px] border border-black/10 p-6">
            <div className="text-ink/60 text-sm">Цена</div>
            <div className="mt-2 text-3xl font-semibold">{product.price}</div>
            <AddToCartButton product={product} />
          </aside>
        </div>
      </div>
    </div>
  );
}
