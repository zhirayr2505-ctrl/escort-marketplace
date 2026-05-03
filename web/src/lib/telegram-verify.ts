import { createHash, createHmac, timingSafeEqual } from "crypto";

/** Проверка данных Telegram Login Widget: https://core.telegram.org/widgets/login#checking-authorization */
export function verifyTelegramLoginWidget(
  data: Record<string, string | number | undefined>,
  botToken: string
): boolean {
  const hash = data.hash;
  if (!hash || typeof hash !== "string") return false;

  const authDate = Number(data.auth_date);
  if (!Number.isFinite(authDate)) return false;
  const maxAgeSec = 86400;
  if (Math.floor(Date.now() / 1000) - authDate > maxAgeSec) return false;

  const pairs = Object.keys(data)
    .filter((k) => k !== "hash" && data[k] !== undefined && data[k] !== "")
    .sort()
    .map((k) => `${k}=${data[k]}`);

  const dataCheckString = pairs.join("\n");

  const secretKey = createHash("sha256").update(botToken).digest();
  const hmac = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  try {
    const a = Buffer.from(hmac, "hex");
    const b = Buffer.from(hash, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
