# Прогресс разработки

## Легенда

- [x] выполнено
- [ ] не начато / в работе

## Этапы из ТЗ

### A. Окружение

- [x] Зафиксированы версии в репозитории (проверка: Node.js, Python; Git — уточнить установку на машине)
- [ ] Финальная проверка: `node -v`, `python -v`, `git --version` у разработчика

### B. Структура проекта

- [x] Монорепо: `web/` (Next.js 14), `bot/` (aiogram 3), `supabase/migrations/`, корневые `.gitignore`, `.env.example`
- [x] `git init` + первый коммит (у разработчика)

### C. Supabase

- [ ] Создать проект Supabase (вручную в dashboard)
- [x] SQL-миграция в репо: `supabase/migrations/001_initial_schema.sql` (таблицы + `app_settings` + `complaints` + `v_models_public` + RLS + бакет `uploads`)
- [ ] Выполнить SQL в Supabase (SQL Editor) и проверить таблицы
- [ ] Политики RLS для anon (после Telegram) — шаг F/G; при необходимости донастроить Storage policies
- [ ] Скопировать URL/anon/service role в `web/.env.local` и `bot/.env`; зафиксировать в Vercel/Render позже

### D. Next.js

- [x] `create-next-app@14`, App Router, TS, Tailwind, `src/`
- [x] Зависимости: `framer-motion`, `@supabase/supabase-js`, `@supabase/ssr`
- [x] Заглушки: `src/lib/supabase/client.ts`, `server.ts`; маршруты `/model/[id]`, `/register`, `/admin`
- [ ] Доработать layout/стили под финальный UI

### E. Компоненты WebApp

- [x] Главная (сетка карточек из `v_models_public`, Framer Motion)
- [x] `/model/[id]` (карусель, цены с табами, контакты public / залог deposit)
- [x] `/register` (инвайт, форма, заявка registration)
- [x] `/admin` (вход по паролю, создание инвайта, таблицы инвайтов и заявок; Telegram ID — позже)

### F. Интеграция

- [x] Telegram Login Widget (`/login`), API `/api/auth/telegram`, cookie-сессия, `/account`
- [ ] Подтверждение 18+ и выбор ника после первого входа
- [ ] Домен бота в BotFather для продакшена (localhost ограничен)

### G. Приватность и залоги

- [ ] Логика public vs deposit
- [ ] Формы, загрузка скриншотов, статусы, отображение контактов

### H. Бот

- [ ] aiogram 3, команды, кнопки, пересылка «Стать моделью»
- [ ] Polling или webhook
- [ ] Уведомления через Supabase + отправка в Telegram

### I. Деплой

- [ ] Vercel — frontend
- [ ] Render — bot

### J. Переменные окружения

- [x] Шаблон корневого `.env.example`
- [ ] Заполненные секреты локально и на хостингах (Supabase, бот, админ ID, URL WebApp, USDT)

### K. Тестирование

- [ ] Инструкция ручного теста (чек-лист)

## Текущий шаг

**Сделано:** `/register?code=` (инвайт, форма, `model_requests`), `/admin/login` + `/admin/dashboard` (инвайты, список заявок), сессия по cookie.

**Дальше:** Telegram Login (F), оплата/скриншоты регистрации, политики Storage, проверка `ADMIN_TELEGRAM_ID` в админке.

---

*Обновлять после каждого завершённого этапа.*
