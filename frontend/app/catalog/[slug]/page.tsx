import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ProductCard } from "@/components/product-card";
import { ProductImageCarousel } from "@/components/product-image-carousel";
import { getProductBySlug, getRelatedProducts } from "@/lib/api/products";

type ProductPageParams = {
  params: Promise<{ slug: string }>;
};

function buildProductDescription(description?: string, subtitle?: string) {
  const source = (description ?? subtitle ?? "").trim();

  if (!source) {
    return (
      <>
        <p>Подробная карточка товара с описанием и характеристиками.</p>
        <p>
          Для уточнения комплектации и сроков поставки свяжитесь с менеджером.
        </p>
      </>
    );
  }

  if (/<[^>]+>/.test(source)) {
    return <div dangerouslySetInnerHTML={{ __html: source }} />;
  }

  const lines = source
    .split(/\n{2,}/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line) => <p key={line}>{line}</p>);
}

function createBreadcrumbData(
  product: Awaited<ReturnType<typeof getProductBySlug>>
): Array<{ label: string; href?: string }> {
  if (!product) {
    return [];
  }

  return [
    { label: "Главная", href: "/" },
    { label: "Каталог", href: "/catalog" },
    ...(product.categorySlug
      ? [
          {
            label: product.category,
            href: `/catalog?section=${encodeURIComponent(product.categorySlug)}`,
          },
        ]
      : []),
    { label: product.title },
  ];
}

export async function generateMetadata({
  params,
}: ProductPageParams): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Товар не найден",
      description: "Запрошенный товар не найден в каталоге.",
    };
  }

  const description =
    product.seoDescription || product.subtitle || "Товар из каталога КардиРу";
  const productImages =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls
      : product.imageUrl
        ? [product.imageUrl]
        : [];

  return {
    title: product.seoTitle || product.title,
    description,
    openGraph: {
      title: product.seoTitle || product.title,
      description,
      images: productImages.length
        ? productImages.map((url) => ({ url }))
        : undefined,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: ProductPageParams) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const productImages =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls
      : product.imageUrl
        ? [product.imageUrl]
        : [];

  const relatedProducts = product.categorySlug
    ? await getRelatedProducts(product.categorySlug, product.slug, 3)
    : [];

  const breadcrumbs = createBreadcrumbData(product);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shop.kardi.ru";
  const absoluteProductUrl = `${baseUrl}/catalog/${product.slug}`;
  const breadcrumbListJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: crumb.href ? `${baseUrl}${crumb.href}` : absoluteProductUrl,
    })),
  };
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.seoDescription || product.subtitle,
    image: productImages.length ? productImages : undefined,
    category: product.category,
    sku: product.slug,
    offers: {
      "@type": "Offer",
      priceCurrency: "RUB",
      price: product.priceValue ?? undefined,
      availability: "https://schema.org/InStock",
      url: absoluteProductUrl,
    },
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbListJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="rounded-[36px] bg-white/80 p-8 shadow-sm">
        <Breadcrumbs items={breadcrumbs} />
        <div className="text-pine pt-4 text-sm uppercase tracking-[0.3em]">
          {product.category}
        </div>
        <h1 className="mt-3 text-4xl font-semibold">{product.title}</h1>
        {product.excerpt ? (
          <p className="text-ink/70 mt-4 max-w-2xl">{product.excerpt}</p>
        ) : product.subtitle ? (
          <p className="text-ink/70 mt-4 max-w-2xl">{product.subtitle}</p>
        ) : null}
        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="bg-surface-accent relative aspect-[4/5] w-full overflow-hidden rounded-[28px]">
            <ProductImageCarousel
              images={productImages}
              title={product.title}
              priorityFirst
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="grid gap-8 md:grid-cols-[1fr_320px] lg:grid-cols-1">
            <div className="text-ink/80 space-y-4 text-sm leading-7">
              {buildProductDescription(product.description, product.excerpt)}
            </div>
            <aside className="bg-sand rounded-[28px] border border-black/10 p-6">
              <div className="text-ink/60 text-sm">Цена</div>
              <div className="mt-2 text-3xl font-semibold">{product.price}</div>
              <AddToCartButton product={product} />
            </aside>
          </div>
        </div>
      </div>
      {relatedProducts.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-ink text-3xl font-semibold">
            Еще из этого раздела
          </h2>
          <div className="mt-6 grid auto-rows-fr gap-5 md:grid-cols-3">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
