import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { verifyTelegramLoginWidget } from "@/lib/telegram-verify";
import { USER_SESSION_COOKIE, createUserSessionValue } from "@/lib/user-session";

export async function POST(req: Request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN не задан" }, { status: 500 });
  }

  let body: Record<string, string | number>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }

  if (!verifyTelegramLoginWidget(body, botToken)) {
    return NextResponse.json({ error: "Неверная подпись Telegram" }, { status: 401 });
  }

  const telegramId = Number(body.id);
  if (!Number.isFinite(telegramId) || telegramId <= 0) {
    return NextResponse.json({ error: "Некорректный id" }, { status: 400 });
  }

  const username = body.username != null ? String(body.username) : null;
  const first = body.first_name != null ? String(body.first_name) : "";
  const last = body.last_name != null ? String(body.last_name) : "";
  const displayName = [first, last].filter(Boolean).join(" ").trim() || username || `user_${telegramId}`;

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Нет Supabase" }, { status: 500 });
  }

  const { data: existing } = await supabase.from("users").select("id").eq("telegram_id", telegramId).maybeSingle();

  let userId: string;

  if (existing?.id) {
    const { error: upErr } = await supabase
      .from("users")
      .update({
        username,
        display_name: displayName,
      })
      .eq("id", existing.id);

    if (upErr) {
      return NextResponse.json({ error: upErr.message }, { status: 500 });
    }
    userId = existing.id;
  } else {
    const { data: ins, error: insErr } = await supabase
      .from("users")
      .insert({
        telegram_id: telegramId,
        username,
        display_name: displayName,
        role: "user",
        age_verified: false,
      })
      .select("id")
      .single();

    if (insErr || !ins?.id) {
      return NextResponse.json({ error: insErr?.message ?? "insert failed" }, { status: 500 });
    }
    userId = ins.id;
  }

  const sessionVal = createUserSessionValue(userId, 60 * 60 * 24 * 30);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(USER_SESSION_COOKIE, sessionVal, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
