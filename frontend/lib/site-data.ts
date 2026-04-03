export type Product = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  priceValue?: number;
  category: string;
  imageUrl?: string;
};

export const categories = [
  "Кардиология",
  "Реабилитация",
  "Расходные материалы",
  "Диагностика",
];

export const featuredProducts: Product[] = [
  {
    id: 1,
    slug: "ecg-monitor-pro",
    title: "КардиРу-BLE Портативный кардиограф",
    subtitle: "Портативный кардиограф для самостоятельной регистрации ЭКГ",
    price: "48 500 ₽",
    priceValue: 48500,
    category: "Приборы",
    imageUrl:
      "https://shop.kardi.ru/upload/iblock/db0/a7bge1maegd6f8ldzb0rttf9nnadw35y.jpg",
  },
  {
    id: 2,
    slug: "cardio-rehab-kit",
    title: "КардиРу-12-клиника",
    subtitle: "Прибор для дистанционного мониторинга ЭКГ пациентов",
    price: "120 000 ₽",
    priceValue: 120000,
    category: "Приборы",
    imageUrl:
      "https://shop.kardi.ru/upload/iblock/749/e318ljrepq8afvjov8e2riaaavzsu6hi.jpg",
  },
  {
    id: 3,
    slug: "smart-pressure-plus",
    title: "Электрокардиограф компьютерный КАРДи",
    subtitle: "Профессиональный электрокардиограф для клиник",
    price: "180 000 ₽",
    priceValue: 180000,
    category: "Приборы",
    imageUrl:
      "https://shop.kardi.ru/upload/iblock/4e1/p8am8nw6fqpxsjgt0jp4qxhn7g0ss0j8.jpg",
  },
];
