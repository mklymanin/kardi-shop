"use client";

import Link from "next/link";

import { useCart } from "@/components/cart/cart-provider";

export function CartLink() {
  const { totalItems } = useCart();

  return <Link href="/cart">Товаров в корзине: {totalItems}</Link>;
}

