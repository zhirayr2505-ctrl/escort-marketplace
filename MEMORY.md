# Память проекта (единый контекст)

> Источник истины для ТЗ, решений и логики. Обновляется по запросу при изменениях.

## Мета

| Поле | Значение |
|------|----------|
| Продукт | Telegram-бот + WebApp (маркетплейс объявлений в Армении) |
| Срок | 10 дней с нуля |
| Бюджет | ~$50 |
| Разработчик | один, VS Code + PowerShell |
| Frontend хостинг | Vercel |
| Бот хостинг | Render |
| БД | Supabase (free tier) |
| Платежи | Ручное подтверждение по скриншотам USDT; адрес регистрации/подписки — личный кошелёк автора; залог — отдельный кошелёк с пометкой «залог» |

## Стек

- **WebApp:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, `@supabase/supabase-js`
- **Бот:** Python 3.10+, aiogram 3.x, python-dotenv, supabase-py
- **БД:** Supabase (Postgres + Storage при необходимости для файлов)

## Регистрация модели (инвайт + оплата)

1. Админ в `/admin` создаёт одноразовую инвайт-ссылку, срок жизни **12 часов**.
2. Ссылка вида `/register?code=...`, код хранится в `invite_links`.
3. Форма: имя, возраст, до 12 фото, до 3 видео, национальность, город, контакты (тел, WhatsApp, Telegram), цены (час, 2ч, день, ночь, у себя, у клиента), паспорт + селфи с паспортом.
4. Кнопка «Оплатить $50» → инструкция: USDT на адрес из настроек → загрузка скриншота.
5. Заявка в админке: статус «ожидает проверки оплаты» (`model_requests`, тип `registration`).
6. Админ подтверждает оплату, проверяет документы, активирует модель на **1 месяц** (`monthly_paid_until`).
7. Ежемесячно: уведомление (бот + WebApp) об оплате **$50**. Если не оплачено **3 дня** — анкета скрывается (`active` / логика скрытия).

## Пользователи (клиенты)

- Вход: **Telegram Login Widget** (автоматически после виджета).
- Первый вход: подтверждение **18+**, выбор ника или оставить Telegram username.

### Приватность контактов (настраивает модель)

- **Вариант A:** контакты видны сразу бесплатно.
- **Вариант B:** контакты после залога **50%** от выбранной пользователем цены (период выбирается на странице модели: час / 2ч / день / ночь / у себя / у тебя → сумма = 50% от этой цены).
- При B: кнопка «Связаться» / «Получить контакты» → форма оплаты залога → скриншот → админ подтверждает → контакты открываются на той же странице.
- Залог: отдельный USDT-кошелёк (пометка «залог»).
- Споры: не состоялась встреча по вине клиента — без возврата; иначе / отмена модели — решение админа, ручной перевод; пользователь может отправить **жалобу**.

## WebApp — страницы

- **Главная:** сетка карточек (фото, имя, возраст, город, цена за час, рейтинг — пока fake), «Подробнее».
- **`/model/[id]`:** карусель медиа; инфо; цены с табами; контакты или CTA залога по правилам приватности.
- **`/register`:** только с валидным `code` из инвайта.
- **`/admin`:** пароль + совпадение **Telegram ID** с `ADMIN_TELEGRAM_ID` в `.env`.
  - Инвайты (12ч, одноразовые).
  - Заявки моделей (оплата, верификация).
  - Подтверждение оплаты регистрации и залогов.
  - Модели: редактирование / блок / удаление.
  - Пользователи.
  - Настройки: цена регистрации, ежемесячная плата, % комиссии залога (и связанные параметры).
  - Уведомления: одна модель / все.

## Telegram-бот

- `/start`: приветствие, кнопка «Открыть WebApp» (URL деплоя), «Стать моделью».
- «Стать моделью»: текст про оператора, запрос username; пересылка админу (личный чат или группа из env).
- Уведомления модели: активация, скрытие анкеты, новый залог по её анкете, за 3 дня до ежемесячного платежа.
- Уведомления админу: новая заявка модели, новый залог, жалоба.
- `/help`: кратко + WebApp + правила.

## База данных (черновик схемы)

Таблицы (уточнять при миграциях):

