-- Демо-анкеты для разработки (фиктивные telegram_id 900000001–900000099)
-- Запуск в Supabase SQL Editor. Повторный запуск: сначала удалит старые демо, затем вставит заново.

DELETE FROM public.models
WHERE
  user_id IN (
    SELECT id
    FROM public.users
    WHERE
      telegram_id BETWEEN 900000001 AND 900000099
  );

DELETE FROM public.users
WHERE
  telegram_id BETWEEN 900000001 AND 900000099;

INSERT INTO
  public.users (telegram_id, username, display_name, role, age_verified)
VALUES
  (900000001, 'demo_elena', 'Елена', 'model', true),
  (900000002, 'demo_mariam', 'Мариам', 'model', true),
  (900000003, 'demo_sona', 'Сона', 'model', true),
  (900000004, 'demo_lilit', 'Лилит', 'model', true);

INSERT INTO
  public.models (
    user_id,
    name,
    age,
    nationality,
    description,
    preferences,
    city,
    price_hour,
    price_2hours,
    price_day,
    price_night,
    price_self,
    price_client,
    photos,
    videos,
    verified,
    active,
    monthly_paid_until,
    privacy_contacts,
    deposit_percent,
    contacts_telegram,
    contacts_whatsapp,
    contacts_phone,
    rating_public
  )
SELECT
  u.id,
  v.name,
  v.age,
  v.nationality,
  v.description,
  v.preferences,
  v.city,
  v.price_hour,
  v.price_2hours,
  v.price_day,
  v.price_night,
  v.price_self,
  v.price_client,
  v.photos,
  v.videos,
  true,
  true,
  now() + interval '30 days',
  v.privacy_contacts,
  50,
  v.contacts_telegram,
  v.contacts_whatsapp,
  v.contacts_phone,
  v.rating_public
FROM
  public.users u
  INNER JOIN (
    VALUES
      (
        900000001::bigint,
        'Елена'::text,
        24::int,
        'Россия'::text,
        'Спокойная атмосфера, встречи в центре Еревана.'::text,
        'Классика, ужин, прогулки.'::text,
        'Ереван'::text,
        150::numeric,
        280::numeric,
        900::numeric,
        700::numeric,
        180::numeric,
        200::numeric,
        ARRAY[
          'https://picsum.photos/seed/elena1/800/1200',
          'https://picsum.photos/seed/elena2/800/1200'
        ]::text[],
        ARRAY['https://picsum.photos/seed/elena3/800/450']::text[],
        'public'::text,
        '@elena_demo'::text,
        '+37400000001'::text,
        '+37400000001'::text,
        4.8::numeric
      ),
      (
        900000002::bigint,
        'Мариам',
        22,
        'Армения',
        'Студентка, свободный график по вечерам.',
        'Активный отдых, кафе.',
        'Ереван',
        120,
        220,
        750,
        600,
        140,
        160,
        ARRAY[
          'https://picsum.photos/seed/mariam1/800/1200',
          'https://picsum.photos/seed/mariam2/800/1200',
          'https://picsum.photos/seed/mariam3/800/1200'
        ],
        ARRAY[]::text[],
        'deposit',
        '@mariam_demo',
        '+37400000002',
        '+37400000002',
        4.9
      ),
      (
        900000003::bigint,
        'Сона',
        26,
        'Армения',
        'Опытная, индивидуальный подход.',
        'Путешествия по региону, уютные встречи.',
        'Гюмри',
        100,
        190,
        650,
        550,
        110,
        130,
        ARRAY[
          'https://picsum.photos/seed/sona1/800/1200',
          'https://picsum.photos/seed/sona2/800/1200'
        ],
        ARRAY['https://picsum.photos/seed/sona3/800/450'],
        'deposit',
        '@sona_demo',
        '+37400000003',
        '+37400000003',
        4.7
      ),
      (
        900000004::bigint,
        'Лилит',
        23,
        'Франция',
        'Недавно в Армении, английский и русский.',
        'Культурная программа, SPA.',
        'Ереван',
        200,
        380,
        1100,
        900,
        220,
        240,
        ARRAY[
          'https://picsum.photos/seed/lilit1/800/1200',
          'https://picsum.photos/seed/lilit2/800/1200',
          'https://picsum.photos/seed/lilit3/800/1200',
          'https://picsum.photos/seed/lilit4/800/1200'
        ],
        ARRAY[]::text[],
        'public',
        '@lilit_demo',
        '+37400000004',
        '+37400000004',
        5.0
      )
  ) AS v (
    tg,
    name,
    age,
    nationality,
    description,
    preferences,
    city,
    price_hour,
    price_2hours,
    price_day,
    price_night,
    price_self,
    price_client,
    photos,
    videos,
    privacy_contacts,
    contacts_telegram,
    contacts_whatsapp,
    contacts_phone,
    rating_public
  ) ON u.telegram_id = v.tg;
