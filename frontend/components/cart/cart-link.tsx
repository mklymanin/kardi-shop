"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";

export function CartLink() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/cart"
      aria-label="Корзина"
      className="border-pine/20 hover:border-pine/40 hover:text-pine relative inline-flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition sm:px-4"
    >
      <ShoppingCart
        className="size-5 shrink-0 sm:hidden"
        strokeWidth={2}
        aria-hidden
      />
      <span className="hidden sm:inline">Корзина</span>
      {totalItems > 0 && (
        <span className="bg-pine absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] leading-none font-bold text-white shadow-sm">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}
