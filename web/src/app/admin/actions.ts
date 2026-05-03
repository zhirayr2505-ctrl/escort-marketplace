"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes } from "crypto";
import { adminSessionCookieName, getAdminSessionToken, verifyAdminSession } from "@/lib/admin-session";
import { createServiceClient } from "@/lib/supabase/service";

export type AdminLoginState = { error?: string };

export async function adminLoginAction(
  _prev: AdminLoginState | undefined,
  formData: FormData
): Promise<AdminLoginState> {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PANEL_PASSWORD;
  if (!expected) {
    return { error: "ADMIN_PANEL_PASSWORD не задан в .env.local" };
  }
  if (password !== expected) {
    return { error: "Неверный пароль" };
  }

  const cookieStore = cookies();
  cookieStore.set(adminSessionCookieName, getAdminSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin/dashboard");
}

export async function adminLogoutAction(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete(adminSessionCookieName);
  redirect("/admin/login");
}

export async function createInviteAction(): Promise<{ ok?: boolean; url?: string; error?: string }> {
  const cookieStore = cookies();
  if (!verifyAdminSession(cookieStore)) {
    return { error: "Нет доступа" };
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return { error: "Нет Supabase service role" };
  }

  const code = randomBytes(16).toString("hex");
  const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase.from("invite_links").insert({
    code,
    created_by: null,
    expires_at: expiresAt,
  });

  if (error) {
    return { error: error.message };
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = `${base.replace(/\/$/, "")}/register?code=${code}`;
  return { ok: true, url };
}
