# Архитектура

## Приложения

### frontend

Публичный сайт магазина на Next.js:

- главная
- каталог
- карточка товара
- корзина
- оформление заказа
- форма заявки (лид) на главной и странице контактов
- статические страницы
- поиск

### backend

CMS и API на Strapi:

- товары
- категории
- страницы
- лиды
- заказы
- SEO-настройки
- общие настройки сайта

## Взаимодействие

- `frontend` получает данные из `Strapi` по REST API
- `backend` хранит данные в `PostgreSQL`
- загрузка изображений идет через Strapi Upload plugin
- формы и заказы сохраняются в Strapi

## Следующие этапы

1. Подключить CAPTCHA и rate limit для форм/лидов.
2. Добавить SEO-слой (meta, OG, sitemap, redirects).
3. Расширить карточку товара (характеристики, документы, связанные товары).
4. Подготовить сценарий миграции контента.

## Тема и дизайн‑токены (frontend)

Во frontend введён слой темы на базе CSS‑переменных и Tailwind:

- Файл `app/theme.css` содержит **дизайн‑токены**:
  - цвета: `--color-ink`, `--color-pine`, `--color-bg-page-top`, `--color-bg-page-bottom`, `--color-bg-header`,
    `--color-surface`, `--color-surface-soft`, `--color-surface-accent`, `--color-pill-bg`,
    `--color-border-subtle`, `--color-border-strong`, `--color-border-soft`, `--color-surface-strong`;
  - радиусы: `--radius-card-lg`, `--radius-card-xl`, `--radius-pill`;
  - тени: `--shadow-card-elevated`.
- Файл `tailwind.config.ts` привязывает часть токенов к цветам Tailwind:
  - `ink`, `pine`, `surface`, `surface-soft`, `surface-accent`, `surface-strong`,
    `border-subtle`, `border-strong`, `pill-bg`.
- Базовый фон и цвет текста для всего сайта задаются в `app/globals.css` через `body` и тему.

**Правила использования:**

- В компонентном коде не использовать raw hex‑цвета — только именованные utility‑классы Tailwind
  (`bg-surface`, `bg-surface-soft`, `bg-surface-accent`, `border-border-subtle`, `border-border-strong`, `bg-pill-bg`, `text-ink`, `text-pine` и т.п.).
- Для фонового градиента страницы, header и сложных случаев — использовать CSS‑переменные из `theme.css`.
- Новые UI‑компоненты должны опираться на общие абстракции (`Card`, `Button`, `PageContainer`, `SectionEyebrow`)
  вместо локальных сочетаний `border/bg/rounded` с hex‑значениями.
