"use client";

import { FormEvent, useMemo, useState } from "react";

import { submitLead } from "@/app/actions/submit-lead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import { IMaskInput } from "react-imask";

const PHONE_DIGITS_COUNT = 11;

function normalizePhoneDigits(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "7";
  }

  if (digits.startsWith("8")) {
    return `7${digits.slice(1)}`.slice(0, PHONE_DIGITS_COUNT);
  }

  if (digits.startsWith("7")) {
    return digits.slice(0, PHONE_DIGITS_COUNT);
  }

  return `7${digits}`.slice(0, PHONE_DIGITS_COUNT);
}

export function OrderNowForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const normalizedPhoneDigits = useMemo(
    () => normalizePhoneDigits(phone),
    [phone]
  );
  const isPhoneValid = normalizedPhoneDigits.length === PHONE_DIGITS_COUNT;
  const isValid = name.trim().length > 1 && isPhoneValid;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || submitting) {
      return;
    }

    setSubmitting(true);
    setStatus("idle");

    try {
      await submitLead({
        name: name.trim(),
        phone: `+${normalizedPhoneDigits}`,
        message: message.trim() || undefined,
        source: "home-order",
      });

      setName("");
      setMessage("");
      setPhone("");
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="font-display flex min-h-0 flex-1 flex-col gap-4 md:min-h-0 md:flex-row md:gap-6"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <Textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Задайте вопрос"
          className="min-h-28 min-w-20 resize-none sm:min-h-32 md:field-sizing-fixed md:min-h-0 md:flex-1"
        />
      </div>

      <div className="flex w-full flex-col gap-3 md:min-h-0 md:w-1/2">
        <Input
          id="order-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="min-h-9 flex-1"
          placeholder="Как вас зовут?"
        />

        <IMaskInput
          id="order-phone"
          type="tel"
          inputMode="numeric"
          mask="+{7} (000) 000-00-00"
          lazy={false}
          placeholderChar="_"
          value={phone}
          onAccept={(value) => setPhone(String(value))}
          className={cn(
            "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 h-9 min-h-9 w-full min-w-0 flex-1 rounded-xl border border-black bg-transparent px-3.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm dark:bg-transparent",
            normalizedPhoneDigits.length === 1
              ? "text-muted-foreground"
              : "text-foreground"
          )}
          placeholder="+7 (___) ___ - __ - __"
        />

        <Button
          type="submit"
          disabled={!isValid || submitting}
          className="h-11 w-full flex-1 justify-between rounded-xl px-3.5 md:h-9"
        >
          {submitting ? "Отправка..." : "Отправить"}
          <ArrowRightIcon className="size-5 min-h-9" />
        </Button>

        {status === "success" ? (
          <p className="text-sm text-green-600">Заявка отправлена.</p>
        ) : null}
        {status === "error" ? (
          <p className="text-sm text-red-600">Ошибка отправки заявки.</p>
        ) : null}
      </div>
    </form>
  );
}
