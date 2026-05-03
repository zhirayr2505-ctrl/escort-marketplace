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
    <div className="app-shell bg-transparent">
      <header className="border-b border-app-border/40 bg-app-header/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center px-4 py-4">
          <Link href="/" className="text-sm font-medium text-app-muted transition hover:text-app-accent">
            ← На главную
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-10">
        <h1 className="app-title-gradient text-3xl font-semibold tracking-tight">Кабинет</h1>

        <dl className="mt-8 space-y-5 rounded-2xl border border-app-border/35 bg-app-surface/55 p-5 text-sm backdrop-blur-sm">
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-app-muted">Имя</dt>
            <dd className="mt-1 font-medium text-app-text">{user.display_name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-app-muted">Telegram</dt>
            <dd className="mt-1 font-mono text-sm text-app-text/90">
              @{user.username ?? "—"} <span className="text-app-muted">(id {String(user.telegram_id)})</span>
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-app-muted">Роль</dt>
            <dd className="mt-1 text-app-text">{user.role}</dd>
          </div>
        </dl>

        <div className="mt-10">
          <AccountLogoutButton />
        </div>
      </main>
    </div>
  );
}
