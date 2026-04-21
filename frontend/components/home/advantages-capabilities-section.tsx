import { FadeInSection } from "@/components/motion/fade-in-section";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { cn } from "@/lib/utils";

const mockAdvantages = [
  "Высокое качество регистрации ЭКГ",
  "Автоматическая оценка исследования",
  "Автоматическое описание ЭКГ после записи",
  "Дистанционная консультация врача",
  "Техническая поддержка и сопровождение",
  "Более 15 лет проекту КардиРу",
];
const mockCapabilities = [
  "Регистрация 6 или 12 стандартных отведений ЭКГ",
  "Подключение к мобильному телефону по Bluetooth",
  "Работа без ограничений по числу пациентов и исследований",
  "Простое управление прибором и данными через приложение",
  "Автоматический анализ ЭКГ с выявлением основных патологий",
  "Экспорт и передача данных в формате PDF и через облачные сервисы",
];

function Panel({
  titleId,
  title,
  items,
  titleRight = false,
  xOffset = 0,
}: {
  titleId: string;
  title: string;
  items: string[];
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
      <StaggerList
        as="ul"
        className="font-display flex w-full flex-1 flex-col gap-3 rounded-xl border border-black px-4 py-5 text-sm leading-relaxed"
      >
        {items.map((item) => (
          <StaggerItem as="li" key={item}>
            <span>•</span> {item}
          </StaggerItem>
        ))}
      </StaggerList>
    </FadeInSection>
  );
}

export function AdvantagesCapabilitiesSection() {
  return (
    <section id="advantages" className="scroll-mt-32 py-12 md:py-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-6 xl:gap-10">
        <Panel
          titleId="advantages-heading"
          title="Преимущества"
          items={mockAdvantages}
          xOffset={-12}
        />
        <Panel
          titleId="capabilities-heading"
          title="Возможности"
          titleRight
          items={mockCapabilities}
          xOffset={12}
        />
      </div>
    </section>
  );
}
