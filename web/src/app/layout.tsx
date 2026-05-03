import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { TelegramWebAppProvider } from "@/components/TelegramWebAppProvider";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Маркетплейс",
  description: "Каталог объявлений",
  appleWebApp: {
    capable: true,
    title: "Маркетплейс",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#09080c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <TelegramWebAppProvider>{children}</TelegramWebAppProvider>
      </body>
    </html>
  );
}
