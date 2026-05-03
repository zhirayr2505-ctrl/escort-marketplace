import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-50 px-4 dark:bg-black">
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">404</h1>
      <p className="text-neutral-600 dark:text-neutral-400">Такой страницы нет.</p>
      <Link
        href="/"
        className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
      >
        На главную
      </Link>
    </div>
  );
}
