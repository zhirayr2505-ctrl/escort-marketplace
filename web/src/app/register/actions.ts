"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { getValidInviteByCode } from "@/lib/invites";

function parseNum(v: FormDataEntryValue | null): number | null {
  if (v == null || v === "") return null;
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function tempTelegramId(): number {
  return -(Math.floor(Math.random() * 900_000_000_000_000) + 100_000_000_000_000);
}

export type RegisterResult = { ok: true } | { ok: false; error: string };

export async function registerModelAction(
  _prev: RegisterResult | null,
  formData: FormData
): Promise<RegisterResult> {
  const code = String(formData.get("code") ?? "").trim();
  const invite = await getValidInviteByCode(code);
  if (!invite) {
    return { ok: false, error: "Инвайт недействителен или истёк." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const age = parseInt(String(formData.get("age") ?? ""), 10);
  const city = String(formData.get("city") ?? "").trim();
  const nationality = String(formData.get("nationality") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const preferences = String(formData.get("preferences") ?? "").trim();
  const privacy = String(formData.get("privacy_contacts") ?? "deposit");
  const contacts_telegram = String(formData.get("contacts_telegram") ?? "").trim();
  const contacts_whatsapp = String(formData.get("contacts_whatsapp") ?? "").trim();
  const contacts_phone = String(formData.get("contacts_phone") ?? "").trim();

  if (!name || !city) {
    return { ok: false, error: "Заполни имя и город." };
  }
  if (!Number.isFinite(age) || age < 18) {
    return { ok: false, error: "Возраст от 18 лет." };
  }
  if (privacy !== "public" && privacy !== "deposit") {
    return { ok: false, error: "Некорректная настройка приватности." };
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return { ok: false, error: "Сервер не настроен (SUPABASE_SERVICE_ROLE_KEY)." };
  }

  const { data: feeRow } = await supabase.from("app_settings").select("value").eq("key", "registration_fee_usdt").maybeSingle();
  const feeVal = feeRow?.value as unknown;
  const amount =
    typeof feeVal === "number"
      ? feeVal
      : typeof feeVal === "string"
        ? Number(feeVal)
        : 50;
  const amount_usdt = Number.isFinite(amount) ? amount : 50;

  let userId: string | null = null;
  let modelId: string | null = null;

  for (let attempt = 0; attempt < 8; attempt++) {
    const telegram_id = tempTelegramId();

    const { data: userIns, error: uErr } = await supabase
      .from("users")
      .insert({
        telegram_id,
        username: `pending_${String(telegram_id).replace("-", "")}`,
        display_name: name,
        role: "model",
        age_verified: false,
      })
      .select("id")
      .single();

    if (uErr) {
      if (uErr.code === "23505") continue;
      return { ok: false, error: uErr.message };
    }
    userId = userIns?.id ?? null;
    break;
  }

  if (!userId) {
    return { ok: false, error: "Не удалось создать пользователя, попробуй ещё раз." };
  }

  const { data: modelIns, error: mErr } = await supabase
    .from("models")
    .insert({
      user_id: userId,
      name,
      age,
      nationality: nationality || null,
      description: description || null,
      preferences: preferences || null,
      city,
      price_hour: parseNum(formData.get("price_hour")),
      price_2hours: parseNum(formData.get("price_2hours")),
      price_day: parseNum(formData.get("price_day")),
      price_night: parseNum(formData.get("price_night")),
      price_self: parseNum(formData.get("price_self")),
      price_client: parseNum(formData.get("price_client")),
      photos: [],
      videos: [],
      verified: false,
      active: false,
      privacy_contacts: privacy,
      deposit_percent: 50,
      contacts_telegram: contacts_telegram || null,
      contacts_whatsapp: contacts_whatsapp || null,
      contacts_phone: contacts_phone || null,
    })
    .select("id")
    .single();

  if (mErr || !modelIns?.id) {
    await supabase.from("users").delete().eq("id", userId);
    return { ok: false, error: mErr?.message ?? "Ошибка создания анкеты." };
  }
  modelId = modelIns.id;

  const { error: rErr } = await supabase.from("model_requests").insert({
    model_id: modelId,
    type: "registration",
    amount_usdt,
    status: "pending",
  });

  if (rErr) {
    await supabase.from("models").delete().eq("id", modelId);
    await supabase.from("users").delete().eq("id", userId);
    return { ok: false, error: rErr.message };
  }

  const { error: invErr } = await supabase
    .from("invite_links")
    .update({ used_by: userId, used_at: new Date().toISOString() })
    .eq("id", invite.id)
    .is("used_by", null);

  if (invErr) {
    return { ok: false, error: "Анкета создана, но инвайт не помечен — напиши админу. " + invErr.message };
  }

  return { ok: true };
}
