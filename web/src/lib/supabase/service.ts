import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Только на сервере (Server Components, Route Handlers). Не импортировать в клиентские компоненты. */
export function createServiceClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}
