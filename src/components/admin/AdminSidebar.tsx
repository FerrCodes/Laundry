"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Shirt,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Sofa,
  User,
  ChevronUp,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/context/ToastContext";
import Modal from "@/components/ui/Modal";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { showToast } = useToast();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
    { name: "Orders", href: "/admin/orders", icon: Package },
    { name: "Services", href: "/admin/services", icon: Shirt },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const isActive = (item: typeof navigation[0]) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    showToast("Berhasil logout", "success");
    setIsLogoutModalOpen(false);
    setLoading(false);
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-[#1A1A1A] border border-[#333333] hover:bg-[#2A2A2A] transition"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 w-64 h-full bg-[#0A0A0A] border-r border-[#333333]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-[#333333]">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Sofa className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">LaundryApp</span>
            <span className="ml-auto text-xs px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full">
              Admin
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${
                      active
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-gray-300 hover:text-white hover:bg-[#1A1A1A]"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Bottom: User Dropdown (Muncul ke ATAS) */}
          <div className="border-t border-[#333333] p-4">
            <div className="relative">
              {/* Tombol User */}
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#2A2A2A] transition"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-white truncate">Admin</p>
                  <p className="text-xs text-gray-400 truncate">admin@laundry.com</p>
                </div>
                <ChevronUp
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    showUserDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown - Muncul ke ATAS */}
              {showUserDropdown && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#1A1A1A] border border-[#333333] rounded-xl shadow-xl py-2">
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      setIsLogoutModalOpen(true);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Logout Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Konfirmasi Logout"
        description="Apakah Anda yakin ingin keluar dari akun Anda?"
        confirmText="Ya, Logout"
        cancelText="Kembali"
        confirmVariant="danger"
        isLoading={loading}
      />
    </>
  );
}