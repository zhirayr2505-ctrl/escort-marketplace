import Link from "next/link";

export default function NotFound() {
  return (
    <div className="app-shell flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-transparent px-4">
      <h1 className="app-title-gradient text-4xl font-semibold">404</h1>
      <p className="text-app-muted">Такой страницы нет.</p>
      <Link href="/" className="app-btn-primary px-6 py-2.5">
        На главную
      </Link>
    </div>
  );
}
