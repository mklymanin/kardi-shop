import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="rounded-3xl border border-border-subtle bg-surface p-8">
        <div className="text-sm uppercase tracking-[0.24em] text-pine">Заказ оформлен</div>
        <h1 className="mt-2 text-4xl font-semibold">Спасибо! Мы получили ваш заказ.</h1>
        <p className="mt-4 text-ink/70">
          Менеджер свяжется с вами в рабочее время для подтверждения. Номер заказа:{" "}
          <span className="font-semibold">{order ?? "без номера"}</span>
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/catalog" className="rounded-full bg-pine px-5 py-3 font-medium text-white">
            Продолжить покупки
          </Link>
          <Link href="/" className="rounded-full border border-border-strong px-5 py-3 font-medium">
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
