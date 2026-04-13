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

export function AdvantagesCapabilitiesSection() {
  return (
    <section id="advantages" className="scroll-mt-32 py-12 md:py-16">
      <div className="flex justify-between gap-6 pb-4">
        <h2 className="font-display text-5xl uppercase">ПРЕИМУЩЕСТВА</h2>
        <h2 className="font-display text-5xl uppercase">ВОЗМОЖНОСТИ</h2>
      </div>
      <div className="my-4 border-b border-black/50" />
      <div className="flex gap-4">
        <ul className="font-display flex w-1/2 flex-col gap-3 rounded-xl border border-black px-4 py-5 text-sm">
          {mockAdvantages.map((advantage) => (
            <li key={advantage}>
              <span>•</span> {advantage}
            </li>
          ))}
        </ul>
        <ul className="font-display flex w-1/2 flex-col gap-3 rounded-xl border border-black px-4 py-5 text-sm">
          {mockCapabilities.map((capability) => (
            <li key={capability}>
              <span>•</span> {capability}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
