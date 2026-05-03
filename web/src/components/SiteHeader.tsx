import Link from "next/link";
import { getCurrentUser } from "@/lib/current-user";
import { UserMenuClient } from "@/components/UserMenuClient";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-app-border/40 bg-app-header/95 backdrop-blur-xl supports-[backdrop-filter]:bg-app-header/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-app-accent shadow-app-glow ring-2 ring-app-accent/25 transition group-hover:scale-110" />
          <span className="text-base font-semibold tracking-tight text-app-text sm:text-lg">
            Маркетплейс
          </span>
        </Link>
        <nav className="flex items-center gap-3 text-sm text-app-muted sm:gap-4">
          <span className="hidden rounded-full border border-app-border/35 bg-app-surface/50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-app-muted sm:inline">
            Армения
          </span>
          {user ? (
            <UserMenuClient displayName={user.display_name ?? user.username ?? "Профиль"} />
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-app-border/50 bg-app-surface/70 px-3 py-1.5 text-xs font-semibold text-app-text transition hover:border-app-accent/45 hover:text-app-accent sm:text-sm"
            >
              Войти
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
