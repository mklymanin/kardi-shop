import { notFound } from "next/navigation";

import { getProductBySlug } from "@/lib/strapi";

export default async function ProductPage({
  params
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
        <div className="text-sm uppercase tracking-[0.3em] text-pine">{product.category}</div>
        <h1 className="mt-3 text-4xl font-semibold">{product.title}</h1>
        <p className="mt-4 max-w-2xl text-ink/70">{product.subtitle}</p>
        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_320px]">
          <div className="space-y-4 text-sm leading-7 text-ink/80">
            <p>Карточка товара будет получать описание, характеристики, изображения и SEO-поля из Strapi.</p>
            <p>Следующим этапом сюда добавятся остатки, связанные товары, форма быстрого запроса и блок документов.</p>
          </div>
          <aside className="rounded-[28px] border border-black/10 bg-sand p-6">
            <div className="text-sm text-ink/60">Цена</div>
            <div className="mt-2 text-3xl font-semibold">{product.price}</div>
            <button className="mt-6 w-full rounded-full bg-ink px-5 py-3 text-white">Добавить в корзину</button>
          </aside>
        </div>
      </div>
    </div>
  );
}
