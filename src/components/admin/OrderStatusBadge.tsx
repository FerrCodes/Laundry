"use client";

interface OrderStatusBadgeProps {
  status: string;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
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

  const info = statusMap[status] || statusMap.pending;

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${info.color}`}>
      {info.label}
    </span>
  );
}