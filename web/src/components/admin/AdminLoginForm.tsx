"use client";

import { useFormState, useFormStatus } from "react-dom";
import { adminLoginAction, type AdminLoginState } from "@/app/admin/actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-neutral-900 py-2.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
    >
      {pending ? "…" : "Войти"}
    </button>
  );
}

export function AdminLoginForm() {
  const [state, formAction] = useFormState(adminLoginAction, {} as AdminLoginState);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      {state?.error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
          {state.error}
        </p>
      )}
      <label className="block">
        <span className="text-sm text-neutral-600 dark:text-neutral-400">Пароль</span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </label>
      <Submit />
    </form>
  );
}
