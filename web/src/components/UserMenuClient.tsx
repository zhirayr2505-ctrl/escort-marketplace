"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function UserMenuClient({ displayName }: { displayName: string }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    router.push("/");
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <span
        className="max-w-[120px] truncate text-xs font-medium text-app-text sm:max-w-[160px] sm:text-sm"
        title={displayName}
      >
        {displayName}
      </span>
      <Link
        href="/account"
        className="rounded-full border border-app-border/45 bg-app-surface/60 px-2.5 py-1 text-[11px] font-semibold text-app-accent transition hover:border-app-accent/50 sm:text-xs"
      >
        Кабинет
      </Link>
      <button
        type="button"
        onClick={() => void logout()}
        className="text-[11px] font-medium text-red-400/95 hover:text-red-300 sm:text-xs"
      >
        Выйти
      </button>
    </div>
  );
}
