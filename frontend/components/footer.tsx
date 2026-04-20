import Link from "next/link";
import Logo from "./logo";
import { Container } from "./ui/container";

export function Footer() {
  return (
    <footer className="bg-primary border-t border-black/50 text-white/80">
      <Container>
        <div>
          <div className="flex flex-col items-start gap-2 py-12">
            <Link
              href="/"
              className="text-primary text-2xl font-semibold tracking-tight"
            >
              <Logo className="h-auto w-48" />
            </Link>
            <p className="font-nav hidden max-w-xs text-sm text-white/80 md:block">
              Интернет-магазин кардиографов и оборудования для ЭКГ
            </p>
            <div className="font-nav flex flex-col gap-2 pt-2">
              <a href="mailto:support@kardi.ru">support@kardi.ru</a>
              <a href="tel:+74993467722">+7 (499) 346-77-22</a>
            </div>
          </div>
          {/* <div>
            <a href="https://t.me/kardi_ru" className="bg-black rounded-lg p-1.5 aspect-square flex items-center justify-center w-fit">
              <TelegramIcon className="h-4 w-4" />
            </a>
          </div> */}
        </div>

        <div className="font-display flex gap-8 border-t border-white/50 py-4 text-white/40">
          <p>KARDI {new Date().getFullYear()}©</p>
          <a href="#">Политика конфиденциальности</a>
          <a href="#">Обработка персональных данных</a>
        </div>
      </Container>
    </footer>
  );
}
