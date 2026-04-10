import Link from "next/link";

import { Container } from "@/components/ui/container";

export default function CheckoutPendingPage() {
  return (
    <Container className="max-w-4xl py-12">
      <div className="border-border-subtle bg-surface rounded-3xl border p-8">
        <div className="text-pine text-sm tracking-[0.24em] uppercase">
          Платёж обрабатывается
        </div>
        <h1 className="mt-2 text-4xl font-semibold">
          Ждём подтверждение оплаты
        </h1>
        <p className="text-ink/70 mt-4">
          Банк или YooKassa ещё не прислали окончательный статус. Обычно это
          занимает недолго. Обновите страницу чуть позже.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="bg-pine rounded-full px-5 py-3 font-medium text-white"
          >
            На главную
          </Link>
          <Link
            href="/checkout"
            className="border-border-strong rounded-full border px-5 py-3 font-medium"
          >
            К оформлению
          </Link>
        </div>
      </div>
    </Container>
  );
}
