import { createHash } from "crypto";

const COOKIE = "admin-session";

export function getAdminSessionToken(): string {
  const pw = process.env.ADMIN_PANEL_PASSWORD ?? "";
  const sec = process.env.ADMIN_SESSION_SECRET || "change-me-in-production";
  return createHash("sha256").update(`${pw}:${sec}`).digest("hex");
}

export function verifyAdminSession(cookieStore: { get: (n: string) => { value: string } | undefined }): boolean {
  const v = cookieStore.get(COOKIE)?.value;
  if (!v) return false;
  return v === getAdminSessionToken();
}

export const adminSessionCookieName = COOKIE;
