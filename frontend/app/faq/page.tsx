import { getFaqItems } from "@/lib/api/faq";
import { FaqAccordion } from "@/components/faq/faq-accordion";

export default async function FaqPage() {
  const faqItems = await getFaqItems();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8">
        <div className="text-pine text-sm uppercase tracking-[0.24em]">
          Вопрос-ответ
        </div>
        <h1 className="mt-2 text-4xl font-semibold">
          Частые вопросы по приборам КардиРу
        </h1>
        <p className="text-ink/65 mt-3 text-sm leading-7">
          Основные вопросы по моделям, подключению, отчетам, оплате и поддержке.
        </p>
      </div>

      {faqItems.length === 0 ? (
        <p className="text-ink/50 text-center text-sm">
          Вопросы пока не добавлены.
        </p>
      ) : (
        <FaqAccordion items={faqItems} />
      )}
    </div>
  );
}
