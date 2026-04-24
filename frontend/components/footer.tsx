import Link from "next/link";
import { Suspense } from "react";

import {
  FooterContactBlock,
  FooterContactBlockSkeleton,
} from "@/components/footer-contact-block";
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
            <p className="font-display hidden max-w-xs text-sm text-white/80 md:block">
              Интернет-магазин кардиографов и оборудования для ЭКГ
            </p>
            <Suspense fallback={<FooterContactBlockSkeleton />}>
              <FooterContactBlock />
            </Suspense>
          </div>
          {/* <div>
            <a href="https://t.me/kardi_ru" className="bg-black rounded-lg p-1.5 aspect-square flex items-center justify-center w-fit">
              <TelegramIcon className="h-4 w-4" />
            </a>
          </div> */}
        </div>

        <div className="font-display flex flex-col gap-x-8 gap-y-4 border-t border-white/50 py-4 text-white/40 md:flex-row">
          <a href="https://ronix.ru" target="_blank" rel="noopener noreferrer">
            @ Разработка сайта ООО "Роникс Системс"
          </a>
          <a href="#">Политика конфиденциальности</a>
          <a href="#">Обработка персональных данных</a>
        </div>
      </Container>
    </footer>
  );
}
