import Link from "next/link";

import { HeaderSiteNav } from "./header-site-nav";
import { Container } from "./ui/container";
import Logo from "./logo";

export async function Header() {
  return (
    <header className="border-border border-b">
      <div className="bg-mist py-8">
        <Container className="font-nav text-foreground flex flex-col gap-2 text-sm md:flex-row md:items-center md:justify-start md:gap-10">
          <a href="tel:+74993467722">+7 (499) 346-77-22</a>
          <a href="mailto:support@kardi.ru">support@kardi.ru</a>
          <span>Пн-Пт с 10:00 до 18:00</span>
        </Container>
      </div>
      <div className="py-6">
        <Container className="flex flex-row items-start justify-between gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 flex-col items-start gap-2">
            <Link
              href="/"
              className="text-pine text-2xl font-semibold tracking-tight"
            >
              <Logo className="h-auto w-48" />
            </Link>
            <p className="text-muted-foreground font-nav hidden max-w-xs text-sm md:block">
              Интернет-магазин кардиографов и оборудования для ЭКГ
            </p>
          </div>
          <HeaderSiteNav />
        </Container>
      </div>
    </header>
  );
}
