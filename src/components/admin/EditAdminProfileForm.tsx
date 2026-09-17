"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, Save } from "lucide-react";
import { updateProfile } from "@/lib/actions/profile-actions";
import { useToast } from "@/context/ToastContext";

interface EditAdminProfileFormProps {
  profile: {
    fullName: string;
    phone: string | null;
  } | null;
  userId: string;
}

export default function EditAdminProfileForm({ profile }: EditAdminProfileFormProps) {
  const [fullName, setFullName] = useState(profile?.fullName || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      showToast("Nama lengkap wajib diisi", "error");
      return;
    }

    setLoading(true);

    const result = await updateProfile({
      fullName: fullName.trim(),
      phone: phone.trim() || null,
    });

    if (!result.success) {
      showToast(result.error || "Gagal update profil", "error");
      setLoading(false);
      return;
    }

    showToast("Profil berhasil diupdate!", "success");
    setLoading(false);
    router.push("/admin/settings");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Nama Lengkap <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Masukkan nama lengkap"
            className="w-full pl-10 pr-3 py-2.5 bg-[#0A0A0A] border border-[#333333] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Nomor Telepon
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Contoh: 0812-3456-7890"
            className="w-full pl-10 pr-3 py-2.5 bg-[#0A0A0A] border border-[#333333] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/admin/settings")}
          className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white font-medium rounded-xl border border-[#333333] transition"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}