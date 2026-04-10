import { ProductCard } from "@/components/product-card";
import { Container } from "@/components/ui/container";
import { getProducts } from "@/lib/api/products";
import {
  filterProductsByQuery,
  isValidSearchQuery,
  MIN_SEARCH_QUERY_LENGTH,
} from "@/lib/search-products";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const valid = isValidSearchQuery(query);
  const products = valid
    ? filterProductsByQuery(await getProducts(), query)
    : [];

  return (
    <Container className="py-12">
      <div className="mb-8">
        <div className="text-rust text-sm tracking-[0.3em] uppercase">
          Поиск
        </div>
        <h1 className="mt-2 text-4xl font-semibold">
          {valid ? `Результаты: «${query}»` : "Поиск по товарам"}
        </h1>
        <p className="text-ink/70 mt-3 max-w-2xl">
          {valid
            ? products.length > 0
              ? `Найдено товаров: ${products.length}.`
              : "По этому запросу товаров не найдено — попробуйте другие слова."
            : `Введите запрос в строке поиска в шапке сайта (не менее ${MIN_SEARCH_QUERY_LENGTH} символов) и нажмите Enter или иконку лупы, чтобы увидеть все совпадения.`}
        </p>
      </div>

      {valid && products.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : null}
    </Container>
  );
}
