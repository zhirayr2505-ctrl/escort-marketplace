import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { OnboardingForm } from "@/components/OnboardingForm";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (user.age_verified) {
    redirect("/account");
  }

  const defaultNickname =
    (user.username ? `@${user.username}` : null) ||
    user.display_name?.trim() ||
    `user_${user.telegram_id}`;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black">
      <header className="border-b border-neutral-200 bg-white/80 dark:border-neutral-800 dark:bg-neutral-950/80">
        <div className="mx-auto flex max-w-lg items-center px-4 py-4">
          <Link href="/" className="text-sm font-medium text-neutral-600 hover:underline dark:text-neutral-400">
            ← На главную
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-10">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Один шаг до кабинета
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Подтверди возраст и при желании задай ник — так мы отображаем тебя в интерфейсе.
        </p>

        <div className="mt-8">
          <OnboardingForm defaultNickname={defaultNickname} />
        </div>
      </main>
    </div>
  );
}
