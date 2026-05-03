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
    <div className="flex items-center gap-3">
      <span className="max-w-[140px] truncate text-neutral-800 dark:text-neutral-200" title={displayName}>
        {displayName}
      </span>
      <Link href="/account" className="hover:underline">
        Кабинет
      </Link>
      <button type="button" onClick={() => void logout()} className="text-red-600 hover:underline dark:text-red-400">
        Выйти
      </button>
    </div>
  );
}
