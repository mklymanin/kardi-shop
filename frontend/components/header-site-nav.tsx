"use client";

import * as React from "react";
import { MenuIcon, XIcon } from "lucide-react";

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
  { href: "#devices", label: "Приборы" },
  { href: "#accessories", label: "Аксессуары" },
  { href: "#delivery", label: "Доставка" },
  { href: "#reviews", label: "Отзывы" },
] as const;

export function HeaderSiteNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className="shrink-0 md:hidden">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-foreground"
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
            className={cn(
              "fixed inset-y-0 top-0 right-0 left-auto h-dvh max-h-dvh w-[min(100vw-1rem,20rem)] max-w-none translate-x-0 translate-y-0 rounded-none rounded-l-xl p-6",
              "gap-0",
              "data-open:animate-in data-open:slide-in-from-right data-open:fade-in-0 data-open:zoom-in-100 data-open:duration-300",
              "data-closed:animate-out data-closed:slide-out-to-right data-closed:fade-out-0 data-closed:zoom-out-100 data-closed:duration-200"
            )}
          >
            <DialogTitle className="font-nav text-foreground mb-6 text-base font-medium">
              Навигация по сайту
            </DialogTitle>
            <nav
              className="font-nav flex flex-col gap-1 text-base"
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
            </nav>
          </DialogContent>
        </Dialog>
      </div>

      <nav
        className="font-nav hidden flex-wrap gap-6 text-sm md:flex md:gap-10"
        aria-label="Основная навигация"
      >
        {SITE_NAV_LINKS.map(({ href, label }) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </nav>
    </>
  );
}
