"use client";

import { useState } from "react";
import { FileCheck2, ShieldCheck, Truck } from "lucide-react";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import type { LineType, Product } from "@/lib/site-data";
import { Button, ButtonLink } from "../ui/button";

export function ProductOrderActions({ product }: { product: Product }) {
  const inStock = product.stock > 0;
  const canRent =
    product.rentalAvailable === true && (product.rentalPriceValue ?? 0) > 0;

  const [mode, setMode] = useState<LineType>("purchase");
  const activeMode: LineType = canRent ? mode : "purchase";
  const isRent = activeMode === "rent";

  const activePrice = isRent ? (product.rentalPrice ?? "—") : product.price;
  const priceLabel = isRent ? "Стоимость аренды" : "Цена";

  if (!inStock) {
    return (
      <div className="mt-auto flex flex-col gap-5 border-t border-black/30 pt-5">
        <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
          <span
            aria-hidden
            className="inline-block size-1.5 rounded-full bg-amber-600"
          />
          Нет в наличии — оформите предзаказ
        </div>

        {canRent && product.rentalPrice ? (
          <p className="text-muted-foreground text-xs">
            После поступления также будет доступна аренда: {product.rentalPrice}
            {product.rentalPeriodLabel ? ` (${product.rentalPeriodLabel})` : ""}
          </p>
        ) : null}

        <div className="flex flex-col gap-1.5">
          <div className="text-muted-foreground text-xs tracking-wide uppercase">
            Ориентировочная цена
          </div>
          <div className="text-4xl leading-none font-semibold tracking-tight">
            {product.price}
          </div>
        </div>

        <ButtonLink
          href={`/catalog/${product.slug}/preorder`}
          className="h-10 w-full text-sm"
        >
          Предзаказ
        </ButtonLink>

        <ul className="grid grid-cols-1 gap-2 border-t border-black/10 pt-4 text-xs sm:grid-cols-2">
          <TrustItem
            icon={
              <Truck
                className="size-4 shrink-0"
                strokeWidth={1.75}
                aria-hidden
              />
            }
          >
            Доставка по России
          </TrustItem>
          <TrustItem
            icon={
              <ShieldCheck
                className="size-4 shrink-0"
                strokeWidth={1.75}
                aria-hidden
              />
            }
          >
            Гарантия производителя
          </TrustItem>
          <TrustItem
            icon={
              <FileCheck2
                className="size-4 shrink-0"
                strokeWidth={1.75}
                aria-hidden
              />
            }
          >
            Регистрационное удостоверение
          </TrustItem>
        </ul>
      </div>
    );
  }

  return (
    <div className="mt-auto flex flex-col gap-5 border-t border-black/30 pt-5">
      <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-green-700 uppercase">
        <span
          aria-hidden
          className="inline-block size-1.5 rounded-full bg-green-600"
        />
        В наличии, готово к отгрузке
      </div>

      {canRent ? (
        <div
          role="radiogroup"
          aria-label="Способ оформления"
          className="grid grid-cols-2 rounded-xl border border-black p-1 text-sm"
        >
          <ModeOption
            label="Купить"
            active={!isRent}
            onSelect={() => setMode("purchase")}
          />
          <ModeOption
            label="Аренда"
            active={isRent}
            onSelect={() => setMode("rent")}
          />
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <div className="text-muted-foreground text-xs tracking-wide uppercase">
          {priceLabel}
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-4xl leading-none font-semibold tracking-tight">
            {activePrice}
          </div>
          {isRent && product.rentalPeriodLabel ? (
            <span className="text-muted-foreground text-sm">
              / {product.rentalPeriodLabel}
            </span>
          ) : null}
        </div>
        {!isRent && canRent ? (
          <p className="text-muted-foreground text-xs">
            Также доступна аренда — {product.rentalPrice}
            {product.rentalPeriodLabel ? ` / ${product.rentalPeriodLabel}` : ""}
          </p>
        ) : null}
      </div>

      <AddToCartButton
        key={activeMode}
        product={product}
        lineType={activeMode}
        className="mt-0"
      />

      <ul className="grid grid-cols-1 gap-2 border-t border-black/10 pt-4 text-xs sm:grid-cols-2">
        <TrustItem
          icon={
            <Truck className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
          }
        >
          Доставка по России
        </TrustItem>
        <TrustItem
          icon={
            <ShieldCheck
              className="size-4 shrink-0"
              strokeWidth={1.75}
              aria-hidden
            />
          }
        >
          Гарантия производителя
        </TrustItem>
        <TrustItem
          icon={
            <FileCheck2
              className="size-4 shrink-0"
              strokeWidth={1.75}
              aria-hidden
            />
          }
        >
          Регистрационное удостоверение
        </TrustItem>
      </ul>
    </div>
  );
}

function ModeOption({
  label,
  active,
  onSelect,
}: {
  label: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <Button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onSelect}
      variant={active ? "default" : "outline"}
    >
      {label}
    </Button>
  );
}

function TrustItem({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="text-muted-foreground flex items-center gap-2 leading-snug">
      {icon}
      <span>{children}</span>
    </li>
  );
}
