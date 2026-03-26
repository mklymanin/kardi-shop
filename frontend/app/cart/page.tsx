"use client";

import Link from "next/link";

import { useCart } from "@/components/cart/cart-provider";

function formatRub(value: number) {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

export default function CartPage() {
  const { items, totalItems, totalPrice, setQuantity, removeItem, clearCart } = useCart();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-4xl font-semibold">Корзина</h1>
      {items.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-[#dceae5] bg-white p-8">
          <p className="text-ink/70">Корзина пока пуста. Добавьте товары из каталога.</p>
          <Link href="/catalog" className="mt-4 inline-block rounded-full bg-pine px-5 py-3 font-medium text-white">
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((item) => (
              <article key={item.slug} className="rounded-3xl border border-[#dceae5] bg-white p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{item.title}</h2>
                    <div className="mt-2 text-sm text-ink/65">{item.priceLabel} за шт.</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      className="h-9 w-9 rounded-full border border-[#cfe3dd]"
                      onClick={() => setQuantity(item.slug, item.quantity - 1)}
                      type="button"
                    >
                      -
                    </button>
                    <span className="w-7 text-center">{item.quantity}</span>
                    <button
                      className="h-9 w-9 rounded-full border border-[#cfe3dd]"
                      onClick={() => setQuantity(item.slug, item.quantity + 1)}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <button className="text-sm text-ink/55 underline" onClick={() => removeItem(item.slug)} type="button">
                    Удалить
                  </button>
                  <div className="text-lg font-semibold">{formatRub(item.priceValue * item.quantity)}</div>
                </div>
              </article>
            ))}
          </div>
          <aside className="h-fit rounded-3xl border border-[#dceae5] bg-white p-6">
            <div className="text-sm text-ink/60">Товаров</div>
            <div className="mt-1 text-2xl font-semibold">{totalItems}</div>
            <div className="mt-4 text-sm text-ink/60">Сумма</div>
            <div className="mt-1 text-3xl font-semibold text-pine">{formatRub(totalPrice)}</div>
            <Link
              href="/checkout"
              className="mt-6 inline-block w-full rounded-full bg-pine px-5 py-3 text-center font-medium text-white"
            >
              Перейти к оформлению
            </Link>
            <button
              className="mt-3 w-full rounded-full border border-[#cfe3dd] px-5 py-3 text-sm"
              onClick={clearCart}
              type="button"
            >
              Очистить корзину
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
