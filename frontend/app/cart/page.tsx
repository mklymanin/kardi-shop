"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { useCart, type CartItem } from "@/components/cart/cart-provider";
import { Button, ButtonLink } from "@/components/ui/button";
import { formatRub } from "@/lib/format";
import { CheckoutStartError, resumeOrderPayment } from "@/lib/orders";
import { clearPendingOrder, getPendingOrder } from "@/lib/pending-order";

const ITEM_TRANSITION = {
  duration: 0.3,
  ease: [0.22, 1, 0.36, 1] as const,
};

function cartItemReactKey(item: CartItem) {
  return `${item.slug}:${item.lineType}`;
}

function CartLineBody({
  item,
  setQuantity,
  removeItem,
}: {
  item: CartItem;
  setQuantity: (slug: string, lineType: CartItem["lineType"], quantity: number) => void;
  removeItem: (slug: string, lineType: CartItem["lineType"]) => void;
}) {
  return (
    <>
      {item.imageUrl ? (
        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-black sm:size-24">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-contain p-1"
            sizes="96px"
          />
        </div>
      ) : (
        <div className="bg-mist flex size-20 shrink-0 items-center justify-center rounded-xl border border-black sm:size-24">
          <ShoppingBag className="text-muted-foreground size-8" />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-sm leading-tight sm:text-base">
              {item.title}
            </h2>
            <span
              className="border-border bg-mist text-muted-foreground font-display inline-flex max-w-full shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] tracking-wide uppercase sm:text-xs"
              aria-label={
                item.lineType === "rent"
                  ? item.rentalPeriodLabel
                    ? `Аренда, ${item.rentalPeriodLabel}`
                    : "Аренда"
                  : "Покупка"
              }
            >
              {item.lineType === "rent" ? (
                <>
                  Аренда
                  {item.rentalPeriodLabel
                    ? ` · ${item.rentalPeriodLabel}`
                    : ""}
                </>
              ) : (
                "Покупка"
              )}
            </span>
          </div>
          <div className="text-muted-foreground mt-1 text-xs sm:text-sm">
            {item.priceLabel} за шт.
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center rounded-xl border border-black">
            <button
              className="hover:bg-muted flex size-9 items-center justify-center rounded-l-xl transition"
              onClick={() =>
                setQuantity(item.slug, item.lineType, item.quantity - 1)
              }
              type="button"
              aria-label="Уменьшить количество"
            >
              <Minus className="size-4" />
            </button>
            <span className="font-display min-w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <button
              className="hover:bg-muted flex size-9 items-center justify-center rounded-r-xl transition"
              onClick={() =>
                setQuantity(item.slug, item.lineType, item.quantity + 1)
              }
              type="button"
              aria-label="Увеличить количество"
            >
              <Plus className="size-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-display text-sm font-semibold sm:text-base">
              {formatRub(item.priceValue * item.quantity)}
            </span>
            <button
              className="text-muted-foreground hover:bg-muted hover:text-foreground flex size-9 items-center justify-center rounded-xl transition"
              onClick={() => removeItem(item.slug, item.lineType)}
              type="button"
              aria-label="Удалить товар"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function CartPage() {
  const { items, totalItems, totalPrice, setQuantity, removeItem, clearCart } =
    useCart();
  const reduce = useReducedMotion();
  const { purchaseLines, rentLines } = useMemo(() => {
    const purchase: CartItem[] = [];
    const rent: CartItem[] = [];
    for (const item of items) {
      if (item.lineType === "rent") {
        rent.push(item);
      } else {
        purchase.push(item);
      }
    }
    return { purchaseLines: purchase, rentLines: rent };
  }, [items]);
  const [resumingPayment, setResumingPayment] = useState(false);
  const [resumeOrderId, setResumeOrderId] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);

  useEffect(() => {
    const pending = getPendingOrder();
    if (!pending) {
      return;
    }

    let cancelled = false;
    setResumingPayment(true);
    resumeOrderPayment(pending.resumeToken)
      .then((result) => {
        if (cancelled) return;
        if (result.paymentStatus === "paid" || !result.confirmationUrl) {
          clearPendingOrder();
          return;
        }
        setResumeOrderId(String(result.orderId));
        setResumeUrl(result.confirmationUrl);
      })
      .catch((err) => {
        if (cancelled) return;
        clearPendingOrder();
        if (err instanceof CheckoutStartError) {
          setResumeError(err.message);
          return;
        }
        setResumeError("Не удалось восстановить неоплаченный заказ");
      })
      .finally(() => {
        if (!cancelled) {
          setResumingPayment(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="py-8 md:py-10">
      <h1 className="font-display text-3xl uppercase sm:text-4xl lg:text-5xl">
        Корзина
      </h1>
      <div className="my-3 border-b border-black/50 sm:my-4" aria-hidden />

      {resumeUrl ? (
        <div className="bg-mist mt-6 rounded-2xl border border-black p-5">
          <p className="font-display text-sm">
            У вас есть неоплаченный заказ{" "}
            {resumeOrderId ? (
              <span className="font-semibold">#{resumeOrderId}</span>
            ) : null}
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              type="button"
              disabled={resumingPayment}
              onClick={() => window.location.assign(resumeUrl)}
              className="h-11 rounded-xl px-5"
            >
              Продолжить оплату
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={clearPendingOrder}
              className="h-11 rounded-xl border-black px-5"
            >
              Оформить новый заказ
            </Button>
          </div>
        </div>
      ) : null}

      {!resumeUrl && resumeError ? (
        <p className="mt-4 text-sm text-red-600">{resumeError}</p>
      ) : null}

      {items.length === 0 ? (
        <motion.div
          className="mt-8 flex flex-col items-center gap-4 py-16 text-center"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <ShoppingBag
            className="text-muted-foreground size-16"
            strokeWidth={1}
          />
          <p className="font-display text-muted-foreground text-lg">
            Корзина пока пуста
          </p>
          <p className="font-display text-muted-foreground max-w-sm text-sm">
            Добавьте товары из каталога, чтобы оформить заказ
          </p>
          <ButtonLink
            href="/#devices"
            className="mt-2 h-11 rounded-xl px-6 text-base"
          >
            Перейти к товарам
          </ButtonLink>
        </motion.div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          <motion.div className="space-y-6" layout={!reduce}>
            {purchaseLines.length > 0 ? (
              <div className="space-y-3">
                <h2 className="text-muted-foreground font-display text-xs font-medium tracking-wide uppercase sm:text-sm">
                  Покупка
                </h2>
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {purchaseLines.map((item) => (
                      <motion.div
                        key={cartItemReactKey(item)}
                        layout={!reduce}
                        initial={
                          reduce ? false : { opacity: 0, y: 8, scale: 0.98 }
                        }
                        animate={
                          reduce ? undefined : { opacity: 1, y: 0, scale: 1 }
                        }
                        exit={
                          reduce
                            ? { opacity: 0 }
                            : { opacity: 0, y: -8, scale: 0.98 }
                        }
                        transition={ITEM_TRANSITION}
                        className="flex gap-4 rounded-2xl border border-black p-4"
                      >
                        <CartLineBody
                          item={item}
                          setQuantity={setQuantity}
                          removeItem={removeItem}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ) : null}
            {rentLines.length > 0 ? (
              <div className="space-y-3">
                <h2 className="text-muted-foreground font-display text-xs font-medium tracking-wide uppercase sm:text-sm">
                  Аренда
                </h2>
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {rentLines.map((item) => (
                      <motion.div
                        key={cartItemReactKey(item)}
                        layout={!reduce}
                        initial={
                          reduce ? false : { opacity: 0, y: 8, scale: 0.98 }
                        }
                        animate={
                          reduce ? undefined : { opacity: 1, y: 0, scale: 1 }
                        }
                        exit={
                          reduce
                            ? { opacity: 0 }
                            : { opacity: 0, y: -8, scale: 0.98 }
                        }
                        transition={ITEM_TRANSITION}
                        className="flex gap-4 rounded-2xl border border-black p-4"
                      >
                        <CartLineBody
                          item={item}
                          setQuantity={setQuantity}
                          removeItem={removeItem}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ) : null}

            <button
              className="text-muted-foreground hover:text-foreground mt-1 text-sm underline underline-offset-2 transition"
              onClick={clearCart}
              type="button"
            >
              Очистить корзину
            </button>
          </motion.div>

          <motion.div
            layout={!reduce}
            className="h-fit rounded-2xl border border-black p-6 lg:sticky lg:top-6"
          >
            <h2 className="font-display text-xl uppercase">Итого</h2>
            <div className="my-3 border-b border-black/50" aria-hidden />

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground text-sm">Товаров</span>
                <span className="font-display font-medium">{totalItems}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground text-sm">Сумма</span>
                <span className="font-display font-medium">
                  {formatRub(totalPrice)}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between border-t border-black/50 pt-4">
              <span className="font-display font-semibold">К оплате</span>
              <span className="font-display text-2xl font-semibold">
                {formatRub(totalPrice)}
              </span>
            </div>

            <ButtonLink
              href="/checkout"
              fullWidth
              className="mt-6 h-11 rounded-xl text-base"
            >
              Перейти к оформлению
            </ButtonLink>

            <Link
              href="/#devices"
              className="text-muted-foreground hover:text-foreground mt-3 block text-center text-sm underline underline-offset-2 transition"
            >
              Продолжить покупки
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  );
}
