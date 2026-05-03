import { ModelCard } from "@/components/ModelCard";
import { SiteHeader } from "@/components/SiteHeader";
import { getPublicModels } from "@/lib/models";

/** Список всегда с актуальной БД, не кэш страницы при сборке */
export const dynamic = "force-dynamic";

export default async function Home() {
  const { models, fetchError, missingServiceKey } = await getPublicModels();
  const projectHost = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="mb-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Анкеты
        </h1>
        <p className="mb-8 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
          Каталог активных профилей. Если список пустой — в базе ещё нет моделей с{" "}
          <code className="rounded bg-neutral-200 px-1 py-0.5 text-xs dark:bg-neutral-800">active = true</code>.
        </p>

        {missingServiceKey && (
          <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
            <p className="font-medium">Нет доступа к данным с сервера</p>
            <p className="mt-1 text-amber-900/90 dark:text-amber-200/90">
              Добавь в <code className="font-mono">web/.env.local</code> строку{" "}
              <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY=</code> (тот же секретный ключ, что в Supabase →
              service_role). Перезапусти <code className="font-mono">npm run dev</code>.
            </p>
          </div>
        )}

        {fetchError && (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-950 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-100">
            <p className="font-medium">Ошибка запроса к Supabase</p>
            <p className="mt-1 font-mono text-xs opacity-90">{fetchError}</p>
          </div>
        )}

        {!fetchError && models.length === 0 && !missingServiceKey && (
          <div className="mb-8 rounded-xl border border-neutral-200 bg-neutral-100/80 p-4 text-sm text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-200">
            <p className="font-medium">Список пустой, но подключение есть</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-neutral-700 dark:text-neutral-300">
              <li>
                SQL с демо нужно выполнить <strong>целиком</strong> (и DELETE, и INSERT) в том же проекте, что в{" "}
                <code className="rounded bg-white px-1 dark:bg-neutral-800">.env.local</code>.
              </li>
              <li>
                Проверь в Table Editor: таблица <code className="rounded bg-white px-1 dark:bg-neutral-800">models</code>{" "}
                — есть строки с <code className="rounded bg-white px-1 dark:bg-neutral-800">active = true</code>.
              </li>
              <li className="break-all">
                Сейчас в приложении указан проект:{" "}
                <code className="rounded bg-white px-1 dark:bg-neutral-800">{projectHost || "(нет URL)"}</code>
              </li>
            </ul>
          </div>
        )}

        {models.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center dark:border-neutral-700 dark:bg-neutral-950">
            <p className="text-neutral-600 dark:text-neutral-400">
              Пока нет анкет. После добавления моделей в Supabase они появятся здесь.
            </p>
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {models.map((model, i) => (
              <li key={model.id}>
                <ModelCard model={model} index={i} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
