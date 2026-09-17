"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { cancelOrder } from "@/lib/actions/order-actions";
import Modal from "@/components/ui/Modal";

interface CancelOrderButtonProps {
  orderId: string;
}

export default function CancelOrderButton({ orderId }: CancelOrderButtonProps) {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleCancel = async () => {
    setLoading(true);
    const result = await cancelOrder(orderId);

    if (!result.success) {
      showToast(result.error || "Gagal membatalkan pesanan", "error");
      setLoading(false);
      setIsModalOpen(false);
      return;
    }

    showToast("Pesanan berhasil dibatalkan", "success");
    setIsModalOpen(false);
    setLoading(false);
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50 transition-all duration-200"
      >
        <AlertTriangle className="w-4 h-4" />
        Batalkan Pesanan
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCancel}
        title="Batalkan Pesanan"
        description="Apakah Anda yakin ingin membatalkan pesanan ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Batalkan"
        cancelText="Kembali"
        confirmVariant="danger"
        isLoading={loading}
      />
    </>
  );
}