import Link from "next/link";

import { CartLink } from "@/components/cart/cart-link";
import { getCategories } from "@/lib/api/products";

export async function Header() {
  const categories = await getCategories();

  return (
    <header>
      <div className="border-pine/10 border-b bg-[rgb(var(--color-bg-header))]">
        <div className="text-ink/75 mx-auto flex max-w-6xl flex-col gap-2 px-6 py-3 text-sm md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="text-pine font-semibold">+7 (499) 346-77-22</span>
            <span>Пн-Пт с 10:00 до 18:00</span>
            <span>support@kardi.ru</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="text-pine font-medium">
              WhatsApp
            </Link>
            <CartLink />
          </div>
        </div>
      </div>
      <div className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-pine text-2xl font-semibold tracking-tight"
            >
              КардиРу
            </Link>
            <div className="text-ink/55 hidden text-sm md:block">
              Интернет-магазин кардиографов и оборудования для ЭКГ
            </div>
          </div>
          <nav className="flex flex-wrap gap-5 text-sm font-medium">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/catalog?section=${cat.slug}`}
                className="hover:text-pine transition"
              >
                {cat.seoTitle ?? cat.title}
              </Link>
            ))}
            <Link href="/faq" className="hover:text-pine transition">
              Вопрос-ответ
            </Link>
            <a
              href="https://www.kardi.ru/"
              className="hover:text-pine transition"
              target="_blank"
              rel="noreferrer"
            >
              Выйти из магазина
            </a>
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/search"
              className="border-pine/20 rounded-full border px-4 py-2"
            >
              Поиск
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
