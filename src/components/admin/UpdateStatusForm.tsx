"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/context/ToastContext";

interface UpdateStatusFormProps {
  orderId: string;
  currentStatus: string;
}

export default function UpdateStatusForm({ orderId, currentStatus }: UpdateStatusFormProps) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { showToast } = useToast();

  const statusOptions = [
    { value: "pending", label: "Menunggu" },
    { value: "confirmed", label: "Dikonfirmasi" },
    { value: "washing", label: "Dicuci" },
    { value: "drying", label: "Dikeringkan" },
    { value: "ironing", label: "Disetrika" },
    { value: "ready", label: "Siap Diambil" },
    { value: "picked_up", label: "Sudah Diambil" },
    { value: "cancelled", label: "Dibatalkan" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === currentStatus) {
      showToast("Status tidak berubah", "info");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      showToast("Gagal update status", "error");
      setLoading(false);
      return;
    }

    showToast("Status order berhasil diupdate", "success");
    setLoading(false);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="flex-1 px-4 py-2.5 bg-[#0A0A0A] border border-[#333333] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#1A1A1A]">
            {opt.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={loading || status === currentStatus}
        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Menyimpan..." : "Update Status"}
      </button>
    </form>
  );
}