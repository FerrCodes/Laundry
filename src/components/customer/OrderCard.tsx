"use client";

import Link from "next/link";
import { Package, Weight, MapPin, Calendar, ArrowRight } from "lucide-react";

interface OrderCardProps {
  id: string;
  order_number: string;
  service_name: string;
  weight_kg: number;
  total_price: number;
  status: string;
  pick_up_address: string;
  created_at: string;
}

export default function OrderCard({
  id,
  order_number,
  service_name,
  weight_kg,
  total_price,
  status,
  pick_up_address,
  created_at,
}: OrderCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<
      string,
      { label: string; color: string; icon: string }
    > = {
      pending: { label: "Menunggu Konfirmasi", color: "bg-yellow-500/20 text-yellow-400", icon: "⏳" },
      confirmed: { label: "Dikonfirmasi", color: "bg-blue-500/20 text-blue-400", icon: "✅" },
      washing: { label: "Dicuci", color: "bg-purple-500/20 text-purple-400", icon: "🔄" },
      drying: { label: "Dikeringkan", color: "bg-orange-500/20 text-orange-400", icon: "🌀" },
      ironing: { label: "Disetrika", color: "bg-pink-500/20 text-pink-400", icon: "👕" },
      ready: { label: "Siap Diambil", color: "bg-green-500/20 text-green-400", icon: "✅" },
      picked_up: { label: "Sudah Diambil", color: "bg-gray-500/20 text-gray-400", icon: "📦" },
      cancelled: { label: "Dibatalkan", color: "bg-red-500/20 text-red-400", icon: "❌" },
    };
    return statusMap[status] || statusMap.pending;
  };

  const statusInfo = getStatusInfo(status);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Link
      href={`/customer/orders/${id}`}
      className="block bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 hover:border-blue-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/5 group"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left - Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-sm font-mono text-gray-400">{order_number}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusInfo.color}`}>
              {statusInfo.icon} {statusInfo.label}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition">
            {service_name}
          </h3>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Weight className="w-3.5 h-3.5" />
              <span>{weight_kg} kg</span>
            </div>
            <div className="flex items-center gap-1">
              <Package className="w-3.5 h-3.5" />
              <span>{formatPrice(total_price)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(created_at)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            <span className="truncate max-w-[200px]">{pick_up_address}</span>
          </div>
        </div>

        {/* Right - Arrow */}
        <div className="flex items-center gap-2 text-blue-400 group-hover:text-blue-300 transition">
          <span className="text-sm font-medium">Detail</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}