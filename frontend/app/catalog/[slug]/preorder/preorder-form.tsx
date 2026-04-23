"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";

import { submitPreorder } from "@/app/actions/submit-preorder";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatRub } from "@/lib/format";
import type { LineType, Product } from "@/lib/site-data";
import {
  getActiveDeliveryMethods,
  type DeliveryMethod,
} from "@/lib/api/delivery-methods";

type PreorderFormProps = {
  product: Product;
};

export function PreorderForm({ product }: PreorderFormProps) {
  const router = useRouter();
  const canRent =
    product.rentalAvailable === true && (product.rentalPriceValue ?? 0) > 0;

  const [lineType, setLineType] = useState<LineType>("purchase");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>([]);
  const [deliveryMethodCode, setDeliveryMethodCode] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryLoadError, setDeliveryLoadError] = useState<string | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    () => deliveryMethods.find((m) => m.code === deliveryMethodCode),
    [deliveryMethods, deliveryMethodCode]
  );

  const needsDeliveryAddress =
    deliveryMethodCode === "courier" || deliveryMethodCode === "russian_post";

  const isValid =
    customerName.trim().length > 1 &&
    phone.trim().length > 4 &&
    (!email.trim() || emailIsValid) &&
    Boolean(deliveryMethodCode) &&
    (!needsDeliveryAddress || deliveryAddress.trim().length > 5);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid || submitting) return;
    if (!selectedDeliveryMethod) return;

    setSubmitting(true);
    setError(null);
    const resolvedLineType: LineType = canRent ? lineType : "purchase";

    const result = await submitPreorder({
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: emailTrimmed || undefined,
      comment: comment.trim() || undefined,
      deliveryMethodCode,
      deliveryMethodTitle: selectedDeliveryMethod.title,
      deliveryAddress: needsDeliveryAddress
        ? deliveryAddress.trim()
        : undefined,
      productSlug: product.slug,
      productTitle: product.title,
      lineType: resolvedLineType,
    });

    setSubmitting(false);
    if (!result.success) {
      setError(result.error.message);
      return;
    }
    router.push(`/catalog/${product.slug}/preorder/success`);
  };

  return (
    <div className="py-8 md:py-10">
      <Link
        href={`/catalog/${product.slug}`}
        className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5 text-sm transition"
      >
        <ArrowLeft className="size-4" />К товару
      </Link>

      <h1 className="font-display text-3xl uppercase sm:text-4xl lg:text-5xl">
        Предзаказ
      </h1>
      <p className="text-muted-foreground mt-2 max-w-xl text-sm">
        Оставьте заявку — менеджер свяжется, когда товар снова появится. Оплата
        на сайте не требуется.
      </p>
      <div className="my-3 border-b border-black/50 sm:my-4" aria-hidden />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-black p-5 sm:p-6">
            <h2 className="font-display text-xl uppercase">Товар</h2>
            <div className="my-3 border-b border-black/50" aria-hidden />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {product.imageUrl ? (
                <div className="bg-muted relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-black/10">
                  <Image
                    src={product.imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              ) : null}
              <div>
                <p className="font-display font-medium">{product.title}</p>
                <p className="text-muted-foreground text-sm">
                  {product.sku ? `Арт. ${product.sku}` : null}
                </p>
              </div>
            </div>

            {canRent ? (
              <div
                role="radiogroup"
                aria-label="Вариант"
                className="mt-4 grid grid-cols-2 rounded-xl border border-black p-1 text-sm"
              >
                <Button
                  type="button"
                  role="radio"
                  aria-checked={lineType === "purchase"}
                  variant={lineType === "purchase" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setLineType("purchase")}
                >
                  Купить
                </Button>
                <Button
                  type="button"
                  role="radio"
                  aria-checked={lineType === "rent"}
                  variant={lineType === "rent" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setLineType("rent")}
                >
                  Аренда
                </Button>
              </div>
            ) : null}
          </div>

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
                    Email
                  </span>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mail@example.com (необязательно)"
                    className="h-11"
                  />
                </label>
              </div>
              {email && !emailIsValid ? (
                <p className="text-sm text-red-600">Укажите корректный email</p>
              ) : null}
              <label className="grid gap-1.5 text-sm">
                <span className="font-display text-muted-foreground">
                  Комментарий
                </span>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Пожелания по срокам и способу связи"
                  className="min-h-24"
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-black p-5 sm:p-6">
            <h2 className="font-display text-xl uppercase">Способ получения</h2>
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
                        onChange={(e) => setDeliveryMethodCode(e.target.value)}
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

          {error ? (
            <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              disabled={!isValid || submitting}
              className="h-11 rounded-xl px-6"
            >
              {submitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Отправить заявку"
              )}
            </Button>
            <ButtonLink
              href={`/catalog/${product.slug}`}
              variant="outline"
              className="h-11 rounded-xl border-black px-6"
            >
              Отмена
            </ButtonLink>
          </div>
        </form>

        <aside className="text-muted-foreground h-fit space-y-3 rounded-2xl border border-black/15 p-5 text-sm">
          <p className="text-foreground font-display font-medium">
            {lineType === "rent" && canRent && product.rentalPrice
              ? `Предварительная стоимость: ${product.rentalPrice}`
              : `Предварительная стоимость: ${product.price}`}
          </p>
          <p>
            Стоимость и согласование сроков — после появления товара, по
            телефону или email.
          </p>
        </aside>
      </div>
    </div>
  );
}
