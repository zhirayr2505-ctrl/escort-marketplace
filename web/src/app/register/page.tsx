import { RegisterForm } from "@/components/RegisterForm";
import { SiteHeader } from "@/components/SiteHeader";
import { getValidInviteByCode } from "@/lib/invites";

type Props = { searchParams: { code?: string } };

export default async function RegisterPage({ searchParams }: Props) {
  const code = searchParams.code?.trim();
  const invite = code ? await getValidInviteByCode(code) : null;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black">
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Регистрация модели</h1>

        {!code && (
          <p className="mt-4 text-red-600 dark:text-red-400">Нужна инвайт-ссылка вида /register?code=…</p>
        )}

        {code && !invite && (
          <p className="mt-4 text-red-600 dark:text-red-400">
            Ссылка недействительна, уже использована или истёк срок (12 часов).
          </p>
        )}

        {invite && code && (
          <div className="mt-8">
            <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
              Инвайт действителен до {new Date(invite.expires_at).toLocaleString("ru-RU")}.
            </p>
            <RegisterForm inviteCode={code} />
          </div>
        )}
      </main>
    </div>
  );
}
