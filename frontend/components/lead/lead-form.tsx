"use client";

import { useState } from "react";

import { submitLead } from "@/lib/strapi";

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
        source
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
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Имя"
          className="h-12 flex-1 rounded-full border border-[#d8e6e2] bg-white px-5 outline-none placeholder:text-ink/35"
        />
        <input
          type="text"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+7 (___) ___-__-__"
          className="h-12 flex-1 rounded-full border border-[#d8e6e2] bg-white px-5 outline-none placeholder:text-ink/35"
        />
        <button
          type="submit"
          disabled={!isValid || submitting}
          className="h-12 rounded-full bg-pine px-6 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Отправка..." : "Отправить"}
        </button>
        {status === "success" ? <p className="w-full text-sm text-pine">Заявка отправлена.</p> : null}
        {status === "error" ? <p className="w-full text-sm text-red-600">Ошибка отправки заявки.</p> : null}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-4 rounded-3xl border border-[#dceae5] bg-white p-6">
      <label className="grid gap-2 text-sm">
        <span>Имя *</span>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Иван Иванов"
          className="h-11 rounded-xl border border-[#cfe3dd] px-4 outline-none"
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span>Телефон *</span>
        <input
          type="text"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+7 (999) 123-45-67"
          className="h-11 rounded-xl border border-[#cfe3dd] px-4 outline-none"
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="mail@example.com"
          className="h-11 rounded-xl border border-[#cfe3dd] px-4 outline-none"
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span>Комментарий</span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Интересует консультация по прибору"
          className="min-h-24 rounded-xl border border-[#cfe3dd] px-4 py-3 outline-none"
        />
      </label>
      <button
        type="submit"
        disabled={!isValid || submitting}
        className="w-fit rounded-full bg-pine px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Отправка..." : "Отправить заявку"}
      </button>
      {status === "success" ? <p className="text-sm text-pine">Заявка отправлена. Мы свяжемся с вами.</p> : null}
      {status === "error" ? <p className="text-sm text-red-600">Ошибка отправки заявки. Попробуйте еще раз.</p> : null}
    </form>
  );
}
