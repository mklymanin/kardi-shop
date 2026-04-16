import Link from "next/link";
import { redirect } from "next/navigation";

import { ClearCartOnSuccess } from "@/components/cart/clear-cart-on-success";
import { ButtonLink } from "@/components/ui/button";
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
    <div className="py-8 md:py-10">
      <ClearCartOnSuccess />
      <div className="rounded-2xl border border-black p-6 sm:p-8">
        <div className="font-display text-muted-foreground text-xs tracking-[0.24em] uppercase">
          Оплата подтверждена
        </div>
        <h1 className="font-display mt-2 text-3xl uppercase sm:text-4xl">
          Спасибо! Заказ успешно оплачен.
        </h1>
        <div className="my-3 border-b border-black/50 sm:my-4" aria-hidden />
        <p className="mt-4">
          Мы получили оплату и передали заказ в обработку. Номер заказа:{" "}
          <span className="font-semibold">{syncedOrder.id}</span>
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/#devices" className="h-11 rounded-xl px-5">
            Продолжить покупки
          </ButtonLink>
          <Link
            href="/"
            className="font-display hover:bg-muted inline-flex h-11 items-center rounded-xl border border-black px-5 font-medium transition"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
