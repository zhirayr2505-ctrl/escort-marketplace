/** Минимальные типы для https://telegram.org/js/telegram-web-app.js */

export {};

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        disableVerticalSwipes?: () => void;
        enableVerticalSwipes?: () => void;
        setHeaderColor?: (color: string) => void;
        setBackgroundColor?: (color: string) => void;
        themeParams: {
          bg_color?: string;
          secondary_bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
        colorScheme?: "light" | "dark";
      };
    };
  }
}
