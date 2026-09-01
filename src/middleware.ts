import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Redirect root ke customer
  if (path === "/") {
    return NextResponse.redirect(new URL("/customer", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};