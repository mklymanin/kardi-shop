"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { FadeInSection } from "@/components/motion/fade-in-section";
import { Button, ButtonLink } from "@/components/ui/button";
import { CheckoutStartError, resumeOrderPayment } from "@/lib/orders";
import { clearPendingOrder, getPendingOrder } from "@/lib/pending-order";

export default function CheckoutFailedPage() {
  const [loading, setLoading] = useState(true);
  const [resuming, setResuming] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);

  useEffect(() => {
    const pending = getPendingOrder();
    if (!pending) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    resumeOrderPayment(pending.resumeToken)
      .then((result) => {
        if (cancelled) return;
        if (result.paymentStatus === "paid" || !result.confirmationUrl) {
          clearPendingOrder();
          return;
        }
        setResumeUrl(result.confirmationUrl);
      })
      .catch((err) => {
        if (cancelled) return;
        clearPendingOrder();
        if (err instanceof CheckoutStartError) {
          setResumeError(err.message);
          return;
        }
        setResumeError("Не удалось подготовить повторную оплату");
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="py-8 md:py-10">
      <FadeInSection
        className="rounded-2xl border border-black p-6 sm:p-8"
        amount={0.1}
      >
        <div className="font-display text-xs tracking-[0.24em] text-red-600 uppercase">
          Оплата не завершена
        </div>
        <h1 className="font-display mt-2 text-3xl uppercase sm:text-4xl">
          Платёж не был подтверждён
        </h1>
        <div className="my-3 border-b border-black/50 sm:my-4" aria-hidden />
        <p className="mt-4">
          Проверьте статус в банке. Вы можете повторить оплату этого же заказа.
        </p>
        {resumeError ? (
          <p className="mt-3 text-sm text-red-600">{resumeError}</p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          {resumeUrl ? (
            <Button
              type="button"
              disabled={resuming}
              onClick={() => {
                setResuming(true);
                window.location.assign(resumeUrl);
              }}
              className="h-11 rounded-xl px-5"
            >
              Повторить оплату
            </Button>
          ) : (
            <ButtonLink href="/checkout" className="h-11 rounded-xl px-5">
              {loading ? "Проверяем заказ..." : "Вернуться к оформлению"}
            </ButtonLink>
          )}
          <Link
            href="/cart"
            className="font-display hover:bg-muted inline-flex h-11 items-center rounded-xl border border-black px-5 font-medium transition"
          >
            В корзину
          </Link>
        </div>
      </FadeInSection>
    </div>
  );
}
