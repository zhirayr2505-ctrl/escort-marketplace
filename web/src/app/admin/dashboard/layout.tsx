import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/admin-session";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  if (!verifyAdminSession(cookies())) {
    redirect("/admin/login");
  }
  return <>{children}</>;
}
