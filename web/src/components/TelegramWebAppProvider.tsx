"use client";

import { useEffect } from "react";

function normalizeHex(color: string | undefined): string | undefined {
  if (!color) return undefined;
  return color.startsWith("#") ? color : `#${color}`;
}

/** Применяет тему Telegram Mini App к CSS-переменным и переводит клиент в полноэкранный режим. */
export function TelegramWebAppProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;

    function applyTelegramTheme(): boolean {
      const tw = window.Telegram?.WebApp;
      if (!tw) return false;

      tw.ready();
      tw.expand();

      try {
        tw.disableVerticalSwipes?.();
      } catch {
        /* старый клиент Telegram */
      }

      document.body.classList.add("tg-mini-app");

      const p = tw.themeParams;
      const bg = normalizeHex(p.bg_color);
      const secondary = normalizeHex(p.secondary_bg_color);
      const text = normalizeHex(p.text_color);
      const hint = normalizeHex(p.hint_color);
      const btn = normalizeHex(p.button_color);
      const btnText = normalizeHex(p.button_text_color);

      if (bg) root.style.setProperty("--app-bg", bg);
      if (secondary) {
        root.style.setProperty("--app-surface", secondary);
        root.style.setProperty("--app-bg-gradient-mid", secondary);
      }
      if (text) root.style.setProperty("--app-text", text);
      if (hint) root.style.setProperty("--app-muted", hint);
      if (btn) root.style.setProperty("--app-accent", btn);
      if (btnText) root.style.setProperty("--app-on-accent", btnText);

      try {
        tw.setHeaderColor?.("secondary_bg_color");
        tw.setBackgroundColor?.("bg_color");
      } catch {
        try {
          if (secondary) tw.setHeaderColor?.(secondary);
          else if (bg) tw.setHeaderColor?.(bg);
          if (bg) tw.setBackgroundColor?.(bg);
        } catch {
          /* ignore */
        }
      }

      return true;
    }

    if (applyTelegramTheme()) return undefined;

    let attempts = 0;
    const id = window.setInterval(() => {
      attempts += 1;
      if (applyTelegramTheme() || attempts > 60) window.clearInterval(id);
    }, 50);

    return () => window.clearInterval(id);
  }, []);

  return children;
}
