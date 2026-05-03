import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { verifyAdminSession } from "@/lib/admin-session";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  if (verifyAdminSession(cookies())) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 dark:bg-black">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Вход в админку</h1>
        <p className="mt-1 text-sm text-neutral-500">Пароль из ADMIN_PANEL_PASSWORD</p>
        <AdminLoginForm />
        <Link href="/" className="mt-6 block text-center text-sm text-neutral-500 hover:underline">
          На сайт
        </Link>
      </div>
    </div>
  );
}
