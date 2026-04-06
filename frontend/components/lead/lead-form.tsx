"use client";

import { useState } from "react";

import { submitLead } from "@/app/actions/submit-lead";

type LeadFormProps = {
  source: string;
  compact?: boolean;
};

export function LeadForm({ source, compact = false }: LeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const isValid = name.trim().length > 1 && phone.trim().length > 4;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || submitting) {
      return;
    }

    setSubmitting(true);
    setStatus("idle");
    try {
      await submitLead({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        message: message.trim() || undefined,
        source,
      });
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  if (compact) {
    return (
      <form
        onSubmit={handleSubmit}
        className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
      >
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Имя"
          className="border-border-soft bg-surface placeholder:text-ink/35 h-12 flex-1 rounded-full border px-5 outline-none"
        />
        <input
          type="text"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+7 (___) ___-__-__"
          className="border-border-soft bg-surface placeholder:text-ink/35 h-12 flex-1 rounded-full border px-5 outline-none"
        />
        <button
          type="submit"
          disabled={!isValid || submitting}
          className="bg-pine h-12 rounded-full px-6 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Отправка..." : "Отправить"}
        </button>
        {status === "success" ? (
          <p className="text-pine w-full text-sm">Заявка отправлена.</p>
        ) : null}
        {status === "error" ? (
          <p className="w-full text-sm text-red-600">Ошибка отправки заявки.</p>
        ) : null}
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border-subtle bg-surface mt-8 grid gap-4 rounded-3xl border p-6"
    >
      <label className="grid gap-2 text-sm">
        <span>Имя *</span>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Иван Иванов"
          className="border-border-strong h-11 rounded-xl border px-4 outline-none"
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span>Телефон *</span>
        <input
          type="text"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+7 (999) 123-45-67"
          className="border-border-strong h-11 rounded-xl border px-4 outline-none"
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="mail@example.com"
          className="border-border-strong h-11 rounded-xl border px-4 outline-none"
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span>Комментарий</span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Интересует консультация по прибору"
          className="border-border-strong min-h-24 rounded-xl border px-4 py-3 outline-none"
        />
      </label>
      <button
        type="submit"
        disabled={!isValid || submitting}
        className="bg-pine w-fit rounded-full px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Отправка..." : "Отправить заявку"}
      </button>
      {status === "success" ? (
        <p className="text-pine text-sm">
          Заявка отправлена. Мы свяжемся с вами.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-red-600">
          Ошибка отправки заявки. Попробуйте еще раз.
        </p>
      ) : null}
    </form>
  );
}
