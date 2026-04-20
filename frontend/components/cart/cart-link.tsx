"use client";

import Link from "next/link";

import { useCart } from "@/components/cart/cart-provider";
import { cn } from "@/lib/utils";

export function CartLink({ className }: { className?: string }) {
  const { totalItems } = useCart();

  return (
    <Link
      href="/cart"
      aria-label="Корзина"
      className={cn(
        "relative inline-flex items-center justify-center rounded-full p-2 text-white transition hover:text-white",
        className
      )}
    >
      <p className="font-nav text-sm">Корзина</p>
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-white px-1 text-[10px] leading-none font-bold text-[#63567A] shadow-sm">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}
