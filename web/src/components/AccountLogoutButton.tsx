"use client";

import { useRouter } from "next/navigation";

export function AccountLogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void logout()}
      className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium dark:border-neutral-600"
    >
      Выйти
    </button>
  );
}
