"use client";

import { useFormState, useFormStatus } from "react-dom";
import { registerModelAction, type RegisterResult } from "@/app/register/actions";

const initial: RegisterResult | null = null;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="app-btn-primary w-full py-3 disabled:opacity-50"
    >
      {pending ? "Отправка…" : "Отправить анкету"}
    </button>
  );
}

type Props = { inviteCode: string };

export function RegisterForm({ inviteCode }: Props) {
  const [state, formAction] = useFormState(registerModelAction, initial);

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-emerald-400/35 bg-emerald-950/40 p-6 text-emerald-50">
        <p className="font-medium">Анкета принята</p>
        <p className="mt-2 text-sm opacity-90">
          Дальше — оплата регистрации и загрузка скриншота (будет в следующем шаге). Заявка у админа в статусе «ожидает оплаты».
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="code" value={inviteCode} />

      {state && !state.ok && (
        <div className="rounded-xl border border-red-400/35 bg-red-950/40 p-3 text-sm text-red-100">
          {state.error}
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-app-accent/90">Основное</h2>
        <label className="block">
          <span className="text-sm text-app-muted">Имя / псевдоним</span>
          <input
            name="name"
            required
            className="mt-1 w-full rounded-xl border border-app-border/45 bg-app-surface/40 px-3 py-2 text-app-text outline-none ring-app-accent/25 focus:ring-2"
          />
        </label>
        <label className="block">
          <span className="text-sm text-app-muted">Возраст</span>
          <input
            name="age"
            type="number"
            min={18}
            required
            className="mt-1 w-full rounded-xl border border-app-border/45 bg-app-surface/40 px-3 py-2 text-app-text outline-none ring-app-accent/25 focus:ring-2"
          />
        </label>
        <label className="block">
          <span className="text-sm text-app-muted">Город</span>
          <input
            name="city"
            required
            className="mt-1 w-full rounded-xl border border-app-border/45 bg-app-surface/40 px-3 py-2 text-app-text outline-none ring-app-accent/25 focus:ring-2"
          />
        </label>
        <label className="block">
          <span className="text-sm text-app-muted">Национальность</span>
          <input name="nationality" className="mt-1 w-full rounded-xl border border-app-border/45 bg-app-surface/40 px-3 py-2 text-app-text outline-none ring-app-accent/25 focus:ring-2" />
        </label>
      </section>

      <section className="space-y-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-app-accent/90">Тексты</h2>
        <label className="block">
          <span className="text-sm text-app-muted">О себе</span>
          <textarea
            name="description"
            rows={3}
            className="mt-1 w-full rounded-xl border border-app-border/45 bg-app-surface/40 px-3 py-2 text-app-text outline-none ring-app-accent/25 focus:ring-2"
          />
        </label>
        <label className="block">
          <span className="text-sm text-app-muted">Предпочтения</span>
          <textarea
            name="preferences"
            rows={2}
            className="mt-1 w-full rounded-xl border border-app-border/45 bg-app-surface/40 px-3 py-2 text-app-text outline-none ring-app-accent/25 focus:ring-2"
          />
        </label>
      </section>

      <section className="space-y-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-app-accent/90">Цены (USDT)</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ["price_hour", "Час"],
              ["price_2hours", "2 часа"],
              ["price_day", "День"],
              ["price_night", "Ночь"],
              ["price_self", "У себя"],
              ["price_client", "У тебя"],
            ] as const
          ).map(([name, label]) => (
            <label key={name} className="block">
              <span className="text-sm text-app-muted">{label}</span>
              <input
                name={name}
                type="number"
                min={0}
                step="0.01"
                className="mt-1 w-full rounded-xl border border-app-border/45 bg-app-surface/40 px-3 py-2 text-app-text outline-none ring-app-accent/25 focus:ring-2"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-app-accent/90">Приватность контактов</h2>
        <select
          name="privacy_contacts"
          className="w-full rounded-xl border border-app-border/45 bg-app-surface/40 px-3 py-2 text-app-text outline-none ring-app-accent/25 focus:ring-2"
          defaultValue="deposit"
        >
          <option value="public">Видны всем сразу</option>
          <option value="deposit">После залога (50% от цены)</option>
        </select>
      </section>

      <section className="space-y-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-app-accent/90">Контакты</h2>
        <label className="block">
          <span className="text-sm text-app-muted">Telegram</span>
          <input name="contacts_telegram" placeholder="@username" className="mt-1 w-full rounded-xl border border-app-border/45 bg-app-surface/40 px-3 py-2 text-app-text outline-none ring-app-accent/25 focus:ring-2" />
        </label>
        <label className="block">
          <span className="text-sm text-app-muted">WhatsApp</span>
          <input name="contacts_whatsapp" className="mt-1 w-full rounded-xl border border-app-border/45 bg-app-surface/40 px-3 py-2 text-app-text outline-none ring-app-accent/25 focus:ring-2" />
        </label>
        <label className="block">
          <span className="text-sm text-app-muted">Телефон</span>
          <input name="contacts_phone" className="mt-1 w-full rounded-xl border border-app-border/45 bg-app-surface/40 px-3 py-2 text-app-text outline-none ring-app-accent/25 focus:ring-2" />
        </label>
      </section>

      <p className="text-xs text-app-muted">
        Фото, видео и документы добавим на следующем шаге (загрузка в Storage).
      </p>

      <SubmitButton />
    </form>
  );
}
