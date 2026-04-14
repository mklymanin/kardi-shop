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
  children,
}: {
  titleId: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
      <h2
        id={titleId}
        className="font-display text-3xl tracking-tight text-balance uppercase sm:text-4xl lg:text-5xl"
      >
        {title}
      </h2>
      <div className="border-b border-black/50" aria-hidden />
      {children}
    </div>
  );
}

export function AdvantagesCapabilitiesSection() {
  return (
    <section id="advantages" className="scroll-mt-32 py-12 md:py-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-6 xl:gap-10">
        <Panel titleId="advantages-heading" title="Преимущества">
          <ul className="font-display flex w-full flex-col gap-3 rounded-xl border border-black px-4 py-5 text-sm leading-relaxed">
            {mockAdvantages.map((advantage) => (
              <li key={advantage}>
                <span>•</span> {advantage}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel titleId="capabilities-heading" title="Возможности">
          <ul className="font-display flex w-full flex-col gap-3 rounded-xl border border-black px-4 py-5 text-sm leading-relaxed">
            {mockCapabilities.map((capability) => (
              <li key={capability}>
                <span>•</span> {capability}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </section>
  );
}
