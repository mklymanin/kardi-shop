import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ProductCard } from "@/components/product-card";
import { ProductImageCarousel } from "@/components/product-image-carousel";
import { Container } from "@/components/ui/container";
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
    sku: product.sku ?? product.slug,
    offers: {
      "@type": "Offer",
      priceCurrency: "RUB",
      price: product.priceValue ?? undefined,
      availability: "https://schema.org/InStock",
      url: absoluteProductUrl,
    },
  };

  const shortLead = product.excerpt || product.subtitle;

  return (
    <Container className="py-8 md:py-12">
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

      <Breadcrumbs items={breadcrumbs} />

      <section className="mt-6 flex flex-col gap-3 sm:gap-4">
        <div className="text-primary text-sm tracking-[0.3em] uppercase">
          {product.category}
        </div>
        <h1 className="font-display text-3xl tracking-tight text-balance uppercase sm:text-4xl lg:text-5xl">
          {product.title}
        </h1>
        <div className="border-b border-black/50" aria-hidden />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start lg:gap-8">
        <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl border border-black">
          <ProductImageCarousel
            images={productImages}
            title={product.title}
            priorityFirst
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <aside className="font-display flex flex-col gap-5 rounded-xl border border-black p-5 sm:p-6">
          {product.sku ? (
            <div className="text-muted-foreground text-sm uppercase">
              Артикул: {product.sku}
            </div>
          ) : null}

          {shortLead ? (
            <p className="text-sm leading-relaxed">{shortLead}</p>
          ) : null}

          <div className="mt-auto flex flex-col gap-4 border-t border-black/30 pt-5">
            <div className="flex flex-col gap-1">
              <div className="text-muted-foreground text-sm uppercase">
                Цена
              </div>
              <div className="text-3xl font-semibold">{product.price}</div>
            </div>
            <AddToCartButton product={product} />
          </div>

          <ul className="font-display flex flex-col gap-2 border-t border-black/30 pt-5 text-sm leading-relaxed">
            <li>
              <span aria-hidden>•</span> Доставка курьером по Москве и по России
            </li>
            <li>
              <span aria-hidden>•</span> Оплата картой или по счёту для юрлиц
            </li>
            <li>
              <span aria-hidden>•</span> Бесплатная консультация менеджера
            </li>
          </ul>
        </aside>
      </section>

      <section className="mt-12 flex flex-col gap-3 sm:gap-4">
        <h2 className="font-display text-3xl tracking-tight text-balance uppercase sm:text-4xl lg:text-5xl">
          ОПИСАНИЕ
        </h2>
        <div className="border-b border-black/50" aria-hidden />
        <div className="font-display flex w-full flex-col gap-3 rounded-xl border border-black px-4 py-5 text-sm leading-relaxed sm:px-6 sm:py-6">
          {buildProductDescription(product.description, product.excerpt)}
        </div>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="mt-12 flex flex-col gap-3 sm:gap-4">
          <h2 className="font-display text-3xl tracking-tight text-balance uppercase sm:text-4xl lg:text-5xl">
            ЕЩЕ ИЗ ЭТОГО РАЗДЕЛА
          </h2>
          <div className="border-b border-black/50" aria-hidden />
          <div className="mt-4 grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      ) : null}
    </Container>
  );
}