- `users` — id, telegram_id, username, display_name, role (`user`|`model`|`admin`), age_verified, is_blocked, blocked_until, created_at
- `models` — id, user_id, name, age, nationality, description, preferences, city, price_hour, price_2hours, price_day, price_night, price_self, price_client, photos[], videos[], passport_photo, selfie_photo, verified, active, monthly_paid_until, privacy_contacts (`public`|`deposit`), deposit_percent (дефолт 50), contacts_*, created_at
- `invite_links` — id, code, created_by, expires_at, used_by, used_at
- `model_requests` — id, model_id, type (`registration`|`monthly`), amount_usdt, screenshot_url, status, admin_notes
- `deposits` — id, user_id, model_id, amount_usdt, selected_price_type, selected_price_value, screenshot_url, status (`pending`|`confirmed`|`rejected`|`refunded`), confirmed_by_admin, created_at
- `notifications` — id, user_id, message, read, created_at
- `app_settings` — key, value (jsonb): суммы, кошельки (дублируют админку / .env)
- `complaints` — жалобы пользователей (связь с model/deposit опционально)

Представление `v_models_public` — поля карточки **без** контактов и паспорта (для безопасного листинга).

Клиенты: Supabase JS (frontend), supabase-py (бот). RLS включён; политики для `anon` — после Telegram Login (шаг F). До этого чтение/запись чувствительных данных — с сервера через **service_role** или Dashboard.

### Supabase: что сделать руками

1. Зайти на [supabase.com](https://supabase.com) → New project (регион ближе к пользователям; пароль БД сохранить в менеджере паролей).
2. **Settings → API:** скопировать `Project URL`, `anon` **public** key, `service_role` **secret** (не в клиент, не в Git).
3. **SQL → New query:** открыть файл репозитория `supabase/migrations/001_initial_schema.sql`, вставить целиком → **Run**. Ошибок быть не должно; при повторном запуске возможны конфликты «already exists» — тогда только на чистой БД или править вручную.
4. **Storage:** бакет `uploads` создаётся скриптом; позже настроить политики загрузки (после auth).
5. Секреты **не** хранить в `.env.example` (он в Git). Скопировать шаблон в `web/.env.local` и при необходимости в `bot/.env`, подставить ключи. Минимум для фронта: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Где взять: **Project Settings → Data API / API Keys**.
6. Первого админ-пользователя в `users` с `role = 'admin'` и твоим `telegram_id` добавим после интеграции бота/виджета или вручную через SQL **Table Editor**.

## Принятые решения (журнал)

| Дата | Решение |
|------|---------|
| (старт) | Документация MEMORY / PROGRESS / STRUCTURE созданы; реализация по шагам A→K из PROGRESS |
| 2026-05-02 | Монорепо: `web/` (Next 14), `bot/`, `supabase/migrations/`. Для Supabase в Next используется `@supabase/ssr` (cookie-сессии) + `@supabase/supabase-js`. Корневой `.gitignore` дополняет `web/.gitignore`. |
| 2026-05-02 | Схема БД в `001_initial_schema.sql`: таблицы из ТЗ + `app_settings`, `complaints`, view `v_models_public`, RLS без политик для anon, бакет `uploads`. |
| 2026-05-02 | Демо-данные: `002_seed_demo_models.sql` (telegram_id 900000001–900000004, фото с picsum.photos). Страница модели: `/model/[id]`, залог пересчитывается от выбранного таба цены. |
| 2026-05-02 | Регистрация: временный `telegram_id` отрицательный bigint до Telegram Login. Админ: cookie `admin-session` = sha256(PASSWORD:SECRET); позже добавить сверку `ADMIN_TELEGRAM_ID`. |
| 2026-05-02 | Клиенты: Telegram Login Widget → POST `/api/auth/telegram`, проверка HMAC по `TELEGRAM_BOT_TOKEN`, cookie `mk_user` (подпись USER_SESSION_SECRET). |
| 2026-05-03 | После входа: страница `/onboarding` (18+ чекбокс + ник 2–40 символов), middleware редирект с любых страниц кроме `/login`, `/register`, `/admin`, `/api`, пока `users.age_verified = false`. После онбординга виджет Telegram не перезаписывает `display_name`. |
| 2026-05-03 | Web: Telegram Mini App — скрипт `telegram-web-app.js`, `expand()` + `disableVerticalSwipes`, синхронизация CSS-переменных с `themeParams`; тёмная премиальная тема (золотой акцент), safe-area. Референсного клонирования сторонних сервисов нет — собственный UI. |

## Открытые вопросы

- ~~Жалобы~~: таблица `complaints` добавлена в миграции.
- Fake-рейтинг: поле `models.rating_public` (по умолчанию 5.0), до реальных отзывов правится в админке или SQL.

---

*При изменении функций — обновить этот файл и PROGRESS.md.*
