"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  completeOnboardingAction,
  type OnboardingState,
} from "@/app/onboarding/actions";

const initial: OnboardingState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-6 w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900"
    >
      {pending ? "Сохранение…" : "Продолжить"}
    </button>
  );
}

export function OnboardingForm({ defaultNickname }: { defaultNickname: string }) {
  const [state, formAction] = useFormState(completeOnboardingAction, initial);

  return (
    <form action={formAction} className="space-y-6">
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
        <input
          type="checkbox"
          name="adult"
          required
          className="mt-1 h-4 w-4 shrink-0 rounded border-neutral-300 dark:border-neutral-600"
        />
        <span className="text-sm text-neutral-800 dark:text-neutral-200">
          Мне есть <strong>18 лет</strong>. Я понимаю характер сервиса и принимаю правила платформы.
        </span>
      </label>

      <div>
        <label
          htmlFor="display_name"
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          Ник для сайта
        </label>
        <p className="mt-1 text-xs text-neutral-500">
          От 2 до 40 символов. Если оставить пустым или слишком коротко — будет использован{" "}
          {defaultNickname.startsWith("@") ? "username Telegram" : "имя из Telegram"}.
        </p>
        <input
          id="display_name"
          name="display_name"
          type="text"
          autoComplete="nickname"
          placeholder={defaultNickname}
          maxLength={40}
          className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none ring-neutral-400 focus:ring-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
        />
      </div>

      {state.error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
