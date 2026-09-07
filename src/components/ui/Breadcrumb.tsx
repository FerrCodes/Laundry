"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home, LayoutDashboard } from "lucide-react";

export default function Breadcrumb() {
  const pathname = usePathname();

  // Hanya tampilkan di halaman customer atau admin
  const isCustomerPage = pathname.startsWith("/customer") && pathname !== "/customer";
  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin";

  if (!isCustomerPage && !isAdminPage) {
    return null;
  }

  const isAdmin = pathname.startsWith("/admin");

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: { label: string; href: string }[] = [];

    // Home
    breadcrumbs.push({
      label: isAdmin ? "Dashboard" : "Beranda",
      href: isAdmin ? "/admin" : "/customer",
    });

    let currentPath = isAdmin ? "/admin" : "/customer";
    const startIndex = isAdmin ? 1 : 1;

    for (let i = startIndex; i < segments.length; i++) {
      const segment = segments[i];
      currentPath += `/${segment}`;

      let label = "";
      if (segment === "profile") {
        label = "Profil";
      } else if (segment === "edit") {
        label = "Edit Profil";
      } else if (segment === "orders") {
        label = isAdmin ? "Daftar Order" : "Riwayat Pesanan";
      } else if (segment === "booking") {
        label = "Booking Laundry";
      } else if (segment === "services") {
        label = isAdmin ? "Kelola Layanan" : "Layanan Laundry";
      } else if (segment === "customers") {
        label = "Daftar Customer";
      } else if (segment === "settings") {
        label = "Pengaturan";
      } else if (segment === "new") {
        label = "Tambah Baru";
      } else {
        // Untuk dynamic routes seperti [id]
        if (segment.startsWith("[") && segment.endsWith("]")) {
          label = "Detail";
        } else {
          label = segment.charAt(0).toUpperCase() + segment.slice(1);
        }
      }

      const isLast = currentPath === pathname;
      breadcrumbs.push({
        label,
        href: isLast ? "#" : currentPath,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="flex items-center gap-1 text-sm text-gray-400 mb-6 flex-wrap" aria-label="Breadcrumb">
      {breadcrumbs.map((item, index) => (
        <div key={item.href + index} className="flex items-center gap-1">
          {index === 0 && (
            item.href.includes("/admin") ? (
              <LayoutDashboard className="w-3.5 h-3.5" />
            ) : (
              <Home className="w-3.5 h-3.5" />
            )
          )}
          {item.href === "#" ? (
            <span className="text-white font-medium">{item.label}</span>
          ) : (
            <Link href={item.href} className="hover:text-white transition">
              {item.label}
            </Link>
          )}
          {index < breadcrumbs.length - 1 && (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </div>
      ))}
    </nav>
  );
}