"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/site-data";

export function AddToCartButton({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  if (compact) {
    return (
      <Button
        type="button"
        onClick={handleClick}
        className="h-9 rounded-xl px-3 text-xs"
      >
        {added ? (
          <>
            <Check strokeWidth={2.5} />
            Готово
          </>
        ) : (
          <>
            <ShoppingCart strokeWidth={2} />В корзину
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      className={cn("mt-6 h-11 w-full rounded-xl text-base")}
    >
      {added ? (
        <>
          <Check className="size-5" strokeWidth={2.5} />
          Добавлено в корзину
        </>
      ) : (
        <>
          <ShoppingCart className="size-5" strokeWidth={2} />
          Добавить в корзину
        </>
      )}
    </Button>
  );
}
