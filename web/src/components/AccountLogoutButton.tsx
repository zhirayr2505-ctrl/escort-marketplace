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
      className="rounded-xl border border-app-border/45 bg-app-surface/50 px-5 py-2.5 text-sm font-medium text-app-muted transition hover:border-red-400/35 hover:text-red-400"
    >
      Выйти
    </button>
  );
}
