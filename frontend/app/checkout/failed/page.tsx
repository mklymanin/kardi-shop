import Link from "next/link";

export default function CheckoutFailedPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="border-border-subtle bg-surface rounded-3xl border p-8">
        <div className="text-sm uppercase tracking-[0.24em] text-red-600">
          Оплата не завершена
        </div>
        <h1 className="mt-2 text-4xl font-semibold">
          Платёж не был подтверждён
        </h1>
        <p className="text-ink/70 mt-4">
          Проверьте статус в банке и попробуйте начать оплату заново из корзины.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/checkout"
            className="bg-pine rounded-full px-5 py-3 font-medium text-white"
          >
            Вернуться к оформлению
          </Link>
          <Link
            href="/cart"
            className="border-border-strong rounded-full border px-5 py-3 font-medium"
          >
            В корзину
          </Link>
        </div>
      </div>
    </div>
  );
}
