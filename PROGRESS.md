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
- [ ] `git init` (на машине нет Git в PATH — установить и выполнить вручную)

### C. Supabase

- [ ] Создать проект Supabase
- [ ] SQL: таблицы users, models, invite_links, model_requests, deposits, notifications
- [ ] RLS, Storage (если файлы через Supabase Storage)
- [ ] Ключи в `.env` / Vercel / Render

### D. Next.js

- [x] `create-next-app@14`, App Router, TS, Tailwind, `src/`
- [x] Зависимости: `framer-motion`, `@supabase/supabase-js`, `@supabase/ssr`
- [x] Заглушки: `src/lib/supabase/client.ts`, `server.ts`; маршруты `/model/[id]`, `/register`, `/admin`
- [ ] Доработать layout/стили под финальный UI

### E. Компоненты WebApp

- [ ] Главная (сетка карточек)
- [ ] `/model/[id]`
- [ ] `/register` (инвайт)
- [ ] `/admin` (разделы по ТЗ)

### F. Интеграция

- [ ] Telegram Login Widget + связка с `users`

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

- [ ] Документировать все ключи (Supabase, бот, админ ID, URL WebApp, кошельки USDT)

### K. Тестирование

- [ ] Инструкция ручного теста (чек-лист)

## Текущий шаг

**Сделано:** структура репозитория, Next.js + зависимости, каркас бота, `npm run build` проходит.

**Следующий шаг:** **C** — проект в Supabase, SQL таблиц, ключи в `.env` / шаблоне.

---

*Обновлять после каждого завершённого этапа.*
