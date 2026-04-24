import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductOrderActions } from "@/components/catalog/product-order-actions";
import { FadeInSection } from "@/components/motion/fade-in-section";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
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
            href: `/catalog/${encodeURIComponent(product.categorySlug)}`,
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
  const absoluteProductUrl = `${baseUrl}/catalog/product/${product.slug}`;
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
    <Container className="py-6 md:py-12">
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

      <FadeInSection
        as="section"
        className="mt-4 flex flex-col gap-2.5 sm:mt-6 sm:gap-4"
        amount={0.1}
      >
        <div className="text-primary text-xs tracking-[0.24em] uppercase sm:text-sm sm:tracking-[0.3em]">
          {product.category}
        </div>
        <h1 className="font-display text-3xl tracking-tight text-balance uppercase sm:text-4xl lg:text-5xl">
          {product.title}
        </h1>
        <div className="border-b border-black/50" aria-hidden />
      </FadeInSection>

      <section className="mt-6 grid gap-5 lg:mt-8 lg:grid-cols-[1.2fr_1fr] lg:items-start lg:gap-8">
        <FadeInSection
          className="relative aspect-4/5 w-full overflow-hidden rounded-xl border border-black"
          amount={0.1}
        >
          <ProductImageCarousel
            images={productImages}
            title={product.title}
            priorityFirst
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </FadeInSection>

        <FadeInSection
          as="aside"
          className="font-display flex flex-col gap-4 rounded-xl border border-black p-4 sm:gap-5 sm:p-6"
          amount={0.1}
          delay={0.1}
        >
          {product.sku ? (
            <div className="text-muted-foreground text-sm uppercase">
              Артикул: {product.sku}
            </div>
          ) : null}

          {shortLead ? (
            <p className="text-sm leading-relaxed">{shortLead}</p>
          ) : null}

          <ProductOrderActions product={product} />

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
        </FadeInSection>
      </section>

      <FadeInSection
        as="section"
        className="mt-10 flex flex-col gap-2.5 sm:mt-12 sm:gap-4"
        amount={0.15}
      >
        <h2 className="font-display text-3xl tracking-tight text-balance uppercase sm:text-4xl lg:text-5xl">
          ОПИСАНИЕ
        </h2>
        <div className="border-b border-black/50" aria-hidden />
        <div className="font-display flex w-full flex-col gap-3 rounded-xl border border-black px-3.5 py-4 text-sm leading-relaxed sm:px-6 sm:py-6">
          {buildProductDescription(product.description, product.excerpt)}
        </div>
      </FadeInSection>

      {relatedProducts.length > 0 ? (
        <section className="mt-10 flex flex-col gap-2.5 sm:mt-12 sm:gap-4">
          <FadeInSection
            className="flex flex-col gap-2.5 sm:gap-4"
            amount={0.15}
          >
            <h2 className="font-display text-3xl tracking-tight text-balance uppercase sm:text-4xl lg:text-5xl">
              ЕЩЕ ИЗ ЭТОГО РАЗДЕЛА
            </h2>
            <div className="border-b border-black/50" aria-hidden />
          </FadeInSection>
          <StaggerList className="mt-3 grid auto-rows-fr grid-cols-1 gap-3.5 sm:mt-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {relatedProducts.map((relatedProduct) => (
              <StaggerItem key={relatedProduct.id} className="h-full">
                <ProductCard product={relatedProduct} />
              </StaggerItem>
            ))}
          </StaggerList>
        </section>
      ) : null}
    </Container>
  );
}
