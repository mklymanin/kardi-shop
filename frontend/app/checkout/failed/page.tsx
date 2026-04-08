"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
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
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="border-border-subtle bg-surface rounded-3xl border p-8">
        <div className="text-sm uppercase tracking-[0.24em] text-red-600">
          Оплата не завершена
        </div>
        <h1 className="mt-2 text-4xl font-semibold">
          Платёж не был подтверждён
        </h1>
        <p className="text-ink/70 mt-4">
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
            >
              Повторить оплату
            </Button>
          ) : (
            <Link
              href="/checkout"
              className="bg-pine rounded-full px-5 py-3 font-medium text-white"
            >
              {loading ? "Проверяем заказ..." : "Вернуться к оформлению"}
            </Link>
          )}
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
