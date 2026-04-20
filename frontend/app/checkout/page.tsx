"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Loader2, ShoppingBag } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatRub } from "@/lib/format";
import { previewOrderPricing, submitOrder } from "@/app/actions/submit-order";
import {
  resumeOrderPayment,
  type OrderPricingSnapshot,
  CheckoutStartError,
} from "@/lib/orders";
import {
  clearPendingOrder,
  getPendingOrder,
  setPendingOrder,
} from "@/lib/pending-order";
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
  const [couponStatus, setCouponStatus] = useState<
    "idle" | "typing" | "checking" | "valid" | "invalid"
  >("idle");
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [pricingPreview, setPricingPreview] =
    useState<OrderPricingSnapshot | null>(null);
  const [deliveryLoadError, setDeliveryLoadError] = useState<string | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const [resumingPayment, setResumingPayment] = useState(false);
  const [resumeOrderId, setResumeOrderId] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const couponRequestSeqRef = useRef(0);
  const emailTrimmed = email.trim();
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed);

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
  const normalizedCouponCode = couponCode.trim().toUpperCase();
  const hasCoupon = normalizedCouponCode.length > 0;
  const canQuoteOrder =
    items.length > 0 &&
    Boolean(deliveryMethodCode) &&
    (!needsDeliveryAddress || deliveryAddress.trim().length > 5);

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

  const itemsSignature = useMemo(
    () =>
      items
        .map((item) => `${item.slug}:${item.quantity}`)
        .sort()
        .join("|"),
    [items]
  );

  useEffect(() => {
    if (!hasCoupon) {
      setCouponStatus("idle");
      setCouponMessage(null);
      setPricingPreview(null);
      return;
    }

    setPricingPreview(null);
    setCouponMessage(null);

    if (!canQuoteOrder) {
      setCouponStatus("typing");
      return;
    }

    setCouponStatus("typing");
    const requestSeq = couponRequestSeqRef.current + 1;
    couponRequestSeqRef.current = requestSeq;

    const timeoutId = window.setTimeout(async () => {
      setCouponStatus("checking");

      const result = await previewOrderPricing({
        customerName: customerName.trim() || "Покупатель",
        phone: phone.trim() || "+70000000000",
        email: emailTrimmed || "customer@example.com",
        comment: comment.trim() || undefined,
        deliveryMethodCode,
        deliveryAddress: needsDeliveryAddress
          ? deliveryAddress.trim() || undefined
          : undefined,
        itemsRaw: items.map((item) => ({
          slug: item.slug,
          quantity: item.quantity,
        })),
        couponCode: normalizedCouponCode,
      });

      if (couponRequestSeqRef.current !== requestSeq) {
        return;
      }

      if (!result.success) {
        setCouponStatus("invalid");
        setCouponMessage(result.error.message);
        setPricingPreview(null);
        return;
      }

      if (!result.pricing.couponApplied) {
        setCouponStatus("invalid");
        setCouponMessage("Купон не применился к текущему заказу");
        setPricingPreview(null);
        return;
      }

      const discountLabel =
        result.pricing.discountType === "percent" &&
        typeof result.pricing.discountValue === "number"
          ? `${result.pricing.discountValue}%`
          : formatRub(result.pricing.discount);
      setCouponStatus("valid");
      setCouponMessage(`Купон применён. Скидка: ${discountLabel}`);
      setPricingPreview(result.pricing);
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    canQuoteOrder,
    comment,
    customerName,
    deliveryAddress,
    deliveryMethodCode,
    email,
    emailTrimmed,
    hasCoupon,
    items,
    itemsSignature,
    needsDeliveryAddress,
    normalizedCouponCode,
    phone,
  ]);

  const couponBlocksSubmit =
    hasCoupon &&
    (couponStatus === "checking" ||
      couponStatus === "typing" ||
      couponStatus === "invalid" ||
      couponStatus === "idle");
  const subtotalBeforeDiscount =
    pricingPreview?.subtotalBeforeDiscount ?? totalPrice;
  const subtotalAfterDiscount =
    pricingPreview?.subtotalAfterDiscount ?? totalPrice;
  const discountAmount = pricingPreview?.discount ?? 0;
  const totalWithCouponAndDelivery = pricingPreview?.total ?? totalWithDelivery;

  const isValid =
    customerName.trim().length > 1 &&
    phone.trim().length > 4 &&
    emailIsValid &&
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
        email: emailTrimmed,
        comment: comment.trim() || undefined,
        deliveryMethodCode,
        deliveryAddress: needsDeliveryAddress
          ? deliveryAddress.trim() || undefined
          : undefined,
        itemsRaw: items.map((item) => ({
          slug: item.slug,
          quantity: item.quantity,
        })),
        couponCode: normalizedCouponCode || undefined,
      });

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      const confirmationUrl = result.order.confirmationUrl;
      setPendingOrder({
        orderId: String(result.order.id),
        resumeToken: result.order.resumeToken,
        createdAt: new Date().toISOString(),
      });
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
    <div className="py-8 md:py-10">
      <Link
        href="/cart"
        className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5 text-sm transition"
      >
        <ArrowLeft className="size-4" />
        Вернуться в корзину
      </Link>

      <h1 className="font-display text-3xl uppercase sm:text-4xl lg:text-5xl">
        Оформление заказа
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
              onClick={() => window.location.assign(resumeUrl)}
              disabled={resumingPayment}
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
        <div className="mt-8 flex flex-col items-center gap-4 py-16 text-center">
          <ShoppingBag
            className="text-muted-foreground size-16"
            strokeWidth={1}
          />
          <p className="font-display text-muted-foreground text-lg">
            В корзине нет товаров
          </p>
          <ButtonLink
            href="/#devices"
            className="mt-2 h-11 rounded-xl px-6 text-base"
          >
            Перейти к товарам
          </ButtonLink>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact info */}
            <div className="rounded-2xl border border-black p-5 sm:p-6">
              <h2 className="font-display text-xl uppercase">
                Контактные данные
              </h2>
              <div className="my-3 border-b border-black/50" aria-hidden />
              <div className="mt-5 grid gap-4">
                <label className="grid gap-1.5 text-sm">
                  <span className="font-display text-muted-foreground">
                    Имя *
                  </span>
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Иван Иванов"
                    className="h-11"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-sm">
                    <span className="font-display text-muted-foreground">
                      Телефон *
                    </span>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 (999) 123-45-67"
                      className="h-11"
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm">
                    <span className="font-display text-muted-foreground">
                      Email *
                    </span>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="mail@example.com"
                      className="h-11"
                    />
                  </label>
                </div>
                {email && !emailIsValid ? (
                  <p className="text-sm text-red-600">
                    Укажите корректный email для получения информации о заказе.
                  </p>
                ) : null}
                <label className="grid gap-1.5 text-sm">
                  <span className="font-display text-muted-foreground">
                    Комментарий
                  </span>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Комментарий к заказу (необязательно)"
                    className="min-h-24"
                  />
                </label>
              </div>
            </div>

            {/* Delivery */}
            <div className="rounded-2xl border border-black p-5 sm:p-6">
              <h2 className="font-display text-xl uppercase">
                Способ получения
              </h2>
              <div className="my-3 border-b border-black/50" aria-hidden />
              {deliveryLoadError ? (
                <p className="mt-3 text-sm text-red-600">{deliveryLoadError}</p>
              ) : (
                <div className="mt-4 grid gap-2">
                  {deliveryMethods.map((method) => {
                    const selected = deliveryMethodCode === method.code;
                    return (
                      <label
                        key={method.code}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                          selected
                            ? "bg-mist border-black"
                            : "border-black/20 hover:border-black"
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliveryMethod"
                          className="size-4 shrink-0 accent-black"
                          value={method.code}
                          checked={selected}
                          onChange={(e) =>
                            setDeliveryMethodCode(e.target.value)
                          }
                        />
                        <span className="flex flex-1 items-center justify-between">
                          <span className="font-display text-sm">
                            {method.title}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            {method.price > 0
                              ? formatRub(method.price)
                              : "Бесплатно"}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}

              {deliveryMethodCode === "pickup" &&
              selectedDeliveryMethod?.pickupAddress ? (
                <div className="bg-mist mt-4 rounded-xl border border-black p-4 text-sm">
                  <div className="text-muted-foreground font-display mb-1 text-xs tracking-wider uppercase">
                    Адрес склада
                  </div>
                  <div>{selectedDeliveryMethod.pickupAddress}</div>
                </div>
              ) : null}

              {needsDeliveryAddress ? (
                <label className="mt-4 grid gap-1.5 text-sm">
                  <span className="font-display text-muted-foreground">
                    Адрес доставки *
                  </span>
                  <Textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Город, улица, дом, квартира"
                    className="min-h-24"
                  />
                </label>
              ) : null}
            </div>

            {/* Coupon */}
            <div className="rounded-2xl border border-black p-5 sm:p-6">
              <h2 className="font-display text-xl uppercase">Промокод</h2>
              <div className="my-3 border-b border-black/50" aria-hidden />
              <Input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Например, SALE10"
                className="h-11 uppercase"
              />
              {couponStatus === "checking" ? (
                <p className="text-muted-foreground mt-2 flex items-center gap-1.5 text-sm">
                  <Loader2 className="size-3.5 animate-spin" />
                  Проверяем купон...
                </p>
              ) : null}
              {couponStatus === "invalid" && couponMessage ? (
                <p className="mt-2 text-sm text-red-600">{couponMessage}</p>
              ) : null}
              {couponStatus === "valid" && couponMessage ? (
                <p className="mt-2 text-sm font-medium text-green-700">
                  {couponMessage}
                </p>
              ) : null}
            </div>

            {error ? (
              <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <Button
              type="submit"
              disabled={!isValid || submitting || couponBlocksSubmit}
              className="h-12 w-full rounded-xl text-base"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Переходим к оплате...
                </>
              ) : (
                "Перейти к оплате"
              )}
            </Button>
          </form>

          {/* Order summary sidebar */}
          <div className="h-fit rounded-2xl border border-black p-6 lg:sticky lg:top-6">
            <h2 className="font-display text-xl uppercase">Ваш заказ</h2>
            <div className="my-3 border-b border-black/50" aria-hidden />

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.slug} className="flex gap-3">
                  {item.imageUrl ? (
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-black">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-contain p-0.5"
                        sizes="48px"
                      />
                    </div>
                  ) : (
                    <div className="bg-mist flex size-12 shrink-0 items-center justify-center rounded-lg border border-black">
                      <ShoppingBag className="text-muted-foreground size-5" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-display truncate text-sm">
                      {item.title}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {item.quantity} x {item.priceLabel}
                    </div>
                  </div>
                  <div className="font-display shrink-0 text-sm font-medium">
                    {formatRub(item.priceValue * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2.5 border-t border-black/50 pt-4">
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-muted-foreground">Товары</span>
                <span className="font-display font-medium">
                  {formatRub(subtotalBeforeDiscount)}
                </span>
              </div>

              {discountAmount > 0 ? (
                <>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-muted-foreground">Скидка</span>
                    <span className="font-display font-medium text-green-700">
                      -{formatRub(discountAmount)}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-muted-foreground">Со скидкой</span>
                    <span className="font-display font-medium">
                      {formatRub(subtotalAfterDiscount)}
                    </span>
                  </div>
                </>
              ) : null}

              <div className="flex items-baseline justify-between text-sm">
                <span className="text-muted-foreground">Доставка</span>
                <span className="font-display font-medium">
                  {selectedDeliveryMethod
                    ? deliveryPrice > 0
                      ? formatRub(deliveryPrice)
                      : "Бесплатно"
                    : "—"}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between border-t border-black/50 pt-4">
              <span className="font-display font-semibold">Итого</span>
              <span className="font-display text-2xl font-semibold">
                {formatRub(totalWithCouponAndDelivery)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
