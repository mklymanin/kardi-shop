import Link from "next/link";

import { CartLink } from "@/components/cart/cart-link";

const navItems = [
  { href: "/catalog?section=pribory", label: "Приборы" },
  { href: "/catalog?section=accessories", label: "Аксессуары" },
  { href: "/catalog?section=arenda", label: "Аренда" },
  { href: "/faq", label: "Вопрос-ответ" }
];

export function Header() {
  return (
    <header>
      <div className="border-b border-pine/10 bg-[rgb(var(--color-bg-header))]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-3 text-sm text-ink/75 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="font-semibold text-pine">+7 (499) 346-77-22</span>
            <span>Пн-Пт с 10:00 до 18:00</span>
            <span>support@kardi.ru</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="font-medium text-pine">
              WhatsApp
            </Link>
            <CartLink />
          </div>
        </div>
      </div>
      <div className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-semibold tracking-tight text-pine">
              КардиРу
            </Link>
            <div className="hidden text-sm text-ink/55 md:block">Интернет-магазин кардиографов и оборудования для ЭКГ</div>
          </div>
          <nav className="flex flex-wrap gap-5 text-sm font-medium">
            {navItems.map((item, index) => (
              <Link key={`${item.href}-${index}`} href={item.href} className="transition hover:text-pine">
                {item.label}
              </Link>
            ))}
            <a href="https://www.kardi.ru/" className="transition hover:text-pine" target="_blank" rel="noreferrer">
              Выйти из магазина
            </a>
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/search" className="rounded-full border border-pine/20 px-4 py-2">
              Поиск
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
