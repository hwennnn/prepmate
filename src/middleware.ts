import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "~/env";

// 1. Specify protected and public routes
const protectedRoutes = ["/dashboard", "/profile", "/onboarding"];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route),
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // 3. Check for NextAuth session cookie (both possible names)
  const allCookies = await cookies();
  const sessionCookie =
    env.NODE_ENV === "development"
      ? allCookies.get("authjs.session-token")?.value
      : allCookies.get("__Secure-authjs.session-token")?.value;

  // 4. Redirect to /login if the user is not authenticated (cookie does not exist)
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/auth/signin", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
