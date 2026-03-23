import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { categories } from "@/lib/site-data";
import { getProducts } from "@/lib/strapi";

export default async function HomePage() {
  const products = await getProducts();
  const reasons = [
    "Высокое качество регистрации ЭКГ",
    "Автоматическая оценка исследования",
    "Автоматическое описание ЭКГ после записи",
    "Дистанционная консультация врача",
    "Техническая поддержка и сопровождение",
    "Более 15 лет проекту КардиРу"
  ];
  const deviceHighlights = [
    "Регистрация 6 или 12 стандартных отведений ЭКГ",
    "Подключение к мобильному телефону по Bluetooth",
    "Работа без ограничений по числу пациентов и исследований",
    "Простое управление прибором и данными через приложение"
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 md:py-10">
      <section className="grid gap-8 rounded-[34px] border border-[#dceae5] bg-white px-8 py-10 shadow-[0_22px_60px_rgba(16,33,43,0.06)] md:grid-cols-[1.1fr_0.9fr] md:px-10">
        <div className="flex flex-col justify-center">
          <div className="mb-3 inline-flex w-fit rounded-full bg-[#eef7f4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-pine">
            shop.kardi.ru
          </div>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-ink md:text-5xl">
            Кардиографы и оборудование для регистрации ЭКГ с понятной витриной и быстрой заявкой.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-ink/68">
            Сохраняем узнаваемую структуру действующего магазина: приборы, аксессуары, быстрый заказ, преимущества
            продукции и понятные карточки товаров.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/catalog" className="rounded-full bg-pine px-6 py-3 font-medium text-white">
              Перейти к приборам
            </Link>
            <Link href="/contact" className="rounded-full border border-pine/20 px-6 py-3 font-medium text-pine">
              Заказать консультацию
            </Link>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="rounded-[28px] bg-[#e6f4f1] p-6">
            <div className="text-sm font-medium text-pine">На связи</div>
            <div className="mt-2 text-3xl font-semibold">+7 (499) 346-77-22</div>
            <p className="mt-3 text-sm leading-6 text-ink/70">
              Рабочие дни с 10:00 до 18:00. Подскажем по выбору прибора, доставке и условиям оплаты.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-[#dceae5] p-5">
              <div className="text-sm text-ink/55">Категорий</div>
              <div className="mt-2 text-4xl font-semibold text-pine">{categories.length}</div>
            </div>
            <div className="rounded-[24px] border border-[#dceae5] p-5">
              <div className="text-sm text-ink/55">Формат заказа</div>
              <div className="mt-2 text-lg font-semibold">Корзина и заявка в 1 клик</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-6 flex items-end justify-between gap-4 border-b border-[#dceae5] pb-4">
          <div>
            <div className="text-sm uppercase tracking-[0.24em] text-pine">Приборы</div>
            <h2 className="mt-2 text-3xl font-semibold">Выберите свой прибор КардиРу</h2>
          </div>
          <Link href="/catalog" className="text-sm font-medium text-pine">
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
        <div className="rounded-[30px] bg-[#0f5b50] p-8 text-white">
          <div className="text-sm uppercase tracking-[0.24em] text-white/70">Почему мы</div>
          <h2 className="mt-3 text-3xl font-semibold">Преимущества приборов КардиРу</h2>
          <ul className="mt-6 grid gap-3 text-sm leading-6 text-white/82">
            {reasons.map((reason) => (
              <li key={reason} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                {reason}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[30px] border border-[#dceae5] bg-white p-8">
          <div className="text-sm uppercase tracking-[0.24em] text-pine">Выберите свой прибор КардиРу</div>
          <h2 className="mt-3 text-3xl font-semibold">Ключевые возможности линейки</h2>
          <ul className="mt-6 grid gap-3 text-sm leading-6 text-ink/72">
            {deviceHighlights.map((item) => (
              <li key={item} className="rounded-2xl bg-[#f2f8f6] px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-[24px] bg-[#f8fcfb] p-5">
            <div className="text-base font-semibold">Купить в 1 клик</div>
            <p className="mt-2 text-sm leading-6 text-ink/68">
              Оставьте номер телефона, и менеджер свяжется с вами в рабочее время для уточнения заказа.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="+7 (___) ___-__-__"
                className="h-12 flex-1 rounded-full border border-[#d8e6e2] bg-white px-5 outline-none placeholder:text-ink/35"
              />
              <button className="h-12 rounded-full bg-pine px-6 font-medium text-white">Отправить</button>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14 grid gap-6 md:grid-cols-2">
        <article className="rounded-[30px] border border-[#dceae5] bg-white p-8">
          <div className="text-sm uppercase tracking-[0.24em] text-pine">Способ доставки</div>
          <h3 className="mt-2 text-2xl font-semibold">Доставка по Москве и России</h3>
          <div className="mt-4 space-y-3 text-sm leading-7 text-ink/72">
            <p>По Москве курьером: 350 руб. Обычно доставка на следующий день после оформления заказа.</p>
            <p>
              По России: 500 руб (Почта России), срок от 3 до 7 дней. Возможна ускоренная отправка другой службой по
              согласованию.
            </p>
            <p>Самовывоз в Москве доступен после подтверждения менеджером.</p>
          </div>
        </article>
        <article className="rounded-[30px] border border-[#dceae5] bg-white p-8">
          <div className="text-sm uppercase tracking-[0.24em] text-pine">Способ оплаты</div>
          <h3 className="mt-2 text-2xl font-semibold">Банковская карта или счет</h3>
          <div className="mt-4 space-y-3 text-sm leading-7 text-ink/72">
            <p>Оплата банковской картой при оформлении заказа на сайте.</p>
            <p>Оплата по счету банковским переводом для юрлиц и клиник.</p>
            <p>Для региональных заказов оборудование отправляется после подтверждения оплаты.</p>
          </div>
        </article>
      </section>

      <section className="mt-14 rounded-[30px] border border-[#dceae5] bg-white p-8">
        <div className="text-sm uppercase tracking-[0.24em] text-pine">Разделы сайта</div>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link href="/catalog?section=pribory" className="rounded-full bg-[#eef7f4] px-4 py-2 text-pine">
            Приборы
          </Link>
          <Link href="/catalog?section=accessories" className="rounded-full bg-[#eef7f4] px-4 py-2 text-pine">
            Аксессуары
          </Link>
          <Link href="/catalog?section=arenda" className="rounded-full bg-[#eef7f4] px-4 py-2 text-pine">
            Аренда
          </Link>
          <Link href="/faq" className="rounded-full bg-[#eef7f4] px-4 py-2 text-pine">
            Вопрос-ответ
          </Link>
        </div>
      </section>
    </div>
  );
}
