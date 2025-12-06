import { NextRequest, NextResponse } from "next/server";

const TOKEN_NAME = "auth_token";

export function middleware(req: NextRequest) {
  const token = req.cookies.get(TOKEN_NAME)?.value;
  const { pathname } = req.nextUrl;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDashboard = pathname.startsWith("/dashboard");

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!token && isDashboard) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*"]
};
