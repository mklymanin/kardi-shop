"use client";

import { useEffect, useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { formatRub } from "@/lib/format";
import { CheckoutStartError, resumeOrderPayment } from "@/lib/orders";
import { clearPendingOrder, getPendingOrder } from "@/lib/pending-order";

export default function CartPage() {
  const { items, totalItems, totalPrice, setQuantity, removeItem, clearCart } =
    useCart();
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
    <PageContainer size="md">
      <h1 className="text-4xl font-semibold">Корзина</h1>
      {resumeUrl ? (
        <Card className="mt-6 rounded-3xl">
          <p className="text-ink/70">
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
            >
              Продолжить оплату
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={clearPendingOrder}
            >
              Оформить новый заказ
            </Button>
          </div>
        </Card>
      ) : null}
      {!resumeUrl && resumeError ? (
        <p className="mt-4 text-sm text-red-600">{resumeError}</p>
      ) : null}
      {items.length === 0 ? (
        <Card className="mt-6 rounded-3xl">
          <p className="text-ink/70">
            Корзина пока пуста. Добавьте товары из каталога.
          </p>
          <ButtonLink href="/catalog" className="mt-4">
            Перейти в каталог
          </ButtonLink>
        </Card>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.slug} radius="lg">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{item.title}</h2>
                    <div className="text-ink/65 mt-2 text-sm">
                      {item.priceLabel} за шт.
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      className="border-border-strong h-9 w-9 rounded-full border"
                      onClick={() => setQuantity(item.slug, item.quantity - 1)}
                      type="button"
                    >
                      -
                    </button>
                    <span className="w-7 text-center">{item.quantity}</span>
                    <button
                      className="border-border-strong h-9 w-9 rounded-full border"
                      onClick={() => setQuantity(item.slug, item.quantity + 1)}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <button
                    className="text-ink/55 text-sm underline"
                    onClick={() => removeItem(item.slug)}
                    type="button"
                  >
                    Удалить
                  </button>
                  <div className="text-lg font-semibold">
                    {formatRub(item.priceValue * item.quantity)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Card className="h-fit rounded-3xl">
            <div className="text-ink/60 text-sm">Товаров</div>
            <div className="mt-1 text-2xl font-semibold">{totalItems}</div>
            <div className="text-ink/60 mt-4 text-sm">Сумма</div>
            <div className="text-pine mt-1 text-3xl font-semibold">
              {formatRub(totalPrice)}
            </div>
            <ButtonLink href="/checkout" fullWidth className="mt-6">
              Перейти к оформлению
            </ButtonLink>
            <button
              className="border-border-strong mt-3 w-full rounded-full border px-5 py-3 text-sm"
              onClick={clearCart}
              type="button"
            >
              Очистить корзину
            </button>
          </Card>
        </div>
      )}
    </PageContainer>
  );
}
