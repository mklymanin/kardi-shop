# Запуск проекта

## 1. Установить зависимости

В корне монорепозитория:

```bash
npm install
```

## 2. Подготовить переменные окружения

```bash
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

## 3. База данных

Локальный запуск использует `PostgreSQL` (как в ТЗ).

Поднять БД через Docker:

```bash
npm run db:up
```

Это поднимет:

- `PostgreSQL` на `localhost:5433`
- `Adminer` на `http://localhost:8080`

Параметры базы уже совпадают с `backend/.env.example`:

- database: `shop_kardi`
- user: `shop_kardi`
- password: `shop_kardi`

## 4. Запустить приложения

Frontend:

```bash
npm run dev:frontend
```

Backend:

```bash
npm run dev:backend
```

## 5. Остановка базы

```bash
npm run db:down
```

## Что уже подготовлено

- монорепо с `frontend` и `backend`
- страницы сайта по ТЗ
- базовые content types для `Strapi`
- локальная dev-база через `PostgreSQL`
- env-шаблоны

## Что еще нужно сделать

- реальное подключение frontend к API Strapi
- корзина и checkout-логика
- формы заявок
- загрузка изображений
- SEO-генерация и редиректы
- миграция контента с текущего сайта
