"use client";

import Link from "next/link";

import { useCart } from "@/components/cart/cart-provider";

export function CartLink() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/cart"
      className="border-pine/20 hover:border-pine/40 hover:text-pine relative inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition"
    >
      <span className="hidden sm:inline">Корзина</span>
      {totalItems > 0 && (
        <span className="bg-pine absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold leading-none text-white shadow-sm">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}
