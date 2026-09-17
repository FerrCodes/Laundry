"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteService } from "@/lib/services/admin-service-actions";
import { useToast } from "@/context/ToastContext";
import Modal from "@/components/ui/Modal";

interface DeleteServiceButtonProps {
  serviceId: string;
  serviceName: string;
}

export default function DeleteServiceButton({ serviceId, serviceName }: DeleteServiceButtonProps) {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteService(serviceId);

    if (!result.success) {
      showToast("Gagal menghapus layanan", "error");
      setLoading(false);
      setIsModalOpen(false);
      return;
    }

    showToast(`Layanan "${serviceName}" berhasil dihapus`, "success");
    setIsModalOpen(false);
    setLoading(false);
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-1.5 rounded-lg hover:bg-[#333333] transition text-gray-400 hover:text-red-400"
        title="Hapus"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Layanan"
        description={`Apakah Anda yakin ingin menghapus layanan "${serviceName}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        confirmVariant="danger"
        isLoading={loading}
      />
    </>
  );
}