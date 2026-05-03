import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/admin-session";

export default function AdminIndexPage() {
  if (verifyAdminSession(cookies())) {
    redirect("/admin/dashboard");
  }
  redirect("/admin/login");
}
