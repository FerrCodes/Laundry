import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function middleware(request: NextRequest) {
  console.log("MIDDLEWARE JALAN 💀 - Path:", request.nextUrl.pathname);

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set(name, value);
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set(name, value, options);
        },
        remove(name: string, options: any) {
          request.cookies.set(name, "");
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set(name, "", options);
        },
      },
    }
  );

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  console.log("User:", user?.email || "Tidak ada user");
  console.log("User Error:", userError?.message || "Tidak ada error");

  const pathname = request.nextUrl.pathname;
  const isAuthRoute = pathname.startsWith("/auth");
  const isAdminRoute = pathname.startsWith("/admin");
  const isCustomerRoute = pathname.startsWith("/customer");
  const isRoot = pathname === "/";

  // PENTING: Jika user tidak ditemukan dan bukan auth route
  if (!user && !isAuthRoute) {
    console.log("❌ User belum login, redirect ke /auth/login");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // PENTING: Jika user ditemukan dan di auth route
  if (user && isAuthRoute) {
    // Redirect berdasarkan role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    
    const role = profile?.role || "customer";
    console.log("Role:", role);
    
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/customer", request.url));
  }

  // PENTING: User ditemukan dan di root (/)
  if (user && isRoot) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    
    const role = profile?.role || "customer";
    console.log("Role at root:", role);
    
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/customer", request.url));
  }

  // PENTING: Jika user ditemukan, cek role untuk akses halaman
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    
    const role = profile?.role || "customer";
    console.log("Role untuk akses:", role, "Path:", pathname);

    // Admin akses customer page
    if (role === "admin" && isCustomerRoute) {
      console.log("⚠️ Admin ke customer → redirect ke /admin");
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Customer akses admin page
    if (role === "customer" && isAdminRoute) {
      console.log("⚠️ Customer ke admin → redirect ke /customer");
      return NextResponse.redirect(new URL("/customer", request.url));
    }
  }

  console.log("✅ Lanjut ke:", pathname);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};