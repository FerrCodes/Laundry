import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getAllCustomers } from "@/lib/services/admin-customer-service";
import { Users, Package, DollarSign, Calendar } from "lucide-react";
import Link from "next/link";

export default async function AdminCustomersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const customers = await getAllCustomers();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Daftar Customer</h1>
          <p className="text-gray-400 mt-1">Kelola semua customer laundry</p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-400">{customers.length} customer</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#333333]">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Nama</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium hidden sm:table-cell">Email</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium hidden md:table-cell">No. HP</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium hidden lg:table-cell">Bergabung</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Order</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Total Belanja</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p>Belum ada customer</p>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-[#333333]/50 hover:bg-[#1A1A1A] transition">
                    <td className="py-3 px-4">
                      <span className="font-medium text-white">{customer.full_name}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-300 hidden sm:table-cell">
                      {customer.email}
                    </td>
                    <td className="py-3 px-4 text-gray-400 hidden md:table-cell">
                      {customer.phone || "-"}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs hidden lg:table-cell">
                      {formatDate(customer.created_at)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-white font-medium">{customer.total_orders}</span>
                    </td>
                    <td className="py-3 px-4 text-right text-white font-medium">
                      {formatPrice(customer.total_spent)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="text-blue-400 hover:text-blue-300 transition text-xs"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}