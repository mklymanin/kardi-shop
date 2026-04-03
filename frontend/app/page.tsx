import Link from "next/link";

import { LeadForm } from "@/components/lead/lead-form";
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/strapi";

export default async function HomePage() {
  const products = await getProducts();
  const reasons = [
    "Высокое качество регистрации ЭКГ",
    "Автоматическая оценка исследования",
    "Автоматическое описание ЭКГ после записи",
    "Дистанционная консультация врача",
    "Техническая поддержка и сопровождение",
    "Более 15 лет проекту КардиРу",
  ];
  const deviceHighlights = [
    "Регистрация 6 или 12 стандартных отведений ЭКГ",
    "Подключение к мобильному телефону по Bluetooth",
    "Работа без ограничений по числу пациентов и исследований",
    "Простое управление прибором и данными через приложение",
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 md:py-10">
      <section className="border-border-subtle bg-surface grid gap-8 rounded-[34px] border px-8 py-10 shadow-[0_22px_60px_rgba(16,33,43,0.06)] md:grid-cols-[1.1fr_0.9fr] md:px-10">
        <div className="flex flex-col justify-center">
          <div className="bg-pill-bg text-pine mb-3 inline-flex w-fit rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em]">
            shop.kardi.ru
          </div>
          <h1 className="text-ink max-w-2xl text-4xl font-semibold leading-tight md:text-5xl">
            Кардиографы и оборудование для регистрации ЭКГ
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="bg-pine rounded-full px-6 py-3 font-medium text-white"
            >
              Перейти к приборам
            </Link>
            <Link
              href="/contact"
              className="border-pine/20 text-pine rounded-full border px-6 py-3 font-medium"
            >
              Заказать консультацию
            </Link>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="rounded-[28px] bg-[rgb(var(--color-bg-header))] p-6">
            <div className="text-pine text-sm font-medium">На связи</div>
            <div className="mt-2 text-3xl font-semibold">
              +7 (499) 346-77-22
            </div>
            <p className="text-ink/70 mt-3 text-sm leading-6">
              Рабочие дни с 10:00 до 18:00. Подскажем по выбору прибора,
              доставке и условиям оплаты.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="border-border-subtle mb-6 flex items-end justify-between gap-4 border-b pb-4">
          <div>
            <div className="text-pine text-sm uppercase tracking-[0.24em]">
              Приборы
            </div>
            <h2 className="mt-2 text-3xl font-semibold">
              Выберите свой прибор КардиРу
            </h2>
          </div>
          <Link href="/catalog" className="text-pine text-sm font-medium">
            Смотреть все
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-6 md:grid-cols-[1fr_1fr]">
        <div className="bg-surface-strong rounded-[30px] p-8 text-white">
          <div className="text-sm uppercase tracking-[0.24em] text-white/70">
            Почему мы
          </div>
          <h2 className="mt-3 text-3xl font-semibold">
            Преимущества приборов КардиРу
          </h2>
          <ul className="text-white/82 mt-6 grid gap-3 text-sm leading-6">
            {reasons.map((reason) => (
              <li
                key={reason}
                className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3"
              >
                {reason}
              </li>
            ))}
          </ul>
        </div>
        <div className="border-border-subtle bg-surface rounded-[30px] border p-8">
          <div className="text-pine text-sm uppercase tracking-[0.24em]">
            Выберите свой прибор КардиРу
          </div>
          <h2 className="mt-3 text-3xl font-semibold">
            Ключевые возможности линейки
          </h2>
          <ul className="text-ink/72 mt-6 grid gap-3 text-sm leading-6">
            {deviceHighlights.map((item) => (
              <li
                key={item}
                className="bg-surface-accent rounded-2xl px-4 py-3"
              >
                {item}
              </li>
            ))}
          </ul>
          <div className="bg-surface-soft mt-6 rounded-[24px] p-5">
            <div className="text-base font-semibold">Купить в 1 клик</div>
            <p className="text-ink/68 mt-2 text-sm leading-6">
              Оставьте номер телефона, и менеджер свяжется с вами в рабочее
              время для уточнения заказа.
            </p>
            <LeadForm source="home-quick" compact />
          </div>
        </div>
      </section>

      <section className="mt-14 grid gap-6 md:grid-cols-2">
        <article className="border-border-subtle bg-surface rounded-[30px] border p-8">
          <div className="text-pine text-sm uppercase tracking-[0.24em]">
            Способ доставки
          </div>
          <h3 className="mt-2 text-2xl font-semibold">
            Доставка по Москве и России
          </h3>
          <div className="text-ink/72 mt-4 space-y-3 text-sm leading-7">
            <p>
              По Москве курьером: 350 руб. Обычно доставка на следующий день
              после оформления заказа.
            </p>
            <p>
              По России: 500 руб (Почта России), срок от 3 до 7 дней. Возможна
              ускоренная отправка другой службой по согласованию.
            </p>
            <p>Самовывоз в Москве доступен после подтверждения менеджером.</p>
          </div>
        </article>
        <article className="border-border-subtle bg-surface rounded-[30px] border p-8">
          <div className="text-pine text-sm uppercase tracking-[0.24em]">
            Способ оплаты
          </div>
          <h3 className="mt-2 text-2xl font-semibold">
            Банковская карта или счет
          </h3>
          <div className="text-ink/72 mt-4 space-y-3 text-sm leading-7">
            <p>Оплата банковской картой при оформлении заказа на сайте.</p>
            <p>Оплата по счету банковским переводом для юрлиц и клиник.</p>
            <p>
              Для региональных заказов оборудование отправляется после
              подтверждения оплаты.
            </p>
          </div>
        </article>
      </section>

      <section className="border-border-subtle bg-surface mt-14 rounded-[30px] border p-8">
        <div className="text-pine text-sm uppercase tracking-[0.24em]">
          Разделы сайта
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link
            href="/catalog?section=pribory"
            className="bg-pill-bg text-pine rounded-full px-4 py-2"
          >
            Приборы
          </Link>
          <Link
            href="/catalog?section=accessories"
            className="bg-pill-bg text-pine rounded-full px-4 py-2"
          >
            Аксессуары
          </Link>
          <Link
            href="/catalog?section=arenda"
            className="bg-pill-bg text-pine rounded-full px-4 py-2"
          >
            Аренда
          </Link>
          <Link
            href="/faq"
            className="bg-pill-bg text-pine rounded-full px-4 py-2"
          >
            Вопрос-ответ
          </Link>
        </div>
      </section>
    </div>
  );
}
