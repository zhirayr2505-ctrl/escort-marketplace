import Link from "next/link";
import { redirect } from "next/navigation";
import { TelegramLoginButton } from "@/components/TelegramLoginButton";
import { getCurrentUser } from "@/lib/current-user";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/account");
  }

  const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME ?? "";

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black">
      <header className="border-b border-neutral-200 bg-white/80 dark:border-neutral-800 dark:bg-neutral-950/80">
        <div className="mx-auto flex max-w-lg items-center px-4 py-4">
          <Link href="/" className="text-sm font-medium text-neutral-600 hover:underline dark:text-neutral-400">
            ← На главную
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-12">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Вход</h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Войди через Telegram — так мы свяжем аккаунт с твоим профилем для залогов и уведомлений.
        </p>

        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
          <TelegramLoginButton botUsername={botName} />
        </div>

        <p className="mt-6 text-xs text-neutral-500">
          На сервере проверяется подпись Telegram (TELEGRAM_BOT_TOKEN). Бот должен быть тем же, что и для виджета.
        </p>
      </main>
    </div>
  );
}
