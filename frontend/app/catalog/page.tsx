import { CatalogView } from "@/components/catalog/catalog-view";
import { Container } from "@/components/ui/container";
import { getCategories, getProducts } from "@/lib/api/products";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Каталог",
  description:
    "Каталог товаров интернет-магазина КардиРу: приборы ЭКГ и аксессуары.",
};

export default async function CatalogPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <Container className="py-6 md:py-12">
      <CatalogView
        title="КАТАЛОГ"
        eyebrow="Магазин КардиРу"
        categories={categories}
        products={products}
      />
    </Container>
  );
}
