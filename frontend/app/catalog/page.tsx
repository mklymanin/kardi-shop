import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { Container } from "@/components/ui/container";
import {
  getCategories,
  getProducts,
  getProductsBySection,
} from "@/lib/api/products";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const { section } = await searchParams;

  const [products, categories] = await Promise.all([
    section ? getProductsBySection(section) : getProducts(),
    getCategories(),
  ]);

  const activeTitle =
    categories.find((c) => c.slug === section)?.seoTitle ??
    categories.find((c) => c.slug === section)?.title;

  return (
    <Container className="py-12">
      <div className="mb-8">
        <div className="text-rust text-sm tracking-[0.3em] uppercase">
          Каталог
        </div>
        <h1 className="mt-2 text-4xl font-semibold">
          {activeTitle ?? "Товары"}
        </h1>
        <p className="text-ink/70 mt-3 max-w-2xl">
          {activeTitle
            ? `Товары в разделе «${activeTitle}».`
            : "Каталог товаров с основными категориями."}
        </p>
      </div>

      <nav className="mb-8 flex flex-wrap gap-2">
        <SectionTab href="/catalog" active={!section}>
          Все
        </SectionTab>
        {categories.map((cat) => (
          <SectionTab
            key={cat.slug}
            href={`/catalog?section=${cat.slug}`}
            active={section === cat.slug}
          >
            {cat.seoTitle ?? cat.title}
          </SectionTab>
        ))}
      </nav>

      {products.length > 0 ? (
        <div className="grid auto-rows-fr gap-5 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="border-border-subtle bg-surface rounded-3xl border p-8 text-center">
          <p className="text-ink/60 text-lg">
            {section
              ? "В этом разделе пока нет товаров."
              : "Товары временно недоступны. Попробуйте обновить страницу позже."}
          </p>
        </div>
      )}
    </Container>
  );
}

function SectionTab({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-primary text-white"
          : "bg-pill-bg text-primary hover:bg-primary/10"
      }`}
    >
      {children}
    </Link>
  );
}
