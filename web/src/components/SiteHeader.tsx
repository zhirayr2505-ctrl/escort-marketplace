import Link from "next/link";
import { getCurrentUser } from "@/lib/current-user";
import { UserMenuClient } from "@/components/UserMenuClient";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Маркетплейс
        </Link>
        <nav className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
          <span className="hidden sm:inline">Армения</span>
          {user ? (
            <UserMenuClient displayName={user.display_name ?? user.username ?? "Профиль"} />
          ) : (
            <Link href="/login" className="font-medium text-neutral-900 hover:underline dark:text-neutral-100">
              Войти
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
