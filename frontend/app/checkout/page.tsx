"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { submitOrder } from "@/lib/strapi";

function formatRub(value: number) {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = customerName.trim().length > 1 && phone.trim().length > 4 && items.length > 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || submitting) {
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const order = await submitOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        comment: comment.trim() || undefined,
        itemsRaw: items.map((item) => ({
          slug: item.slug,
          title: item.title,
          quantity: item.quantity,
          price: item.priceValue
        })),
        total: totalPrice
      });
      clearCart();
      router.push(`/checkout/success?order=${encodeURIComponent(String(order.id))}`);
    } catch {
      setError("Не удалось отправить заказ. Проверьте, запущен ли backend, и попробуйте снова.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-4xl font-semibold">Оформление заказа</h1>
      {items.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-[#dceae5] bg-white p-8">
          <p className="text-ink/70">В корзине нет товаров. Добавьте позиции перед оформлением заказа.</p>
          <Link href="/catalog" className="mt-4 inline-block rounded-full bg-pine px-5 py-3 font-medium text-white">
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_320px]">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-[#dceae5] bg-white p-6">
            <h2 className="text-xl font-semibold">Контактные данные</h2>
            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm">
                <span>Имя *</span>
                <input
                  className="h-11 rounded-xl border border-[#cfe3dd] px-4 outline-none"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Иван Иванов"
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span>Телефон *</span>
                <input
                  className="h-11 rounded-xl border border-[#cfe3dd] px-4 outline-none"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+7 (999) 123-45-67"
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span>Email</span>
                <input
                  className="h-11 rounded-xl border border-[#cfe3dd] px-4 outline-none"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="mail@example.com"
                  type="email"
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span>Комментарий</span>
                <textarea
                  className="min-h-24 rounded-xl border border-[#cfe3dd] px-4 py-3 outline-none"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Комментарий к заказу"
                />
              </label>
            </div>
            {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={!isValid || submitting}
              className="mt-6 rounded-full bg-pine px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Отправка..." : "Подтвердить заказ"}
            </button>
          </form>
          <aside className="h-fit rounded-3xl border border-[#dceae5] bg-white p-6">
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
              <div className="text-sm text-ink/65">Итого</div>
              <div className="text-3xl font-semibold text-pine">{formatRub(totalPrice)}</div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
