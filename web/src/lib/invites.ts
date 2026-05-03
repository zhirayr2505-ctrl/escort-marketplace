import { createServiceClient } from "@/lib/supabase/service";

export type InviteRow = {
  id: string;
  code: string;
  expires_at: string;
  used_by: string | null;
  used_at: string | null;
};

export async function getValidInviteByCode(code: string): Promise<InviteRow | null> {
  const trimmed = code?.trim();
  if (!trimmed) return null;

  const supabase = createServiceClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("invite_links")
    .select("id, code, expires_at, used_by, used_at")
    .eq("code", trimmed)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as InviteRow;
  if (row.used_by) return null;

  const expires = new Date(row.expires_at);
  if (expires.getTime() <= Date.now()) return null;

  return row;
}
