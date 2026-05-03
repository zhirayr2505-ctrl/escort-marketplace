import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";

/** Для middleware / клиента: текущий пользователь из cookie (или null). */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({
    user: {
      id: user.id,
      age_verified: user.age_verified,
      username: user.username,
      display_name: user.display_name,
    },
  });
}
