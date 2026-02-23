import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req });

  const url = req.nextUrl.pathname;

  if (!token && url !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (url.startsWith("/admin") && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (url.startsWith("/professor") && token.role !== "PROFESSOR") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/professor/:path*", "/assistente/:path*"],
};
