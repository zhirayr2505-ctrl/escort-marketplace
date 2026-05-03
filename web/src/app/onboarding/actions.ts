"use server";

import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/service";
import { getCurrentUser } from "@/lib/current-user";

export type OnboardingState = { error: string | null };

export async function completeOnboardingAction(
  _prev: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  const adult = formData.get("adult");
  if (adult !== "on") {
    return { error: "Подтверди, что тебе есть 18 лет." };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { error: "Сессия истекла. Войди снова." };
  }
  if (user.age_verified) {
    redirect("/account");
  }

  const nickRaw = String(formData.get("display_name") ?? "")
    .trim()
    .replace(/\s+/g, " ");
  const fallback =
    (user.username ? `@${user.username}` : null) ||
    user.display_name?.trim() ||
    `user_${user.telegram_id}`;
  const displayName =
    nickRaw.length >= 2 && nickRaw.length <= 40 ? nickRaw : fallback;

  const supabase = createServiceClient();
  if (!supabase) {
    return { error: "Сервер базы данных недоступен." };
  }

  const { error } = await supabase
    .from("users")
    .update({ age_verified: true, display_name: displayName })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  redirect("/account");
}
