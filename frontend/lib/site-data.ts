export type Product = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  category: string;
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
    title: "ECG Monitor Pro",
    subtitle: "Компактный монитор для экспресс-диагностики",
    price: "89 000 ₽",
    category: "Диагностика"
  },
  {
    id: 2,
    slug: "cardio-rehab-kit",
    title: "Cardio Rehab Kit",
    subtitle: "Набор для восстановительных программ",
    price: "46 500 ₽",
    category: "Реабилитация"
  },
  {
    id: 3,
    slug: "smart-pressure-plus",
    title: "Smart Pressure Plus",
    subtitle: "Точный тонометр для кабинета и дома",
    price: "14 900 ₽",
    category: "Кардиология"
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
