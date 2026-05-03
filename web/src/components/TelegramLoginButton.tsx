"use client";

import { useEffect, useRef, useState } from "react";

type Props = { botUsername: string };

declare global {
  interface Window {
    onTelegramAuth?: (user: Record<string, string | number>) => void;
  }
}

export function TelegramLoginButton({ botUsername }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.onTelegramAuth = async (user) => {
      setError(null);
      setLoading(true);
      try {
        const res = await fetch("/api/auth/telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) {
          setError(j.error ?? `Ошибка ${res.status}`);
          return;
        }
        window.location.href = "/";
      } catch {
        setError("Сеть недоступна");
      } finally {
        setLoading(false);
      }
    };

    const el = containerRef.current;
    if (!el || !botUsername) return;

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botUsername.replace(/^@/, ""));
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "12");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    el.appendChild(script);

    return () => {
      el.innerHTML = "";
      delete window.onTelegramAuth;
    };
  }, [botUsername]);

  if (!botUsername) {
    return (
      <p className="text-sm text-amber-800 dark:text-amber-200">
        Задай NEXT_PUBLIC_TELEGRAM_BOT_NAME в .env.local (username бота без @).
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div ref={containerRef} className="flex min-h-[44px] items-center" />
      {loading && <p className="text-sm text-neutral-500">Вход…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
