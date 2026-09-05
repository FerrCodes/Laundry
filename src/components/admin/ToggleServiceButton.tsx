"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Power, PowerOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/context/ToastContext";

interface ToggleServiceButtonProps {
  serviceId: string;
  isActive: boolean;
}

export default function ToggleServiceButton({ serviceId, isActive }: ToggleServiceButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { showToast } = useToast();

  const handleToggle = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("laundry_services")
      .update({ is_active: !isActive })
      .eq("id", serviceId);

    if (error) {
      showToast("Gagal mengubah status", "error");
      setLoading(false);
      return;
    }

    showToast(`Layanan ${isActive ? "dinonaktifkan" : "diaktifkan"}`, "success");
    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`p-1.5 rounded-lg hover:bg-[#333333] transition ${
        isActive ? "text-green-400 hover:text-green-300" : "text-red-400 hover:text-red-300"
      } disabled:opacity-50`}
      title={isActive ? "Nonaktifkan" : "Aktifkan"}
    >
      {isActive ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
    </button>
  );
}