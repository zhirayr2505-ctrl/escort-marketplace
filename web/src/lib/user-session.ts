import { createHmac, timingSafeEqual } from "crypto";

export const USER_SESSION_COOKIE = "mk_user";

function sessionSecret(): string {
  return process.env.USER_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET || "dev-user-session";
}

/** Подписанная cookie: base64url(userId:expUnix:sig) */
export function createUserSessionValue(userId: string, maxAgeSec: number): string {
  const exp = Math.floor(Date.now() / 1000) + maxAgeSec;
  const payload = `${userId}:${exp}`;
  const sig = createHmac("sha256", sessionSecret()).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`, "utf8").toString("base64url");
}

export function verifyUserSessionValue(token: string | undefined): { userId: string } | null {
  if (!token) return null;
  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const lastColon = raw.lastIndexOf(":");
    if (lastColon === -1) return null;
    const sig = raw.slice(lastColon + 1);
    const payload = raw.slice(0, lastColon);
    const expPart = payload.lastIndexOf(":");
    if (expPart === -1) return null;
    const userId = payload.slice(0, expPart);
    const exp = Number(payload.slice(expPart + 1));
    if (!Number.isFinite(exp) || Math.floor(Date.now() / 1000) > exp) return null;

    const expected = createHmac("sha256", sessionSecret()).update(payload).digest("hex");
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(sig, "hex");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

    return { userId };
  } catch {
    return null;
  }
}
