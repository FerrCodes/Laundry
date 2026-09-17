import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  Package,
  Weight,
  MapPin,
  FileText,
  Clock,
  Calendar,
  CreditCard,
  QrCode,
} from "lucide-react";
import OrderStatusTracker from "@/components/customer/OrderStatusTracker";
import CancelOrderButton from "@/components/customer/CancelOrderButton";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      service: true,
      payments: true,
    },
  });

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center py-16 bg-[#1A1A1A] rounded-xl border border-[#333333]">
          <p className="text-gray-400">Order tidak ditemukan</p>
        </div>
      </div>
    );
  }

  if (order.customerId !== session.user.id) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center py-16 bg-[#1A1A1A] rounded-xl border border-[#333333]">
          <p className="text-red-400">Anda tidak memiliki akses ke order ini</p>
        </div>
      </div>
    );
  }

  const payment = order.payments[0];
  const isPaid = order.paymentStatus === "paid";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canCancel = order.status === "pending";

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Detail Pesanan</h1>
          <p className="text-sm text-gray-400 font-mono mt-1">{order.orderNumber}</p>
        </div>
        {canCancel && <CancelOrderButton orderId={order.id} />}
      </div>

      <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 mb-6">
        <OrderStatusTracker currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <p className="text-sm text-white">{Number(order.weightKg)} kg</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-xs text-gray-500">Durasi</p>
                  <p className="text-sm text-white">{order.service?.durationHours || "-"} jam</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-xs text-gray-500">Tanggal Pesan</p>
                  <p className="text-sm text-white">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Alamat & Catatan</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Alamat Penjemputan</p>
                  <p className="text-sm text-white">{order.pickUpAddress || "-"}</p>
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
              <span className="text-2xl font-bold text-blue-400">{formatPrice(Number(order.totalPrice))}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-medium text-white">Pembayaran</h3>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${isPaid ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
            {isPaid ? "✅ Lunas" : "⏳ Menunggu Pembayaran"}
          </span>
        </div>

        {!isPaid ? (
          <div className="text-center py-4 space-y-4">
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center p-4 shadow-lg">
                <div className="w-full h-full bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-500">
                  <QrCode className="w-20 h-20 text-gray-600 mb-2" />
                  <p className="text-xs font-medium text-gray-700">QRIS</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Kode Pembayaran: <span className="font-mono">{payment?.qrisCode || "-"}</span>
            </p>

            <form
              action={async () => {
                "use server";
                const response = await fetch(`${appUrl}/api/payment/create`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ orderId: order.id }),
                });
                const data = await response.json();
                if (data.redirect_url) {
                  redirect(data.redirect_url);
                }
              }}
            >
              <button
                type="submit"
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Bayar Sekarang
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-green-400 text-sm">✅ Pembayaran sudah lunas</p>
          </div>
        )}
      </div>
    </div>
  );
}