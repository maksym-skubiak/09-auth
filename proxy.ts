import { NextRequest, NextResponse } from "next/server";
import type { AxiosResponse } from "axios";
import { checkSession } from "@/lib/api/serverApi";

const privateRoutes = ["/notes", "/profile"];
const publicRoutes = ["/sign-in", "/sign-up"];

const startsWithRoute = (pathname: string, routes: string[]) =>
  routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

const applySetCookie = (
  response: NextResponse,
  session: AxiosResponse<{ success: boolean }> | null,
) => {
  const setCookie = session?.headers["set-cookie"];

  if (!setCookie) {
    return response;
  }

  const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];

  cookies.forEach((cookie) => {
    response.headers.append("Set-Cookie", cookie);
  });

  return response;
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = startsWithRoute(pathname, privateRoutes);
  const isPublicRoute = startsWithRoute(pathname, publicRoutes);

  if (!isPrivateRoute && !isPublicRoute) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let session: AxiosResponse<{ success: boolean }> | null = null;
  let isAuthenticated = Boolean(accessToken);

  // Якщо accessToken відсутній, але є refreshToken —
  // пробуємо оновити сесію
  if (!accessToken && refreshToken) {
    try {
      session = await checkSession(request.headers.get("cookie") ?? "");
      isAuthenticated = session.data.success;
    } catch {
      isAuthenticated = false;
    }
  }

  // Користувач не авторизований і намагається
  // потрапити на приватний маршрут
  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Користувач вже авторизований і намагається
  // відкрити sign-in або sign-up
  if (isPublicRoute && isAuthenticated) {
    return applySetCookie(
      NextResponse.redirect(new URL("/", request.url)),
      session,
    );
  }

  // Передаємо далі нові cookies, якщо checkSession
  // повернув оновлену сесію
  return applySetCookie(NextResponse.next(), session);
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};
