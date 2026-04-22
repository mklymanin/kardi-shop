"use client";

import { useState } from "react";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { cn } from "@/lib/utils";
import type { LineType, Product } from "@/lib/site-data";

export function ProductOrderActions({ product }: { product: Product }) {
  const canRent =
    product.rentalAvailable === true && (product.rentalPriceValue ?? 0) > 0;

  const [mode, setMode] = useState<LineType>("purchase");

  return (
    <div className="mt-auto flex flex-col gap-4 border-t border-black/30 pt-5">
      {canRent ? (
        <div
          className="flex gap-1 rounded-xl border border-black/30 p-1"
          role="group"
          aria-label="Способ оформления"
        >
          <button
            type="button"
            onClick={() => setMode("purchase")}
            className={cn(
              "font-display flex-1 rounded-lg px-3 py-2 text-sm transition",
              mode === "purchase"
                ? "bg-black text-white"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Купить
          </button>
          <button
            type="button"
            onClick={() => setMode("rent")}
            className={cn(
              "font-display flex-1 rounded-lg px-3 py-2 text-sm transition",
              mode === "rent"
                ? "bg-black text-white"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Аренда
          </button>
        </div>
      ) : null}

      <div className="flex flex-col gap-1">
        <div className="text-muted-foreground text-sm uppercase">
          {mode === "rent" ? (
            <>
              Аренда
              {product.rentalPeriodLabel ? (
                <span className="text-muted-foreground font-normal normal-case">
                  {" "}
                  ({product.rentalPeriodLabel})
                </span>
              ) : null}
            </>
          ) : (
            "Цена"
          )}
        </div>
        <div className="text-3xl font-semibold">
          {mode === "rent" ? (product.rentalPrice ?? "—") : product.price}
        </div>
      </div>
      <AddToCartButton product={product} lineType={mode} />
    </div>
  );
}
