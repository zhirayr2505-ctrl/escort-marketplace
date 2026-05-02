# Структура проекта

Актуальное состояние репозитория `escort_markeplace`.

## Корень

| Путь | Назначение |
|------|------------|
| `MEMORY.md` | ТЗ, решения, бизнес-логика |
| `PROGRESS.md` | Чеклист этапов |
| `STRUCTURE.md` | Этот файл — карта каталогов |
| `.env.example` | Шаблон переменных (скопировать в `web/.env.local` и `bot/.env`) |
| `.gitignore` | Игнор для всего монорепо: `.env`, `node_modules`, `.next`, venv, кэши |

## `web/` — Next.js 14 (App Router)

| Путь | Назначение |
|------|------------|
| `package.json` | Скрипты `dev` / `build` / `start` / `lint`; зависимости включая `framer-motion`, `@supabase/supabase-js`, `@supabase/ssr` |
| `next.config.mjs` | Конфиг Next (имя файла может быть `.mjs` после create-next-app) |
| `tsconfig.json` | TypeScript, alias `@/*` → `src/*` |
| `tailwind.config.ts` | Tailwind |
| `postcss.config.mjs` | PostCSS |
| `src/app/layout.tsx` | Корневой layout |
| `src/app/page.tsx` | Главная (шаблон create-next-app) |
| `src/app/globals.css` | Глобальные стили |
| `src/app/model/[id]/page.tsx` | Страница модели (заглушка) |
| `src/app/register/page.tsx` | Регистрация по `?code=` (заглушка) |
| `src/app/admin/page.tsx` | Админка (заглушка) |
| `src/lib/supabase/client.ts` | Браузерный Supabase через `createBrowserClient` (`@supabase/ssr`) |
| `src/lib/supabase/server.ts` | Серверный клиент с cookie (RSC / route handlers) |
| `src/components/` | Общие UI-компоненты (пока пусто, `.gitkeep`) |

Локально: из папки `web` скопировать `.env.example` из **корня** в `web/.env.local` и заполнить `NEXT_PUBLIC_*` (или symlink — на усмотрение).

## `bot/` — Telegram (aiogram 3)

| Путь | Назначение |
|------|------------|
| `requirements.txt` | `aiogram`, `python-dotenv`, `supabase` |
| `main.py` | Точка входа, `polling`, подключение роутеров |
| `handlers/__init__.py` | `setup_routers` |
| `handlers/start.py` | `/start` (заглушка) |
| `services/__init__.py` | Заготовка под Supabase и уведомления |

Запуск (после `python -m venv venv` и `pip install -r requirements.txt`): из `bot/` с файлом `.env` с `TELEGRAM_BOT_TOKEN`.

## `supabase/`

| Путь | Назначение |
|------|------------|
| `migrations/.gitkeep` | Сюда класть SQL миграции после создания таблиц в Supabase |

## Поток данных

- **WebApp:** Supabase anon key только в клиенте; бизнес-правки и админ-операции — через RLS и/или server actions / route handlers (уточняется на этапе C–G).
- **Бот:** `SUPABASE_SERVICE_ROLE_KEY` только на Render, не в репозитории.

---

*Обновлять при добавлении файлов.*
