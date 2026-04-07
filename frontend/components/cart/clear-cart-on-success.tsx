"use client";

import { useEffect } from "react";

import { useCart } from "@/components/cart/cart-provider";

export function ClearCartOnSuccess() {
  const { clearCart } = useCart();

  useEffect(() => {
    const flagKey = "shop-kardi-last-paid-order";
    const orderId = window.location.search
      ? new URLSearchParams(window.location.search).get("order")
      : null;

    if (orderId && sessionStorage.getItem(flagKey) === orderId) {
      return;
    }

    clearCart();

    if (orderId) {
      sessionStorage.setItem(flagKey, orderId);
    }
  }, [clearCart]);

  return null;
}
