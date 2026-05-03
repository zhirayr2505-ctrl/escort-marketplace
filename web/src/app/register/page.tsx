import { RegisterForm } from "@/components/RegisterForm";
import { SiteHeader } from "@/components/SiteHeader";
import { getValidInviteByCode } from "@/lib/invites";

type Props = { searchParams: { code?: string } };

export default async function RegisterPage({ searchParams }: Props) {
  const code = searchParams.code?.trim();
  const invite = code ? await getValidInviteByCode(code) : null;

  return (
    <div className="app-shell bg-transparent">
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-4 pb-12 pt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-app-accent/90">модель</p>
        <h1 className="app-title-gradient mt-2 text-3xl font-semibold tracking-tight">Регистрация</h1>

        {!code && <p className="mt-6 text-sm text-red-400">Нужна инвайт-ссылка вида /register?code=…</p>}

        {code && !invite && (
          <p className="mt-6 text-sm text-red-400">
            Ссылка недействительна, уже использована или истёк срок (12 часов).
          </p>
        )}

        {invite && code && (
          <div className="mt-8">
            <p className="mb-6 text-sm text-app-muted">
              Инвайт действителен до{" "}
              <span className="font-medium text-app-text">{new Date(invite.expires_at).toLocaleString("ru-RU")}</span>.
            </p>
            <RegisterForm inviteCode={code} />
          </div>
        )}
      </main>
    </div>
  );
}
