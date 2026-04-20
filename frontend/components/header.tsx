import Link from "next/link";

import { CartLink } from "@/components/cart/cart-link";
import { HeaderSiteNav } from "./header-site-nav";
import { Container } from "./ui/container";
import Logo from "./logo";

export async function Header() {
  return (
    <header className="bg-primary text-white">
      <Container className="flex flex-col gap-4 py-5 md:gap-5 md:py-6">
        <div className="font-nav flex flex-col gap-2 text-sm text-white/90 md:flex-row md:items-center md:justify-start md:gap-10">
          <a href="tel:+74993467722">+7 (499) 346-77-22</a>
          <a href="mailto:support@kardi.ru">support@kardi.ru</a>
          <span>Пн-Пт с 10:00 до 18:00</span>
        </div>
        <div className="h-px w-full bg-white/20" />
        <div className="flex flex-row items-start justify-between gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 flex-col items-start gap-2">
            <Link
              href="/"
              className="text-2xl font-semibold tracking-tight text-white"
            >
              <Logo className="h-auto w-48" />
            </Link>
            <p className="font-nav hidden max-w-xs text-sm text-white/80 md:block">
              Интернет-магазин кардиографов и оборудования для ЭКГ
            </p>
          </div>
          <div className="flex items-center gap-6">
            <HeaderSiteNav />
            <CartLink className="hidden md:block" />
          </div>
        </div>
      </Container>
    </header>
  );
}
