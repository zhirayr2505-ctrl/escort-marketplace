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
    <div className="app-shell bg-transparent">
      <header className="border-b border-app-border/40 bg-app-header/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center px-4 py-4">
          <Link href="/" className="text-sm font-medium text-app-muted transition hover:text-app-accent">
            ← На главную
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-app-accent/90">онбординг</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-app-text">Один шаг до кабинета</h1>
        <p className="mt-3 text-sm leading-relaxed text-app-muted">
          Подтверди возраст и при желании задай ник — так мы отображаем тебя в интерфейсе.
        </p>

        <div className="mt-8">
          <OnboardingForm defaultNickname={defaultNickname} />
        </div>
      </main>
    </div>
  );
}
