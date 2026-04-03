"use client";

import { useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import type { Product } from "@/lib/site-data";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      className="bg-ink mt-6 w-full rounded-full px-5 py-3 text-white"
      onClick={() => {
        addItem(product, 1);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
      type="button"
    >
      {added ? "Добавлено" : "Добавить в корзину"}
    </button>
  );
}
