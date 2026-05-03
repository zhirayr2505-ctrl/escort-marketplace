-- Маркетплейс: начальная схема (Postgres / Supabase)
-- Выполнить в Supabase → SQL Editor → New query → Run (или supabase db push при CLI)

-- Расширения (в Supabase обычно уже включены)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  telegram_id bigint NOT NULL UNIQUE,
  username text,
  display_name text,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'model', 'admin')),
  age_verified boolean NOT NULL DEFAULT false,
  is_blocked boolean NOT NULL DEFAULT false,
  blocked_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_role ON public.users (role);

-- ---------------------------------------------------------------------------
-- models (полная строка; контакты не отдаём в публичный API без проверки)
-- ---------------------------------------------------------------------------
CREATE TABLE public.models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  user_id uuid NOT NULL UNIQUE REFERENCES public.users (id) ON DELETE CASCADE,
  name text NOT NULL,
  age int NOT NULL CHECK (age >= 18),
  nationality text,
  description text,
  preferences text,
  city text,
  price_hour numeric(12, 2),
  price_2hours numeric(12, 2),
  price_day numeric(12, 2),
  price_night numeric(12, 2),
  price_self numeric(12, 2),
  price_client numeric(12, 2),
  photos text[] NOT NULL DEFAULT '{}',
  videos text[] NOT NULL DEFAULT '{}',
  passport_photo text,
  selfie_photo text,
  verified boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT false,
  monthly_paid_until timestamptz,
  privacy_contacts text NOT NULL DEFAULT 'deposit' CHECK (privacy_contacts IN ('public', 'deposit')),
  deposit_percent int NOT NULL DEFAULT 50 CHECK (
    deposit_percent >= 0
    AND deposit_percent <= 100
  ),
  contacts_telegram text,
  contacts_whatsapp text,
  contacts_phone text,
  rating_public numeric(3, 2) NOT NULL DEFAULT 5.0,
  created_at timestamptz NOT NULL DEFAULT now (),
  updated_at timestamptz NOT NULL DEFAULT now ()
);

CREATE INDEX idx_models_active_city ON public.models (active, city);

-- ---------------------------------------------------------------------------
-- invite_links (одноразовые, 12 ч — проверка в приложении)
-- ---------------------------------------------------------------------------
CREATE TABLE public.invite_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  code text NOT NULL UNIQUE,
  created_by uuid REFERENCES public.users (id) ON DELETE SET NULL,
  expires_at timestamptz NOT NULL,
  used_by uuid REFERENCES public.users (id) ON DELETE SET NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now ()
);

CREATE INDEX idx_invite_links_code ON public.invite_links (code);

-- ---------------------------------------------------------------------------
-- model_requests (регистрация / ежемесячный платёж)
-- ---------------------------------------------------------------------------
CREATE TABLE public.model_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  model_id uuid NOT NULL REFERENCES public.models (id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('registration', 'monthly')),
  amount_usdt numeric(12, 2) NOT NULL,
  screenshot_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now ()
);

CREATE INDEX idx_model_requests_model ON public.model_requests (model_id);
CREATE INDEX idx_model_requests_status ON public.model_requests (status);

-- ---------------------------------------------------------------------------
-- deposits (залог за контакты)
-- ---------------------------------------------------------------------------
CREATE TABLE public.deposits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  user_id uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  model_id uuid NOT NULL REFERENCES public.models (id) ON DELETE CASCADE,
  amount_usdt numeric(12, 2) NOT NULL,
  selected_price_type text NOT NULL CHECK (
    selected_price_type IN ('hour', '2hours', 'day', 'night', 'self', 'client')
  ),
  selected_price_value numeric(12, 2) NOT NULL,
  screenshot_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'rejected', 'refunded')
  ),
  confirmed_by_admin uuid REFERENCES public.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now ()
);

CREATE INDEX idx_deposits_user ON public.deposits (user_id);
CREATE INDEX idx_deposits_model ON public.deposits (model_id);
CREATE INDEX idx_deposits_status ON public.deposits (status);

-- ---------------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------------
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  user_id uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now ()
);

CREATE INDEX idx_notifications_user_unread ON public.notifications (user_id, read);

-- ---------------------------------------------------------------------------
-- app_settings (платёжные суммы и кошельки; дубли .env при необходимости)
-- ---------------------------------------------------------------------------
CREATE TABLE public.app_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now ()
);

INSERT INTO public.app_settings (key, value)
VALUES
  ('registration_fee_usdt', to_jsonb (50)),
  ('monthly_fee_usdt', to_jsonb (50)),
  ('deposit_commission_percent', to_jsonb (50)),
  ('usdt_wallet_main', to_jsonb (''::text)),
  ('usdt_wallet_deposit', to_jsonb (''::text))
ON CONFLICT (key) DO NOTHING;

-- ---------------------------------------------------------------------------
-- complaints (жалобы пользователей)
-- ---------------------------------------------------------------------------
CREATE TABLE public.complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  user_id uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  model_id uuid REFERENCES public.models (id) ON DELETE SET NULL,
  deposit_id uuid REFERENCES public.deposits (id) ON DELETE SET NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now ()
);

CREATE INDEX idx_complaints_model ON public.complaints (model_id);

-- ---------------------------------------------------------------------------
-- Публичное представление карточек (без контактов и паспорта)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.v_models_public AS
SELECT
  m.id,
  m.name,
  m.age,
  m.city,
  m.nationality,
  m.description,
  m.preferences,
  m.price_hour,
  m.price_2hours,
  m.price_day,
  m.price_night,
  m.price_self,
  m.price_client,
  m.photos,
  m.videos,
  m.privacy_contacts,
  m.deposit_percent,
  m.rating_public,
  m.verified,
  m.active,
  m.created_at
FROM public.models m
WHERE
  m.active = true;

-- ---------------------------------------------------------------------------
-- updated_at на models
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at ()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_models_updated_at
BEFORE UPDATE ON public.models
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security (политики для anon/authenticated — после Telegram Login, шаг F/G)
-- Сейчас: без политик anon не читает таблицы; service_role (бот, сервер Next) обходит RLS.
-- Публичный листинг без утечки контактов: серверные route handlers или SECURITY DEFINER RPC.
-- ---------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invite_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

COMMENT ON VIEW public.v_models_public IS 'Карточки без контактов; чтение с клиента — после выдачи GRANT + политик или только через сервер.';
COMMENT ON TABLE public.models IS 'Контакты и паспорт; доступ через RLS или только service_role до настройки политик.';

-- ---------------------------------------------------------------------------
-- Storage: приватный бакет для скриншотов и медиа (политики — позже)
-- ---------------------------------------------------------------------------
INSERT INTO
  storage.buckets (id, name, public)
VALUES
  ('uploads', 'uploads', false)
ON CONFLICT (id) DO NOTHING;
