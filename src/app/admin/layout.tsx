import AdminSidebar from "@/components/admin/AdminSidebar";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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