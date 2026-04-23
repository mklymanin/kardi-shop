import Link from "next/link";
import { Suspense } from "react";

import { CartLink } from "@/components/cart/cart-link";
import {
  HeaderContactBar,
  HeaderContactBarSkeleton,
} from "@/components/header-contact-bar";
import { HeaderSiteNav } from "./header-site-nav";
import { Container } from "./ui/container";
import Logo from "./logo";

export function Header() {
  return (
    <header className="bg-primary text-white">
      <Container className="flex flex-col gap-4 py-5 md:gap-5 md:py-6">
        <Suspense fallback={<HeaderContactBarSkeleton />}>
          <HeaderContactBar />
        </Suspense>
        <div className="h-px w-full bg-white/20" />
        <div className="flex flex-row items-start justify-between gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 flex-col items-start gap-2">
            <Link
              href="/"
              className="text-2xl font-semibold tracking-tight text-white"
            >
              <Logo className="h-auto w-48" />
            </Link>
            <p className="font-display hidden max-w-xs text-sm text-white/80 md:block">
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
