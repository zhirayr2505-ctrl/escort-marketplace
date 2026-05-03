import { createServiceClient } from "@/lib/supabase/service";

export type PublicModelRow = {
  id: string;
  name: string;
  age: number;
  city: string | null;
  nationality: string | null;
  description: string | null;
  preferences: string | null;
  price_hour: string | null;
  price_2hours: string | null;
  price_day: string | null;
  price_night: string | null;
  price_self: string | null;
  price_client: string | null;
  photos: string[] | null;
  videos: string[] | null;
  privacy_contacts: string;
  deposit_percent: number;
  rating_public: string | null;
  verified: boolean;
  active: boolean;
  created_at: string;
};

export type PublicModelsResult = {
  models: PublicModelRow[];
  fetchError: string | null;
  missingServiceKey: boolean;
};

export async function getPublicModels(): Promise<PublicModelsResult> {
  const supabase = createServiceClient();
  if (!supabase) {
    return { models: [], fetchError: null, missingServiceKey: true };
  }

  const { data, error } = await supabase
    .from("v_models_public")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getPublicModels]", error.message);
    return { models: [], fetchError: error.message, missingServiceKey: false };
  }

  return { models: (data ?? []) as PublicModelRow[], fetchError: null, missingServiceKey: false };
}

/** Полная строка models для страницы профиля (сервер, service_role) */
export type ModelDetailRow = {
  id: string;
  user_id: string;
  name: string;
  age: number;
  nationality: string | null;
  description: string | null;
  preferences: string | null;
  city: string | null;
  price_hour: string | null;
  price_2hours: string | null;
  price_day: string | null;
  price_night: string | null;
  price_self: string | null;
  price_client: string | null;
  photos: string[] | null;
  videos: string[] | null;
  privacy_contacts: string;
  deposit_percent: number;
  contacts_telegram: string | null;
  contacts_whatsapp: string | null;
  contacts_phone: string | null;
  rating_public: string | null;
  verified: boolean;
  active: boolean;
  created_at: string;
};

export async function getActiveModelById(id: string): Promise<ModelDetailRow | null> {
  const supabase = createServiceClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("models")
    .select("*")
    .eq("id", id)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    console.error("[getActiveModelById]", error.message);
    return null;
  }

  if (!data) return null;
  return data as ModelDetailRow;
}
