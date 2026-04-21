import { FadeInSection } from "@/components/motion/fade-in-section";
import { cn } from "@/lib/utils";

function Column({
  titleId,
  title,
  children,
  titleRight = false,
  xOffset = 0,
}: {
  titleId: string;
  title: string;
  children: React.ReactNode;
  titleRight?: boolean;
  xOffset?: number;
}) {
  return (
    <FadeInSection
      className="flex min-w-0 flex-col gap-3 sm:gap-4"
      x={xOffset}
      y={0}
      amount={0.25}
    >
      <h2
        id={titleId}
        className={cn(
          "font-display text-3xl tracking-tight text-balance uppercase sm:text-4xl lg:text-5xl",
          titleRight && "text-right"
        )}
      >
        {title}
      </h2>
      <div
        className={cn(
          "border-b border-black/50",
          !titleRight && "lg:-mr-6 xl:-mr-10"
        )}
        aria-hidden
      />
      {children}
    </FadeInSection>
  );
}

export function DeliveryPaymentSection() {
  return (
    <section id="delivery" className="scroll-mt-32 py-12 md:py-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-6 xl:gap-10">
        <Column titleId="delivery-heading" title="Доставка" xOffset={-12}>
          <div className="font-display flex w-full flex-1 flex-col gap-3 rounded-xl border border-black px-4 py-5 text-sm leading-relaxed">
            <h3 className="text-lg font-bold">Доставка по Москве и России</h3>
            <p>
              <span className="font-bold">Курьером по Москве: 350 руб</span>.
              Обычно доставка на следующий день после оформления заказа.
            </p>
            <p>
              <span className="font-bold">
                По России: 500 руб (Почта России)
              </span>
              , срок от 3 до 7 дней. Возможна ускоренная отправка другой службой
              по согласованию.
            </p>
            <p>Самовывоз в Москве доступен после подтверждения менеджером.</p>
          </div>
        </Column>
        <Column
          titleId="payment-heading"
          title="Оплата"
          titleRight
          xOffset={12}
        >
          <div className="font-display flex w-full flex-1 flex-col gap-3 rounded-xl border border-black px-4 py-5 text-sm leading-relaxed">
            <h3 className="text-lg font-bold">Банковская карта или счет</h3>
            <p>Оплата банковской картой при оформлении заказа на сайте.</p>
            <p>Оплата по счету банковским переводом для юрлиц и клиник.</p>
            <p>
              Для региональных заказов оборудование отправляется после
              подтверждения оплаты.
            </p>
          </div>
        </Column>
      </div>
    </section>
  );
}
