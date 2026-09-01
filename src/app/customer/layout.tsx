import CustomerNavbar from "@/components/customer/CustomerNavbar";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <CustomerNavbar />
      <main className="pt-20">{children}</main>
    </div>
  );
}