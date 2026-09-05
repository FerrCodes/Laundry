import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getOrderById } from "@/lib/services/order-service";
import Link from "next/link";
import { ArrowLeft, Package, Weight, MapPin, FileText, Clock, Calendar, AlertTriangle } from "lucide-react";
import OrderStatusTracker from "@/components/customer/OrderStatusTracker";
import CancelOrderButton from "@/components/customer/CancelOrderButton";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const order = await getOrderById(id);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center py-16 bg-[#1A1A1A] rounded-xl border border-[#333333]">
          <p className="text-gray-400">Order tidak ditemukan</p>
          <Link href="/customer/orders" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
            Kembali ke Riwayat Pesanan
          </Link>
        </div>
      </div>
    );
  }

  // Cek apakah order milik user yang login
  if (order.customer_id !== user.id) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center py-16 bg-[#1A1A1A] rounded-xl border border-[#333333]">
          <p className="text-red-400">Anda tidak memiliki akses ke order ini</p>
          <Link href="/customer/orders" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
            Kembali ke Riwayat Pesanan
          </Link>
        </div>
      </div>
    );
  }

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
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canCancel = order.status === "pending";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/customer/orders"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Riwayat Pesanan
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Detail Pesanan</h1>
          <p className="text-sm text-gray-400 font-mono mt-1">{order.order_number || `ORD-${order.id.slice(0, 8)}`}</p>
        </div>
        {canCancel && (
          <CancelOrderButton orderId={order.id} />
        )}
      </div>

      {/* Status Tracker */}
      <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 mb-6">
        <OrderStatusTracker currentStatus={order.status} />
      </div>

      {/* Order Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Informasi Pesanan</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-xs text-gray-500">Layanan</p>
                  <p className="text-sm text-white">{order.service?.name || "Layanan"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Weight className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-xs text-gray-500">Berat</p>
                  <p className="text-sm text-white">{order.weight_kg} kg</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-xs text-gray-500">Durasi</p>
                  <p className="text-sm text-white">{order.service?.duration_hours || "-"} jam</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-xs text-gray-500">Tanggal Pesan</p>
                  <p className="text-sm text-white">{formatDate(order.created_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Alamat & Catatan</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Alamat Penjemputan</p>
                  <p className="text-sm text-white">{order.pick_up_address || "-"}</p>
                </div>
              </div>
              {order.notes && (
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Catatan</p>
                    <p className="text-sm text-white">{order.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total Harga</span>
              <span className="text-2xl font-bold text-blue-400">{formatPrice(order.total_price)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}