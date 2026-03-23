import Link from "next/link";

const navItems = [
  { href: "/catalog", label: "Приборы" },
  { href: "/catalog", label: "Аксессуары" },
  { href: "/contact", label: "Аренда" },
  { href: "/articles", label: "Статьи" },
  { href: "/about", label: "О нас" },
  { href: "/contact", label: "Контакты" }
];

export function Header() {
  return (
    <header>
      <div className="border-b border-pine/10 bg-[#e6f4f1]">
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
            <Link href="/cart">Корзина</Link>
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
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/search" className="rounded-full border border-pine/20 px-4 py-2">
              Поиск
            </Link>
            <Link href="/contact" className="rounded-full bg-pine px-4 py-2 font-medium text-white">
              Купить в 1 клик
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
