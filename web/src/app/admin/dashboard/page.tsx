import Link from "next/link";
import { createInviteAction } from "@/app/admin/actions";
import { adminLogoutAction } from "@/app/admin/actions";
import { createServiceClient } from "@/lib/supabase/service";
import { CreateInviteButton } from "@/components/admin/CreateInviteButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = createServiceClient();

  const { data: invites } = supabase
    ? await supabase.from("invite_links").select("id, code, expires_at, used_at").order("created_at", { ascending: false }).limit(15)
    : { data: null };

  const { data: requests } = supabase
    ? await supabase
        .from("model_requests")
        .select("id, type, amount_usdt, status, created_at, model_id")
        .order("created_at", { ascending: false })
        .limit(20)
    : { data: null };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black">
      <header className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-semibold">Админ-панель</h1>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-neutral-600 hover:underline dark:text-neutral-400">
              Сайт
            </Link>
            <form action={adminLogoutAction}>
              <button type="submit" className="text-sm text-red-600 hover:underline">
                Выйти
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-10 px-4 py-8">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Инвайт (12 ч)</h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Создать одноразовую ссылку для регистрации модели.
          </p>
          <div className="mt-4">
            <CreateInviteButton createAction={createInviteAction} />
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Последние инвайты</h2>
          <div className="mt-3 overflow-x-auto rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <th className="p-3 font-medium">Код</th>
                  <th className="p-3 font-medium">Истекает</th>
                  <th className="p-3 font-medium">Использован</th>
                </tr>
              </thead>
              <tbody>
                {(invites ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-neutral-500">
                      Пусто
                    </td>
                  </tr>
                ) : (
                  invites!.map((row) => (
                    <tr key={row.id} className="border-b border-neutral-100 dark:border-neutral-800/80">
                      <td className="p-3 font-mono text-xs">{row.code.slice(0, 12)}…</td>
                      <td className="p-3">{new Date(row.expires_at).toLocaleString("ru-RU")}</td>
                      <td className="p-3">{row.used_at ? "да" : "нет"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Заявки (model_requests)</h2>
          <div className="mt-3 overflow-x-auto rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <th className="p-3 font-medium">Тип</th>
                  <th className="p-3 font-medium">Сумма</th>
                  <th className="p-3 font-medium">Статус</th>
                  <th className="p-3 font-medium">Дата</th>
                </tr>
              </thead>
              <tbody>
                {(requests ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-neutral-500">
                      Пусто
                    </td>
                  </tr>
                ) : (
                  requests!.map((row) => (
                    <tr key={row.id} className="border-b border-neutral-100 dark:border-neutral-800/80">
                      <td className="p-3">{row.type}</td>
                      <td className="p-3">${row.amount_usdt}</td>
                      <td className="p-3">{row.status}</td>
                      <td className="p-3">{new Date(row.created_at).toLocaleString("ru-RU")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
