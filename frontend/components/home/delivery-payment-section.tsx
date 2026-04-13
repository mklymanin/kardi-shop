export function DeliveryPaymentSection() {
  return (
    <section id="delivery" className="scroll-mt-32 py-12 md:py-16">
      <div className="flex justify-between gap-6 pb-4">
        <h2 className="font-display text-5xl uppercase">ДОСТАВКА</h2>
        <h2 className="font-display text-5xl uppercase">ОПЛАТА</h2>
      </div>
      <div className="my-4 border-b border-black/50" />
      <div className="flex gap-4">
        <div className="font-display flex w-1/2 flex-col gap-3 rounded-xl border border-black px-4 py-5 text-sm">
          <h3 className="text-lg font-bold">Доставка по Москве и России</h3>
          <p>
            <span className="font-bold">Курьером по Москве: 350 руб</span>.
            Обычно доставка на следующий день после оформления заказа.
          </p>
          <p>
            <span className="font-bold">По России: 500 руб (Почта России)</span>
            , срок от 3 до 7 дней. Возможна ускоренная отправка другой службой
            по согласованию.
          </p>
          <p>Самовывоз в Москве доступен после подтверждения менеджером.</p>
        </div>
        <div className="font-display flex w-1/2 flex-col gap-3 rounded-xl border border-black px-4 py-5 text-sm">
          <h3 className="text-lg font-bold">Банковская карта или счет</h3>
          <p>Оплата банковской картой при оформлении заказа на сайте.</p>
          <p>Оплата по счету банковским переводом для юрлиц и клиник.</p>
          <p>
            Для региональных заказов оборудование отправляется после
            подтверждения оплаты.
          </p>
        </div>
      </div>
    </section>
  );
}
