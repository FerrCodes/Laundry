import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Belum login → ke halaman login
  if (!session?.user) {
    redirect("/auth/login");
  }

  // Kalau bukan admin, redirect ke customer
  // TAPI jangan redirect kalau sudah di /customer
  if (session.user.role !== "admin") {
    redirect("/customer");
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <AdminSidebar />
      <main className="lg:ml-64 min-h-screen p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb otomatis di semua halaman admin */}
          <Breadcrumb />
          {children}
        </div>
      </main>
    </div>
  );
}