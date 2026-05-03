import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { AccountLogoutButton } from "@/components/AccountLogoutButton";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black">
      <header className="border-b border-neutral-200 bg-white/80 dark:border-neutral-800 dark:bg-neutral-950/80">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-4">
          <Link href="/" className="text-sm font-medium text-neutral-600 hover:underline dark:text-neutral-400">
            ← На главную
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-10">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Кабинет</h1>

        <dl className="mt-8 space-y-4 text-sm">
          <div>
            <dt className="text-neutral-500">Имя</dt>
            <dd className="mt-1 font-medium text-neutral-900 dark:text-neutral-100">{user.display_name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Telegram</dt>
            <dd className="mt-1 font-mono text-neutral-800 dark:text-neutral-200">
              @{user.username ?? "—"} (id {String(user.telegram_id)})
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Роль</dt>
            <dd className="mt-1">{user.role}</dd>
          </div>
        </dl>

        <div className="mt-10">
          <AccountLogoutButton />
        </div>

        <p className="mt-8 text-xs text-neutral-500">
          Подтверждение 18+ и выбор ника — следующий шаг. Сейчас имя берётся из Telegram.
        </p>
      </main>
    </div>
  );
}
