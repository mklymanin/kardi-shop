"use client";

import * as React from "react";
import Link from "next/link";
import { MenuIcon, XIcon } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const SITE_NAV_LINKS = [
  { href: "/#devices", label: "Приборы" },
  { href: "/#accessories", label: "Аксессуары" },
  { href: "/#delivery", label: "Доставка" },
  { href: "/#reviews", label: "Отзывы" },
] as const;

export function HeaderSiteNav() {
  const [open, setOpen] = React.useState(false);
  const { totalItems } = useCart();

  return (
    <>
      <div className="shrink-0 lg:hidden">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-white hover:bg-white/10 hover:text-white"
              aria-expanded={open}
              aria-controls="site-nav-mobile-panel"
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
            >
              {open ? (
                <XIcon className="size-6" />
              ) : (
                <MenuIcon className="size-6" />
              )}
            </Button>
          </DialogTrigger>
          <DialogContent
            id="site-nav-mobile-panel"
            showCloseButton
            onCloseAutoFocus={(event) => event.preventDefault()}
            className={cn(
              "fixed inset-y-0 top-0 right-0 left-auto h-dvh max-h-dvh w-[min(100vw-1rem,20rem)] max-w-none translate-x-0 translate-y-0 rounded-none rounded-l-xl p-6",
              "gap-0",
              "data-open:animate-in data-open:slide-in-from-right data-open:fade-in-0 data-open:zoom-in-100 data-open:duration-300",
              "data-closed:animate-out data-closed:slide-out-to-right data-closed:fade-out-0 data-closed:zoom-out-100 data-closed:duration-200"
            )}
          >
            <DialogTitle className="font-display text-foreground mb-6 text-base font-medium">
              Навигация по сайту
            </DialogTitle>
            <nav
              className="font-display flex flex-col gap-1 text-base"
              aria-label="Основная навигация"
            >
              {SITE_NAV_LINKS.map(({ href, label }) => (
                <DialogClose key={href} asChild>
                  <a
                    href={href}
                    className="text-foreground hover:bg-muted -mx-2 rounded-md px-2 py-3 transition-colors"
                  >
                    {label}
                  </a>
                </DialogClose>
              ))}
              <DialogClose asChild>
                <Link
                  href="/cart"
                  className="text-foreground hover:bg-muted -mx-2 flex items-center gap-2 rounded-md px-3 py-1 transition-colors"
                >
                  Корзина
                  {totalItems > 0 && (
                    <span className="bg-foreground text-background ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] leading-none font-bold">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </Link>
              </DialogClose>
            </nav>
          </DialogContent>
        </Dialog>
      </div>

      <nav
        className="font-display hidden flex-wrap gap-6 text-sm md:gap-4 lg:flex"
        aria-label="Основная навигация"
      >
        {SITE_NAV_LINKS.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className="rounded-md px-3 py-1 text-white/90 duration-200 hover:bg-white/10 hover:text-white"
          >
            {label}
          </a>
        ))}
      </nav>
    </>
  );
}
