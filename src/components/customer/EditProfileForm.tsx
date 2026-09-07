"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, MapPin, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/context/ToastContext";

interface EditProfileFormProps {
  profile: {
    full_name: string;
    phone: string | null;
    address: string | null;
  } | null;
  userId: string;
}

export default function EditProfileForm({ profile, userId }: EditProfileFormProps) {
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [address, setAddress] = useState(profile?.address || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      showToast("Nama lengkap wajib diisi", "error");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        address: address.trim() || null,
      })
      .eq("id", userId);

    if (error) {
      showToast("Gagal update profil", "error");
      setLoading(false);
      return;
    }

    showToast("Profil berhasil diupdate!", "success");
    setLoading(false);
    router.push("/customer/profile");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nama Lengkap */}
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

      {/* Nomor Telepon */}
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

      {/* Alamat */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Alamat
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Masukkan alamat lengkap"
            rows={3}
            className="w-full pl-10 pr-3 py-2.5 bg-[#0A0A0A] border border-[#333333] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>

      {/* Tombol */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/customer/profile")}
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