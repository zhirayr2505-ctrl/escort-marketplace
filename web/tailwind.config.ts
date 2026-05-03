import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        app: {
          bg: "var(--app-bg)",
          surface: "var(--app-surface)",
          border: "var(--app-border)",
          accent: "var(--app-accent)",
          "accent-dim": "var(--app-accent-dim)",
          "on-accent": "var(--app-on-accent)",
          text: "var(--app-text)",
          muted: "var(--app-muted)",
          header: "var(--app-header-bg)",
        },
      },
      boxShadow: {
        app: "0 24px 60px -18px rgba(0, 0, 0, 0.55)",
        "app-glow": "0 0 42px -8px color-mix(in oklab, var(--app-accent) 35%, transparent)",
      },
    },
  },
  plugins: [],
};
export default config;
