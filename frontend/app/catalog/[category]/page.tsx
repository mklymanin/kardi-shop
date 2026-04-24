import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { CatalogView } from "@/components/catalog/catalog-view";
import { Container } from "@/components/ui/container";
import { getCategories, getProductsBySection } from "@/lib/api/products";

type CategoryPageParams = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageParams): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === categorySlug);

  if (!category) {
    return {
      title: "Раздел не найден",
      description: "Запрошенный раздел каталога не найден.",
    };
  }

  const title = category.seoTitle || category.title;

  return {
    title,
    description: `Товары в разделе «${title}» интернет-магазина КардиРу.`,
  };
}

export default async function CatalogCategoryPage({
  params,
}: CategoryPageParams) {
  const { category: categorySlug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === categorySlug);

  if (!category) {
    notFound();
  }

  const products = await getProductsBySection(category.slug);
  const title = category.seoTitle || category.title;

  const breadcrumbs = [
    { label: "Главная", href: "/" },
    { label: "Каталог", href: "/catalog" },
    { label: title },
  ];

  return (
    <Container className="py-6 md:py-12">
      <Breadcrumbs items={breadcrumbs} />
      <div className="mt-4 md:mt-6">
        <CatalogView
          title={title}
          eyebrow="Раздел каталога"
          activeSlug={category.slug}
          categories={categories}
          products={products}
          emptyMessage={`В разделе «${title}» пока нет товаров.`}
        />
      </div>
    </Container>
  );
}
