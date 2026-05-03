import { ModelCard } from "@/components/ModelCard";
import { SiteHeader } from "@/components/SiteHeader";
import { getPublicModels } from "@/lib/models";

/** Список всегда с актуальной БД, не кэш страницы при сборке */
export const dynamic = "force-dynamic";

export default async function Home() {
  const { models, fetchError, missingServiceKey } = await getPublicModels();
  const projectHost = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

  return (
    <div className="app-shell bg-transparent">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6 sm:pt-8">
        <div className="mb-8 sm:mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-app-accent/90">
            каталог
          </p>
          <h1 className="app-title-gradient mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Анкеты
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-app-muted">
            Подборка активных профилей. В Telegram Mini App интерфейс раскрывается на весь экран — как
            отдельное приложение.
          </p>
        </div>

        {missingServiceKey && (
          <div className="mb-8 rounded-2xl border border-app-accent/25 bg-app-accent-dim p-4 text-sm text-app-text">
            <p className="font-semibold text-app-accent">Нет доступа к данным с сервера</p>
            <p className="mt-2 text-app-muted">
              Добавь в <code className="rounded-md bg-black/25 px-1.5 py-0.5 font-mono text-xs">web/.env.local</code>{" "}
              строку{" "}
              <code className="rounded-md bg-black/25 px-1.5 py-0.5 font-mono text-xs">
                SUPABASE_SERVICE_ROLE_KEY=
              </code>{" "}
              и перезапусти <code className="font-mono text-xs">npm run dev</code>.
            </p>
          </div>
        )}

        {fetchError && (
          <div className="mb-8 rounded-2xl border border-red-400/30 bg-red-950/35 p-4 text-sm text-red-100">
            <p className="font-semibold">Ошибка запроса к Supabase</p>
            <p className="mt-2 font-mono text-xs opacity-90">{fetchError}</p>
          </div>
        )}

        {!fetchError && models.length === 0 && !missingServiceKey && (
          <div className="mb-8 rounded-2xl border border-app-border/40 bg-app-surface/50 p-4 text-sm text-app-muted">
            <p className="font-medium text-app-text">Список пустой, но подключение есть</p>
            <ul className="mt-3 list-inside list-disc space-y-1.5">
              <li>
                Выполни SQL с демо <strong className="text-app-text">целиком</strong> в том же проекте, что в env.
              </li>
              <li>
                В Table Editor: <code className="rounded bg-black/30 px-1 font-mono text-xs">models</code> с{" "}
                <code className="rounded bg-black/30 px-1 font-mono text-xs">active = true</code>.
              </li>
              <li className="break-all">
                Проект:{" "}
                <code className="rounded bg-black/30 px-1 font-mono text-[11px]">{projectHost || "(нет URL)"}</code>
              </li>
            </ul>
          </div>
        )}

        {models.length === 0 ? (
          <div className="rounded-[1.35rem] border border-dashed border-app-border/45 bg-app-surface/40 p-12 text-center text-app-muted">
            Пока нет анкет — добавь модели в Supabase.
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
