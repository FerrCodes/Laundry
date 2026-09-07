import CustomerNavbar from "@/components/customer/CustomerNavbar";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <CustomerNavbar />
      <main className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb otomatis di semua halaman customer */}
        <Breadcrumb />
        {children}
      </main>
    </div>
  );
}