import Link from "next/link";
import { redirect } from "next/navigation";

import { ClearCartOnSuccess } from "@/components/cart/clear-cart-on-success";
import { Container } from "@/components/ui/container";
import { getOrderByPublicId, syncOrderPaymentStatus } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  const orderId = order?.trim();

  if (!orderId) {
    redirect("/checkout/failed");
  }

  const snapshot = await getOrderByPublicId(orderId);
  if (!snapshot) {
    redirect("/checkout/failed");
  }

  const syncedOrder = await syncOrderPaymentStatus(snapshot);

  if (syncedOrder.paymentStatus === "pending") {
    redirect(`/checkout/pending?order=${encodeURIComponent(orderId)}`);
  }

  if (syncedOrder.paymentStatus !== "paid") {
    redirect(`/checkout/failed?order=${encodeURIComponent(orderId)}`);
  }

  return (
    <Container className="max-w-4xl py-12">
      <ClearCartOnSuccess />
      <div className="border-border-subtle bg-surface rounded-3xl border p-8">
        <div className="text-pine text-sm tracking-[0.24em] uppercase">
          Оплата подтверждена
        </div>
        <h1 className="mt-2 text-4xl font-semibold">
          Спасибо! Заказ успешно оплачен.
        </h1>
        <p className="text-ink/70 mt-4">
          Мы получили оплату и передали заказ в обработку. Номер заказа:{" "}
          <span className="font-semibold">{syncedOrder.id}</span>
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/catalog"
            className="bg-pine rounded-full px-5 py-3 font-medium text-white"
          >
            Продолжить покупки
          </Link>
          <Link
            href="/"
            className="border-border-strong rounded-full border px-5 py-3 font-medium"
          >
            На главную
          </Link>
        </div>
      </div>
    </Container>
  );
}
