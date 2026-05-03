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
      className="w-full rounded-xl bg-neutral-900 py-3 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
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
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-green-950 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-100">
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
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-100">
          {state.error}
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-500">Основное</h2>
        <label className="block">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">Имя / псевдоним</span>
          <input
            name="name"
            required
            className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
          />
        </label>
        <label className="block">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">Возраст</span>
          <input
            name="age"
            type="number"
            min={18}
            required
            className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
          />
        </label>
        <label className="block">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">Город</span>
          <input
            name="city"
            required
            className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
          />
        </label>
        <label className="block">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">Национальность</span>
          <input name="nationality" className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950" />
        </label>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-500">Тексты</h2>
        <label className="block">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">О себе</span>
          <textarea
            name="description"
            rows={3}
            className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
          />
        </label>
        <label className="block">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">Предпочтения</span>
          <textarea
            name="preferences"
            rows={2}
            className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
          />
        </label>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-500">Цены (USDT)</h2>
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
              <span className="text-sm text-neutral-600 dark:text-neutral-400">{label}</span>
              <input
                name={name}
                type="number"
                min={0}
                step="0.01"
                className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-500">Приватность контактов</h2>
        <select
          name="privacy_contacts"
          className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
          defaultValue="deposit"
        >
          <option value="public">Видны всем сразу</option>
          <option value="deposit">После залога (50% от цены)</option>
        </select>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-500">Контакты</h2>
        <label className="block">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">Telegram</span>
          <input name="contacts_telegram" placeholder="@username" className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950" />
        </label>
        <label className="block">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">WhatsApp</span>
          <input name="contacts_whatsapp" className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950" />
        </label>
        <label className="block">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">Телефон</span>
          <input name="contacts_phone" className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950" />
        </label>
      </section>

      <p className="text-xs text-neutral-500">
        Фото, видео и документы добавим на следующем шаге (загрузка в Storage).
      </p>

      <SubmitButton />
    </form>
  );
}
