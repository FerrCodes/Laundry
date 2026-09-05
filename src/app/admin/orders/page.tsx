import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getAllOrders } from "@/lib/services/admin-order-service";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import Link from "next/link";
import { Eye, Package, Search } from "lucide-react";

interface AdminOrdersPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
  }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const { status, search } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const orders = await getAllOrders(status);

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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusOptions = [
    { value: "all", label: "Semua" },
    { value: "pending", label: "Menunggu" },
    { value: "confirmed", label: "Dikonfirmasi" },
    { value: "washing", label: "Dicuci" },
    { value: "drying", label: "Dikeringkan" },
    { value: "ironing", label: "Disetrika" },
    { value: "ready", label: "Siap Diambil" },
    { value: "picked_up", label: "Sudah Diambil" },
    { value: "cancelled", label: "Dibatalkan" },
  ];

  // Filter berdasarkan search (jika ada)
  const filteredOrders = search
    ? orders.filter(
        (order) =>
          order.order_number.toLowerCase().includes(search.toLowerCase()) ||
          order.customer_name.toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  // Get current status label
  const currentStatusLabel = statusOptions.find((opt) => opt.value === (status || "all"))?.label || "Semua";

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Daftar Order</h1>
          <p className="text-gray-400 mt-1">Kelola semua order laundry</p>
        </div>
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-400">
            {filteredOrders.length} order
          </span>
        </div>
      </div>

      {/* Filter Status - Menggunakan Link */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statusOptions.map((opt) => {
          const isActive = (status || "all") === opt.value;
          return (
            <Link
              key={opt.value}
              href={`/admin/orders?status=${opt.value}${search ? `&search=${search}` : ""}`}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                ${isActive
                  ? "bg-blue-600 text-white"
                  : "bg-[#1A1A1A] text-gray-400 hover:text-white hover:bg-[#2A2A2A] border border-[#333333]"
                }
              `}
            >
              {opt.label}
            </Link>
          );
        })}
      </div>

      {/* Search */}
      <div className="mb-6">
        <form method="GET" className="flex gap-2">
          {status && status !== "all" && (
            <input type="hidden" name="status" value={status} />
          )}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              name="search"
              defaultValue={search || ""}
              placeholder="Cari order number atau customer..."
              className="w-full pl-9 pr-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition text-sm"
          >
            Cari
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#333333]">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Order</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium hidden sm:table-cell">Customer</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium hidden md:table-cell">Layanan</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium hidden lg:table-cell">Tanggal</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Total</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p>Belum ada order</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-[#333333]/50 hover:bg-[#1A1A1A] transition">
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs text-gray-400">
                        {order.order_number}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white hidden sm:table-cell">
                      {order.customer_name}
                    </td>
                    <td className="py-3 px-4 text-gray-300 hidden md:table-cell">
                      {order.service_name}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs hidden lg:table-cell">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="py-3 px-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="py-3 px-4 text-right text-white font-medium">
                      {formatPrice(order.total_price)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
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