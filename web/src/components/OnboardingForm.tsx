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
      className="app-btn-primary mt-6 w-full disabled:pointer-events-none disabled:opacity-55"
    >
      {pending ? "Сохранение…" : "Продолжить"}
    </button>
  );
}

export function OnboardingForm({ defaultNickname }: { defaultNickname: string }) {
  const [state, formAction] = useFormState(completeOnboardingAction, initial);

  return (
    <form action={formAction} className="space-y-6">
      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-app-border/40 bg-app-surface/55 p-4 backdrop-blur-sm">
        <input
          type="checkbox"
          name="adult"
          required
          className="mt-1 h-4 w-4 shrink-0 rounded border-app-border text-app-accent focus:ring-app-accent"
        />
        <span className="text-sm leading-relaxed text-app-text/95">
          Мне есть <strong className="text-app-accent">18 лет</strong>. Я понимаю характер сервиса и принимаю правила
          платформы.
        </span>
      </label>

      <div>
        <label htmlFor="display_name" className="block text-sm font-medium text-app-text">
          Ник для сайта
        </label>
        <p className="mt-1 text-xs text-app-muted">
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
          className="mt-2 w-full rounded-xl border border-app-border/45 bg-app-bg/50 px-3 py-2.5 text-sm text-app-text outline-none ring-app-accent/40 placeholder:text-app-muted/70 focus:ring-2"
        />
      </div>

      {state.error ? (
        <p className="text-sm text-red-400" role="alert">
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
