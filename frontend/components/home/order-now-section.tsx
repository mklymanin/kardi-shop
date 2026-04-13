import { OrderNowForm } from "@/components/home/order-now-form";

export function OrderNowSection() {
  return (
    <section
      id="order"
      className="flex scroll-mt-32 flex-col gap-4 py-12 md:flex-row md:items-stretch"
    >
      <div className="md:max-w-sm">
        <h2 className="font-display text-5xl uppercase">ЗАКАЖИТЕ СЕЙЧАС</h2>
        <div className="my-4 border-b border-black/50" />
        <div className="font-display flex flex-col gap-3 text-sm">
          <p>Проведём бесплатную консультацию</p>
          <p>Ответим на любые вопросы</p>
          <p>Поможем с подбором прибора</p>
        </div>
      </div>
      <div className="border-muted-foreground flex min-h-0 min-w-0 flex-1 flex-col rounded-3xl border p-7">
        <OrderNowForm />
      </div>
    </section>
  );
}
