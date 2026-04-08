"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { ButtonLink, Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { formatRub } from "@/lib/format";
import { submitOrder } from "@/app/actions/submit-order";
import {
  getActiveDeliveryMethods,
  type DeliveryMethod,
} from "@/lib/api/delivery-methods";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>([]);
  const [deliveryMethodCode, setDeliveryMethodCode] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [deliveryLoadError, setDeliveryLoadError] = useState<string | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getActiveDeliveryMethods()
      .then((methods) => {
        if (cancelled) return;
        setDeliveryMethods(methods);
        setDeliveryMethodCode((prev) => prev || methods[0]?.code || "");
      })
      .catch(() => {
        if (cancelled) return;
        setDeliveryLoadError("Не удалось загрузить способы получения");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedDeliveryMethod = useMemo(
    () => deliveryMethods.find((method) => method.code === deliveryMethodCode),
    [deliveryMethods, deliveryMethodCode]
  );
  const needsDeliveryAddress =
    deliveryMethodCode === "courier" || deliveryMethodCode === "russian_post";
  const deliveryPrice = selectedDeliveryMethod?.price ?? 0;
  const totalWithDelivery = totalPrice + deliveryPrice;

  const isValid =
    customerName.trim().length > 1 &&
    phone.trim().length > 4 &&
    items.length > 0 &&
    Boolean(deliveryMethodCode) &&
    (!needsDeliveryAddress || deliveryAddress.trim().length > 5);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || submitting) {
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const result = await submitOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        comment: comment.trim() || undefined,
        deliveryMethodCode,
        deliveryAddress: needsDeliveryAddress
          ? deliveryAddress.trim() || undefined
          : undefined,
        itemsRaw: items.map((item) => ({
          slug: item.slug,
          quantity: item.quantity,
        })),
        couponCode: couponCode.trim() || undefined,
      });

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      const confirmationUrl = result.order.confirmationUrl;
      if (/^https?:\/\//i.test(confirmationUrl)) {
        window.location.assign(confirmationUrl);
        return;
      }
      router.push(confirmationUrl);
    } catch {
      setError("Не удалось создать платёж. Попробуйте снова.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer size="md">
      <h1 className="text-4xl font-semibold">Оформление заказа</h1>
      {items.length === 0 ? (
        <Card className="mt-6 rounded-3xl">
          <p className="text-ink/70">
            В корзине нет товаров. Добавьте позиции перед оформлением заказа.
          </p>
          <ButtonLink href="/catalog" className="mt-4">
            Перейти в каталог
          </ButtonLink>
        </Card>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_320px]">
          <form
            onSubmit={handleSubmit}
            className="border-border-subtle bg-surface rounded-3xl border p-6"
          >
            <h2 className="text-xl font-semibold">Контактные данные</h2>
            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm">
                <span>Имя *</span>
                <input
                  className="border-border-strong h-11 rounded-xl border px-4 outline-none"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Иван Иванов"
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span>Телефон *</span>
                <input
                  className="border-border-strong h-11 rounded-xl border px-4 outline-none"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+7 (999) 123-45-67"
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span>Email</span>
                <input
                  className="border-border-strong h-11 rounded-xl border px-4 outline-none"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="mail@example.com"
                  type="email"
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span>Комментарий</span>
                <textarea
                  className="border-border-strong min-h-24 rounded-xl border px-4 py-3 outline-none"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Комментарий к заказу"
                />
              </label>
            </div>
            <h3 className="mt-6 text-lg font-semibold">Способ получения</h3>
            {deliveryLoadError ? (
              <p className="mt-3 text-sm text-red-600">{deliveryLoadError}</p>
            ) : (
              <div className="mt-4 grid gap-3">
                {deliveryMethods.map((method) => (
                  <label
                    key={method.code}
                    className="border-border-subtle flex cursor-pointer items-start gap-3 rounded-xl border p-3"
                  >
                    <input
                      type="radio"
                      name="deliveryMethod"
                      className="mt-1"
                      value={method.code}
                      checked={deliveryMethodCode === method.code}
                      onChange={(event) =>
                        setDeliveryMethodCode(event.target.value)
                      }
                    />
                    <span className="grid gap-1">
                      <span className="text-sm font-medium">
                        {method.title}
                      </span>
                      <span className="text-ink/65 text-sm">
                        {method.price > 0
                          ? formatRub(method.price)
                          : "Бесплатно"}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            )}
            {deliveryMethodCode === "pickup" &&
            selectedDeliveryMethod?.pickupAddress ? (
              <div className="border-border-subtle mt-4 rounded-xl border p-4 text-sm">
                <div className="text-ink/60 mb-1">Адрес склада</div>
                <div>{selectedDeliveryMethod.pickupAddress}</div>
              </div>
            ) : null}
            {needsDeliveryAddress ? (
              <label className="mt-4 grid gap-2 text-sm">
                <span>Адрес доставки *</span>
                <textarea
                  className="border-border-strong min-h-24 rounded-xl border px-4 py-3 outline-none"
                  value={deliveryAddress}
                  onChange={(event) => setDeliveryAddress(event.target.value)}
                  placeholder="Город, улица, дом, квартира"
                />
              </label>
            ) : null}
            <label className="mt-4 grid gap-2 text-sm">
              <span>Купон</span>
              <input
                className="border-border-strong h-11 rounded-xl border px-4 uppercase outline-none"
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                placeholder="Например, SALE10"
              />
            </label>
            {error ? (
              <p className="mt-4 text-sm text-red-600">{error}</p>
            ) : null}
            <Button
              type="submit"
              disabled={!isValid || submitting}
              className="mt-6"
            >
              {submitting ? "Переходим к оплате..." : "Перейти к оплате"}
            </Button>
          </form>
          <Card className="h-fit rounded-3xl">
            <h2 className="text-lg font-semibold">Ваш заказ</h2>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.slug} className="text-sm">
                  <div>{item.title}</div>
                  <div className="text-ink/65">
                    {item.quantity} x {item.priceLabel}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 border-t border-[#e3efeb] pt-4">
              <div className="text-ink/65 text-sm">Товары</div>
              <div className="text-lg font-semibold">
                {formatRub(totalPrice)}
              </div>
              <div className="text-ink/65 mt-3 text-sm">Способ получения</div>
              <div className="text-lg font-semibold">
                {selectedDeliveryMethod
                  ? `${selectedDeliveryMethod.title}: ${formatRub(deliveryPrice)}`
                  : "Не выбран"}
              </div>
              <div className="text-ink/65 mt-3 text-sm">Итого</div>
              <div className="text-pine text-3xl font-semibold">
                {formatRub(totalWithDelivery)}
              </div>
            </div>
          </Card>
        </div>
      )}
    </PageContainer>
  );
}
