import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const pathname = nextUrl.pathname;

  const isAuthRoute = pathname.startsWith("/auth");
  const isAdminRoute = pathname.startsWith("/admin");
  const isCustomerRoute = pathname.startsWith("/customer");
  const isRoot = pathname === "/";

  // Root path
  if (isRoot) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/login", nextUrl));
    }
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }
    return NextResponse.redirect(new URL("/customer", nextUrl));
  }

  // Belum login & akses protected
  if (!isLoggedIn && (isAdminRoute || isCustomerRoute)) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl));
  }

  // Sudah login & akses auth
  if (isLoggedIn && isAuthRoute) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }
    return NextResponse.redirect(new URL("/customer", nextUrl));
  }

  // Admin akses customer
  if (isLoggedIn && role === "admin" && isCustomerRoute) {
    return NextResponse.redirect(new URL("/admin", nextUrl));
  }

  // Customer akses admin
  if (isLoggedIn && role === "customer" && isAdminRoute) {
    return NextResponse.redirect(new URL("/customer", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};