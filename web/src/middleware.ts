import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Совпадает с `USER_SESSION_COOKIE` в `src/lib/user-session.ts` (там же комментарий). */
const MK_USER = "mk_user";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname.startsWith("/register") ||
    pathname === "/onboarding"
  ) {
    return NextResponse.next();
  }

  const cookieHeader = request.headers.get("cookie") ?? "";
  if (!cookieHeader.includes(`${MK_USER}=`)) {
    return NextResponse.next();
  }

  try {
    const meUrl = new URL("/api/auth/me", request.nextUrl.origin);
    const res = await fetch(meUrl, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });
    if (!res.ok) return NextResponse.next();
    const data = (await res.json()) as {
      user: { age_verified: boolean } | null;
    };
    if (data.user && !data.user.age_verified) {
      return NextResponse.redirect(new URL("/onboarding", request.nextUrl));
    }
  } catch {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
