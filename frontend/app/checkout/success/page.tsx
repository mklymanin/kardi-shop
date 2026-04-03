import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="border-border-subtle bg-surface rounded-3xl border p-8">
        <div className="text-pine text-sm uppercase tracking-[0.24em]">
          Заказ оформлен
        </div>
        <h1 className="mt-2 text-4xl font-semibold">
          Спасибо! Мы получили ваш заказ.
        </h1>
        <p className="text-ink/70 mt-4">
          Менеджер свяжется с вами в рабочее время для подтверждения. Номер
          заказа: <span className="font-semibold">{order ?? "без номера"}</span>
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
    </div>
  );
}
