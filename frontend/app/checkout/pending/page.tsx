import Link from "next/link";

import { FadeInSection } from "@/components/motion/fade-in-section";
import { ButtonLink } from "@/components/ui/button";

export default function CheckoutPendingPage() {
  return (
    <div className="py-8 md:py-10">
      <FadeInSection
        className="rounded-2xl border border-black p-6 sm:p-8"
        amount={0.1}
      >
        <div className="font-display text-muted-foreground text-xs tracking-[0.24em] uppercase">
          Платёж обрабатывается
        </div>
        <h1 className="font-display mt-2 text-3xl uppercase sm:text-4xl">
          Ждём подтверждение оплаты
        </h1>
        <div className="my-3 border-b border-black/50 sm:my-4" aria-hidden />
        <p className="mt-4">
          Банк или YooKassa ещё не прислали окончательный статус. Обычно это
          занимает недолго. Обновите страницу чуть позже.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/" className="h-11 rounded-xl px-5">
            На главную
          </ButtonLink>
          <Link
            href="/checkout"
            className="font-display hover:bg-muted inline-flex h-11 items-center rounded-xl border border-black px-5 font-medium transition"
          >
            К оформлению
          </Link>
        </div>
      </FadeInSection>
    </div>
  );
}
