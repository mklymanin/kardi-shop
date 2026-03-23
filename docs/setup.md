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

По умолчанию локальный запуск использует `SQLite`, чтобы проект стартовал без Docker и отдельной настройки БД.

Для этого достаточно:

```bash
cp backend/.env.example backend/.env
```

и оставить:

```bash
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

Если нужен именно `PostgreSQL`, можно поднять его через Docker:

```bash
npm run db:up
```

Это поднимет:

- `PostgreSQL` на `localhost:5432`
- `Adminer` на `http://localhost:8080`

Тогда в `backend/.env` нужно переключить:

```bash
DATABASE_CLIENT=postgres
```

Параметры базы уже совпадают с шаблоном:

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
- локальная dev-база через `SQLite` по умолчанию
- env-шаблоны

## Что еще нужно сделать

- реальное подключение frontend к API Strapi
- корзина и checkout-логика
- формы заявок
- загрузка изображений
- SEO-генерация и редиректы
- миграция контента с текущего сайта
