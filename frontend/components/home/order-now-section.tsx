import { OrderNowForm } from "@/components/home/order-now-form";

export function OrderNowSection() {
  return (
    <section
      id="order"
      className="grid grid-cols-1 gap-6 py-8 sm:gap-6 sm:py-10 md:grid-cols-2 md:items-stretch lg:gap-8 lg:py-12"
    >
      <div className="w-full min-w-0">
        <h2 className="font-display text-3xl wrap-break-word uppercase sm:text-4xl lg:text-5xl">
          ЗАКАЖИТЕ СЕЙЧАС
        </h2>
        <div className="my-4 border-b border-black/50" />
        <div className="font-display flex flex-col gap-3 text-sm">
          <p>Проведём бесплатную консультацию</p>
          <p>Ответим на любые вопросы</p>
          <p>Поможем с подбором прибора</p>
        </div>
      </div>
      <div className="border-muted-foreground flex min-h-0 min-w-0 flex-col rounded-3xl border p-4 sm:p-6 lg:p-7">
        <OrderNowForm />
      </div>
    </section>
  );
}
