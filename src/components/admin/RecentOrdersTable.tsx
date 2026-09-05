"use client";

import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";

interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  total_price: number;
  status: string;
  created_at: string;
}

interface RecentOrdersTableProps {
  orders: RecentOrder[];
}

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
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
      { label: string; color: string }
    > = {
      pending: { label: "Menunggu", color: "bg-yellow-500/20 text-yellow-400" },
      confirmed: { label: "Dikonfirmasi", color: "bg-blue-500/20 text-blue-400" },
      washing: { label: "Dicuci", color: "bg-purple-500/20 text-purple-400" },
      drying: { label: "Dikeringkan", color: "bg-orange-500/20 text-orange-400" },
      ironing: { label: "Disetrika", color: "bg-pink-500/20 text-pink-400" },
      ready: { label: "Siap Diambil", color: "bg-green-500/20 text-green-400" },
      picked_up: { label: "Sudah Diambil", color: "bg-gray-500/20 text-gray-400" },
      cancelled: { label: "Dibatalkan", color: "bg-red-500/20 text-red-400" },
    };
    return statusMap[status] || statusMap.pending;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        Belum ada order
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#333333]">
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Order</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium hidden sm:table-cell">Customer</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium hidden md:table-cell">Tanggal</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
            <th className="text-right py-3 px-4 text-gray-400 font-medium">Total</th>
            <th className="text-right py-3 px-4 text-gray-400 font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            return (
              <tr key={order.id} className="border-b border-[#333333]/50 hover:bg-[#1A1A1A] transition">
                <td className="py-3 px-4 font-mono text-xs text-gray-400">
                  {order.order_number}
                </td>
                <td className="py-3 px-4 text-white hidden sm:table-cell">
                  {order.customer_name}
                </td>
                <td className="py-3 px-4 text-gray-400 hidden md:table-cell">
                  {formatDate(order.created_at)}
                </td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}