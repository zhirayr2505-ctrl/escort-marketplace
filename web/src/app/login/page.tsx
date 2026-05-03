import Link from "next/link";
import { redirect } from "next/navigation";
import { TelegramLoginButton } from "@/components/TelegramLoginButton";
import { getCurrentUser } from "@/lib/current-user";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect(user.age_verified ? "/account" : "/onboarding");
  }

  const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME ?? "";

  return (
    <div className="app-shell bg-transparent">
      <header className="border-b border-app-border/40 bg-app-header/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center px-4 py-4">
          <Link href="/" className="text-sm font-medium text-app-muted transition hover:text-app-accent">
            ← На главную
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-12">
        <h1 className="app-title-gradient text-3xl font-semibold tracking-tight">Вход</h1>
        <p className="mt-3 text-sm leading-relaxed text-app-muted">
          Войди через Telegram — аккаунт нужен для залогов и уведомлений. В Mini App удобнее открыть каталог из бота.
        </p>

        <div className="mt-8 rounded-[1.35rem] border border-app-border/40 bg-app-surface/60 p-6 backdrop-blur-sm">
          <TelegramLoginButton botUsername={botName} />
        </div>

        <p className="mt-6 text-xs leading-relaxed text-app-muted">
          На сервере проверяется подпись Telegram (<code className="font-mono text-[11px] text-app-accent/90">TELEGRAM_BOT_TOKEN</code>). Домен сайта должен быть добавлен у BotFather для виджета.
        </p>
      </main>
    </div>
  );
}
