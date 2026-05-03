import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase/service";
import { USER_SESSION_COOKIE, verifyUserSessionValue } from "@/lib/user-session";

export type CurrentUser = {
  id: string;
  telegram_id: number;
  username: string | null;
  display_name: string | null;
  role: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = cookies().get(USER_SESSION_COOKIE)?.value;
  const session = verifyUserSessionValue(token);
  if (!session) return null;

  const supabase = createServiceClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("users")
    .select("id, telegram_id, username, display_name, role")
    .eq("id", session.userId)
    .maybeSingle();

  if (error || !data) return null;
  return data as CurrentUser;
}
