export type Product = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  category: string;
  imageUrl?: string;
};

export const categories = [
  "Кардиология",
  "Реабилитация",
  "Расходные материалы",
  "Диагностика"
];

export const featuredProducts: Product[] = [
  {
    id: 1,
    slug: "ecg-monitor-pro",
    title: "КардиРу-BLE Портативный кардиограф",
    subtitle: "Портативный кардиограф для самостоятельной регистрации ЭКГ",
    price: "48 500 ₽",
    category: "Приборы",
    imageUrl: "https://shop.kardi.ru/upload/iblock/81b/81bbbb75065f3ef7765b0d04fbc4d4b5.jpg"
  },
  {
    id: 2,
    slug: "cardio-rehab-kit",
    title: "КардиРу-12-клиника",
    subtitle: "Прибор для дистанционного мониторинга ЭКГ пациентов",
    price: "120 000 ₽",
    category: "Приборы",
    imageUrl: "https://shop.kardi.ru/upload/iblock/a09/a098180029526207af1ea6395671de82.png"
  },
  {
    id: 3,
    slug: "smart-pressure-plus",
    title: "Электрокардиограф компьютерный КАРДи",
    subtitle: "Профессиональный электрокардиограф для клиник",
    price: "180 000 ₽",
    category: "Приборы",
    imageUrl: "https://shop.kardi.ru/upload/iblock/cbf/cbf617679bb03e6d81de68230510b3d9.png"
  }
];

export const articles = [
  {
    slug: "how-to-choose-monitor",
    title: "Как выбрать монитор пациента для частной клиники",
    excerpt: "Критерии подбора оборудования для амбулаторной и стационарной практики."
  },
  {
    slug: "rehab-routes",
    title: "Оснащение кардиореабилитации: базовый контур",
    excerpt: "Какие позиции действительно нужны на первом этапе запуска направления."
  }
];

export type ArticlePreview = {
  slug: string;
  title: string;
  excerpt: string;
};
